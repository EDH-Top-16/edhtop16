use anyhow::Context;
use futures::StreamExt;
use mongodb::{
    bson::{self, doc, oid::ObjectId, Document},
    Collection, Database,
};
use regex::Regex;
use scraper::moxfield::MoxfieldClient;
use simple_logger::SimpleLogger;
use std::time::{SystemTime, UNIX_EPOCH};
use std::{collections::HashMap, env};
use tokio::task::JoinSet;

const THIRTY_DAYS_AS_MILLIS: u128 = 2592000000;

async fn recent_tournaments(db: &Database) -> anyhow::Result<Vec<String>> {
    let thirty_days_ago = bson::DateTime::from_millis(
        (SystemTime::now().duration_since(UNIX_EPOCH)?.as_millis() - THIRTY_DAYS_AS_MILLIS)
            .try_into()
            .unwrap(),
    );

    let metadata: Collection<Document> = db.collection("metadata");
    let mut cursor = metadata
        .find(doc! {
            "date": doc! {
                "$gte": thirty_days_ago
            }
        })
        .await?;

    let mut tids: Vec<String> = Vec::new();
    while let Some(Ok(tournament)) = cursor.next().await {
        let tid = tournament.get_str("TID")?;
        tids.push(tid.to_string());
    }

    Ok(tids)
}

async fn unprocessed_standings(
    db: &Database,
    tid: &str,
) -> anyhow::Result<HashMap<ObjectId, String>> {
    let standings: Collection<Document> = db.collection(tid);
    let mut cursor = standings
        .find(doc! {
            "commander": doc! { "$exists": false },
            "colorID": doc! { "$exists": false },
            "mainDeck": doc! { "$exists": false },
        })
        .await?;

    let mut decklist_url_by_record_id: HashMap<ObjectId, String> = HashMap::new();
    while let Some(Ok(entry)) = cursor.next().await {
        let entry_id = entry.get_object_id("_id")?;
        let Ok(decklist_url) = entry.get_str("decklist") else {
            continue;
        };

        decklist_url_by_record_id.insert(entry_id, decklist_url.to_string());
    }

    Ok(decklist_url_by_record_id)
}

fn moxfield_id(decklist_url: &str) -> Option<String> {
    let re = Regex::new(r"https:\/\/(www\.)?moxfield\.com\/decks\/([\-\w]+)").unwrap();
    re.captures(decklist_url)
        .and_then(|matches| matches.get(2))
        .map(|id| id.as_str().to_string())
}

async fn update_decklist_for_entry(
    moxfield_client: &MoxfieldClient,
    collection: &Collection<Document>,
    object_id: &ObjectId,
    decklist_url: &str,
) -> anyhow::Result<Option<String>> {
    let Some(decklist_id) = moxfield_id(&decklist_url) else {
        log::info!(
            "Skipping {}/{}: could not match moxfield link {:?}",
            collection.name(),
            object_id,
            decklist_url
        );

        return Ok(None);
    };

    let Ok(deck) = moxfield_client
        .get_deck(&decklist_id)
        .await
        .inspect_err(|err| {
            log::info!(
                "Skipping {}/{}: moxfield API request failed for {}: {:?}",
                collection.name(),
                object_id,
                decklist_url,
                err
            );
        })
    else {
        return Ok(None);
    };

    let color_id = deck.color_id();
    let commander_name = deck.commander_name();
    let main_deck: Vec<String> = deck.mainboard.into_keys().collect();

    collection
        .update_one(
            doc! { "_id": object_id },
            doc! {
                "$set": doc! {
                    "commander": &commander_name,
                    "colorID": color_id,
                    "mainDeck": main_deck,
                }
            },
        )
        .await?;

    Ok(Some(commander_name))
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    SimpleLogger::new().init().unwrap();
    if let Ok(path) = dotenvy::dotenv() {
        log::info!("Loaded environment variables from {:?}", path)
    } else {
        log::info!("No .env file found")
    }

    let mongo_uri = env::var("ENTRIES_DB_URL").context("Loading ENTRIES_DB_URL")?;
    let moxfield_api_key = env::var("MOXFIELD_API_KEY").context("Loading MOXFIELD_API_KEY")?;

    let mongo_client = mongodb::Client::with_uri_str(mongo_uri).await?;
    let database = mongo_client.database("cedhtop16");
    log::info!("Connected to MongoDB!");

    let moxfield_client = MoxfieldClient::new(&moxfield_api_key);

    let mut decklist_updates: JoinSet<anyhow::Result<()>> = JoinSet::new();
    for tid in recent_tournaments(&database).await? {
        let tournament_collection: Collection<Document> = database.collection(&tid);
        for (object_id, decklist_url) in unprocessed_standings(&database, &tid).await? {
            let moxfield_client = moxfield_client.clone();
            let tournament_collection = tournament_collection.clone();
            let tid = tid.clone();

            decklist_updates.spawn(async move {
                let commander_name = update_decklist_for_entry(
                    &moxfield_client,
                    &tournament_collection,
                    &object_id,
                    &decklist_url,
                )
                .await?;

                if let Some(commander_name) = commander_name {
                    log::info!("Processed {}/{}: {}", tid, object_id, commander_name);
                };

                Ok(())
            });
        }
    }

    while let Some(res) = decklist_updates.join_next().await {
        match res {
            Ok(Ok(_)) => {}
            Ok(Err(err)) => {
                log::error!("Could not insert: {:?}", err);
            }
            Err(err) => {
                log::error!("Could not join task: {:?}", err);
            }
        }
    }

    Ok(())
}

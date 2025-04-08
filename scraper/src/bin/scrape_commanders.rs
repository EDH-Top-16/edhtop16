use anyhow::{anyhow, Context};
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

    let thirty_days_ago_seconds = thirty_days_ago.timestamp_millis() / 1000;

    let metadata: Collection<Document> = db.collection("metadata");
    let mut cursor = metadata
        .find(doc! {
            "$or": [
                { "date": { "$gte": thirty_days_ago } },
                { "startDate": { "$gte": thirty_days_ago_seconds } }
            ],
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
        let decklist_url = entry.get_str("decklist").unwrap_or_default();
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
) -> anyhow::Result<String> {
    let Some(decklist_id) = moxfield_id(&decklist_url) else {
        return Err(anyhow!(
            "Could not extract Moxfield link for {}/{}: {}",
            collection.name(),
            object_id,
            decklist_url
        ));
    };

    let deck = moxfield_client
        .get_deck(&decklist_id)
        .await
        .context(anyhow!("Could not get decklist: {}", decklist_url))?;

    let color_id = deck.color_id();
    let commander_name = deck.commander_name();
    let main_deck: Vec<String> = deck
        .mainboard
        .values()
        .map(|c| c.card.scryfall_id.clone())
        .collect();

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

    Ok(commander_name)
}

async fn set_unknown_commander_for_entry(
    collection: &Collection<Document>,
    object_id: &ObjectId,
) -> () {
    let update = collection
        .update_one(
            doc! { "_id": object_id },
            doc! {
                "$set": doc! {
                    "commander": "Unknown Commander",
                    "colorID": "N/A",
                }
            },
        )
        .await;

    if let Err(err) = update {
        log::error!(
            "Could not set unknown commander for {}/{}: {}",
            collection.name(),
            object_id,
            err
        );
    };
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

    let mut decklist_updates: JoinSet<()> = JoinSet::new();
    for tid in recent_tournaments(&database).await? {
        let tournament_collection: Collection<Document> = database.collection(&tid);
        for (object_id, decklist_url) in unprocessed_standings(&database, &tid).await? {
            let moxfield_client = moxfield_client.clone();
            let tournament_collection = tournament_collection.clone();
            let tid = tid.clone();

            decklist_updates.spawn(async move {
                let update = update_decklist_for_entry(
                    &moxfield_client,
                    &tournament_collection,
                    &object_id,
                    &decklist_url,
                )
                .await;

                match update {
                    Ok(commander_name) => {
                        log::info!("Processed {}/{}: {}", tid, object_id, commander_name);
                    }
                    Err(err) => {
                        log::info!("Could not update entry: {:?}", err);
                        set_unknown_commander_for_entry(&tournament_collection, &object_id).await;
                    }
                }
            });
        }
    }

    while let Some(res) = decklist_updates.join_next().await {
        match res {
            Ok(()) => {}
            Err(err) => {
                log::error!("Could not join task: {:?}", err);
            }
        }
    }

    Ok(())
}

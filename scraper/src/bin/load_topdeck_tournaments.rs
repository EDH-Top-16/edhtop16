use anyhow::Context;
use futures::StreamExt;
use mongodb::{
    bson::{doc, Document},
    Collection, Database,
};
use scraper::topdeck::TopdeckClient;
use simple_logger::SimpleLogger;
use std::collections::HashSet;
use std::env;
use tokio::task::JoinSet;

async fn existing_tids(db: &Database) -> Result<HashSet<String>, mongodb::error::Error> {
    let metdata_collection: Collection<Document> = db.collection("metadata");
    let mut cursor = metdata_collection.find(doc! {}).await?;

    let mut known_tids: HashSet<String> = HashSet::new();
    while let Some(doc) = cursor.next().await {
        if let Ok(tid) = doc?.get_str("TID") {
            known_tids.insert(tid.into());
        }
    }

    Ok(known_tids)
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
    let topdeck_api_key = env::var("TOPDECK_GG_API_KEY").context("Loading TOPDECK_GG_API_KEY")?;

    let mongo_client = mongodb::Client::with_uri_str(mongo_uri).await?;
    log::info!("Connected to MongoDB!");

    let database = mongo_client.database("cedhtop16");
    let known_tids = existing_tids(&database).await?;
    log::info!("Found {:?} existing tournaments", known_tids.len());

    let topdeck_client = TopdeckClient::new(&topdeck_api_key);
    let tournaments = topdeck_client.tournaments_from_past_month().await?;
    log::info!(
        "Loaded {:?} tournaments from Topdeck API",
        tournaments.len()
    );

    let mut tournament_inserts: JoinSet<anyhow::Result<()>> = JoinSet::new();
    for tournament in tournaments {
        if known_tids.contains(&tournament.tid) {
            log::info!("Skipping import for {}", tournament.tid);
            continue;
        }

        let metdata_ref: mongodb::Collection<Document> = database.collection("metadata").clone();
        let tournament_doc = tournament.into_doc();

        tournament_inserts.spawn(async move {
            metdata_ref.insert_one(&tournament_doc).await?;
            log::info!(
                "Inserted metadata for: {}",
                tournament_doc.get("TID").unwrap().as_str().unwrap()
            );

            Ok(())
        });

        for (standing, entry) in tournament.standings.iter().enumerate() {
            let standing: i32 = standing.try_into().unwrap();
            let entry_doc = entry.into_doc(standing + 1);
            let collection_ref: mongodb::Collection<Document> =
                database.collection(&tournament.tid).clone();

            tournament_inserts.spawn(async move {
                collection_ref.insert_one(entry_doc).await?;
                log::info!("Inserted entry for: {}/{}", collection_ref.name(), standing);

                Ok(())
            });
        }
    }

    while let Some(res) = tournament_inserts.join_next().await {
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

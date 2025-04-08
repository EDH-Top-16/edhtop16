use anyhow::Context;
use mongodb::bson::{doc, Document};
use serde::{Deserialize, Serialize};
use simple_logger::SimpleLogger;
use std::{
    collections::{HashMap, HashSet},
    env,
};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct ThirdPartyTournamentEntry {
    pub name: String,
    pub decklist: String,
    #[serde(rename = "winsSwiss", default)]
    pub wins_swiss: i32,
    #[serde(rename = "lossesSwiss", default)]
    pub losses_swiss: i32,
    pub draws: i32,
    #[serde(rename = "winsBracket", default)]
    pub wins_bracket: i32,
    #[serde(rename = "lossesBracket", default)]
    pub losses_bracket: i32,
}

impl ThirdPartyTournamentEntry {
    pub fn into_doc(&self, index: i32) -> mongodb::bson::Document {
        mongodb::bson::doc! {
            "name": self.name.clone(),
            "decklist": self.decklist.clone(),
            "winsSwiss": self.wins_swiss,
            "lossesSwiss": self.losses_swiss,
            "draws": self.draws,
            "winsBracket": self.wins_bracket,
            "lossesBracket": self.losses_bracket,
            "standing": index + 1,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct ThirdPartyTournament {
    #[serde(rename = "TID")]
    pub third_party_id: String,
    #[serde(rename = "tournamentName")]
    pub tournament_name: String,
    pub players: i32,
    #[serde(rename = "startDate")]
    pub start_date: i32,
    #[serde(rename = "swissRounds")]
    pub swiss_rounds: i32,
    #[serde(rename = "topCut")]
    pub top_cut: i32,
    #[serde(rename = "bracketUrl")]
    pub bracket_url: String,
    pub standings: Vec<ThirdPartyTournamentEntry>,
}

impl ThirdPartyTournament {
    pub fn tid(&self, provider: &str) -> String {
        format!("{}:{}", provider, self.third_party_id)
    }

    pub fn into_doc(&self, provider: &str) -> mongodb::bson::Document {
        mongodb::bson::doc! {
            "TID": self.tid(provider),
            "tournamentName": self.tournament_name.clone(),
            "players": self.players,
            "startDate": self.start_date,
            "swissRounds": self.swiss_rounds,
            "topCut": self.top_cut,
            "bracketUrl": self.bracket_url.clone()
        }
    }
}

async fn process_provider(
    db: &mongodb::Database,
    provider: &str,
    api_url: &str,
) -> anyhow::Result<()> {
    let existing_tournaments: HashSet<String> =
        HashSet::from_iter(db.list_collection_names().await?);

    let metdata_collection: mongodb::Collection<Document> = db.collection("metadata");
    let api_response = reqwest::Client::new().get(api_url).send().await?;

    for line in api_response.text().await?.lines() {
        let tournament: ThirdPartyTournament = serde_json::from_str(line)?;
        let tid = tournament.tid(provider);
        if existing_tournaments.contains(&tid) {
            log::info!("Skipping existing tournament: {}", &tid);
            continue;
        }

        let tournament_doc = tournament.into_doc(provider);
        metdata_collection.insert_one(&tournament_doc).await?;
        log::info!(
            "Inserted metadata for: {}",
            tournament_doc.get_str("TID").unwrap()
        );

        let entries_collection: mongodb::Collection<Document> = db.collection(&tid);
        entries_collection
            .insert_many(
                tournament
                    .standings
                    .iter()
                    .enumerate()
                    .map(|(standing, entry)| {
                        let standing: i32 = standing.try_into().unwrap();
                        entry.into_doc(standing)
                    }),
            )
            .await?;

        log::info!(
            "Inserted {} entries for: {}",
            tournament.standings.len(),
            tid
        );
    }

    Ok(())
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
    let mongo_client = mongodb::Client::with_uri_str(mongo_uri).await?;

    let providers = HashMap::from([
        ("spicerack", "https://api.spicerack.gg/api/export-decklists/?event_format=Commander&num_days=30&format=ndjson")
    ]);

    let database = mongo_client.database("cedhtop16");
    for (name, api_url) in providers.iter() {
        process_provider(&database, name, api_url).await?;
    }

    Ok(())
}

use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Tournament {
    #[serde(rename = "TID")]
    pub tid: String,
    #[serde(rename = "tournamentName")]
    pub tournament_name: String,
    #[serde(rename = "swissNum")]
    pub swiss_num: i32,
    #[serde(rename = "startDate")]
    pub start_date: i64,
    pub game: String,
    pub format: String,
    #[serde(rename = "averageElo")]
    pub average_elo: Option<f32>,
    #[serde(rename = "modeElo")]
    pub mode_elo: Option<f32>,
    #[serde(rename = "medianElo")]
    pub median_elo: Option<f32>,
    #[serde(rename = "topElo")]
    pub top_elo: Option<f32>,
    #[serde(rename = "topCut")]
    top_cut: serde_json::Value,
    pub standings: Vec<TournamentEntry>,
}

impl Tournament {
    pub fn top_cut(&self) -> i64 {
        match &self.top_cut {
            serde_json::Value::Number(number) => number.as_i64().unwrap_or_default(),
            serde_json::Value::String(str) => str.parse::<i64>().unwrap_or_default(),
            _ => i64::default(),
        }
    }

    pub fn bracket_url(&self) -> String {
        format!("https://topdeck.gg/bracket/{}", self.tid)
    }

    pub fn into_doc(&self) -> mongodb::bson::Document {
        let tournament_size: i32 = self.standings.len().try_into().unwrap();

        mongodb::bson::doc! {
            "TID": self.tid.clone(),
            "tournamentName": self.tournament_name.clone(),
            "size": tournament_size,
            "date": mongodb::bson::DateTime::from_millis(self.start_date * 1000),
            "dateCreated": self.start_date,
            "swissNum": self.swiss_num,
            "topCut": self.top_cut(),
            "bracketUrl": self.bracket_url()
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TournamentEntry {
    pub name: Option<String>,
    pub id: String,
    pub decklist: Option<String>,
    #[serde(default)]
    pub wins: i32,
    #[serde(rename = "winsSwiss", default)]
    pub wins_swiss: i32,
    #[serde(rename = "winsBracket", default)]
    pub wins_bracket: i32,
    #[serde(default)]
    pub draws: i32,
    #[serde(default)]
    pub losses: i32,
    #[serde(rename = "lossesSwiss", default)]
    pub losses_swiss: i32,
    #[serde(rename = "lossesBracket", default)]
    pub losses_bracket: i32,
    #[serde(rename = "deckObj")]
    pub deck: Option<TournamentDecklist>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TournamentDecklist {
    #[serde(rename = "Commanders")]
    commanders: HashMap<String, TournamentDecklistEntry>,
    #[serde(rename = "Mainboard")]
    mainboard: HashMap<String, TournamentDecklistEntry>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TournamentDecklistEntry {
    pub id: String,
    pub count: i32,
}

impl TournamentEntry {
    pub fn into_doc(&self, index: i32) -> mongodb::bson::Document {
        let mut doc = mongodb::bson::doc! {
            "name": self.name.clone(),
            "decklist": self.decklist.clone(),
            "winsSwiss": self.wins_swiss,
            "winsBracket": self.wins_bracket,
            "draws": self.draws,
            "lossesSwiss": self.losses_swiss,
            "lossesBracket": self.losses_bracket,
            "standing": index + 1,
            "profile": self.id.clone()
        };

        if let Some(deck) = &self.deck {
            doc.insert(
                "deckObj",
                mongodb::bson::to_bson(deck).unwrap_or(mongodb::bson::Bson::Null),
            );
        }

        doc
    }
}

pub struct TopdeckClient {
    api_key: String,
    http_client: reqwest::Client,
}

impl TopdeckClient {
    pub fn new(api_key: &str) -> TopdeckClient {
        let http_client = reqwest::Client::new();
        TopdeckClient {
            api_key: api_key.to_string(),
            http_client,
        }
    }

    pub async fn tournaments_from_past_month(&self) -> anyhow::Result<Vec<Tournament>> {
        let request_body = format!(
            "{{
  \"game\": \"Magic: The Gathering\",
  \"format\": \"EDH\",
  \"last\": 5,
  \"columns\": [
    \"name\",
    \"id\",
    \"decklist\",
    \"wins\",
    \"winsSwiss\",
    \"winsBracket\",
    \"winRateSwiss\",
    \"winRateBracket\",
    \"draws\",
    \"losses\",
    \"lossesSwiss\",
    \"lossesBracket\"
  ]
}}"
        );

        let api_response = self
            .http_client
            .post("https://topdeck.gg/api/v2/tournaments")
            .header("Accept", "application/json")
            .header("Authorization", self.api_key.clone())
            .header("Content-Type", "application/json")
            .body(request_body)
            .send()
            .await?;

        let response_body = api_response.text().await?;
        let tournaments: Vec<Tournament> = serde_json::from_str(&response_body)?;
        Ok(tournaments)
    }

    pub async fn get_tournaments(&self, tids: &Vec<String>) -> anyhow::Result<Vec<Tournament>> {
        let tids_json: String = tids
            .iter()
            .map(|t| format!("\"{}\"", t))
            .collect::<Vec<String>>()
            .join(", ");

        let request_body = format!(
            "{{
    \"game\": \"Magic: The Gathering\",
    \"format\": \"EDH\",
    \"TID\": {},
    \"columns\": [
        \"name\",
        \"id\",
        \"decklist\",
        \"wins\",
        \"winsSwiss\",
        \"winsBracket\",
        \"winRateSwiss\",
        \"winRateBracket\",
        \"draws\",
        \"losses\",
        \"lossesSwiss\",
        \"lossesBracket\"
    ]
}}",
            tids_json
        );

        let api_response = self
            .http_client
            .post("https://topdeck.gg/api/v2/tournaments")
            .header("Accept", "application/json")
            .header("Authorization", self.api_key.clone())
            .header("Content-Type", "application/json")
            .body(request_body)
            .send()
            .await?;

        let response_body = api_response.text().await?;
        let tournaments: Vec<Tournament> = serde_json::from_str(&response_body)?;
        Ok(tournaments)
    }
}

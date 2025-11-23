use anyhow::anyhow;
use anyhow::Context;
use governor::{DefaultDirectRateLimiter, Quota, RateLimiter};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, num::NonZero, sync::Arc};

fn wubrgify(color_id: Vec<char>) -> String {
    let mut buf = "".to_string();

    if color_id.contains(&'W') {
        buf += "W"
    }
    if color_id.contains(&'U') {
        buf += "U"
    }
    if color_id.contains(&'B') {
        buf += "B"
    }
    if color_id.contains(&'R') {
        buf += "R"
    }
    if color_id.contains(&'G') {
        buf += "G"
    }

    if buf.len() == 0 {
        "C".to_string()
    } else {
        buf
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Card {
    pub scryfall_id: String,
    pub color_identity: Vec<char>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DecklistItem {
    pub quantity: i32,
    pub card: Card,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Deck {
    pub name: String,
    pub mainboard: HashMap<String, DecklistItem>,
    pub commanders: HashMap<String, DecklistItem>,
}

impl Deck {
    pub fn color_id(&self) -> String {
        let color_ids: Vec<char> = self
            .commanders
            .values()
            .map(|c| c.card.color_identity.clone())
            .flatten()
            .collect();

        wubrgify(color_ids)
    }

    pub fn commander_name(&self) -> String {
        let mut commander_names: Vec<String> = self.commanders.keys().map(|c| c.clone()).collect();
        commander_names.sort();
        commander_names.join(" / ")
    }
}

#[derive(Clone)]
pub struct MoxfieldClient {
    api_key: String,
    http_client: reqwest::Client,
    limiter: Arc<DefaultDirectRateLimiter>,
}

impl MoxfieldClient {
    pub fn new(api_key: &str) -> MoxfieldClient {
        let http_client = reqwest::Client::new();
        let limiter_quota = Quota::per_second(NonZero::new(1).unwrap());
        let limiter = RateLimiter::direct(limiter_quota);

        MoxfieldClient {
            api_key: api_key.to_string(),
            http_client,
            limiter: Arc::new(limiter),
        }
    }

    pub async fn get_deck(&self, id: &str) -> anyhow::Result<Deck> {
        self.limiter.until_ready().await;
        let api_response = self
            .http_client
            .get(format!("https://api.moxfield.com/v2/decks/all/{}", id))
            .header("Accept", "application/json")
            .header("Content-Type", "application/json")
            .header("User-Agent", format!("MoxKey; {}", self.api_key))
            .header("x-requested-by", "edhtop16")
            .send()
            .await?;

        let status = api_response.status();
        if status != 200 {
            let response_body = api_response.text().await?;
            return Err(anyhow!("Error {}: {}", &status, response_body));
        }

        let response_body = api_response.text().await?;
        let deck: Deck = serde_json::from_str(&response_body)
            .with_context(|| format!("Failed to parse JSON: {}", response_body))?;

        Ok(deck)
    }
}

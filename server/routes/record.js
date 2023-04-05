const { application } = require("express");
const express = require("express");
const { CURSOR_FLAGS, ReturnDocument} = require("mongodb");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

async function parseTourneyFilters(filters){
  // This generates a list of tournament IDs based on filters.
  // We only want one time-related filter, so we check for the existence of both 'dateCreated' and 'date' in filters (and error if there is).
  // IF we're passed a none-like object or otherwise malformed object (i.e. the query didn't have tourney filters) we set filter to {} to return all tournament IDs.
  let query = {};
  // Error checking
  if((!!filters) && (filters.constructor === Object)){// If filter is a non-null, non-array object

    // Parse date filter

    // Cannot have both date and dateCreated
    if("date" in filters && "dateCreated" in filters){
      throw new Error("Error: Request cannot have both date and datecreated fields");
    }

    // dateName is which key we use; dateValue is its value
    let dateName = Object.keys(filters).includes("date") ? "date" : "dateCreated";
    if(dateName === "date"){
      Object.keys(filters.date).forEach(
        key => {
          filters.date[key] = new Date(filters.date[key]);
        }
      )
    }
    let dateValue = (dateName === "date") ?  filters.date : filters.dateCreated;

    // Form query and add date and size filter.
    query = {
      [dateName]: (dateValue !== undefined) ? dateValue: {$gt: 0}, // If date not included, set filter to since 0
      size: Object.keys(filters).includes("size") ? filters.size: {$gt: 0} // If size not included, set filter to more than 0 entries
    };

    // Process TID filter
    if (Object.keys(filters).includes("TID")){
      query = {...query, TID: filters.TID};
    }

    // Process tournamentName filter
    if (Object.keys(filters).includes("tournamentName")){
      query = {...query, tournamentName: filters.tournamentName};
    }
  }

  // Perform query on DB
  let db_connect = dbo.getDb();

  const result = await new Promise((resolve, reject) => {
    db_connect.collection("metadata")
    .find(query, {projection: {_id: 0}}).toArray((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
  });

  return result;
}

// Main API endpoint. Returns a list of playerobjects with variouus stats relating performance and deck.
// Alongside filtering these datapoints, you can also filter based on the tournament based on size, recency, etc.
recordRoutes.route("/api/req").post(async function (req, res) {
  let db_connect = dbo.getDb();

  // Parse tournament filters
  try{
    var tourney_ids = await parseTourneyFilters(req.body.tourney_filter);
  } catch (err) {
    res.status(400);
    res.send("Error: invalid tournament filters.");
    return;
  }

  var query = {};
  try{
    // Generate query
    // TODO: soft/hard match toggling for colorID
    const keys = ['name', 'profile', 'decklist', 'wins', 'winsSwiss', 'winsBracket', 'winRate', 'winRateSwiss', 'winRateBracket', 'draws', 'losses', 'lossesSwiss', 'lossesBracket', 'standing', 'colorID', 'commander'];
    keys.forEach(element => {
      if(element in req.body){
        query[element] = req.body[element];
      }
    });
  } catch (err){
    res.status(400);
    res.send("Error: invalid filters.");
    return;
  }
  var results = [];
  
  // Get entry for each tournament we got from parseTourneyFilters
  for (let i = 0; i < tourney_ids.length; i++) {
    const result = await new Promise((resolve, reject) => {
      db_connect
        .collection(tourney_ids[i].TID)
        .find(query, {projection: {_id: 0}})
        .toArray((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
    });

    // Append tournamentName onto entries
    result.map((x) => (x.tournamentName = tourney_ids[i].tournamentName));
    results = results.concat(result);
  }

  res.json(results);
});

// Get a list of all tournaments as well as tournament IDs and metadata
recordRoutes.route("/api/list_tourneys").post(async function (req, res) {

  // Parse tournament filters and just return it
  try{
    var tourney_ids = await parseTourneyFilters(req.body);
  } catch (err) {
    res.status(400);
    res.send("Error: invalid filters.");
    return;
  }
  res.json(tourney_ids);
});

// Get all commanders present, their color IDs, and their count.
// This is only really useful for cursory analysis, as you cannot filter by standing, etc. To do so, use the 'req' endpoint.
// This endpoint is mostly here to use for search bar suggestions and to be quicker than the main 'req' endpoint.
recordRoutes.route("/api/get_commanders").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("commanders")
    .find({}, {projection: {_id: 0}})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
 });

module.exports = recordRoutes;
const { application } = require("express");
const express = require("express");
const { CURSOR_FLAGS } = require("mongodb");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

function parseTourneyFilters(filters){
  let db_connect = dbo.getDb();
  if(filters.hasOwnProperty("date") && filters.hasOwnProperty("dateCreated")){
    throw new Error("Request cannot have both date and datecreated fields");
  }
  let dateName = (filters.hasOwnProperty("date")) ? "date" : "dateCreated";
  let dateValue = (filters.hasOwnProperty("date")) ? filters.date : filters.dateCreated;
  db_connect.collection("metadata")
    .find(
      {
        [dateName]: dateValue,
        size: filters.size
      }
    ).toArray(function (err, res){if (err) throw err; callback(res);});
}
 
// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
 let db_connect = dbo.getDb();
 db_connect
   .collection("test")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});

recordRoutes.route("/record/req").post(async function (req, res) {
  let db_connect = dbo.getDb();
  let tourney_ids = parseTourneyFilters(req.body.tourney_filter);
  // TODO: add all the other fields
  let myobj = {
    standing: res.body.standing,
    colorID: res.body.colorID
  }
  var results = [];

  for (let i = 0; i < tourney_ids.length; i++) {
    const result = await new Promise((resolve, reject) => {
      db_connect
        .collection(tourney_ids[i])
        .find(myobj)
        .toArray((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
    });
    results = results.concat(result);
  }

  res.json(results);
});

recordRoutes.route("/record/list_tourneys").post(async function (req, res) {
    let db_connect = dbo.getDb("test");
    db_connect
      .collection("metadata")
      .find(req.body)
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });   
});
 
 
// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("test")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   name: req.body.name,
   position: req.body.position,
   level: req.body.level,
 };
 db_connect.collection("test").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 let newvalues = {
   $set: {
     name: req.body.name,
     position: req.body.position,
     level: req.body.level,
   },
 };
 db_connect
   .collection("test")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated");
     response.json(res);
   });
});
 
// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("test").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = recordRoutes;
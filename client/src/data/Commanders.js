import axios from "axios";

/**
 * @TODO need to make tiebreaker (top 16/4/1);
 */

/**
 *
 * @returns all valid commanders from our api
 */
export function getCommanders(filters) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return axios
    .post(process.env.REACT_APP_uri + "/api/req", filters, config)
    .then((res) =>
      res.data.filter((el) => el.commander !== "Unknown Commander")
    );
}

/**
 * @returns each unique commander(s) rankings given some data
 */
export function getCommanderRankings(data, x) {
  var uniqueCommanders = [];

  // Iterating through the entirety of the array to find unique comanders
  for (let i = 0; i < data.length; i++) {
    // If so-far unique, push it to the uniqueCommanders array given the filters
    if (!uniqueCommanders.find((el) => el.commander === data[i].commander)) {
      if (data[i].standing <= x) {
        if (!data[i].hasOwnProperty("topX")) data[i].topX = 1;
      } else {
        if (!data[i].hasOwnProperty("topX")) data[i].topX = 0;
      }

      data[i].tiebreaker = 0;
      data[i].count = 1;

      uniqueCommanders.push(data[i]);
    }
    // Otherwise, we'll look at the standing and apply filters
    else {
      let match = uniqueCommanders.find(
        (el) => el.commander === data[i].commander
      );

      if (data[i].standing <= x) {
        match.topX++;
      }

      // Tiebreaker value is 4/1/16 for x = 16/4/1
      let tiebreaker = x === 16 ? 4 : x === 4 ? 1 : 16;
      if (data[i].standing <= tiebreaker) {
        match.tiebreaker += 1;
      }

      match.count++;
    }
  }

  // Sort the array with respect to topXs and tiebreaker
  let rankedCommanders = uniqueCommanders.sort((a, b) => {
    if (b.topX - a.topX === 0) {
      return b.tiebreaker - a.tiebreaker;
    } else {
      return b.topX - a.topX;
    }
  });

  console.log(rankedCommanders);
  return rankedCommanders;
}

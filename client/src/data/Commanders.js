import axios from "axios";

/**
 * @TODO need to make tiebreaker (average winrate)
 */

/**
 *
 * @returns all valid commanders from our api
 */
export const getCommanders = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const data = {};
  return axios
    .post(process.env.REACT_APP_uri + "/api/req", data, config)
    .then((res) =>
      res.data.filter((el) => el.commander !== "Unknown Commander")
    );
};

/**
 *
 * @returns each unique commander(s) rankings given some data
 */
export function getCommanderRankings(data, filters) {
  var uniqueCommanders = [];

  // Iterating through the entirety of the array to find unique comanders
  for (let i = 0; i < data.length; i++) {
    // If so-far unique, push it to the uniqueCommanders array given the filters
    if (!uniqueCommanders.find((el) => el.commander === data[i].commander)) {
      /**
       * @TODO change 16 to filter value
       */
      if (data[i].standing <= 16) {
        if (!data[i].hasOwnProperty("top16")) data[i].top16 = 1;
        uniqueCommanders.push(data[i]);
      }
    }
    // Otherwise, we'll look at the standing and apply filters
    else {
      let match = uniqueCommanders.find(
        (el) => el.commander === data[i].commander
      );

      /**
       * @TODO change 16 to filter value
       */
      if (data[i].standing <= 16) {
        match.top16 += 1;
      }
    }
  }

  /**
   * @TODO change 16 to filter value
   */
  let sorted = uniqueCommanders.sort((a, b) => b.top16 - a.top16);

  console.log(sorted);
  return sorted;
}

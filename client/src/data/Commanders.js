import axios from "axios";

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
      res.data.filter((el) => el.commander != "Unknown Commander")
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
        uniqueCommanders.push(data[i]);
      }
    }
    // Otherwise, we'll look at the standing and apply filters
    else {
      let match = uniqueCommanders.find(
        (el) => el.commander == data[i].commander
      );

      /**
       * @TODO change 16 to filter value
       */
      if (data[i].standing <= 16) {
        /**
         * @TODO increment topX count
         */
        if (!match.hasOwnProperty("top16")) {
          match.top16 = 1;
          continue;
        }
        match.top16 += 1;
      }
    }
  }

  /**
   * @TODO change 16 to filter value
   */
  let sorted = uniqueCommanders.sort((a, b) => a.top16 - b.top16);

  console.log(sorted);
  return sorted;
}

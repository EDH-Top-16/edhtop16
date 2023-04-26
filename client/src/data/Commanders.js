import axios from "axios";

import { CheckValidFields } from "./ErrorChecking";

/**
 * @returns all valid commanders from our api
 */
export async function getCommanders(filters) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  // console.log("asdf", filters);
  const res = await axios.post(
    process.env.REACT_APP_uri + "/api/req",
    filters,
    config
  );
  return res.data.filter(
    (el) => "commander" in el && el.commander !== "Unknown Commander"
  );
}

export async function getTournaments(filters){
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
    console.log("asdf", filters);
  const res = await axios.post(
    process.env.REACT_APP_uri + "/api/list_tourneys",
    filters,
    config
  );
  return res.data;
}

/** 
 * @returns each unique commander(s) rankings given some data
 */
export function getCommanderRankings(data, entries, x) {
  var uniqueCommanders = [];

  // Iterating through the entirety of the array to find unique comanders
  for (let i = 0; i < data.length; i++) {
    /**
     * If so-far unique, push it to the uniqueCommanders array given the filters
     */
    if (!uniqueCommanders.find((el) => el.commander === data[i].commander)) {
      if (data[i].standing <= x) {
        if (!data[i].hasOwnProperty("topX")) data[i].topX = 1;
      } else {
        if (!data[i].hasOwnProperty("topX")) data[i].topX = 0;
      }

      data[i].tiebreaker = 0;
      data[i].count = 1;

      let slug;
      if (data[i].commander) {
        // Creates the slug out of its name
        slug = data[i].commander.replaceAll("/", "+");
      }
      data[i].slug = slug;

      uniqueCommanders.push(data[i]);
    } else {
      /**
       * Otherwise, we'll look at the standing and apply filters
       */
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

  let filteredCommanders = rankedCommanders;
  if (entries) {
    filteredCommanders = filteredCommanders.filter((el) => {
      if (Object.keys(entries)[0] === "$gte") {
        return el.count >= entries["$gte"];
      } else if (Object.keys(entries)[0] === "$lte") {
        return el.count <= entries["$lte"];
      } else {
        return el.count === entries;
      }
    });
  }

  // console.log("fc", filteredCommanders);
  return filteredCommanders;
}

export function getCommanderNames() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return axios
    .get(process.env.REACT_APP_uri + "/api/get_commanders", config)
    .then((res) =>
      res.data.filter((el) => el.commander !== "Unknown Commander")
    );
}

export function sortCommanders(commanders, sort, toggled) {
  let sortedCommanders = commanders.sort((a, b) => {
    if (sort === "name") {
      return !toggled
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sort === "commander") {
      return !toggled
        ? a.commander.localeCompare(b.commander)
        : b.commander.localeCompare(a.commander);
    } else if (sort === "wins") {
      return !toggled ? b.wins - a.wins : a.wins - b.wins;
    } else if (sort === "losses") {
      return !toggled ? b.losses - a.losses : a.losses - b.losses;
    } else if (sort === "draws") {
      return !toggled ? b.draws - a.draws : a.draws - b.draws;
    } else if (sort === "winrate") {
      return !toggled ? b.winRate - a.winRate : a.winRate - b.winRate;
    } else if (sort === "tournament") {
      return !toggled
        ? a.tournamentName.localeCompare(b.tournamentName)
        : b.tournamentName.localeCompare(a.tournamentName);
    } else if (sort === "topX") {
      if (b.topX - a.topX === 0) {
        return !toggled
          ? b.tiebreaker - a.tiebreaker
          : a.tiebreaker - b.tiebreaker;
      } else {
        return !toggled ? b.topX - a.topX : a.topX - b.topX;
      }
    } else if (sort === "count") {
      return !toggled ? b.count - a.count : a.count - b.count;
    } else if (sort === "conversion") {
      let conversionA = (a.topX / a.count) * 100;
      let conversionB = (b.topX / b.count) * 100;

      return !toggled ? conversionB - conversionA : conversionA - conversionB;
    } else if (sort === "standing") {
      return !toggled ? a.standing - b.standing : b.standing - a.standing;
    } else {
      return !toggled ? b[sort] - a[sort] : a[sort] - b[sort];
    }
  });

  return sortedCommanders;
}

/**
 * @returns commander names with respect to the input
 * @TODO make a semi-fuzzy search algo
 */
export function filterNames(data, input) {
  const names = data.map((obj) => {
    return obj.commander;
  });

  const filtered = names.filter((x) => {
    return x.toLowerCase().includes(input.toLowerCase());
  });

  return filtered;
}

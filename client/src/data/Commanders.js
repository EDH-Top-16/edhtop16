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

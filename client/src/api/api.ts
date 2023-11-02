/**
 * The base file to make API calls to the server.
 */

import axios, { AxiosRequestConfig } from "axios";

async function get(url: string, config?: AxiosRequestConfig, timeout?: number) {
  if (timeout) config = { ...config, timeout };

  try {
    const res = await axios.get(url, config);
    return res;
  } catch (e) {
    throw e;
  }
}

async function post<DataType>(
  url: string,
  data: DataType,
  config?: AxiosRequestConfig,
  timeout?: number,
) {
  if (timeout) config = { ...config, timeout };

  try {
    const res = await axios.post(url, data, config);
    return res;
  } catch (e) {
    throw e;
  }
}

const api = {
  get,
  post,
};

export default api;

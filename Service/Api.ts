import axios from "axios";

const baseURL = "http://10.10.92.101:5000";

export const endPoints = {
  "create-collaborate": "/api/create/collaborate",
  "get-collaborate": "/api/collaborate",
};

export const AUTHAPI = (token: string) => {
  return axios.create({
    baseURL: baseURL,
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const API = () =>
  axios.create({
    baseURL: baseURL,
  });

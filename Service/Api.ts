import axios from "axios";

const baseURL = "http://10.10.93.13:5000";

export const endPoints = {
  "create-collaborate": "/api/create/collaborate",
  "get-collaborate": "/api/collaborate",
  "update-collaborate": (id: number) => `/api/collaborate/${id}`,
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

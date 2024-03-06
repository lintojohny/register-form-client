import axios from "axios";

const endPoint = "http://localhost:4001/api";

export const postAPI = (data) => {
  return axios.post(endPoint + "/users", { user: data }).catch((error) => {
    throw error?.response?.data || {};
  });
};

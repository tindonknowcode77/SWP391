import axiosClient from "./http";

export const login = (request) => {
  return axiosClient.post('/Login/login', {...request});
};
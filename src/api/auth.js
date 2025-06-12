import axiosClient from "./http";

export const login = (request) => {
  return axiosClient.post('/Login/login', {...request});
};

export const dangky = (request) => {
  return axiosClient.post('/Register/register', {...request});
};
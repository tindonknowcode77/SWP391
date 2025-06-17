import axiosClient from "./http";

export const login = (request) => {
  return axiosClient.post('/Login/login', {...request});
};

export const loginInfor = () => {
  return axiosClient.get('/Login/me');
};

export const session = () => {
  return axiosClient.get('/Login/check-session', { withCredentials: true });
};

export const dangky = (request) => {
  return axiosClient.post('/Register/register', {...request});
};
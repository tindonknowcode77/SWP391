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

export const Laylichhen = () => {
  return axiosClient.get('/Appointment');
};

export const dangky = (request) => {
  return axiosClient.post('/Register/register', {...request});
};

export const capnhatprofile = (data) => {
  return axiosClient.put(
    'EditProfileUser/edit-profile',
    data, // Gửi object gốc
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
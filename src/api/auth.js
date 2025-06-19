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
    data, 
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const xemdanhsachlichhen = () => {
  return axiosClient.get('Appointment');
};

export const xemdanhsachlichhenpending = () => {
  return axiosClient.get('staff/appointments/pending');
};

export const xacnhanlich = (id) => {
  return axiosClient.put(
    `staff/appointments/approve/${id}`, null, 
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const huylich = (id, reason) => {
  return axiosClient.put(
    `staff/appointments/reject/${id}`,
    { Reason: reason },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
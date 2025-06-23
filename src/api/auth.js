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

export const pantient = (userId) => {
  return axiosClient.get(`EditProfileUser/${userId}`);
};
export const getAllDoctors = () => {
  return axiosClient.get('/Doctor/AllDoctors');
};

export const getDoctorById = (id) => {
  return axiosClient.get(`/Doctor/${id}`);
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

export const xemdanhsachlichduocduyet = () => {
  return axiosClient.get('/Appointment/approved');
};



// Get doctor work schedules
export const getDoctorWorkSchedules = () => {
  return axiosClient.get('/Doctor/DoctorWorkSchedule/');
};

// Get work schedule for a specific doctor
export const getDoctorWorkScheduleById = (doctorId) => {
  return axiosClient.get(`/Doctor/DoctorWorkSchedule/${doctorId}`);
};

// Get appointments for the currently logged-in user
export const getCurrentUserAppointments = () => {
  return axiosClient.get('/Appointment/mine');
};


export const datlichkham = () => {
  return axiosClient.get("/Appointment/MyBooking");
};

// Book an appointment with specific details
export const bookAppointment = (bookingData) => {
  return axiosClient.post(
    '/Appointment/Booking',
    bookingData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
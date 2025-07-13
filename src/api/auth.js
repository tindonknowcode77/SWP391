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

export const xemdanhsachlichhendathanhcong = () => {
  return axiosClient.get('staff/appointments/successful');
};

export const xemdanhsachlichhendahuy = () => {
  return axiosClient.get('staff/appointments/cancelled');
};

export const xemdanhsachlichhendone = () => {
  return axiosClient.get('staff/appointments/all');
};

export const xemdanhsachlichhendahoanthanh = () => {
  return axiosClient.get('staff/appointments/completed');
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
  return axiosClient.get("/Appointment/mine");
};

export const nguoidungdatlich = (bookingData) => {
  return axiosClient.post(
    '/Appointment/booking',
    bookingData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const  bacsilaytreatmentplan = () => {
  return axiosClient.get('/TreatmentPlan/doctor');
};

export const bacsilaydanhsachbenhnhan = () => {
  return axiosClient.get('/Appointment/mine-patients');
};
export const huylichthanhcong = (id, reason) => {
  return axiosClient.put(`/Appointment/rejected/${id}`, reason, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const TreatmentPlansByPatient = (patientId) => {
  return axiosClient.get(`/TreatmentPlan/by-patient/${patientId}`);
};

export const getTreatmentPlanById = (treatmentPlanId) => {
  return axiosClient.get(`/TreatmentPlan/GetTreatmentPlanById/${treatmentPlanId}`);
}; 
export const  AddTreatmentPlan = (data) => {
  return axiosClient.post('/TreatmentPlan/AddTreatmentPlan', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
export const UpdateTreatmentPlan = (data) => {
  return axiosClient.put('/TreatmentPlan/UpdateTreatmentPlan', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const DeleteTreatmentPlan = (treatmentPlanId) =>{
  return axiosClient.delete(`/TreatmentPlan/delete/${treatmentPlanId}`);
}

export const addPrescription = (data) => {
  return axiosClient.post('/Prescription/add-prescription', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const updatePrescription = (data) => {
  return axiosClient.put('/Prescription/update-prescription', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const AllPrescriptions = () => {
  return axiosClient.get('/Prescription/all-prescriptions');
};

export const PrescriptionById = (prescriptionId) => {
  return axiosClient.get(`/Prescription/get-prescription-by-id/${prescriptionId}`);
};

export const PrescriptionsByPatient = (patientId) => {
  return axiosClient.get(`/Prescription/by-patient/${patientId}`);
};
export const AllARVProtocol = () => {
  return axiosClient.get('/Doctor/AllARVProtocol');
}

export const ARVProtocolById = (ARVProtocolID) => {
  return axiosClient.get(`/Doctor/ARVProtocol/${ARVProtocolID}`);
};

export const  updateARVProtocol = (data) => {
  return axiosClient.put('/Doctor/UpdateARVProtocol', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getAllMedications = () => {
  return axiosClient.get('/Medication/get-all');
};

export const getMedicationById = (id) => {
  return axiosClient.get(`/Medication/get-by-id/${id}`);
};


export const aichat = (message) => {
  const token = localStorage.getItem('token');
  return axiosClient.post(
    '/Chat',
    { Message: message },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
};

export const cancelAppointment = (id, reason) =>{
  return axiosClient.put(`/Appointment/cancel/${id}`, reason, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const nguoidunglayhosodieutri = () => {
  return axiosClient.get('/TreatmentPlan/patient');
};
export const checkin =(id ) =>{
  return axiosClient.put(`/Appointment/confirm-checkin/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const checkout =(id ) =>{
  return axiosClient.put(`/Appointment/complete/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const nguoidunglaytoathuoc = (patientId) => {
  return axiosClient.get(`/TreatmentPlan/GetPrescriptionByPatient/${patientId}`);
};

export const nguoidunglayAVR = (patientId) => {
  return axiosClient.get(`/TreatmentPlan/GetARVByPatient/${patientId}`);
};
export const suaidbenhnhan = (patientId) => {
  return axiosClient.get(`/EditProfileUser/patient/${patientId}`);
}
export const infordoctor = (doctorId) => {
  return axiosClient.get(`/Doctor/InfoDoctor/${doctorId}`);
}
export const patientcheckin = (id) => {
  return axiosClient.put(`/Appointment/PatientCheckin/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const doctorcheckout =(id) =>{
  return axiosClient.put(`/Appointment/DoctorCheckout/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
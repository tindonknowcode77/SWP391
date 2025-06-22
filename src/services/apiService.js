
// API service for accessing backend endpoints

// Base URL for our API
const BASE_URL = 'https://localhost:7246/api';

// Hàm tiện ích để xử lý các yêu cầu API
const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Trong ứng dụng thực tế, lấy token từ localStorage hoặc authContext
    const token = localStorage.getItem('hivAppToken');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    // Thêm token xác thực nếu có
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Xử lý lỗi từ API
      throw new Error(data.message || 'Đã xảy ra lỗi khi gọi API');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Các hàm xử lý API xác thực
export const authAPI = {
  login: async (credentials) => {
    return fetchAPI('/Login/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  register: async (userData) => {
    return fetchAPI('/Register/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  resetPassword: async (email) => {
    return fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Các hàm xử lý API cho người dùng
export const userAPI = {
  getProfile: async () => {
    return fetchAPI('/Login/me');
  },
  
  updateProfile: async (userData) => {
    return fetchAPI('/EditProfileUser/edit-profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Các hàm xử lý API cho thuốc
export const medicationAPI = {
  getMedications: async () => {
    return fetchAPI('/Medication');
  },
  
  getMedicationById: async (id) => {
    return fetchAPI(`/Medication/${id}`);
  },
  
  addMedication: async (medicationData) => {
    return fetchAPI('/Medication', {
      method: 'POST',
      body: JSON.stringify(medicationData),
    });
  },
  
  updateMedication: async (id, medicationData) => {
    return fetchAPI(`/Medication/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicationData),
    });
  },
  
  deleteMedication: async (id) => {
    return fetchAPI(`/Medication/${id}`, {
      method: 'DELETE',
    });
  },
};

// Các hàm xử lý API cho lịch hẹn
export const appointmentAPI = {
  getAppointments: async () => {
    return fetchAPI('/Appointment/mine');
  },
  
  getAppointmentById: async (id) => {
    return fetchAPI(`/Appointment/${id}`);
  },
  
  bookAppointment: async (appointmentData) => {
    return fetchAPI('/Appointment/book-appointment', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },
  
  updateAppointment: async (id, appointmentData) => {
    return fetchAPI(`/Appointment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  },
  
  cancelAppointment: async (id, reason) => {
    return fetchAPI(`/Appointment/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'cancelled', reason }),
    });
  },
  
  getAvailableSlots: async (date, doctorId, departmentId) => {
    return fetchAPI(`/Appointment/available-slots?doctorId=${doctorId}&date=${date}${departmentId ? `&departmentId=${departmentId}` : ''}`);
  },
};

// Các hàm xử lý API cho kế hoạch điều trị
export const treatmentPlanAPI = {
  getTreatmentPlan: async () => {
    return fetchAPI('/TreatmentPlan/current');
  },
  
  getTreatmentHistory: async () => {
    return fetchAPI('/TreatmentPlan/history');
  },
  
  createTreatmentPlan: async (planData) => {
    return fetchAPI('/TreatmentPlan', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },
  
  updateTreatmentPlan: async (id, planData) => {
    return fetchAPI(`/TreatmentPlan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  },
};

// Các hàm xử lý API cho tài nguyên
export const resourcesAPI = {
  getResources: async (category) => {
    return fetchAPI(`/Resources${category ? `?category=${category}` : ''}`);
  },
  
  getResourceById: async (id) => {
    return fetchAPI(`/Resources/${id}`);
  },
  
  searchResources: async (query) => {
    return fetchAPI(`/Resources/search?q=${encodeURIComponent(query)}`);
  },
  
  createResource: async (resourceData) => {
    return fetchAPI('/Resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    });
  },
  
  updateResource: async (id, resourceData) => {
    return fetchAPI(`/Resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData),
    });
  },
  
  deleteResource: async (id) => {
    return fetchAPI(`/Resources/${id}`, {
      method: 'DELETE',
    });
  },
};

// Thêm API cho bác sĩ
export const doctorAPI = {
  getDoctors: async () => {
    return fetchAPI('/Doctor/AllDoctors');
  },
  
  getDoctorById: async (doctorId) => {
    return fetchAPI(`/Doctor/InfoDoctor/${doctorId}`);
  },
  
  getARVProtocols: async () => {
    return fetchAPI('/Doctor/AllARVProtocol');
  },
  
  getARVProtocolById: async (protocolId) => {
    return fetchAPI(`/Doctor/ARVProtocol/${protocolId}`);
  },
  
  updateARVProtocol: async (protocolData) => {
    return fetchAPI('/Doctor/UpdateARVProtocol', {
      method: 'PUT',
      body: JSON.stringify(protocolData),
    });
  }
};

export const apiService = {
  auth: authAPI,
  user: userAPI,
  medication: medicationAPI,
  appointment: appointmentAPI,
  treatmentPlan: treatmentPlanAPI,
  resources: resourcesAPI,
  doctor: doctorAPI
};

// Export as both default and named export to support both import styles
export default apiService;
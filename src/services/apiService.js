
// Mô phỏng API - trong ứng dụng thực tế, những hàm này sẽ gọi đến API thực

// URL cơ sở - trong dự án thực tế sẽ là URL API thực của bạn
const BASE_URL = 'https://api.hivtreatment.example.com/api/v1';

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
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          const user = {
            id: 'user123',
            name: 'Nguyễn Văn A',
            email: credentials.email,
            token: 'mock_token_' + Math.random(),
          };
          resolve({ success: true, data: user });
        } else {
          resolve({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify(credentials),
    // });
  },
  
  register: async (userData) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userData.name && userData.email && userData.password) {
          const user = {
            id: 'user' + Math.floor(Math.random() * 1000),
            name: userData.name,
            email: userData.email,
            token: 'mock_token_' + Math.random(),
          };
          resolve({ success: true, data: user });
        } else {
          resolve({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
        }
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify(userData),
    // });
  },
  
  resetPassword: async (email) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email) {
          resolve({ 
            success: true, 
            message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn' 
          });
        } else {
          resolve({ success: false, message: 'Vui lòng nhập địa chỉ email' });
        }
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/auth/reset-password', {
    //   method: 'POST',
    //   body: JSON.stringify({ email }),
    // });
  },
};

// Các hàm xử lý API cho người dùng
export const userAPI = {
  getProfile: async () => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const profile = {
          id: 'user123',
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          phoneNumber: '0912345678',
          dateOfBirth: '1990-01-01',
          gender: 'male',
          address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
          bloodType: 'A+',
          emergencyContact: 'Nguyễn Thị B - 0987654321',
          allergies: 'Không có',
          currentMedications: 'Efavirenz, Lamivudine, Tenofovir',
          registrationDate: '2023-05-10',
        };
        resolve({ success: true, data: profile });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/users/profile');
  },
  
  updateProfile: async (userData) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          data: { ...userData },
          message: 'Cập nhật thông tin thành công' 
        });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/users/profile', {
    //   method: 'PUT',
    //   body: JSON.stringify(userData),
    // });
  },
};

// Các hàm xử lý API cho thuốc
export const medicationAPI = {
  getMedications: async () => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const medications = [
          {
            id: 1,
            name: 'Efavirenz 600mg',
            dosage: '1 viên/ngày',
            schedule: 'Tối trước khi đi ngủ',
            startDate: '2023-01-10',
            endDate: null, // dùng liên tục
            instructions: 'Uống vào buổi tối trước khi đi ngủ, tốt nhất là cách bữa ăn 2 giờ',
            sideEffects: 'Có thể gây chóng mặt, mất ngủ hoặc mơ vivid trong vài tuần đầu',
            remainingQuantity: 30,
            nextRefillDate: '2023-06-15'
          },
          {
            id: 2,
            name: 'Lamivudine 300mg',
            dosage: '1 viên/ngày',
            schedule: 'Sáng sau khi ăn',
            startDate: '2023-01-10',
            endDate: null, // dùng liên tục
            instructions: 'Uống vào buổi sáng sau khi ăn',
            sideEffects: 'Thường dung nạp tốt, đôi khi gây buồn nôn, đau đầu',
            remainingQuantity: 30,
            nextRefillDate: '2023-06-15'
          },
          {
            id: 3,
            name: 'Tenofovir 300mg',
            dosage: '1 viên/ngày',
            schedule: 'Sáng sau khi ăn',
            startDate: '2023-01-10',
            endDate: null, // dùng liên tục
            instructions: 'Uống vào buổi sáng sau khi ăn cùng với Lamivudine',
            sideEffects: 'Có thể ảnh hưởng đến thận, cần theo dõi chức năng thận định kỳ',
            remainingQuantity: 30,
            nextRefillDate: '2023-06-15'
          }
        ];
        resolve({ success: true, data: medications });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/medications');
  },
  
  getMedicationById: async (id) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const medication = {
          id: id,
          name: 'Efavirenz 600mg',
          dosage: '1 viên/ngày',
          schedule: 'Tối trước khi đi ngủ',
          startDate: '2023-01-10',
          endDate: null, // dùng liên tục
          instructions: 'Uống vào buổi tối trước khi đi ngủ, tốt nhất là cách bữa ăn 2 giờ',
          sideEffects: 'Có thể gây chóng mặt, mất ngủ hoặc mơ vivid trong vài tuần đầu',
          remainingQuantity: 30,
          nextRefillDate: '2023-06-15',
          doctor: 'BS. Nguyễn Văn A',
          pharmacy: 'Nhà thuốc Bệnh viện Bạch Mai'
        };
        resolve({ success: true, data: medication });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/medications/${id}`);
  },
  
  addMedication: async (medicationData) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          data: { id: Math.floor(Math.random() * 1000), ...medicationData },
          message: 'Thêm thuốc thành công' 
        });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/medications', {
    //   method: 'POST',
    //   body: JSON.stringify(medicationData),
    // });
  },
  
  updateMedication: async (id, medicationData) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          data: { id, ...medicationData },
          message: 'Cập nhật thông tin thuốc thành công' 
        });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/medications/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(medicationData),
    // });
  },
  
  deleteMedication: async (id) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Xóa thuốc thành công' 
        });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/medications/${id}`, {
    //   method: 'DELETE',
    // });
  },
};

// Các hàm xử lý API cho lịch hẹn
export const appointmentAPI = {
  getAppointments: async () => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointments = [
          {
            id: 1,
            date: '2023-06-15',
            time: '09:00',
            doctor: 'BS. Nguyễn Văn A',
            department: 'Khoa HIV/AIDS',
            reason: 'Tái khám định kỳ',
            status: 'scheduled', // scheduled, completed, cancelled
            notes: 'Mang theo kết quả xét nghiệm gần nhất'
          },
          {
            id: 2,
            date: '2023-07-20',
            time: '10:30',
            doctor: 'BS. Trần Thị B',
            department: 'Khoa HIV/AIDS',
            reason: 'Khám tổng quát',
            status: 'scheduled',
            notes: 'Nhớ nhịn ăn trước 8 giờ để xét nghiệm máu'
          },
          {
            id: 3,
            date: '2023-05-10',
            time: '14:00',
            doctor: 'BS. Lê Văn C',
            department: 'Khoa Nội tiết',
            reason: 'Khám bệnh đồng nhiễm',
            status: 'completed',
            notes: 'Đã thực hiện xét nghiệm và kê đơn thuốc'
          }
        ];
        resolve({ success: true, data: appointments });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/appointments');
  },
  
  getAppointmentById: async (id) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = {
          id: id,
          date: '2023-06-15',
          time: '09:00',
          doctor: 'BS. Nguyễn Văn A',
          department: 'Khoa HIV/AIDS',
          reason: 'Tái khám định kỳ',
          status: 'scheduled',
          notes: 'Mang theo kết quả xét nghiệm gần nhất',
          location: 'Phòng 305, Tầng 3, Nhà A1',
          createdAt: '2023-05-20',
          documents: [
            { name: 'Kết quả xét nghiệm CD4', url: '/documents/cd4-results.pdf' },
            { name: 'Kết quả xét nghiệm tải lượng virus', url: '/documents/viral-load.pdf' }
          ]
        };
        resolve({ success: true, data: appointment });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/appointments/${id}`);
  },
  
  bookAppointment: async (appointmentData) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          data: { id: Math.floor(Math.random() * 1000), ...appointmentData, status: 'scheduled' },
          message: 'Đặt lịch hẹn thành công' 
        });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/appointments', {
    //   method: 'POST',
    //   body: JSON.stringify(appointmentData),
    // });
  },
  
  updateAppointment: async (id, appointmentData) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          data: { id, ...appointmentData },
          message: 'Cập nhật lịch hẹn thành công' 
        });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/appointments/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(appointmentData),
    // });
  },
  
  cancelAppointment: async (id, reason) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Hủy lịch hẹn thành công' 
        });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/appointments/${id}/cancel`, {
    //   method: 'POST',
    //   body: JSON.stringify({ reason }),
    // });
  },
  
  getAvailableSlots: async (date, doctorId, departmentId) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const availableSlots = [
          { time: '08:00', available: true },
          { time: '08:30', available: true },
          { time: '09:00', available: false },
          { time: '09:30', available: true },
          { time: '10:00', available: true },
          { time: '10:30', available: false },
          { time: '11:00', available: true },
          { time: '14:00', available: true },
          { time: '14:30', available: true },
          { time: '15:00', available: false },
          { time: '15:30', available: true },
          { time: '16:00', available: true },
          { time: '16:30', available: true },
        ];
        resolve({ success: true, data: availableSlots });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/appointments/available-slots?date=${date}&doctorId=${doctorId}&departmentId=${departmentId}`);
  },
};

// Các hàm xử lý API cho kế hoạch điều trị
export const treatmentPlanAPI = {
  getTreatmentPlan: async () => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const treatmentPlan = {
          id: 1,
          patientId: 'user123',
          doctor: 'BS. Nguyễn Văn A',
          startDate: '2023-01-10',
          lastUpdated: '2023-05-15',
          overview: 'Kế hoạch điều trị ARV kết hợp với theo dõi sức khỏe định kỳ',
          status: 'active',
          arvRegimen: {
            name: 'TLD (Tenofovir + Lamivudine + Dolutegravir)',
            dosage: 'Một viên mỗi ngày',
            startDate: '2023-01-10',
            notes: 'Uống vào cùng một thời điểm mỗi ngày, tốt nhất là vào buổi sáng sau khi ăn'
          },
          monitoringSchedule: [
            {
              type: 'Xét nghiệm CD4',
              frequency: 'Mỗi 6 tháng',
              nextDate: '2023-07-10',
              lastResults: '650 tế bào/mm³ (2023-01-10)'
            },
            {
              type: 'Xét nghiệm tải lượng virus',
              frequency: 'Mỗi 6 tháng',
              nextDate: '2023-07-10',
              lastResults: 'Không phát hiện (2023-01-10)'
            },
            {
              type: 'Xét nghiệm chức năng gan',
              frequency: 'Mỗi 6 tháng',
              nextDate: '2023-07-10',
              lastResults: 'Bình thường (2023-01-10)'
            },
            {
              type: 'Xét nghiệm chức năng thận',
              frequency: 'Mỗi 6 tháng',
              nextDate: '2023-07-10',
              lastResults: 'Bình thường (2023-01-10)'
            }
          ],
          appointmentSchedule: [
            {
              type: 'Tái khám định kỳ',
              frequency: 'Mỗi 3 tháng',
              nextDate: '2023-07-10',
              location: 'Phòng khám HIV/AIDS - Bệnh viện Bạch Mai'
            },
            {
              type: 'Lấy thuốc',
              frequency: 'Mỗi 3 tháng',
              nextDate: '2023-07-10',
              location: 'Nhà thuốc - Bệnh viện Bạch Mai'
            }
          ],
          recommendations: [
            'Duy trì chế độ ăn uống lành mạnh, đảm bảo đủ dinh dưỡng',
            'Tập thể dục đều đặn, ít nhất 30 phút mỗi ngày',
            'Tránh rượu bia và các chất kích thích',
            'Thông báo cho bác sĩ nếu có bất kỳ tác dụng phụ nào của thuốc',
            'Sử dụng bao cao su khi quan hệ tình dục'
          ],
          supportResources: [
            {
              name: 'Nhóm hỗ trợ đồng đẳng',
              schedule: 'Thứ Bảy hàng tuần, 9:00 - 11:00',
              location: 'Phòng sinh hoạt cộng đồng - Tầng 1, Nhà A2',
              contact: 'Anh Minh - 0912 345 678'
            },
            {
              name: 'Tư vấn dinh dưỡng',
              schedule: 'Thứ Ba và Thứ Năm, 14:00 - 16:00',
              location: 'Phòng tư vấn - Tầng 2, Nhà A1',
              contact: 'Chị Hương - 0987 654 321'
            }
          ]
        };
        resolve({ success: true, data: treatmentPlan });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/treatment-plans/current');
  },
  
  getTreatmentHistory: async () => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const treatmentHistory = [
          {
            id: 1,
            date: '2023-01-10',
            doctor: 'BS. Nguyễn Văn A',
            diagnosis: 'Nhiễm HIV, CD4 = 650 tế bào/mm³, Tải lượng virus = Không phát hiện',
            treatment: 'Bắt đầu phác đồ TLD (Tenofovir + Lamivudine + Dolutegravir)',
            notes: 'Bệnh nhân dung nạp thuốc tốt, không ghi nhận tác dụng phụ'
          },
          {
            id: 2,
            date: '2023-04-15',
            doctor: 'BS. Trần Thị B',
            diagnosis: 'Tái khám định kỳ, sức khỏe ổn định',
            treatment: 'Tiếp tục phác đồ TLD',
            notes: 'Bệnh nhân tuân thủ điều trị tốt, không có vấn đề gì đáng chú ý'
          }
        ];
        resolve({ success: true, data: treatmentHistory });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI('/treatment-plans/history');
  },
};

// Các hàm xử lý API cho tài nguyên
export const resourcesAPI = {
  getResources: async (category) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const resources = [
          {
            id: 1,
            title: 'Hiểu về HIV/AIDS',
            category: 'education',
            type: 'article',
            thumbnail: '/resources/hiv-overview.jpg',
            content: 'Bài viết giới thiệu về HIV/AIDS, cách lây truyền, phòng ngừa và điều trị...',
            author: 'BS. Nguyễn Văn A',
            publishDate: '2023-01-15',
            tags: ['HIV', 'AIDS', 'Giáo dục sức khỏe']
          },
          {
            id: 2,
            title: 'Hiểu về thuốc ARV',
            category: 'medication',
            type: 'video',
            thumbnail: '/resources/arv-drugs.jpg',
            videoUrl: 'https://example.com/videos/arv-drugs',
            duration: '15:30',
            author: 'TS. Trần Thị B',
            publishDate: '2023-02-20',
            tags: ['ARV', 'Điều trị HIV', 'Thuốc']
          },
          {
            id: 3,
            title: 'Dinh dưỡng cho người sống với HIV',
            category: 'lifestyle',
            type: 'article',
            thumbnail: '/resources/nutrition.jpg',
            content: 'Hướng dẫn về chế độ dinh dưỡng phù hợp cho người sống với HIV...',
            author: 'ThS. Phạm Thị D',
            publishDate: '2023-03-10',
            tags: ['Dinh dưỡng', 'Sức khỏe', 'HIV']
          },
          {
            id: 4,
            title: 'Lịch sử phát hiện và điều trị HIV',
            category: 'education',
            type: 'document',
            thumbnail: '/resources/hiv-history.jpg',
            documentUrl: '/documents/hiv-history.pdf',
            author: 'GS. Lê Văn C',
            publishDate: '2023-04-05',
            tags: ['Lịch sử HIV', 'Nghiên cứu']
          }
        ];
        
        if (category) {
          const filteredResources = resources.filter(resource => resource.category === category);
          resolve({ success: true, data: filteredResources });
        } else {
          resolve({ success: true, data: resources });
        }
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/resources${category ? `?category=${category}` : ''}`);
  },
  
  getResourceById: async (id) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const resource = {
          id: id,
          title: 'Hiểu về HIV/AIDS',
          category: 'education',
          type: 'article',
          thumbnail: '/resources/hiv-overview.jpg',
          content: `
            <h2>HIV là gì?</h2>
            <p>HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người. Virus này tấn công vào hệ thống miễn dịch của cơ thể, đặc biệt là tế bào CD4, làm suy yếu khả năng chống lại các bệnh nhiễm trùng và một số loại ung thư.</p>
            
            <h2>AIDS là gì?</h2>
            <p>AIDS (Acquired Immunodeficiency Syndrome) là giai đoạn cuối cùng của quá trình nhiễm HIV. Khi số lượng tế bào CD4 giảm xuống dưới 200 tế bào/mm³ hoặc khi người bệnh xuất hiện các bệnh nhiễm trùng cơ hội, họ được chẩn đoán mắc AIDS.</p>
            
            <h2>Cách lây truyền HIV</h2>
            <p>HIV lây truyền qua các đường sau:</p>
            <ul>
              <li>Quan hệ tình dục không bảo vệ với người nhiễm HIV</li>
              <li>Dùng chung kim tiêm, bơm tiêm hoặc các dụng cụ tiêm chích khác</li>
              <li>Từ mẹ sang con trong quá trình mang thai, sinh con hoặc cho con bú</li>
              <li>Truyền máu hoặc cấy ghép nội tạng từ người nhiễm HIV</li>
            </ul>
            
            <h2>Phòng ngừa HIV</h2>
            <p>Có thể phòng ngừa HIV bằng cách:</p>
            <ul>
              <li>Sử dụng bao cao su đúng cách khi quan hệ tình dục</li>
              <li>Không dùng chung kim tiêm, bơm tiêm hoặc các dụng cụ tiêm chích khác</li>
              <li>Uống thuốc dự phòng trước phơi nhiễm (PrEP) nếu thuộc nhóm nguy cơ cao</li>
              <li>Điều trị ARV sớm cho người nhiễm HIV để giảm nguy cơ lây truyền</li>
            </ul>
            
            <h2>Điều trị HIV</h2>
            <p>Hiện nay, HIV có thể được kiểm soát hiệu quả bằng liệu pháp kháng retrovirus (ARV). Người nhiễm HIV cần uống thuốc ARV đều đặn theo chỉ định của bác sĩ để giảm tải lượng virus trong máu xuống mức không phát hiện được. Khi đó, người bệnh sẽ sống khỏe mạnh và không lây truyền HIV cho người khác.</p>
          `,
          author: 'BS. Nguyễn Văn A',
          publishDate: '2023-01-15',
          tags: ['HIV', 'AIDS', 'Giáo dục sức khỏe'],
          relatedResources: [2, 3]
        };
        resolve({ success: true, data: resource });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/resources/${id}`);
  },
  
  searchResources: async (query) => {
    // Mô phỏng - trong dự án thực tế sẽ gọi API thực
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchResults = [
          {
            id: 1,
            title: 'Hiểu về HIV/AIDS',
            category: 'education',
            type: 'article',
            thumbnail: '/resources/hiv-overview.jpg',
            snippet: '...bài viết giới thiệu về <strong>HIV</strong>/AIDS, cách lây truyền, phòng ngừa...',
            author: 'BS. Nguyễn Văn A',
            publishDate: '2023-01-15'
          },
          {
            id: 3,
            title: 'Dinh dưỡng cho người sống với HIV',
            category: 'lifestyle',
            type: 'article',
            thumbnail: '/resources/nutrition.jpg',
            snippet: '...chế độ dinh dưỡng phù hợp cho người sống với <strong>HIV</strong>...',
            author: 'ThS. Phạm Thị D',
            publishDate: '2023-03-10'
          }
        ];
        resolve({ success: true, data: searchResults });
      }, 800);
    });
    
    // Trong dự án thực tế
    // return fetchAPI(`/resources/search?q=${encodeURIComponent(query)}`);
  },
};

export const apiService = {
  auth: authAPI,
  user: userAPI,
  medication: medicationAPI,
  appointment: appointmentAPI,
  treatmentPlan: treatmentPlanAPI,
  resources: resourcesAPI
};

// Export as both default and named export to support both import styles
export default apiService;
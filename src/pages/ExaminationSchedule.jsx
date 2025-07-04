import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import '../styles/ExaminationSchedule.css';
import '../styles/ExaminationScheduleEnhancements.css';
import { getAllDoctors, getDoctorWorkSchedules, getDoctorWorkScheduleById } from '../api/auth';
import { nguoidungdatlich } from '../api/auth';

// Dịch vụ mặc định khi không có từ API
const defaultServices = {
  // 'Xét nghiệm HIV':,
  // 'Điều trị ARV': ,
  // 'Tư vấn HIV': ,
  // 'Tái khám định kỳ': ,
  // 'Khám tổng quát': ,
};

export default function ExaminationSchedule() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); 
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  // State variables for community feedback
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ name: '', comment: '', rating: 5 });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  // Thêm state cho popup và data lịch khám
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [doctorScheduleData, setDoctorScheduleData] = useState([]);
  const [showServiceSuccessPopup, setShowServiceSuccessPopup] = useState(false);
  const [examschPage, setExamschPage] = useState(0); // Pagination for doctor grid
  const doctorsPerPage = 5;
  
  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const doctorsData = await getAllDoctors();
        console.log('Doctors data from API:', doctorsData);
        
        if (doctorsData && Array.isArray(doctorsData)) {
          // Process doctors data to add schedule and work hours if they don't exist
          const processedDoctors = doctorsData.map(doctor => ({
            id: doctor.DoctorId,
            userId: doctor.UserID,
            name: doctor.Fullname || doctor.name || 'Bác sĩ',
            specialty: doctor.Specialization || doctor.specialty || 'Chuyên khoa chung',
            experience: doctor.ExperienceYears ? `${doctor.ExperienceYears} năm kinh nghiệm` : doctor.experience || 'Chuyên gia y tế',
            avatar: doctor.image || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
            education: doctor.education || 'Đại học Y',
            description: doctor.Description || doctor.description || 'Thông tin đang được cập nhật',
            rating: doctor.rating || (4 + Math.random()).toFixed(1),
            // Default schedules
            schedule: 'Thứ 2 - Thứ 6',
            hours: '8:00 - 17:00',
            workDays: {
              1: true, 2: true, 3: true, 4: true, 5: true, // Thứ 2 - Thứ 6
              0: false, 6: false // CN, T7 nghỉ
            },
            workHours: {
              start: 8,
              end: 17
            },
            certifications: [doctor.Certifications || 'Chứng chỉ hành nghề'],
            // Default services and fees
            services: [
              // 'Tư vấn HIV/AIDS',
              // 'Điều trị ARV', 
              // 'Xét nghiệm định kỳ',
              // 'Tái khám định kỳ',
              // 'Khám tổng quát'
            ],
            fees: defaultServices
          }));
          
          setDoctors(processedDoctors);
        } else {
          console.error('API không trả về dữ liệu bác sĩ dạng mảng:', doctorsData);
          setDoctors([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bác sĩ từ API:', error);
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);
  
  const [form, setForm] = useState({
    phone: '',
    reason: '',
    appointmentDate: '',
    appointmentTime: '',
    doctorId: '',
    bookingtype: '',
    bookdate : '',
    notes: '',
    totalFee: 0,
    isOnlineConsultation: false,
    onlineConsultationFee: 100000, // Phí tư vấn trực tuyến cố định: 100,000 VND
  });
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState(null);
  const [appointmentCode, setAppointmentCode] = useState('');
  
  useEffect(() => {
    // Lấy các cuộc hẹn từ localStorage
    const stored = localStorage.getItem('appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  // Load feedback data when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      // In a real application, you would fetch the feedback from an API
      // For now, we'll simulate this with some sample data
      const sampleFeedbacks = [
        {
          id: 1,
          doctorId: selectedDoctor.id,
          name: 'Nguyễn Thị A',
          comment: 'Bác sĩ rất tận tâm và chuyên môn cao. Tư vấn rất chi tiết và giải thích rõ ràng cho tôi về tình trạng bệnh và phương pháp điều trị. Tôi cảm thấy rất an tâm.',
          rating: 5,
          date: '2025-05-17T08:30:00.000Z'
        },
        {
          id: 2,
          doctorId: selectedDoctor.id,
          name: 'Trần Văn B',
          comment: 'Bác sĩ chuyên nghiệp, nhiệt tình tư vấn. Thời gian chờ đợi hơi lâu nhưng chất lượng khám bệnh tốt nên tôi rất hài lòng.',
          rating: 4,
          date: '2025-05-12T10:15:00.000Z'
        },
        {
          id: 3,
          doctorId: selectedDoctor.id,
          name: 'Lê Thị C',
          comment: 'Rất hài lòng với dịch vụ. Bác sĩ tư vấn tận tình, giải thích mọi thắc mắc của tôi. Không gian phòng khám sạch sẽ và riêng tư.',
          rating: 5,
          date: '2025-05-05T14:45:00.000Z'
        }
      ];
      
      // Load feedback from localStorage if available
      const storedFeedbacks = localStorage.getItem('doctorFeedbacks');
      let allFeedbacks = storedFeedbacks ? JSON.parse(storedFeedbacks) : [];
      
      // Filter feedbacks for current doctor
      const doctorFeedbacks = allFeedbacks.filter(feedback => feedback.doctorId === selectedDoctor.id);
      
      // If we have stored feedbacks for this doctor, use those. Otherwise, use sample data
      const finalFeedbacks = doctorFeedbacks.length > 0 ? doctorFeedbacks : sampleFeedbacks;
      setFeedbacks(finalFeedbacks);

      // Calculate average rating and rating distribution
      const calculateRatingStats = (feedbacks) => {
        if (feedbacks.length === 0) {
          return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          };
        }

        const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
        const averageRating = totalRating / feedbacks.length;
        
        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedbacks.forEach(feedback => {
          distribution[feedback.rating]++;
        });

        return {
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews: feedbacks.length,
          ratingDistribution: distribution
        };
      };

      const ratingStats = calculateRatingStats(finalFeedbacks);
      
      // Update selectedDoctorInfo with calculated rating
      setSelectedDoctorInfo(prevInfo => ({
        ...prevInfo,
        rating: ratingStats.averageRating,
        totalReviews: ratingStats.totalReviews,
        ratingDistribution: ratingStats.ratingDistribution
      }));

      // Fetch the doctor's work schedule when selected
      const fetchDoctorSchedule = async () => {
        try {
          const response = await getDoctorWorkScheduleById(selectedDoctor.id);
          console.log(`Doctor ${selectedDoctor.id}'s schedule:`, response);
          
          // If response includes work schedule data, update the selected doctor info
          if (response && response.data) {
            const scheduleData = response.data;
            
            // Update doctor schedule info
            setSelectedDoctorInfo(prevInfo => ({
              ...prevInfo,
              workDays: scheduleData.workDays || prevInfo.workDays,
              workHours: {
                start: scheduleData.startTime || prevInfo.workHours.start,
                end: scheduleData.endTime || prevInfo.workHours.end
              },
              schedule: scheduleData.daysDescription || prevInfo.schedule,
              hours: `${scheduleData.startTime || 8}:00 - ${scheduleData.endTime || 17}:00`
            }));
          }
        } catch (error) {
          console.error(`Error fetching doctor ${selectedDoctor.id}'s schedule:`, error);
        }
      };

      fetchDoctorSchedule();
    }
  }, [selectedDoctor]);

  // Fetch all doctor work schedules
  useEffect(() => {
    const fetchAllDoctorSchedules = async () => {
      try {
        const response = await getDoctorWorkSchedules();
        console.log('All doctor schedules:', response);
        
        // If we have schedule data, update our doctors array with correct schedule information
        if (response && response.data && Array.isArray(response.data)) {
          const schedules = response.data;
          
          setDoctors(prevDoctors => {
            return prevDoctors.map(doctor => {
              // Find schedule for this doctor
              const doctorSchedule = schedules.find(s => s.doctorId === doctor.id);
              
              if (doctorSchedule) {
                // Convert schedule data to our format
                const workDays = {};
                if (doctorSchedule.workDays) {
                  // Convert API work days format to our format
                  Object.keys(doctorSchedule.workDays).forEach(day => {
                    workDays[day] = doctorSchedule.workDays[day];
                  });
                } else {
                  // Default weekdays
                  workDays[0] = false; // Sunday
                  workDays[1] = true;  // Monday
                  workDays[2] = true;  // Tuesday
                  workDays[3] = true;  // Wednesday
                  workDays[4] = true;  // Thursday
                  workDays[5] = true;  // Friday
                  workDays[6] = false; // Saturday
                }
                
                return {
                  ...doctor,
                  workDays,
                  workHours: {
                    start: doctorSchedule.startTime || doctor.workHours.start,
                    end: doctorSchedule.endTime || doctor.workHours.end
                  },
                  schedule: doctorSchedule.daysDescription || doctor.schedule,
                  hours: `${doctorSchedule.startTime || 8}:00 - ${doctorSchedule.endTime || 17}:00`
                };
              }
              
              return doctor;
            });
          });
        }
      } catch (error) {
        console.error('Error fetching all doctor schedules:', error);
      }
    };

    // Call this after doctors are loaded
    if (doctors.length > 0) {
      fetchAllDoctorSchedules();
    }
  }, [doctors.length]);
    const generateTimeSlots = (date, doctorId) => {
    if (!date) return [];
    
    const doctor = doctors.find(doc => doc.id === parseInt(doctorId) || doc.id === doctorId);
    if (!doctor) return [];

    // Chuyển đổi ngày đã chọn thành thứ trong tuần (0: Chủ Nhật, 1: Thứ 2, ...)
    const dayOfWeek = new Date(date).getDay();
    
    // Kiểm tra xem bác sĩ có làm việc vào ngày đã chọn không
    if (!doctor.workDays || !doctor.workDays[dayOfWeek]) return [];
    
    // Lấy giờ làm việc từ cấu trúc dữ liệu nâng cao
    const { start: startHour = 8, end: endHour = 17 } = doctor.workHours || {};
    
    // Tạo các khung giờ 30 phút
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    
    // Kiểm tra ngày hiện tại để không hiển thị các khung giờ đã qua
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    // Lọc các khung giờ đã được đặt và đã qua
    const bookedSlots = appointments.filter(
      app => app.appointmentDate === date && 
             app.doctorId === doctorId
    ).map(app => app.appointmentTime);
    
    return slots.filter(slot => {
      // Không hiển thị slot đã được đặt
      if (bookedSlots.includes(slot)) return false;
      
      // Nếu là ngày hiện tại, kiểm tra thêm giờ
      if (date === today) {
        const [slotHour, slotMinute] = slot.split(':').map(Number);
        if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
          return false;
        }
      }
      
      return true;
    });
  };

  const getVietnamDayName = (dayIndex) => {
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[dayIndex];
  };  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDoctorInfo(doctor);
    setForm(prev => ({
      ...prev,
      doctorId: doctor.id.toString(),
      requestedServices: [], // Reset requested services
      totalFee: 0 // Reset fee when changing doctors
    }));
    setShowDetails(true);
    
    // Sau khi chọn bác sĩ, chuyển sang bước tiếp theo trong quá trình đặt lịch
    setCurrentStep(1);
    
    // Fetch doctor work schedule for the selected doctor
    try {
      const scheduleResponse = await getDoctorWorkScheduleById(doctor.id);
      console.log(`Fetched schedule for doctor ${doctor.id}:`, scheduleResponse);
      
      if (scheduleResponse && scheduleResponse.data) {
        const schedule = scheduleResponse.data;
        
        // Update doctor's schedule information
        const updatedDoctor = {
          ...doctor,
          workDays: schedule.workDays || doctor.workDays,
          workHours: {
            start: schedule.startTime || doctor.workHours.start,
            end: schedule.endTime || doctor.workHours.end
          },
          schedule: schedule.daysDescription || doctor.schedule,
          hours: `${schedule.startTime || 8}:00 - ${schedule.endTime || 17}:00`
        };
        
        setSelectedDoctor(updatedDoctor);
        setSelectedDoctorInfo(updatedDoctor);
      }
    } catch (error) {
      console.error(`Error fetching schedule for doctor ${doctor.id}:`, error);
    }
  };
  
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    setForm(prev => ({
      ...prev,
      appointmentDate: selectedDate,
      bookdate: combineDateTime(selectedDate, prev.appointmentTime)
    }));
    const slots = generateTimeSlots(selectedDate, form.doctorId);
    setAvailableSlots(slots);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'appointmentTime') {
      setForm(prev => ({
        ...prev,
        [name]: value,
        bookdate: combineDateTime(prev.appointmentDate, value)
      }));
    } else if (name === 'phone') {
      // Chỉ cho nhập số, tối đa 10 ký tự
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === 'doctorId') {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (selectedDate) {
        const slots = generateTimeSlots(selectedDate, value);
        setAvailableSlots(slots);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
    const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    const selectedDoctor = doctors.find(doc => doc.id.toString() === form.doctorId);
    
    if (checked) {
      // Add service to the list and update total fee
      const serviceFee = selectedDoctor?.fees[value] || 0;
      setForm(prev => ({
        ...prev,
        requestedServices: [...prev.requestedServices, value],
        totalFee: prev.totalFee + serviceFee
      }));
    } else {
      // Remove service from the list and update total fee
      const serviceFee = selectedDoctor?.fees[value] || 0;
      setForm(prev => ({
        ...prev,
        requestedServices: prev.requestedServices.filter(service => service !== value),
        totalFee: prev.totalFee - serviceFee
      }));
    }
  };const nextStep = () => {
    // Validate current step before moving to the next
    if (currentStep === 1) {
      if (!form.doctorId) {
        alert('Vui lòng chọn bác sĩ.');
        return;
      }
      setCurrentStep(2);
    } 
    else if (currentStep === 2) {
      if (!form.appointmentDate || !form.appointmentTime) {
        alert('Vui lòng chọn ngày và giờ khám.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra các thông tin bắt buộc
    if (form.phone.length < 9 || form.phone.length > 10) {
      alert('Số điện thoại phải có 9 hoặc 10 số.');
      return;
    }
    
    if (!form.appointmentDate || !form.appointmentTime) {
      alert('Vui lòng chọn ngày và giờ khám.');
      return;
    }
    
    if (!form.reason) {
      alert('Vui lòng nhập lý do khám.');
      return;
    }
    
    if (form.requestedServices.length === 0) {
      alert('Vui lòng chọn ít nhất một dịch vụ khám.');
      return;
    }
    
    setSubmitted(true);
    setShowForm(false);
    
    // Tạo mã cuộc hẹn ngẫu nhiên với format dễ nhớ
    const generatedCode = Math.random().toString(36).substring(2, 5).toUpperCase() + 
                          Math.random().toString(10).substring(2, 5);
    setAppointmentCode(generatedCode);
      // Lưu chi tiết cuộc hẹn vào localStorage
    const selectedDoctor = doctors.find(doc => doc.id.toString() === form.doctorId);
    const newAppointment = {
      id: Date.now(),
      appointmentCode: generatedCode,
      phone: form.phone,
      reason: form.reason,
      appointmentDate: form.appointmentDate,
      appointmentTime: form.appointmentTime,
      doctorId: form.doctorId,
      doctorName: selectedDoctor?.name || '',
      doctorSpecialty: selectedDoctor?.specialty || '',
      requestedServices: form.requestedServices,
      notes: form.notes,
      status: 'pending',
      isOnlineConsultation: form.isOnlineConsultation,
      onlineConsultationFee: form.isOnlineConsultation ? form.onlineConsultationFee : 0,
      totalFee: form.totalFee,
      createdAt: new Date().toISOString(),
    };
    
    const stored = localStorage.getItem('appointments');
    const currentAppointments = stored ? JSON.parse(stored) : [];
    currentAppointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(currentAppointments));
    setAppointments(currentAppointments);
    
    // Hiển thị popup thành công
    setShowSuccessPopup(true);
    setCurrentStep(4);
      // Đặt lại form
    setForm({
      phone: '',
      reason: '',
      appointmentDate: '',
      appointmentTime: '',
      doctorId: '',
      bookingtype: '',
      notes: '',
      totalFee: 0,
      isOnlineConsultation: false,
      onlineConsultationFee: 100000,
    });
  };

  function combineDateTime(date, time) {
    if (!date || !time) return '';
    // time: 'HH:mm'
    return new Date(`${date}T${time}:00`).toISOString();
  }

  return (
    <>
      <Navbar />
      <div className="examination-schedule-container">
        <div className="page-header">
          <h1>Đặt lịch khám HIV/AIDS</h1>
          <p className="subtitle">Đặt lịch khám dễ dàng với các bác sĩ chuyên khoa HIV/AIDS hàng đầu</p>
        </div>
          {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Đang tải danh sách bác sĩ...</p>
          </div>
        ) : showDetails && selectedDoctorInfo ? (
          <div className="doctor-detail-container">
            <button className="back-btn" onClick={() => setShowDetails(false)}>
              <i className="fas fa-arrow-left"></i> Quay lại danh sách bác sĩ
            </button>
            
            <div className="doctor-detail">
              <div className="doctor-profile">
                <img className="doctor-detail-avatar" src={selectedDoctorInfo.avatar} alt={selectedDoctorInfo.name} />
                <div className="doctor-detail-info">
                  <h2>{selectedDoctorInfo.name}</h2>
                  <p className="doctor-detail-specialty">{selectedDoctorInfo.specialty}</p>
                  <div className="doctor-rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.floor(selectedDoctorInfo.rating) ? 'filled' : 'empty'}`}></i>
                    ))}
                    <span>{selectedDoctorInfo.rating}/5</span>
                  </div>
                  <div className="doctor-badges">
                    <span className="doctor-badge"><i className="fas fa-graduation-cap"></i> {selectedDoctorInfo.education}</span>
                    <span className="doctor-badge"><i className="fas fa-briefcase"></i> {selectedDoctorInfo.experience}</span>
                  </div>
                </div>
                <div className="doctor-schedule-info">
                  <h3>Xem lịch bác sĩ ngày</h3>
                  <button className="book-doctor-btn" onClick={() => setShowForm(true)}>
                    Đặt lịch với bác sĩ này
                  </button>
                  <button className="book-doctor-btn" onClick={async () => {
                    
                    if (selectedDoctorInfo && selectedDoctorInfo.id) {
                      try {
                        const res = await getDoctorWorkScheduleById(selectedDoctorInfo.id);
                        if (res && Array.isArray(res)) {
                          setDoctorScheduleData(res);
                        } else if (res && res.data && Array.isArray(res.data)) {
                          setDoctorScheduleData(res.data);
                        }
                        setShowSchedulePopup(true);
                      } catch (e) {
                        alert('Không lấy được lịch khám!');
                      }
                    }
                  }}>
                    Xem lịch làm việc
                  </button>
                </div>
              </div>
              
              <div className="doctor-description">
                <h3>Thông tin bác sĩ</h3>
                <p>{selectedDoctorInfo.description}</p>
              </div>
                <div className="doctor-services">
                <h3>Các dịch vụ</h3>
                <ul>
                  <li><i className="fas fa-check-circle"></i> Tư vấn HIV/AIDS</li>
                  <li><i className="fas fa-check-circle"></i> Điều trị ARV</li>
                  <li><i className="fas fa-check-circle"></i> Xét nghiệm định kỳ</li>
                  <li><i className="fas fa-check-circle"></i> Theo dõi tải lượng virus</li>
                  <li><i className="fas fa-check-circle"></i> Tư vấn dinh dưỡng cho bệnh nhân HIV</li>
                </ul>
              </div>
              
              {/* Community Feedback Section */}
              <div className="community-feedback">
                <h3><i className="fas fa-comments"></i> Đóng góp ý kiến cộng đồng</h3>
                
                <div className="feedback-stats">
                  <div className="average-rating">
                    <div className="rating-number">{selectedDoctorInfo.rating}</div>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < Math.floor(selectedDoctorInfo.rating) ? 'filled' : 'empty'}`}></i>
                      ))}
                    </div>
                    <div className="rating-count">Dựa trên {selectedDoctorInfo.totalReviews} đánh giá</div>
                  </div>
                  
                  <div className="rating-bars">
                    <div className="rating-bar-item">
                      <span className="rating-label">5 sao</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{width: `${selectedDoctorInfo.totalReviews > 0 ? (selectedDoctorInfo.ratingDistribution[5] / selectedDoctorInfo.totalReviews) * 100 : 0}%`}}></div>
                      </div>
                      <span className="rating-percent">{selectedDoctorInfo.totalReviews > 0 ? ((selectedDoctorInfo.ratingDistribution[5] / selectedDoctorInfo.totalReviews) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="rating-bar-item">
                      <span className="rating-label">4 sao</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{width: `${selectedDoctorInfo.totalReviews > 0 ? (selectedDoctorInfo.ratingDistribution[4] / selectedDoctorInfo.totalReviews) * 100 : 0}%`}}></div>
                      </div>
                      <span className="rating-percent">{selectedDoctorInfo.totalReviews > 0 ? ((selectedDoctorInfo.ratingDistribution[4] / selectedDoctorInfo.totalReviews) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="rating-bar-item">
                      <span className="rating-label">3 sao</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{width: `${selectedDoctorInfo.totalReviews > 0 ? (selectedDoctorInfo.ratingDistribution[3] / selectedDoctorInfo.totalReviews) * 100 : 0}%`}}></div>
                      </div>
                      <span className="rating-percent">{selectedDoctorInfo.totalReviews > 0 ? ((selectedDoctorInfo.ratingDistribution[3] / selectedDoctorInfo.totalReviews) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="rating-bar-item">
                      <span className="rating-label">2 sao</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{width: `${selectedDoctorInfo.totalReviews > 0 ? (selectedDoctorInfo.ratingDistribution[2] / selectedDoctorInfo.totalReviews) * 100 : 0}%`}}></div>
                      </div>
                      <span className="rating-percent">{selectedDoctorInfo.totalReviews > 0 ? ((selectedDoctorInfo.ratingDistribution[2] / selectedDoctorInfo.totalReviews) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="rating-bar-item">
                      <span className="rating-label">1 sao</span>
                      <div className="rating-bar">
                        <div className="rating-bar-fill" style={{width: `${selectedDoctorInfo.totalReviews > 0 ? (selectedDoctorInfo.ratingDistribution[1] / selectedDoctorInfo.totalReviews) * 100 : 0}%`}}></div>
                      </div>
                      <span className="rating-percent">{selectedDoctorInfo.totalReviews > 0 ? ((selectedDoctorInfo.ratingDistribution[1] / selectedDoctorInfo.totalReviews) * 100).toFixed(0) : 0}%</span>
                    </div>
                  </div>
                </div>
                  {/* Feedback Comments */}
                <div className="feedback-comments">
                  {feedbacks.length > 0 ? (
                    feedbacks.map(feedback => (
                      <div className="feedback-item" key={feedback.id}>
                        <div className="feedback-user">
                          <img 
                            src={`https://randomuser.me/api/portraits/${feedback.id % 2 === 0 ? 'men' : 'women'}/${(feedback.id * 10) % 100}.jpg`}
                            alt={feedback.name} 
                          />
                          <div>
                            <h4>{feedback.name}</h4>
                            <div className="feedback-date">
                              {new Date(feedback.date).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        <div className="feedback-rating">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star ${i < feedback.rating ? 'filled' : 'empty'}`}></i>
                          ))}
                        </div>
                        <div className="feedback-content">
                          <p>{feedback.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-feedback">
                      <p>Chưa có đánh giá nào cho bác sĩ này. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
                    </div>
                  )}
                </div>
                
                {/* Add Feedback Button */}
                <div className="add-feedback-section">
                  <button 
                    className="add-feedback-btn" 
                    onClick={() => setShowFeedbackForm(true)}
                  >
                    <i className="fas fa-plus-circle"></i> Thêm đánh giá của bạn
                  </button>
                </div>
                
                {/* Feedback Form Popup */}
                {showFeedbackForm && (
                  <div className="popup-overlay">
                    <div className="popup-form feedback-form">
                      <div className="popup-header">
                        <h2>Đánh giá bác sĩ {selectedDoctorInfo.name}</h2>
                        <button className="close-btn" onClick={() => setShowFeedbackForm(false)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                        <form onSubmit={(e) => {
                        e.preventDefault();
                        
                        // Create new feedback
                        const newFeedbackItem = {
                          id: Date.now(),
                          doctorId: selectedDoctorInfo.id,
                          ...newFeedback,
                          date: new Date().toISOString()
                        };
                        
                        // Update state
                        const updatedFeedbacks = [newFeedbackItem, ...feedbacks];
                        setFeedbacks(updatedFeedbacks);
                        
                        // Calculate new rating stats
                        const calculateRatingStats = (feedbacks) => {
                          if (feedbacks.length === 0) {
                            return {
                              averageRating: 0,
                              totalReviews: 0,
                              ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                            };
                          }

                          const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
                          const averageRating = totalRating / feedbacks.length;
                          
                          // Calculate rating distribution
                          const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                          feedbacks.forEach(feedback => {
                            distribution[feedback.rating]++;
                          });

                          return {
                            averageRating: parseFloat(averageRating.toFixed(1)),
                            totalReviews: feedbacks.length,
                            ratingDistribution: distribution
                          };
                        };

                        const newRatingStats = calculateRatingStats(updatedFeedbacks);
                        
                        // Update selectedDoctorInfo with new rating
                        setSelectedDoctorInfo(prevInfo => ({
                          ...prevInfo,
                          rating: newRatingStats.averageRating,
                          totalReviews: newRatingStats.totalReviews,
                          ratingDistribution: newRatingStats.ratingDistribution
                        }));
                        
                        // Save to localStorage
                        const storedFeedbacks = localStorage.getItem('doctorFeedbacks');
                        let allFeedbacks = storedFeedbacks ? JSON.parse(storedFeedbacks) : [];
                        
                        // Filter out feedbacks for this doctor and add the new ones
                        const otherDoctorFeedbacks = allFeedbacks.filter(
                          feedback => feedback.doctorId !== selectedDoctorInfo.id
                        );
                        
                        localStorage.setItem(
                          'doctorFeedbacks', 
                          JSON.stringify([...otherDoctorFeedbacks, ...updatedFeedbacks])
                        );
                        
                        setNewFeedback({ name: '', comment: '', rating: 5 });
                        setShowFeedbackForm(false);
                        alert('Cảm ơn bạn đã đóng góp ý kiến!');
                      }}>
                        <div className="form-group">
                          <label htmlFor="feedback-name">Họ tên:</label>
                          <input
                            type="text"
                            id="feedback-name"
                            value={newFeedback.name}
                            onChange={(e) => setNewFeedback({...newFeedback, name: e.target.value})}
                            placeholder="Nhập họ tên của bạn"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Đánh giá:</label>
                          <div className="star-rating">
                            {[...Array(5)].map((_, index) => {
                              const ratingValue = index + 1;
                              return (
                                <i
                                  key={index}
                                  className={`fas fa-star ${ratingValue <= newFeedback.rating ? 'filled' : 'empty'}`}
                                  onClick={() => setNewFeedback({...newFeedback, rating: ratingValue})}
                                ></i>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="feedback-comment">Nhận xét của bạn:</label>
                          <textarea
                            id="feedback-comment"
                            value={newFeedback.comment}
                            onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                            placeholder="Chia sẻ trải nghiệm của bạn về bác sĩ..."
                            required
                          ></textarea>
                        </div>
                        
                        <div className="form-actions">
                          <button type="button" onClick={() => setShowFeedbackForm(false)} className="cancel-btn">Hủy bỏ</button>
                          <button type="submit" className="submit-btn">Gửi đánh giá</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="appointment-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-text">Chọn bác sĩ</div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-text">Chọn ngày giờ khám</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-text">Điền thông tin</div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-text">Hoàn tất đặt lịch</div>
              </div>
            </div>
            
            <div className="filter-container">
              <div className="search-filter">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Tìm kiếm theo tên bác sĩ, chuyên khoa..." />
              </div>
              <div className="specialty-filter">
                <select>
                  <option value="">Tất cả chuyên khoa</option>
                  <option value="HIV/AIDS">HIV/AIDS</option>
                  <option value="Truyền nhiễm">Truyền nhiễm</option>
                  <option value="Nội">Nội</option>
                </select>
              </div>
            </div>
            
            <h2 className="section-title">Chọn bác sĩ chuyên khoa</h2>
            <div className="doctor-grid">
              {doctors
                .slice(examschPage * doctorsPerPage, examschPage * doctorsPerPage + doctorsPerPage)
                .map((doc) => (
                  <div className="doctor-card" key={doc.id} onClick={() => handleDoctorSelect(doc)}>
                    <img className="doctor-avatar" src={doc.avatar} alt={doc.name} />
                    <div className="doctor-card-info">
                      <h3 className="doctor-name">{doc.name}</h3>
                      <p className="doctor-specialty">{doc.specialty}</p>
                      <div className="doctor-experience">{doc.experience}</div>
                      <div className="doctor-rating">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star ${i < Math.floor(doc.rating) ? 'filled' : 'empty'}`}></i>
                        ))}
                        <span>{doc.rating}</span>
                      </div>
                      <div className="doctor-schedule-brief">
                        <div><i className="fas fa-calendar-alt"></i> {doc.schedule}</div>
                        <div><i className="fas fa-clock"></i> {doc.hours}</div>
                      </div>
                      <button className="view-profile-btn">Xem hồ sơ</button>
                    </div>
                  </div>
                ))}
            </div>
            {/* Pagination controls */}
            {doctors.length > doctorsPerPage && (
              <div className="examsch-pagination">
                <button
                  className="examsch-pagination-arrow"
                  onClick={() => setExamschPage((prev) => Math.max(prev - 1, 0))}
                  disabled={examschPage === 0}
                  aria-label="Trang trước"
                >
                  &lt;
                </button>
                <span className="examsch-pagination-info">{examschPage + 1} / {Math.ceil(doctors.length / doctorsPerPage)}</span>
                <button
                  className="examsch-pagination-arrow"
                  onClick={() => setExamschPage((prev) => Math.min(prev + 1, Math.ceil(doctors.length / doctorsPerPage) - 1))}
                  disabled={examschPage === Math.ceil(doctors.length / doctorsPerPage) - 1}
                  aria-label="Trang sau"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
        
        {showForm && (
          <div className="popup-overlay">
            <div className="popup-form">
              <button className="popup-close-absolute" onClick={() => setShowForm(false)}>
                <i className="fas fa-times"></i>
              </button>
              <div className="popup-header">
                <h2>Đặt lịch khám</h2>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="appointment-doctor-info">
                  <img src={selectedDoctor.avatar} alt={selectedDoctor.name} />
                  <div>
                    <h3>{selectedDoctor.name}</h3>
                    <p>{selectedDoctor.specialty}</p>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3><i className="fas fa-calendar-alt"></i> Thời gian khám</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="appointmentDate">Ngày khám:</label>
                      <select
                        id="appointmentDate"
                        name="appointmentDate"
                        value={form.appointmentDate}
                        onChange={handleDateChange}
                        required
                      >
                        <option value="">-- Chọn ngày khám --</option>
                        {doctorScheduleData
                          .map(item => item.DateWork && item.DateWork.slice(0, 10))
                          .filter((date, idx, arr) => date && arr.indexOf(date) === idx)
                          .map(date => (
                            <option key={date} value={date}>{date}</option>
                          ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="appointmentTime">Giờ khám:</label>
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={form.appointmentTime}
                        onChange={handleChange}
                        required
                        disabled={
                          !form.appointmentDate ||
                          doctorScheduleData.filter(item => item.DateWork && item.DateWork.slice(0,10) === form.appointmentDate).length === 0
                        }
                      >
                        <option value="">-- Chọn giờ khám --</option>
                        {doctorScheduleData
                          .filter(item => item.DateWork && item.DateWork.slice(0,10) === form.appointmentDate)
                          .map(item => (
                            <option key={item.ScheduleID} value={item.StartTime && item.StartTime.slice(0,5)}>
                              {item.StartTime && item.StartTime.slice(0,5)} - {item.EndTime && item.EndTime.slice(0,5)} 
                            </option>
                          ))}
                      </select>
                      {form.appointmentDate && doctorScheduleData.filter(item => item.DateWork && item.DateWork.slice(0,10) === form.appointmentDate).length === 0 && (
                        <p className="note">Không có khung giờ trống cho ngày đã chọn</p>
                      )}
                    </div>
                  </div>
                </div>
                
                
                
                <div className="form-section">
                  <h3><i className="fas fa-stethoscope"></i> Thông tin khám bệnh</h3>
                  <div className="form-group">
                    <label htmlFor="reason">Lý do khám:</label>
                    <textarea 
                      id="reason" 
                      name="reason" 
                      value={form.reason} 
                      onChange={handleChange} 
                      placeholder="Mô tả tình trạng sức khỏe hoặc lý do khám bệnh của bạn"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label>Dịch vụ cần khám:</label>
                    <div className="form-group">
                      <input
                        type="text"
                        id="bookingtype"
                        name="bookingtype"
                        value={form.bookingtype}
                        onChange={handleChange}
                        placeholder="Nhập dịch vụ cần khám (ví dụ: Khám Tổng Quát)"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Ghi chú bổ sung:</label>
                    <textarea 
                      id="notes" 
                      name="notes" 
                      value={form.notes} 
                      onChange={handleChange} 
                      placeholder="Thông tin bổ sung (nếu có)"
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    className="submit-btn"
                    style={{marginTop: '12px'}}
                    onClick={async () => {
                      if (!selectedDoctor) {
                        alert('Vui lòng chọn bác sĩ trước!');
                        return;
                      }
                      if (!form.bookingtype || form.bookingtype.trim() === "") {
                        alert('Vui lòng nhập dịch vụ cần khám!');
                        return;
                      }
                      
                      let allSuccess = true;
                      try {
                        await nguoidungdatlich({
                          DoctorID: selectedDoctor.id,
                          BookingType: form.bookingtype,
                          BookDate: form.bookdate,
                          Note: form.notes || '',
                        });
                      } catch (e) {
                        allSuccess = false;
                      }
                      if (allSuccess) {
                        setShowServiceSuccessPopup(true);
                      } else {
                        alert('Có lỗi khi đặt lịch khám !');
                      }
                    }}
                  >
                    Đặt lịch khám 
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {showSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup-form success-popup">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Đặt lịch khám thành công!</h2>
              <p className="success-message">
                Bạn đã đặt lịch khám thành công với {doctors.find(doc => doc.id.toString() === form.doctorId)?.name}.
                <br/>Chúng tôi sẽ liên hệ qua số điện thoại của bạn để xác nhận lịch hẹn.
              </p>
              <div className="appointment-details">
                <div className="appointment-detail-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Ngày khám: {new Date(appointments[appointments.length - 1]?.appointmentDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="appointment-detail-item">
                  <i className="fas fa-clock"></i>
                  <span>Giờ khám: {appointments[appointments.length - 1]?.appointmentTime}</span>
                </div>
                <div className="appointment-detail-item">
                  <i className="fas fa-user-md"></i>
                  <span>Bác sĩ: {appointments[appointments.length - 1]?.doctorName}</span>
                </div>                <div className="appointment-detail-item">
                  <i className="fas fa-hashtag"></i>
                  <span>Mã đặt lịch: {appointments[appointments.length - 1]?.appointmentCode}</span>
                </div>
                <div className="appointment-detail-item">
                  <i className="fas fa-money-bill"></i>
                  <span>Tổng chi phí: {new Intl.NumberFormat('vi-VN').format(appointments[appointments.length - 1]?.totalFee || 0)} VNĐ</span>
                </div>
                {appointments[appointments.length - 1]?.isOnlineConsultation && (
                  <div className="appointment-detail-item">
                    <i className="fas fa-laptop-medical"></i>
                    <span>Tư vấn trực tuyến: Có</span>
                  </div>
                )}
              </div>
              <div className="success-actions">
                <button onClick={() => { setShowServiceSuccessPopup(false); setShowForm(false); navigate('/appointments'); }} className="done-btn">Đóng</button>
                
              </div>
            </div>
          </div>
        )}
        {showSchedulePopup && (
          <div className="popup-overlay">
            <div className="popup-form schedule-popup">
              <div className="popup-header">
                <h2>Lịch khám chi tiết cố định hàng tuần</h2>
                <button className="close-btn" onClick={() => setShowSchedulePopup(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Giờ bắt đầu làm việc</th>
                    <th>Ngày </th>
                  </tr>
                </thead>
                <tbody>
                  {doctorScheduleData.map((item) => (
                    <tr key={item.ScheduleID}>
                      <td>{item.DayOfWeek}</td>
                      <td>{item.StartTime ? item.StartTime.slice(0,5) : ''}</td>
                      <td>{item.DateWork ? item.DateWork.slice(0,10) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showServiceSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup-form service-success-popup">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Đăng ký dịch vụ thành công!</h2>
              <p className="success-message">Bạn đã đăng ký dịch vụ thành công. Vui lòng chờ xác nhận từ phòng khám.</p>
              <div className="success-actions">
                <button onClick={() => { setShowServiceSuccessPopup(false); setShowForm(false); navigate('/appointments'); }} className="done-btn">Đóng</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import '../styles/ExaminationSchedule.css';

const doctors = [
  { 
    id: 1, 
    name: 'BS. Nguyễn Văn A',
    workDays: {
      1: true, // Thứ 2
      3: true, // Thứ 4
      5: true, // Thứ 6
      0: false, 2: false, 4: false, 6: false // Những ngày không làm việc
    }, 
    schedule: 'Thứ 2, 4, 6', 
    hours: '8:00 - 11:00',
    workHours: {
      start: 8,
      end: 11
    },
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
    specialty: 'Chuyên khoa HIV/AIDS',
    experience: '15 năm kinh nghiệm',
    rating: 4.9,
    education: 'Đại học Y Hà Nội',
    description: 'Bác sĩ chuyên khoa II về HIV/AIDS với hơn 15 năm kinh nghiệm điều trị các bệnh nhiễm trùng và quản lý HIV.',
    certifications: ['Chuyên khoa II - ĐH Y Hà Nội', 'Chứng chỉ quốc tế về HIV/AIDS'],
    researchAreas: ['Thuốc kháng virus thế hệ mới', 'Miễn dịch trong điều trị HIV'],
    services: [
      'Tư vấn HIV/AIDS',
      'Điều trị ARV',
      'Xét nghiệm định kỳ', 
      'Theo dõi tải lượng virus',
      'Tư vấn dinh dưỡng cho bệnh nhân HIV'
    ]
  },
  { 
    id: 2, 
    name: 'BS. Trần Thị B',
    workDays: {
      2: true, // Thứ 3
      4: true, // Thứ 5
      6: true, // Thứ 7
      0: false, 1: false, 3: false, 5: false // Những ngày không làm việc
    },
    schedule: 'Thứ 3, 5, 7', 
    hours: '13:00 - 16:00',
    workHours: {
      start: 13,
      end: 16
    },
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg', 
    specialty: 'Chuyên khoa Nội - Truyền nhiễm',
    experience: '10 năm kinh nghiệm',
    rating: 4.7,
    education: 'Đại học Y Dược TP.HCM',
    description: 'Bác sĩ chuyên điều trị các bệnh truyền nhiễm và đồng nhiễm HIV/AIDS, có kinh nghiệm điều trị ARV.',
    certifications: ['Chuyên khoa I Truyền nhiễm', 'Nghiên cứu sinh tại Pháp'],
    researchAreas: ['Đồng nhiễm HIV và bệnh truyền nhiễm', 'Kháng thuốc trong điều trị HIV'],
    services: [
      'Tư vấn HIV/AIDS',
      'Điều trị ARV',
      'Điều trị các bệnh truyền nhiễm cơ hội',
      'Quản lý tác dụng phụ thuốc',
      'Theo dõi bệnh nhân đồng nhiễm'
    ]
  },
  { 
    id: 3, 
    name: 'BS. Lê Văn C',
    workDays: {
      1: true, // Thứ 2
      2: true, // Thứ 3
      3: true, // Thứ 4
      4: true, // Thứ 5
      5: true, // Thứ 6
      0: false, 6: false // Những ngày không làm việc
    },
    schedule: 'Thứ 2 - Thứ 6', 
    hours: '9:00 - 12:00',
    workHours: {
      start: 9,
      end: 12
    },
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg', 
    specialty: 'Chuyên khoa Truyền nhiễm',
    experience: '12 năm kinh nghiệm',
    rating: 4.8,
    education: 'Đại học Y Hà Nội',
    description: 'Bác sĩ chuyên sâu về các bệnh nhiễm trùng cơ hội liên quan đến HIV và điều trị ARV hiện đại.',
    certifications: ['Tiến sĩ Y khoa', 'Thành viên Hiệp hội Truyền nhiễm Châu Á'],
    researchAreas: ['Phác đồ ARV thế hệ mới', 'Điều trị lao đa kháng thuốc ở bệnh nhân HIV'],
    services: [
      'Tư vấn HIV/AIDS',
      'Điều trị ARV',
      'Quản lý nhiễm trùng cơ hội',
      'Chăm sóc bệnh nhân HIV giai đoạn cuối',
      'Điều trị dự phòng sau phơi nhiễm'
    ]
  },
  { 
    id: 4, 
    name: 'BS. Phạm Thị D',
    workDays: {
      3: true, // Thứ 4
      4: true, // Thứ 5
      6: true, // Thứ 7
      0: false, 1: false, 2: false, 5: false // Những ngày không làm việc
    },
    schedule: 'Thứ 4, 5, 7', 
    hours: '14:00 - 17:00',
    workHours: {
      start: 14,
      end: 17
    },
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg', 
    specialty: 'Chuyên khoa HIV/AIDS & Miễn dịch',
    experience: '8 năm kinh nghiệm',
    rating: 4.6,
    education: 'Đại học Y Dược Huế',
    description: 'Bác sĩ trẻ có chuyên môn cao về suy giảm miễn dịch và phác đồ điều trị HIV hiện đại.',
    certifications: ['Chuyên khoa I', 'Thạc sĩ Y học'],
    researchAreas: ['Miễn dịch trong bệnh HIV/AIDS', 'Liệu pháp điều trị mới'],
    services: [
      'Tư vấn HIV/AIDS',
      'Điều trị ARV',
      'Liệu pháp tăng cường miễn dịch',
      'Tư vấn phòng ngừa lây nhiễm',
      'Theo dõi CD4 và tải lượng virus'
    ]
  },
  { 
    id: 5, 
    name: 'BS. Đỗ Văn E',
    workDays: {
      3: true, // Thứ 4
      4: true, // Thứ 5
      6: true, // Thứ 7
      0: false, 1: false, 2: false, 5: false // Những ngày không làm việc
    },
    schedule: 'Thứ 4, 5, 7', 
    hours: '14:00 - 17:00',
    workHours: {
      start: 14,
      end: 17
    },
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg', 
    specialty: 'Chuyên khoa HIV/AIDS & Miễn dịch',
    experience: '9 năm kinh nghiệm',
    rating: 4.6,
    education: 'Đại học Y Dược TP.HCM',
    description: 'Bác sĩ Đỗ Văn E là chuyên gia về dinh dưỡng cho người nhiễm HIV/AIDS.',
    certifications: ['Chuyên gia dinh dưỡng lâm sàng', 'Thạc sĩ Y học'],
    researchAreas: ['Miễn dịch trong bệnh HIV/AIDS', 'Liệu pháp điều trị mới'],
    services: [
      'Tư vấn HIV/AIDS',
      'Điều trị ARV',
      'Liệu pháp tăng cường miễn dịch',
      'Tư vấn phòng ngừa lây nhiễm',
      'Theo dõi CD4 và tải lượng virus'
    ]
  },
];

export default function ExaminationSchedule() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Doctor Selection, 2: Date & Time, 3: Contact Info, 4: Success
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [form, setForm] = useState({
    phone: '',
    reason: '',
    appointmentDate: '',
    appointmentTime: '',
    doctorId: '',
    requestedServices: [],
    notes: '',
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
  const generateTimeSlots = (date, doctorId) => {
    if (!date) return [];
    
    const doctor = doctors.find(doc => doc.id === parseInt(doctorId));
    if (!doctor) return [];

    // Chuyển đổi ngày đã chọn thành thứ trong tuần (0: Chủ Nhật, 1: Thứ 2, ...)
    const dayOfWeek = new Date(date).getDay();
    
    // Kiểm tra xem bác sĩ có làm việc vào ngày đã chọn không
    if (!doctor.workDays[dayOfWeek]) return [];
    
    // Lấy giờ làm việc từ cấu trúc dữ liệu nâng cao
    const { start: startHour, end: endHour } = doctor.workHours;
    
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
  };
    const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDoctorInfo(doctor);
    setForm(prev => ({
      ...prev,
      doctorId: doctor.id.toString()
    }));
    setShowDetails(true);
    
    // Sau khi chọn bác sĩ, chuyển sang bước tiếp theo trong quá trình đặt lịch
    setCurrentStep(1);
  };
  
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    setForm(prev => ({ ...prev, appointmentDate: selectedDate }));
    
    const slots = generateTimeSlots(selectedDate, form.doctorId);
    setAvailableSlots(slots);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
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
    if (checked) {
      setForm(prev => ({
        ...prev,
        requestedServices: [...prev.requestedServices, value]
      }));
    } else {
      setForm(prev => ({
        ...prev,
        requestedServices: prev.requestedServices.filter(service => service !== value)
      }));
    }
  };  const nextStep = () => {
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
      requestedServices: [],
      notes: '',
    });
  };
  return (
    <>
      <Navbar />
      <div className="examination-schedule-container">
        <div className="page-header">
          <h1>Đặt lịch khám HIV/AIDS</h1>
          <p className="subtitle">Đặt lịch khám dễ dàng với các bác sĩ chuyên khoa HIV/AIDS hàng đầu</p>
        </div>
        
        {showDetails ? (
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
                  <h3>Lịch khám</h3>
                  <div className="schedule-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{selectedDoctorInfo.schedule}</span>
                  </div>
                  <div className="schedule-item">
                    <i className="fas fa-clock"></i>
                    <span>{selectedDoctorInfo.hours}</span>
                  </div>
                  <button className="book-doctor-btn" onClick={() => setShowForm(true)}>
                    Đặt lịch với bác sĩ này
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
              {doctors.map((doc) => (
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
          </>
        )}
        
        {showForm && (
          <div className="popup-overlay">
            <div className="popup-form appointment-form">
              <div className="popup-header">
                <h2>Đặt lịch khám</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}><i className="fas fa-times"></i></button>
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
                      <input 
                        type="date" 
                        id="appointmentDate" 
                        name="appointmentDate" 
                        value={form.appointmentDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="appointmentTime">Giờ khám:</label>
                      <select 
                        id="appointmentTime" 
                        name="appointmentTime" 
                        value={form.appointmentTime} 
                        onChange={handleChange}
                        required
                        disabled={availableSlots.length === 0}
                      >
                        <option value="">-- Chọn giờ khám --</option>
                        {availableSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                      {availableSlots.length === 0 && form.appointmentDate && (
                        <p className="note">Không có khung giờ trống cho ngày đã chọn</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3><i className="fas fa-info-circle"></i> Thông tin liên hệ</h3>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại:</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      placeholder="VD: 0912345678" 
                      required 
                    />
                    <p className="note">Bạn sẽ nhận thông báo qua số điện thoại này</p>
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
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="hivTest" 
                          value="Xét nghiệm HIV" 
                          checked={form.requestedServices.includes('Xét nghiệm HIV')} 
                          onChange={handleServiceChange} 
                        />
                        <label htmlFor="hivTest">Xét nghiệm HIV</label>
                      </div>
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="arvTreatment" 
                          value="Điều trị ARV" 
                          checked={form.requestedServices.includes('Điều trị ARV')} 
                          onChange={handleServiceChange} 
                        />
                        <label htmlFor="arvTreatment">Điều trị ARV</label>
                      </div>
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="counseling" 
                          value="Tư vấn HIV" 
                          checked={form.requestedServices.includes('Tư vấn HIV')} 
                          onChange={handleServiceChange} 
                        />
                        <label htmlFor="counseling">Tư vấn HIV</label>
                      </div>
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="followUp" 
                          value="Tái khám định kỳ" 
                          checked={form.requestedServices.includes('Tái khám định kỳ')} 
                          onChange={handleServiceChange} 
                        />
                        <label htmlFor="followUp">Tái khám định kỳ</label>
                      </div>
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
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Hủy bỏ</button>
                  <button type="submit" className="submit-btn">Xác nhận đặt lịch</button>
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
                </div>
                <div className="appointment-detail-item">
                  <i className="fas fa-hashtag"></i>
                  <span>Mã đặt lịch: {appointments[appointments.length - 1]?.appointmentCode}</span>
                </div>
              </div>
              <div className="success-actions">
                <button onClick={() => setShowSuccessPopup(false)} className="done-btn">Đóng</button>
                <button onClick={() => navigate('/appointments')} className="view-appointments-btn">Xem lịch hẹn của tôi</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

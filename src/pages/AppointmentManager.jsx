import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { formatDate, getDaysUntilAppointment, groupAppointmentsByMonth } from '../utils/helpers';
import useResponsive from '../hooks/useResponsive';
import '../styles/AppointmentManager.css';

const AppointmentManager = () => {
  const { currentUser } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctorId: '',
    purpose: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ status: '', message: '' });
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const { isMobile } = useResponsive();

  // Fetch appointments and doctors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsData, doctorsData] = await Promise.all([
          apiService.getUserAppointments(currentUser.id),
          apiService.getDoctors()
        ]);
        
        setAppointments(appointmentsData);
        setDoctors(doctorsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'upcoming') {
      return appointmentDate >= today && appointment.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return appointmentDate < today && appointment.status !== 'cancelled';
    } else if (activeTab === 'cancelled') {
      return appointment.status === 'cancelled';
    }
    return true;
  });

  // Group appointments by month for calendar view
  const groupedAppointments = groupAppointmentsByMonth(filteredAppointments);

  // Get the doctor's name
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(doc => doc.id === doctorId);
    return doctor ? `${doctor.title} ${doctor.lastName} ${doctor.firstName}` : 'Unknown Doctor';
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.date) errors.date = 'Ngày khám là bắt buộc';
    if (!formData.time) errors.time = 'Giờ khám là bắt buộc';
    if (!formData.doctorId) errors.doctorId = 'Vui lòng chọn bác sĩ';
    if (!formData.purpose) errors.purpose = 'Mục đích khám là bắt buộc';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({
        status: 'error',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }
    
    try {
      setSubmitStatus({ status: 'loading', message: 'Đang đặt lịch...' });
      
      // Create appointment object
      const newAppointment = {
        ...formData,
        patientId: currentUser.id,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      
      // Save appointment
      const savedAppointment = await apiService.createAppointment(newAppointment);
      
      // Update local state
      setAppointments(prev => [...prev, savedAppointment]);
      
      // Reset form
      setFormData({
        date: '',
        time: '',
        doctorId: '',
        purpose: '',
        notes: '',
      });
      
      setSubmitStatus({
        status: 'success',
        message: 'Đặt lịch thành công!'
      });
      
      // Close form after a delay
      setTimeout(() => {
        setShowAppointmentForm(false);
        setSubmitStatus({ status: '', message: '' });
      }, 2000);
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      setSubmitStatus({
        status: 'error',
        message: 'Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại!'
      });
    }
  };

  // Handle cancel appointment
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    
    try {
      // Update appointment status to cancelled
      const updatedAppointment = {
        ...appointmentToCancel,
        status: 'cancelled',
        cancelReason,
        cancelledAt: new Date().toISOString()
      };
      
      await apiService.updateAppointment(updatedAppointment.id, updatedAppointment);
      
      // Update local state
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentToCancel.id ? updatedAppointment : appointment
        )
      );
      
      // Close modal
      setShowCancelModal(false);
      setAppointmentToCancel(null);
      setCancelReason('');
      
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  // Get appointment status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'status-scheduled';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      case 'no-show':
        return 'status-no-show';
      default:
        return '';
    }
  };

  // Get appointment status text
  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Đã lên lịch';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'no-show':
        return 'Không đến';
      default:
        return status;
    }
  };

  // Check if a date has appointments
  const hasAppointmentsOnDate = (date) => {
    return filteredAppointments.some(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get appointments for selected date
  const getAppointmentsForDate = (date) => {
    return filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Generate calendar days
    const days = [];
    
    // Add days from previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        day,
        date: new Date(year, month - 1, day),
        isCurrentMonth: false
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        day,
        date,
        isCurrentMonth: true,
        hasAppointments: hasAppointmentsOnDate(date),
        isToday: 
          date.getDate() === new Date().getDate() &&
          date.getMonth() === new Date().getMonth() &&
          date.getFullYear() === new Date().getFullYear()
      });
    }
    
    // Add days from next month to complete the last week
    const lastDayOfWeek = lastDay.getDay();
    const daysToAdd = 6 - lastDayOfWeek;
    for (let day = 1; day <= daysToAdd; day++) {
      days.push({
        day,
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  // Next/Previous Month
  const changeMonth = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="appointment-manager">
      <div className="appointments-header">
        <div className="container">
          <h1>Quản Lý Lịch Khám</h1>
          <p>Quản lý lịch hẹn khám bệnh, theo dõi lịch sử khám và đặt lịch khám mới.</p>
          
          <div className="appointment-actions">
            <div className="appointment-tabs">
              <button 
                className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                <i className="far fa-calendar-alt"></i> Sắp tới
              </button>
              <button 
                className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                <i className="fas fa-history"></i> Quá khứ
              </button>
              <button 
                className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelled')}
              >
                <i className="fas fa-ban"></i> Đã hủy
              </button>
            </div>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <i className="far fa-calendar-alt"></i>
                {!isMobile() && " Lịch"}
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
                {!isMobile() && " Danh sách"}
              </button>
            </div>
            
            <button 
              className="new-appointment-btn"
              onClick={() => setShowAppointmentForm(true)}
            >
              <i className="fas fa-plus"></i> Đặt lịch mới
            </button>
          </div>
        </div>
      </div>
      
      <div className="appointments-content">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu lịch khám...</p>
            </div>
          ) : (
            <>
              {filteredAppointments.length === 0 ? (
                <div className="no-appointments">
                  <div className="no-data-icon">
                    <i className="far fa-calendar-times"></i>
                  </div>
                  <h3>Không có lịch khám {activeTab === 'upcoming' ? 'sắp tới' : activeTab === 'past' ? 'trong quá khứ' : 'đã hủy'}</h3>
                  <p>
                    {activeTab === 'upcoming' 
                      ? 'Bạn chưa có lịch khám nào sắp tới. Đặt lịch ngay để gặp bác sĩ!' 
                      : activeTab === 'past'
                        ? 'Bạn chưa có lịch sử khám bệnh nào.'
                        : 'Bạn chưa có lịch khám nào bị hủy.'}
                  </p>
                  {activeTab === 'upcoming' && (
                    <button 
                      className="schedule-now-btn"
                      onClick={() => setShowAppointmentForm(true)}
                    >
                      Đặt lịch ngay
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {viewMode === 'calendar' ? (
                    <div className="calendar-view">
                      <div className="calendar-header">
                        <button 
                          className="month-nav-btn"
                          onClick={() => changeMonth(-1)}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <h2>{formatMonthYear(selectedDate)}</h2>
                        <button 
                          className="month-nav-btn"
                          onClick={() => changeMonth(1)}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                      
                      <div className="calendar-grid">
                        <div className="calendar-weekdays">
                          <div className="weekday">CN</div>
                          <div className="weekday">T2</div>
                          <div className="weekday">T3</div>
                          <div className="weekday">T4</div>
                          <div className="weekday">T5</div>
                          <div className="weekday">T6</div>
                          <div className="weekday">T7</div>
                        </div>
                        
                        <div className="calendar-days">
                          {generateCalendarDays().map((dayData, index) => (
                            <div 
                              key={index}
                              className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''} ${dayData.isToday ? 'today' : ''}`}
                              onClick={() => dayData.isCurrentMonth && setSelectedDate(dayData.date)}
                            >
                              <div className="day-number">{dayData.day}</div>
                              {dayData.hasAppointments && (
                                <div className="appointment-indicator"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="selected-day-appointments">
                        <h3>Lịch khám ngày {formatDate(selectedDate)}</h3>
                        
                        {getAppointmentsForDate(selectedDate).length === 0 ? (
                          <p className="no-appointments-for-day">Không có lịch khám nào vào ngày này.</p>
                        ) : (
                          <div className="day-appointments-list">
                            {getAppointmentsForDate(selectedDate).map(appointment => (
                              <div className="day-appointment-card" key={appointment.id}>
                                <div className="appointment-time">{appointment.time}</div>
                                <div className="appointment-details">
                                  <h4>{appointment.purpose}</h4>
                                  <p>Bác sĩ: {getDoctorName(appointment.doctorId)}</p>
                                  <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                                    {getStatusText(appointment.status)}
                                  </div>
                                </div>
                                {appointment.status === 'scheduled' && (
                                  <button 
                                    className="cancel-appointment-btn"
                                    onClick={() => {
                                      setAppointmentToCancel(appointment);
                                      setShowCancelModal(true);
                                    }}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="list-view">
                      {Object.entries(groupedAppointments).map(([monthYear, monthAppointments]) => (
                        <div className="month-appointments" key={monthYear}>
                          <h3 className="month-title">{new Date(monthAppointments[0].date).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</h3>
                          
                          <div className="appointments-list">
                            {monthAppointments.map(appointment => {
                              const appointmentDate = new Date(appointment.date);
                              const daysUntil = getDaysUntilAppointment({ date: appointmentDate });
                              
                              return (
                                <div className="appointment-card" key={appointment.id}>
                                  <div className="appointment-date">
                                    <div className="appointment-day">{appointmentDate.getDate()}</div>
                                    <div className="appointment-month">{appointmentDate.toLocaleDateString('vi-VN', { month: 'short' })}</div>
                                  </div>
                                  
                                  <div className="appointment-info">
                                    <h4>{appointment.purpose}</h4>
                                    <div className="appointment-details">
                                      <div className="appointment-detail">
                                        <i className="far fa-clock"></i> {appointment.time}
                                      </div>
                                      <div className="appointment-detail">
                                        <i className="fas fa-user-md"></i> {getDoctorName(appointment.doctorId)}
                                      </div>
                                      {appointment.notes && (
                                        <div className="appointment-detail">
                                          <i className="far fa-sticky-note"></i> {appointment.notes}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="appointment-footer">
                                      <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                                        {getStatusText(appointment.status)}
                                      </div>
                                      
                                      {activeTab === 'upcoming' && daysUntil !== null && (
                                        <div className="days-until">
                                          {daysUntil === 0 ? 'Hôm nay' : `Còn ${daysUntil} ngày`}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="appointment-actions">
                                    {appointment.status === 'scheduled' && (
                                      <button 
                                        className="cancel-btn"
                                        onClick={() => {
                                          setAppointmentToCancel(appointment);
                                          setShowCancelModal(true);
                                        }}
                                      >
                                        Hủy lịch
                                      </button>
                                    )}
                                    
                                    {activeTab === 'past' && appointment.status === 'completed' && (
                                      <Link to={`/treatment-plan?appointmentId=${appointment.id}`} className="view-report-btn">
                                        Xem kết quả
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* New Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="modal-overlay">
          <div className="appointment-form-modal">
            <div className="modal-header">
              <h3>Đặt Lịch Khám Mới</h3>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setShowAppointmentForm(false);
                  setFormData({
                    date: '',
                    time: '',
                    doctorId: '',
                    purpose: '',
                    notes: '',
                  });
                  setFormErrors({});
                  setSubmitStatus({ status: '', message: '' });
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="date">Ngày khám:</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={formErrors.date ? 'has-error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {formErrors.date && <div className="error-message">{formErrors.date}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Giờ khám:</label>
                <select 
                  id="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={formErrors.time ? 'has-error' : ''}
                >
                  <option value="">-- Chọn giờ --</option>
                  <option value="08:00">08:00</option>
                  <option value="08:30">08:30</option>
                  <option value="09:00">09:00</option>
                  <option value="09:30">09:30</option>
                  <option value="10:00">10:00</option>
                  <option value="10:30">10:30</option>
                  <option value="11:00">11:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                </select>
                {formErrors.time && <div className="error-message">{formErrors.time}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="doctorId">Bác sĩ:</label>
                <select 
                  id="doctorId" 
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className={formErrors.doctorId ? 'has-error' : ''}
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.title} {doctor.lastName} {doctor.firstName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                {formErrors.doctorId && <div className="error-message">{formErrors.doctorId}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="purpose">Mục đích khám:</label>
                <select 
                  id="purpose" 
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className={formErrors.purpose ? 'has-error' : ''}
                >
                  <option value="">-- Chọn mục đích --</option>
                  <option value="Tái khám định kỳ">Tái khám định kỳ</option>
                  <option value="Khám sức khỏe tổng quát">Khám sức khỏe tổng quát</option>
                  <option value="Tư vấn điều trị">Tư vấn điều trị</option>
                  <option value="Xét nghiệm định kỳ">Xét nghiệm định kỳ</option>
                  <option value="Điều chỉnh thuốc">Điều chỉnh thuốc</option>
                  <option value="Tư vấn dinh dưỡng">Tư vấn dinh dưỡng</option>
                  <option value="Tư vấn tâm lý">Tư vấn tâm lý</option>
                  <option value="Khác">Khác</option>
                </select>
                {formErrors.purpose && <div className="error-message">{formErrors.purpose}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Ghi chú (không bắt buộc):</label>
                <textarea 
                  id="notes" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Nhập ghi chú hoặc triệu chứng (nếu có)"
                  rows="3"
                ></textarea>
              </div>
              
              {submitStatus.message && (
                <div className={`submit-status ${submitStatus.status}`}>
                  {submitStatus.status === 'loading' && <div className="spinner small"></div>}
                  {submitStatus.message}
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-form-btn"
                  onClick={() => {
                    setShowAppointmentForm(false);
                    setFormData({
                      date: '',
                      time: '',
                      doctorId: '',
                      purpose: '',
                      notes: '',
                    });
                    setFormErrors({});
                    setSubmitStatus({ status: '', message: '' });
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="submit-form-btn"
                  disabled={submitStatus.status === 'loading'}
                >
                  Đặt lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <div className="modal-header">
              <h3>Xác nhận hủy lịch khám</h3>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setShowCancelModal(false);
                  setAppointmentToCancel(null);
                  setCancelReason('');
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <p>Bạn có chắc chắn muốn hủy lịch khám này không?</p>
              {appointmentToCancel && (
                <div className="cancel-appointment-details">
                  <div><strong>Ngày khám:</strong> {formatDate(new Date(appointmentToCancel.date))}</div>
                  <div><strong>Giờ khám:</strong> {appointmentToCancel.time}</div>
                  <div><strong>Bác sĩ:</strong> {getDoctorName(appointmentToCancel.doctorId)}</div>
                  <div><strong>Mục đích:</strong> {appointmentToCancel.purpose}</div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="cancelReason">Lý do hủy:</label>
                <select 
                  id="cancelReason" 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                >
                  <option value="">-- Chọn lý do --</option>
                  <option value="Lịch cá nhân thay đổi">Lịch cá nhân thay đổi</option>
                  <option value="Không thể đến được">Không thể đến được</option>
                  <option value="Chuyển sang ngày khác">Chuyển sang ngày khác</option>
                  <option value="Tình trạng sức khỏe thay đổi">Tình trạng sức khỏe thay đổi</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowCancelModal(false);
                  setAppointmentToCancel(null);
                  setCancelReason('');
                }}
              >
                Không, giữ lịch
              </button>
              <button 
                className="confirm-btn"
                onClick={handleCancelAppointment}
                disabled={!cancelReason}
              >
                Có, hủy lịch
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Help Section */}
      <section className="appointment-help">
        <div className="container">
          <div className="help-content">
            <div className="help-text">
              <h2>Cần hỗ trợ với lịch khám?</h2>
              <p>Nếu bạn có bất kỳ thắc mắc hoặc cần hỗ trợ về lịch khám, vui lòng liên hệ với chúng tôi qua hotline hoặc gửi email.</p>
              <div className="help-contacts">
                <div className="help-contact">
                  <i className="fas fa-phone-alt"></i>
                  <div>
                    <h4>Hotline</h4>
                    <p>1900 1234</p>
                  </div>
                </div>
                <div className="help-contact">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email</h4>
                    <p>appointment@hivtreatment.vn</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="help-image">
              <img src="/src/assets/images/appointment.png" alt="Doctor appointment" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentManager;
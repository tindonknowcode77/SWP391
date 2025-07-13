import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';
import {capnhatprofile} from '../api/auth';
import {pantient} from '../api/auth';
import { nguoidunglayhosodieutri } from  '../api/auth';
import { nguoidunglaytoathuoc } from  '../api/auth';
import { nguoidunglayAVR } from  '../api/auth';
import { datlichkham } from '../api/auth';
import { patientcheckin } from '../api/auth';

const Profile = () => {  
  const { currentUser, loading, updateProfile, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewUser = location.state?.newUser || false;  const showAccountStatus = location.state?.showAccountStatus || localStorage.getItem('hivAppShowAccountStatus') === 'true';

  // Format account status for better display
  const formatAccountStatus = (status) => {
    if (!status) return 'Không xác định';
    
    switch(status.toLowerCase()) {
      case 'active':
        return 'Đang hoạt động';
      case 'inactive':
        return 'Đã tạm khóa';
      case 'suspended':
        return 'Đã bị đình chỉ';
      case 'pending':
        return 'Đang chờ xác minh';
      default:
        return status;
    }
  };

  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(
    isNewUser 
      ? {
          type: 'success',
          message: 'Đăng ký thành công! Vui lòng cập nhật thông tin cá nhân của bạn.'
        }      : showAccountStatus
        ? {
            type: 'success',
            message: `Đăng nhập thành công! Trạng thái tài khoản: ${formatAccountStatus(currentUser?.accountStatus)} - Loại tài khoản: ${currentUser?.accountType || 'Bệnh nhân'}`
          }
        : null
  );
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    allergies: '',    
    address : '',
    image : ''
  });

  const [medicalHistory, setMedicalHistory] = useState([]);

  // Mô phỏng dữ liệu thuốc đang dùng
  const [medications] = useState([
    {
      id: 1,
      name: 'Efavirenz 600mg',
      dosage: '1 viên/ngày',
      schedule: 'Tối trước khi đi ngủ',
      startDate: '10/01/2025',
      endDate: 'Dùng liên tục'
    },
    {
      id: 2,
      name: 'Lamivudine 300mg',
      dosage: '1 viên/ngày',
      schedule: 'Sáng sau khi ăn',
      startDate: '10/01/2025',
      endDate: 'Dùng liên tục'
    },
    {
      id: 3,
      name: 'Tenofovir 300mg',
      dosage: '1 viên/ngày',
      schedule: 'Sáng sau khi ăn',
      startDate: '10/01/2025',
      endDate: 'Dùng liên tục'
    }
  ]);

  // Mô phỏng dữ liệu thông báo từ hệ thống
  const [notifications] = useState([
    {
      id: 1,
      date: '10/05/2025',
      title: 'Nhắc lịch hẹn',
      message: 'Bạn có lịch hẹn tái khám vào ngày 15/05/2025',
      isRead: false
    },
    {
      id: 2,
      date: '05/05/2025',
      title: 'Nhắc uống thuốc',
      message: 'Hãy đảm bảo bạn uống thuốc đầy đủ theo lịch, không bỏ liều',
      isRead: true
    },
    {
      id: 3,
      date: '01/05/2025',
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả xét nghiệm mới nhất của bạn đã có sẵn',
      isRead: true
    }
  ]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [tpLoading, setTpLoading] = useState(false);
  const [tpError, setTpError] = useState(null);

  const [showPrescriptionPopup, setShowPrescriptionPopup] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState(null);
  const [prescriptionPage, setPrescriptionPage] = useState(0);

  const [showARVResultPopup, setShowARVResultPopup] = useState(false);
  const [arvResultData, setArvResultData] = useState(null);
  const [arvResultLoading, setArvResultLoading] = useState(false);
  const [arvResultError, setArvResultError] = useState(null);

  // Thay thế state lịch hẹn giả lập bằng state động
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const isToday = (bookDate) => {
    const today = new Date().toISOString().split('T')[0];
    const book = new Date(bookDate).toISOString().split('T')[0];
    console.log('Today:', today, 'BookDate:', book, 'IsToday:', book === today);
    return book === today;
  };

  // Hàm kiểm tra có phải hôm nay hoặc trong tương lai gần (để test)
  const isTodayOrNear = (bookDate) => {
    const today = new Date();
    const book = new Date(bookDate);
    const diffDays = Math.ceil((book - today) / (1000 * 60 * 60 * 24));
    console.log('BookDate:', book, 'Today:', today, 'DiffDays:', diffDays);
    // Cho phép check-in trong vòng 2 ngày (hôm qua, hôm nay, ngày mai)
    return diffDays >= -1 && diffDays <= 1;
  };

  // Lấy dữ liệu profile từ API khi vào trang hoặc khi currentUser thay đổi
  useEffect(() => {
    if (currentUser?.id) {
      pantient(currentUser.id).then(userRes => {
        if (userRes) {
          setFormData({
            fullName: userRes.Fullname || '',
            email: userRes.Email || '',
            phoneNumber: userRes.Phone || '',
            dateOfBirth: userRes.DateOfBirth ? userRes.DateOfBirth.split('T')[0] : '',
            gender: userRes.Gender || '',
            bloodType: userRes.BloodType || '',
            allergies: userRes.Allergy || '' ,
            address : userRes.Address || '' ,
            image : userRes.Image 
          });
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login', { state: { from: location } });
    }
  }, [currentUser, loading, navigate, location]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
       
        localStorage.removeItem('hivAppShowAccountStatus');
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (localStorage.getItem('showProfileSuccessPopup') === 'true') {
      setShowSuccessPopup(true);
      localStorage.removeItem('showProfileSuccessPopup');
    }
  }, []);

  useEffect(() => {
    nguoidunglayhosodieutri()
      .then(res => {
        // Đảm bảo luôn là mảng
        const arr = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [res]);
        const mapped = arr.map(item => ({
          id: item.TreatmentPlanID,
          doctor: item.DoctorID,
          diagnosis: item.Diagnosis,
          arv: item.TreatmentLine,
          notes: item.TreatmentResult,
          PatientID: item.PatientID
        }));
        setMedicalHistory(mapped);
      })
      .catch(() => setMedicalHistory([]));
  }, []);

  // Lấy lịch hẹn động khi vào tab 'appointments'
  useEffect(() => {
    if (activeTab === 'appointments' && currentUser?.id) {
      setAppointmentsLoading(true);
      setAppointmentsError(null);
      datlichkham()
        .then((data) => {
          setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setAppointmentsLoading(false);
        })
        .catch((err) => {
          setAppointmentsError('Không thể tải danh sách lịch hẹn');
          setAppointmentsLoading(false);
        });
    }
  }, [activeTab, currentUser]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const profileData = {
        UserId: currentUser?.id, 
        Fullname: formData.fullName,
        DateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00.000Z` : '',
        Gender: formData.gender,
        Address : formData.address,
        Phone: formData.phoneNumber,
        BloodType: formData.bloodType,
        Allergy: formData.allergies,
      };
      console.log('Sending profileData:', profileData);
      const response = await capnhatprofile(profileData);
      if (response && response.message === "Cập nhật hồ sơ thành công") {
        if (currentUser?.id) {
          const userRes = await pantient(currentUser.id);
          if (userRes) {
            setFormData({
              fullName: userRes.Fullname || '',
              email: userRes.Email || '',
              phoneNumber: userRes.Phone || '',
              dateOfBirth: userRes.DateOfBirth ? userRes.DateOfBirth.split('T')[0] : '',
              gender: userRes.Gender || '',
              bloodType: userRes.BloodType || '',
            });
          }
        }
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.setItem('showProfileSuccessPopup', 'true');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-user-info">
            <div className="profile-avatar">
              {formData.image ? (
                <img
                  src={`https://localhost:7246/image/${formData.image}` || "fa fa-user"}
                  alt=""
                  className="profile-avatar-img"
                  style={{ width: 150, height: 150, borderRadius: '50%', zIndex: 1  }}
                />
              ) : (
                <i className="fas fa-user-circle" style={{ fontSize: 100 }}></i>
              )}
              {editMode && (
                <button className="change-avatar-btn">
                  <i className="fas fa-camera"></i>
                </button>
              )}
            </div>
            <h3>{currentUser?.name || 'Người dùng'}</h3>
            <p>{currentUser?.email || 'email@example.com'}</p>
          </div>
          
          <div className="profile-nav">
            <button 
              className={`profile-nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => handleTabChange('personal')}
            >
              <i className="fas fa-user"></i>
              <span>Thông tin cá nhân</span>
            </button>
            
            <button 
              className={`profile-nav-btn ${activeTab === 'medical' ? 'active' : ''}`}
              onClick={() => handleTabChange('medical')}
            >
              <i className="fas fa-notes-medical"></i>
              <span>Hồ sơ bệnh án</span>
            </button>
            {/* Thêm tab Lịch hẹn của tôi */}
            <button 
              className={`profile-nav-btn ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => handleTabChange('appointments')}
            >
              <i className="fas fa-calendar-check"></i>
              <span>Lịch hẹn của tôi</span>
            </button>
            <button 
              className={`profile-nav-btn ${activeTab === 'medication' ? 'active' : ''}`}
              onClick={() => handleTabChange('medication')}
            >
              <i className="fas fa-pills"></i>
              <span>Thuốc đang dùng</span>
            </button>
            
            <button 
              className={`profile-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabChange('notifications')}
            >
              <i className="fas fa-bell"></i>
              <span>Thông báo</span>
              <span className="notification-badge">1</span>
            </button>
          </div>
          
          <div className="profile-actions">
            <Link to="/appointments" className="profile-action-btn appointments">
              <i className="fas fa-calendar-check"></i>
              <span>Đặt lịch khám</span>
            </Link>
            
            <button className="profile-action-btn logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
        
        <div className="profile-content">
          {notification && (
            <div className={`profile-notification ${notification.type}`}>
              <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              <span>{notification.message}</span>
              <button onClick={() => setNotification(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          <div className="profile-header">
            <h2>
              {activeTab === 'personal' && 'Thông tin cá nhân'}
              {activeTab === 'medical' && 'Hồ sơ bệnh án'}
              {activeTab === 'appointments' && 'Lịch hẹn của tôi'}
              {activeTab === 'medication' && 'Thuốc đang dùng'}
              {activeTab === 'notifications' && 'Thông báo hệ thống'}
            </h2>
            
            {activeTab === 'personal' && (
              <button 
                className={`edit-profile-btn ${editMode ? 'active' : ''}`}
                onClick={handleEditToggle}
              >
                {editMode ? (
                  <>
                    <i className="fas fa-times"></i>
                    <span>Hủy chỉnh sửa</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-edit"></i>
                    <span>Chỉnh sửa</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="profile-body">
            {activeTab === 'personal' && (
              <form onSubmit={handleSubmit} className="personal-info-form">
                <div className="form-section">
                  <h3>Thông tin cơ bản</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Họ và tên</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={true}
                        required
                      />
                    </div>
                    
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Số điện thoại</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="dateOfBirth">Ngày sinh</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="form-group">
                     <label htmlFor="address">Địa chỉ</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!editMode}
                        required/>
                   </div>
                  </div>

                  
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="gender">Giới tính</label>
                      <select
                        id="gender"
                        name="gender" 
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!editMode}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="bloodType">Nhóm máu</label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        disabled={!editMode}
                      >
                        <option value="">Chọn nhóm máu</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>Thông tin y tế</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="allergies">Dị ứng</label>
                      <textarea
                        id="allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="Liệt kê các loại dị ứng (nếu có)"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {editMode && (
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={handleEditToggle}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="save-btn"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </form>
            )}
            
            {activeTab === 'medical' && (
              <div className="medical-history">
                <div className="section-info">
                  <p>Hiển thị lịch sử khám bệnh và điều trị gần đây. Để xem toàn bộ hồ sơ, vui lòng liên hệ phòng khám.</p>
                </div>
                
                <div className="medical-history-list">
                  {medicalHistory.map(record => (
                    <div className="medical-record" key={record.id}>
                      <div className="record-header">
                      <div className="record-doctor">{record.id}</div>
                        <div className="record-doctor">{record.doctor}</div>
                      </div>
                      
                      <div className="record-body">
                        <div className="record-item">
                          <span className="label">Chẩn đoán:</span>
                          <span className="value">{record.diagnosis}</span>
                        </div>
                        
                        <div className="record-item">
                          <span className="label">Ghi chú:</span>
                          <span className="value">{record.notes}</span>
                        </div>
                        
                        <div className="record-item">
                          <span className="label">Số Lần Điều Trị:</span>
                          <span className="value highlight">{record.arv}</span>
                        </div>
                      </div>
                      
                      <div className="record-actions">
                        <button className="record-btn" onClick={async () => {
                          setSelectedPrescription(record);
                          setShowPrescriptionPopup(true);
                          setPrescriptionLoading(true);
                          setPrescriptionError(null);
                          setPrescriptionPage(0);
                          try {
                            console.log('PatientID gửi lên:', record.PatientID);
                            const res = await nguoidunglaytoathuoc(record.PatientID);
                            console.log('API response:', res);
                            setPrescriptionData(Array.isArray(res) ? res : []);
                            console.log('Set prescriptionData:', Array.isArray(res) ? res : []);
                          } catch (err) {
                            setPrescriptionError('Không thể lấy dữ liệu đơn thuốc.');
                            setPrescriptionData([]);
                          } finally {
                            setPrescriptionLoading(false);
                          }
                        }}>
                          <i className="fas fa-file-pdf"></i>
                          <span>Xem toa thuốc</span>
                        </button>
                        
                        <button className="record-btn" onClick={async () => {
                          setShowARVResultPopup(true);
                          setArvResultLoading(true);
                          setArvResultError(null);
                          setArvResultData(null);
                          try {
                            const res = await nguoidunglayAVR(record.PatientID);
                            setArvResultData(Array.isArray(res) ? res : []);
                          } catch (err) {
                            setArvResultError('Không thể lấy dữ liệu ARV.');
                            setArvResultData(null);
                          } finally {
                            setArvResultLoading(false);
                          }
                        }}>
                          <i className="fas fa-file-medical-alt"></i>
                          <span>Xem kết quả xét nghiệm</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>  
              </div>
            )}
            
            {activeTab === 'appointments' && (
              <div className="appointment-list">
                <div className="section-info">
                  <p>Danh sách các lịch hẹn của bạn tại phòng khám.</p>
                </div>
                {appointmentsLoading ? (
                  <div>Đang tải...</div>
                ) : appointmentsError ? (
                  <div style={{color: 'red'}}>{appointmentsError}</div>
                ) : appointments.length === 0 ? (
                  <div>Không có lịch hẹn nào.</div>
                ) : (
                  <div className="appointments-table-wrapper">
                    <table className="appointments-table">
                      <thead>
                        <tr>
                          <th>Mã đặt lịch</th>
                          <th>Tên bệnh nhân</th>
                          <th>Loại dịch vụ</th>
                          <th>Thời gian</th>
                          <th>Ghi chú</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...appointments].sort((a, b) => {
                          const isCancelledA = a.Status === 'Đã hủy' || a.Status === 'rejected';
                          const isCancelledB = b.Status === 'Đã hủy' || b.Status === 'rejected';
                          if (isCancelledA === isCancelledB) return 0;
                          return isCancelledA ? 1 : -1;
                        }).map((item, idx) => (
                          <tr key={item.BookID || idx}>
                            <td>{item.BookID}</td>
                            <td>{item.PatientFullname || item.patientName || ''}</td>
                            <td>{item.BookingType || ''}</td>
                            <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                            <td>{item.Note || ''}</td>
                            <td className={
                              item.Status === 'Đang chờ'
                                ? 'status-badge-2 status-pending-3'
                                : item.Status === 'Đã xác nhận'
                                ? 'status-badge-2 status-confirmed-3'
                                : item.Status === 'Đã checkin'
                                ? 'status-badge-2 status-checkedin-3'
                                : item.Status === 'rejected'
                                ? 'status-badge-2 status-rejected-3'
                                : item.Status === 'Đã hủy'
                                ? 'status-badge-2 status-cancelled-3'
                                : item.Status === 'Thành công'
                                ? 'status-badge-2 status-thanhcong-3'
                                : item.Status === 'Đã khám'
                                ? 'status-badge-2 status-confirmed-3'
                                : 'status-badge-2'
                            }>
                              {item.Status || ''}
                              {/* Nút Check-in chỉ hiện ở trạng thái "Thành công" */}
                              {isTodayOrNear(item.BookDate) && 
                               item.Status && 
                               item.Status.trim().toLowerCase() === 'thành công' && (
                                <button
                                  style={{
                                    marginLeft: 8,
                                    padding: '4px 12px',
                                    background: '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}
                                  onClick={async () => {
                                    console.log('Check-in clicked for BookID:', item.BookID);
                                    try {
                                      await patientcheckin(item.BookID);
                                      // Sau khi check-in thành công, chuyển status thành "Đã checkin"
                                      setAppointments(prev =>
                                        prev.map(app =>
                                          app.BookID === item.BookID ? { ...app, Status: 'Đã checkin' } : app
                                        )
                                      );
                                      alert('✅ Check-in thành công! Trạng thái đã được cập nhật.');
                                    } catch (error) {
                                      console.error('Check-in error:', error);
                                      alert('❌ Check-in thất bại: ' + (error.response?.data || error.message));
                                    }
                                  }}
                                >
                                  ✅ Check-in
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'medication' && (
              <div className="medication-list">
                <div className="section-info">
                  <p>Danh sách thuốc bạn đang sử dụng theo phác đồ điều trị hiện tại. Hãy đảm bảo dùng thuốc đúng liều, đúng giờ.</p>
                </div>
                
                <div className="current-medications">
                  {medications.map(med => (
                    <div className="medication-card" key={med.id}>
                      <div className="medication-header">
                        <h4>{med.name}</h4>
                        <span className="medication-badge">Đang dùng</span>
                      </div>
                      
                      <div className="medication-details">
                        <div className="medication-detail">
                          <i className="fas fa-prescription-bottle"></i>
                          <span className="label">Liều lượng:</span>
                          <span className="value">{med.dosage}</span>
                        </div>
                        
                        <div className="medication-detail">
                          <i className="fas fa-clock"></i>
                          <span className="label">Lịch uống:</span>
                          <span className="value">{med.schedule}</span>
                        </div>
                        
                        <div className="medication-detail">
                          <i className="fas fa-calendar-plus"></i>
                          <span className="label">Ngày bắt đầu:</span>
                          <span className="value">{med.startDate}</span>
                        </div>
                        
                        <div className="medication-detail">
                          <i className="fas fa-calendar-minus"></i>
                          <span className="label">Ngày kết thúc:</span>
                          <span className="value">{med.endDate}</span>
                        </div>
                      </div>
                      
                      <div className="medication-actions">
                        <button className="medication-btn info">
                          <i className="fas fa-info-circle"></i>
                          <span>Thông tin thuốc</span>
                        </button>
                        
                        <button className="medication-btn reminder">
                          <i className="fas fa-bell"></i>
                          <span>Thiết lập nhắc nhở</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="medication-links">
                  <Link to="/medication" className="medication-link">
                    <i className="fas fa-pills"></i>
                    <span>Quản lý thuốc và nhắc nhở</span>
                  </Link>
                  
                  <Link to="/resources" className="medication-link">
                    <i className="fas fa-book-medical"></i>
                    <span>Thông tin về thuốc ARV</span>
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="notification-list">
                <div className="section-info">
                  <p>Các thông báo từ hệ thống liên quan đến lịch khám, thuốc và các thông tin quan trọng khác.</p>
                </div>
                
                <div className="notifications">
                  {notifications.map(notification => (
                    <div className={`notification-item ${!notification.isRead ? 'unread' : ''}`} key={notification.id}>
                      <div className="notification-icon">
                        {notification.title.includes('lịch hẹn') && <i className="fas fa-calendar-check"></i>}
                        {notification.title.includes('thuốc') && <i className="fas fa-pills"></i>}
                        {notification.title.includes('xét nghiệm') && <i className="fas fa-vial"></i>}
                      </div>
                      
                      <div className="notification-content">
                        <div className="notification-header">
                          <h4>{notification.title}</h4>
                          <span className="notification-date">{notification.date}</span>
                        </div>
                        <p>{notification.message}</p>
                      </div>
                      
                      <div className="notification-actions">
                        <button className="mark-read-btn">
                          <i className="fas fa-check"></i>
                        </button>
                        <button className="delete-notification-btn">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="notification-settings">
                  <button className="notification-settings-btn">
                    <i className="fas fa-cog"></i>
                    <span>Cài đặt thông báo</span>
                  </button>
                  
                  <button className="mark-all-read-btn">
                    <i className="fas fa-check-double"></i>
                    <span>Đánh dấu tất cả đã đọc</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showPrescriptionPopup && (
  <div className="prescription-popup-overlay">
    <div className="prescription-popup">
      {/* Header */}
      <div className="prescription-popup-header">
        <h3>🩺 Toa thuốc</h3>
          <button
           className="close-btn"
           onClick={() => {
            setShowPrescriptionPopup(false);
            setPrescriptionData([]);
          }}
              >
             ❌
        </button>
      </div>

      {/* Body */}
      <div className="prescription-popup-body">
        {prescriptionLoading ? (
          <div className="text-gray-600">Đang tải đơn thuốc...</div>
        ) : prescriptionError ? (
          <div className="text-red-500">{prescriptionError}</div>
        ) : (
          Array.isArray(prescriptionData) &&
          prescriptionData.length > 0 &&
          prescriptionData[0] &&
          typeof prescriptionData[0] === "object" ? (
            <>
              {/* Thông tin chung */}
              <div className="prescription-info">
                <div><strong>Mã đơn thuốc:</strong> {prescriptionData[0].PrescriptionID}</div>
                <div><strong>Mã hồ sơ:</strong> {prescriptionData[0].MedicalRecordID}</div>
                <div><strong>Mã phác đồ:</strong> {prescriptionData[0].TreatmentPlanID}</div>
                <div><strong>Bệnh nhân:</strong> {prescriptionData[0].FullnameDoctor}</div>
                <div><strong>Bác sĩ:</strong> {prescriptionData[0].FullnamePatient}</div>
                <div><strong>Phác đồ điều trị:</strong> {prescriptionData[0].LineOfTreatment}</div>
              </div>

              {/* Danh sách thuốc */}
              <div className="prescription-medicine-list">
                <h4 className="text-md font-semibold mb-2">💊 Danh sách thuốc</h4>
                <div className="overflow-x-auto">
                  <table className="prescription-table">
                    <thead>
                      <tr>
                        <th>Tên thuốc</th>
                        <th>Liều lượng</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.MedicalName || ''}</td>
                          <td>{item.Dosage || ''}</td>
                          <td>{item.StartDate?.split('T')[0] || ''}</td>
                          <td>{item.EndDate?.split('T')[0] || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="prescription-info-2">
              <div><strong>Kết quả điều trị:</strong> {prescriptionData[0].TreatmentResult}</div>
              <div><strong>Chẩn đoán:</strong> {prescriptionData[0].Diagnosis}</div>
              </div>

              {/* Ghi chú */}
              <div className="prescription-message">
                Bệnh nhân vui lòng sử dụng thuốc đúng liều lượng và thời gian theo chỉ định của bác sĩ.
              </div>
            </>
          ) : (
            <div>Không có dữ liệu đơn thuốc.</div>
          )
        )}
      </div>
    </div>
  </div>
)}

{showARVResultPopup && (
  <div className="prescription-popup-overlay">
    <div className="prescription-popup">
      <div className="prescription-popup-header">
        <h3>🧪 Kết quả ARV</h3>
        <button className="close-btn" onClick={() => { setShowARVResultPopup(false); setArvResultData(null); }}>
          ❌
        </button>
      </div>
      <div className="prescription-popup-body">
        {arvResultLoading ? (
          <div>Đang tải kết quả...</div>
        ) : arvResultError ? (
          <div style={{color: 'red'}}>{arvResultError}</div>
        ) : (
          Array.isArray(arvResultData) && arvResultData.length > 0 ? (
            <>
              <div className="prescription-medicine-list">
                <h4>Danh sách ARV</h4>
                <table className="prescription-table">
                  <thead>
                    <tr>
                      <th>Mã ARV</th>
                      <th>Tên ARV</th>
                      <th>Phác đồ</th>
                      <th>Mô tả</th>
                      <th>Độ tuổi</th>
                      <th>Nhóm</th>
                      <th>Chẩn đoán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arvResultData.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.ARVCode || ''}</td>
                        <td>{item.ARVName || ''}</td>
                        <td>{item.ARVProtocol || item.ARVID || ''}</td>
                        <td>{item.Description || ''}</td>
                        <td>{item.AgeRange || ''}</td>
                        <td>{item.ForGroup || ''}</td>
                        <td>{item.Diagnosis || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : <div>Không có dữ liệu kết quả ARV.</div>
        )}
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Profile;
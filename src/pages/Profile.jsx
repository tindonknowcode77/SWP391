import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';
import {capnhatprofile} from '../api/auth';
import {pantient} from '../api/auth';
import { nguoidunglayhosodieutri } from  '../api/auth';

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
          notes: item.TreatmentResult
        }));
        setMedicalHistory(mapped);
      })
      .catch(() => setMedicalHistory([]));
  }, []);

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
                        <button className="record-btn">
                          <i className="fas fa-file-pdf"></i>
                          <span>Xem toa thuốc</span>
                        </button>
                        
                        <button className="record-btn">
                          <i className="fas fa-file-medical-alt"></i>
                          <span>Xem kết quả xét nghiệm</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>  
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
      {showSuccessPopup && (
        <div className="profile-success-popup-overlay">
          <div className="profile-success-popup">
            <div className="profile-success-icon-wrapper">
              <i className="fas fa-check-circle profile-success-icon"></i>
            </div>
            <div className="profile-success-title">Bạn đã thay đổi thông tin thành công!</div>
            <button className="profile-success-btn" onClick={() => setShowSuccessPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
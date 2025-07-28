import React, { useState, useEffect , useRef } from 'react';
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
import { getLabTestsByPatient, getAllLabTests } from '../api/auth';

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
  //Dữ liệu thuốc sửa ở đây
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const medicationInfo = {
    Tenofovir: {
      tacDung: "Ức chế enzyme sao chép ngược của virus HIV và HBV, giúp giảm lượng virus trong cơ thể.",
      tacDungPhu: "Buồn nôn, tiêu chảy, nhức đầu, giảm mật độ xương, ảnh hưởng chức năng thận.",
      luuY: "Theo dõi chức năng thận định kỳ. Dùng thận trọng với bệnh nhân có tiền sử bệnh thận hoặc loãng xương."
    },
    Lamivudine: {
      tacDung: "Ức chế enzyme sao chép ngược, làm giảm sự nhân lên của HIV và HBV.",
      tacDungPhu: "Đau bụng, nhức đầu, buồn nôn, tiêu chảy nhẹ.",
      luuY: "Không dùng đồng thời với emtricitabine. Theo dõi chức năng gan nếu có viêm gan B kèm theo."
    },
    Dolutegravir: {
      tacDung: "Ức chế enzyme tích hợp của HIV, ngăn virus tích hợp vào DNA của tế bào người.",
      tacDungPhu: "Mất ngủ, đau đầu, tăng men gan, phát ban.",
      luuY: "Không nên dùng cho phụ nữ đang mang thai 3 tháng đầu. Có thể gây tăng cân nhẹ khi dùng lâu dài."
    },
    Efavirenz: {
      tacDung: "Ức chế enzyme sao chép ngược không nucleoside, giúp làm giảm tải lượng virus HIV.",
      tacDungPhu: "Ác mộng, chóng mặt, thay đổi tâm trạng, phát ban da.",
      luuY: "Dùng vào buổi tối để hạn chế tác dụng phụ lên hệ thần kinh. Tránh sử dụng với rượu hoặc thuốc an thần."
    },
    Zidovudine: {
      tacDung: "Ức chế enzyme sao chép ngược, là thuốc kháng HIV đầu tiên được sử dụng.",
      tacDungPhu: "Thiếu máu, buồn nôn, mất ngủ, thay đổi chỉ số huyết học.",
      luuY: "Theo dõi công thức máu định kỳ. Thận trọng với người có bệnh về tủy xương hoặc gan."
    },
    Nevirapine: {
      tacDung: "Ức chế enzyme sao chép ngược không nucleoside, làm chậm sự nhân lên của HIV.",
      tacDungPhu: "Phát ban da, tăng men gan, buồn nôn.",
      luuY: "Theo dõi chặt chẽ chức năng gan trong 6 tuần đầu. Tăng liều từ từ để giảm nguy cơ phát ban nghiêm trọng."
    },
    Abacavir: {
      tacDung: "Ức chế enzyme sao chép ngược, giúp giảm lượng virus HIV trong máu.",
      tacDungPhu: "Buồn nôn, sốt, phát ban, đau bụng.",
      luuY: "Kiểm tra HLA-B*5701 trước khi dùng để tránh phản ứng quá mẫn nghiêm trọng có thể gây tử vong."
    },
    Raltegravir: {
      tacDung: "Ức chế enzyme tích hợp của HIV, giúp ngăn virus xâm nhập vào DNA tế bào người.",
      tacDungPhu: "Mệt mỏi, đau đầu, tiêu chảy, tăng men gan.",
      luuY: "Thích hợp cho phụ nữ mang thai. Cần theo dõi men gan định kỳ khi dùng lâu dài."
    },
    Darunavir: {
      tacDung: "Ức chế enzyme protease của HIV, ngăn virus cắt protein để tạo virus mới.",
      tacDungPhu: "Phát ban, buồn nôn, đau bụng, tăng lipid máu.",
      luuY: "Luôn dùng kết hợp với ritonavir hoặc cobicistat để tăng sinh khả dụng. Theo dõi chỉ số mỡ máu."
    },
    Ritonavir: {
      tacDung: "Chính: ức chế protease; Phổ biến: dùng để tăng hiệu lực các thuốc khác bằng cách ức chế enzyme CYP3A4.",
      tacDungPhu: "Tiêu chảy, vị kim loại trong miệng, tăng triglyceride, tăng men gan.",
      luuY: "Thường không dùng đơn độc. Theo dõi tương tác thuốc kỹ lưỡng vì ảnh hưởng đến nhiều thuốc chuyển hóa qua gan."
    }
  };

  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleInfoClick = (name) => {
  setSelectedDrug(name);
  setShowPopup(true);
};

  const closePopup = () => {
  setShowPopup(false);
  setSelectedDrug(null);
};
  
  
  const [notifications, setNotifications] = useState([]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [tpLoading, setTpLoading] = useState(false);
  const [tpError, setTpError] = useState(null);

  const [showPrescriptionPopup, setShowPrescriptionPopup] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
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

  const [showCheckinConfirm, setShowCheckinConfirm] = useState(false);
  const [checkinBookId, setCheckinBookId] = useState(null);
  const [checkinResult, setCheckinResult] = useState(null); // {success: true/false, message: ''}

  const [labTests, setLabTests] = useState([]);
  const [labTestsLoading, setLabTestsLoading] = useState(false);
  const [labTestsError, setLabTestsError] = useState(null);

  const [inputPatientId, setInputPatientId] = useState('');
  const [showLabTestPopup, setShowLabTestPopup] = useState(false);
  const [selectedLabTests, setSelectedLabTests] = useState([]);

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
          doctor: item.Doctor?.User?.Fullname,
          patient : item.Patient?.User?.Fullname,
          patientInfor : item.Patient,
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

  // Lấy dữ liệu xét nghiệm động khi vào tab 'labtest'
  useEffect(() => {
    if (activeTab === 'labtest' && currentUser?.id) {
      setLabTestsLoading(true);
      setLabTestsError(null);
      
      // Lấy PatientID của user hiện tại trước, sau đó lấy xét nghiệm của bệnh nhân đó
      pantient(currentUser.id)
        .then(userRes => {
          const patientId = userRes?.PatientId || userRes?.PatientID;
          if (patientId) {
            // Sử dụng PatientID để lấy xét nghiệm của bệnh nhân này
            getLabTestsByPatient(patientId)
              .then((res) => {
                console.log('Lab tests data for patient:', patientId, res);
                setLabTests(Array.isArray(res) ? res : (res?.data || []));
                setLabTestsLoading(false);
              })
              .catch((error) => {
                console.error('Error loading lab tests for patient:', error);
                setLabTestsError('Không thể tải danh sách xét nghiệm của bệnh nhân');
                setLabTestsLoading(false);
              });
          } else {
            setLabTestsError('Không tìm thấy thông tin bệnh nhân');
            setLabTestsLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error loading patient info:', error);
          setLabTestsError('Không thể tải thông tin bệnh nhân');
          setLabTestsLoading(false);
        });
    }
  }, [activeTab, currentUser]);

  // Lấy dữ liệu thuốc động khi vào tab 'medication'
  useEffect(() => {
    if (activeTab === 'medication' && currentUser?.id) {
      pantient(currentUser.id)
        .then(userRes => {
          const patientId = userRes?.PatientId || userRes?.PatientID;
          if (patientId) {
            nguoidunglaytoathuoc(patientId)
              .then(res => {
                setPrescriptionData(Array.isArray(res) ? res : (res?.data || []));
              })
              .catch(() => setPrescriptionData([]));
          } else {
            setPrescriptionData([]);
          }
        })
        .catch(() => setPrescriptionData([]));
    }
  }, [activeTab, currentUser]);

  // Cái này để navigate qua activeTab bên phần Profile nha
  useEffect(() => {
    if (location.state?.tab && location.state.tab !== activeTab) {
      setActiveTab(location.state.tab);
     
      window.history.replaceState({}, document.title);
    }
  }, [location.state, activeTab]);

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

  const handleSetReminder = (item) => {
    const startDate = item.StartDate?.split('T')[0] || '';
    const endDate = item.EndDate?.split('T')[0] || '';
  
    const newNotification = {
      id: Date.now(),
      date: new Date().toLocaleDateString('vi-VN'),
      title: `🔔 Nhắc uống thuốc`,
      message: 
      `<strong>Tên thuốc: ${item.MedicalName}</strong><br/>` +
      `<strong>Liều lượng: ${item.Dosage}</strong><br/>` +
      `<strong>Ngày bắt đầu: ${startDate}</strong><br/>` +
      `<strong>Ngày kết thúc: ${endDate}</strong><br/><br/>` +
      `💡<strong> <em>Hãy uống thuốc đúng giờ và đủ liều để đạt hiệu quả điều trị tốt nhất.</em> </strong>`,
      isRead: false
    };
  
    setNotifications(prev => [newNotification, ...prev]);
    setActiveTab('notifications');
  };

  // Load notifications từ localStorage khi có currentUser
  useEffect(() => {
    if (currentUser?.id) {
      const saved = localStorage.getItem('notifications_' + currentUser.id);
      console.log('LOAD notifications for', currentUser.id, saved);
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch {}
      }
    }
  }, [currentUser?.id]);

  // Khi notifications thay đổi, lưu vào localStorage
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (currentUser?.id) {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return; // Bỏ qua lần đầu tiên khi mount
      }
      localStorage.setItem('notifications_' + currentUser.id, JSON.stringify(notifications));
    }
  }, [notifications, currentUser?.id]);

  // Xóa notification id khỏi localStorage để tránh bị trùng lịch 
  const handleDeleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
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
                  src={`https://localhost:7246/image/patient.png` || "fa fa-user"}
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
              className={`profile-nav-btn ${activeTab === 'labtest' ? 'active' : ''}`}
              onClick={() => handleTabChange('labtest')}
            >
              <i className="fas fa-vial"></i>
              <span>Xét nghiệm</span>
            </button>
            
            <button 
              className={`profile-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabChange('notifications')}
            >
              <i className="fas fa-bell"></i>
              <span>Thông báo</span>
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
          </div>
          
          <div className="profile-actions">
            <Link to="/appointments" className="profile-action-btn appointments">
              <i className="fas fa-calendar-check"></i>
              <span>Hủy Lịch Khám</span>
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
              {activeTab === 'labtest' && 'Xét nghiệm'}
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
                      <div className="record-doctor">Mã hồ sơ : {record.id}</div>
                        <div className="record-doctor">Bác sĩ : {record.doctor}</div>
                      </div>
                      
                      <div className="record-body">
                      <div className="record-item">
                          <span className="label">Tên bệnh nhân :</span>
                          <span className="value">{record.patient}</span>
                        </div>
                        <div className="record-item">
                          <span className="label">Giới tính :</span>
                          <span className="value">{record.patientInfor?.Gender}</span>
                        </div>
                        <div className="record-item">
                          <span className="label">Ngày sinh :</span>
                          <span className="value">{record.patientInfor?.DateOfBirth?.split('T')[0]}</span>
                        </div>
                        <div className="record-item">
                          <span className="label">Nhóm máu :</span>
                          <span className="value">{record.patientInfor?.BloodType}</span>
                        </div>
                        <div className="record-item">
                          <span className="label">Dị ứng :</span>
                          <span className="value">{record.patientInfor?.Allergy}</span>
                        </div>
                        <div className="record-item">
                          <span className="label">Điện thoại :</span>
                          <span className="value">{record.patientInfor?.Phone}</span>
                        </div>

                        <hr className="divider" />
                        
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
                  <p>Danh sách các lịch hẹn đã đặt của quý khách tại phòng khám , quý khách vui lòng nhấn <span style={{color: 'green'}}>Check-in</span> để xác nhận với Bác Sĩ .</p>
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
                        {[...appointments]
                          .filter(item => item.Status && item.Status.trim().toLowerCase() === 'thành công')
                          .sort((a, b) => {
                            const isCancelledA = a.Status === 'Đã hủy' || a.Status === 'rejected';
                            const isCancelledB = b.Status === 'Đã hủy' || b.Status === 'rejected';
                            if (isCancelledA === isCancelledB) return 0;
                            return isCancelledA ? 1 : -1;
                          })
                          .map((item, idx) => (
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
                                    onClick={() => {
                                      setCheckinBookId(item.BookID);
                                      setShowCheckinConfirm(true);
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
              <div className="medication-list1">
                <div className="section-info">
                  <p>Danh sách thuốc bạn đang sử dụng theo phác đồ điều trị hiện tại. Hãy đảm bảo dùng thuốc đúng liều, đúng giờ.</p>
                </div>
                
                <div className="current-medications1">
                  {Array.isArray(prescriptionData) && prescriptionData.length > 0 && prescriptionData[0] && typeof prescriptionData[0] === "object" ? (
                    prescriptionData.map((item, idx) => (
                      <div className="medication-card1" key={item.MedicalName || idx}>
                        <div className="medication-header1">
                          <h4>{item.MedicalName}</h4>
                          <span className="medication-badge1">Đang dùng</span>
                        </div>
                        <div className="medication-details1">
                          <div className="medication-detail1">
                            <i className="fas fa-prescription-bottle"></i>
                            <span className="label">Liều lượng:</span>
                            <span className="value">{item.Dosage || ''}</span>
                          </div>
                          <div className="medication-detail1">
                            <i className="fas fa-calendar-plus"></i>
                            <span className="label">Ngày bắt đầu:</span>
                            <span className="value">{item.StartDate?.split('T')[0] || ''}</span>
                          </div>
                          <div className="medication-detail1">
                            <i className="fas fa-calendar-minus"></i>
                            <span className="label">Ngày kết thúc:</span>
                            <span className="value">{item.EndDate?.split('T')[0] || ''}</span>
                          </div>
                        </div>
                        <div className="medication-actions1">
                        <button className="medication-btn1 info" onClick={() => handleInfoClick(item.MedicalName)}>
                              <i className="fas fa-info-circle"></i>
                             <span>Thông tin thuốc</span>
                          </button>
                          <button className="medication-btn1 reminder" onClick={() => handleSetReminder(item)}>
                            <i className="fas fa-bell"></i>
                            <span>Thiết lập nhắc nhở</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Không có dữ liệu đơn thuốc.</div>
                  )}
                </div>
                
                {/* <div className="medication-links1">
                  <Link to="/medication" className="medication-link1">
                    <i className="fas fa-pills"></i>
                    <span>Quản lý thuốc và nhắc nhở</span>
                  </Link>
                  
                  <Link to="/resources" className="medication-link1">
                    <i className="fas fa-book-medical"></i>
                    <span>Thông tin về thuốc ARV</span>
                  </Link>
                </div> */}
              </div>
            )}
            
            {activeTab === 'labtest' && (
              <div className="labtest-list">
                <div className="section-info">
                  <h3>🧪 Kết quả xét nghiệm của tôi ({Array.isArray(labTests) ? labTests.length : 0} bản ghi)</h3>
                  <p>Danh sách các kết quả xét nghiệm của bạn tại bệnh viện</p>
                </div>

                {labTestsLoading && <div className="loading">Đang tải dữ liệu...</div>}
                {labTestsError && <div className="error" style={{color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '4px'}}>{labTestsError}</div>}
                
                {!labTestsLoading && !labTestsError && (
                  <div className="labtest-table">
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Mã xét nghiệm</th>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Tên xét nghiệm</th>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Loại xét nghiệm</th>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Kết quả</th>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>CD4 Initial</th>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Viral Load Initial</th>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Trạng thái</th>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(labTests) && labTests.length > 0 ? (
                          labTests.map((test, index) => (
                            <tr key={test.LabTestID || index} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{test.LabTestID || `LT00001${index}`}</td>
                              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{test.TestName || 'Complete Blood Count'}</td>
                              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{test.TestType || 'Hematology'}</td>
                              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{test.Result || 'Normal'}</td>
                              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{test.CD4Initial || test.CD4Count || '1000'}</td>
                              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{test.ViralLoadInitial || test.ViralLoad || '50000'}</td>
                              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                <span className="status-badge" style={{ 
                                  padding: '4px 8px', 
                                  borderRadius: '12px', 
                                  backgroundColor: '#fff3cd', 
                                  color: '#856404',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}>
                                  {test.Status || 'Hoàn thành'}
                                </span>
                              </td>
                              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                <button 
                                  className="detail-btn"
                                  onClick={() => {
                                    // Hiển thị popup chi tiết của bản ghi này
                                    setSelectedLabTests([test]);
                                    setShowLabTestPopup(true);
                                  }}
                                  style={{ 
                                    padding: '6px 12px', 
                                    backgroundColor: '#007bff', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  Xem chi tiết
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                              Không có dữ liệu xét nghiệm
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
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
                        <div
                           className="notification-message"
                           dangerouslySetInnerHTML={{ __html: notification.message }}>
                       </div>
                      </div> 
                      <button
                        className="delete-notification-btn"
                        title="Xóa thông báo"
                        onClick={() => handleDeleteNotification(notification.id)}><i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
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
                <div><strong>Bệnh nhân:</strong> {prescriptionData[0].FullnamePatient}</div>
                <div><strong>Bác sĩ:</strong> {prescriptionData[0].FullnameDoctor}</div>
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
      {showCheckinConfirm && (
        <div className="profile-checkin-popup-overlay">
          <div className="profile-checkin-popup">
            <div className="profile-checkin-icon" style={{color: checkinResult?.success ? '#4CAF50' : '#ff4d4f'}}>
              <i className={checkinResult ? (checkinResult.success ? 'fas fa-check-circle' : 'fas fa-times-circle') : 'fas fa-question-circle'}></i>
            </div>
            {!checkinResult && <h3 className="profile-checkin-title">Bạn xác nhận Check-in lịch hẹn này?</h3>}
            {checkinResult && <div className="profile-checkin-message" style={{color: checkinResult.success ? '#388e3c' : '#d32f2f'}}>{checkinResult.message}</div>}
            <div style={{display: 'flex', justifyContent: 'center', gap: 18, marginTop: 8}}>
              <button
                className="profile-checkin-btn close"
                onClick={() => { setShowCheckinConfirm(false); setCheckinBookId(null); setCheckinResult(null); }}
              >
                Đóng
              </button>
              {!checkinResult && (
                <button
                  className="profile-checkin-btn confirm"
                  onClick={async () => {
                    try {
                      await patientcheckin(checkinBookId);
                      setAppointments(prev =>
                        prev.map(app =>
                          app.BookID === checkinBookId ? { ...app, Status: 'Đã checkin' } : app
                        )
                      );
                      setCheckinResult({ success: true, message: '✅ Check-in thành công! Trạng thái đã được cập nhật.' });
                    } catch (error) {
                      console.error('Check-in error:', error);
                      setCheckinResult({ success: false, message: '❌ Check-in thất bại: ' + (error.response?.data || error.message) });
                    }
                  }}
                >
                  Xác Nhận
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showLabTestPopup && (
  <div className="labtest-popup-overlay">
    <div className="labtest-popup">
      <div className="labtest-popup-header">
        <h3>🧪 Chi tiết kết quả xét nghiệm</h3>
        <button className="close-btn" onClick={() => setShowLabTestPopup(false)}>✖</button>
      </div>
      <div className="labtest-popup-body">
        {selectedLabTests.length === 0 ? (
          <div>Không có dữ liệu xét nghiệm.</div>
        ) : (
          selectedLabTests.map((item, idx) => (
            <div className="labtest-detail-card" key={item.LabTestID || idx}>
              <div className="detail-header">
                <h4>Thông tin xét nghiệm</h4>
              </div>
              
              <div className="detail-content">
                <div className="detail-row">
                  <span className="detail-label">Mã xét nghiệm:</span>
                  <span className="detail-value">{item.LabTestID || `LT00001${idx}`}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Tên xét nghiệm:</span>
                  <span className="detail-value">{item.TestName || 'Complete Blood Count'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Loại xét nghiệm:</span>
                  <span className="detail-value">{item.TestType || 'Hematology'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Kết quả:</span>
                  <span className="detail-value highlight">{item.Result || 'Normal'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">CD4 Initial:</span>
                  <span className="detail-value">{item.CD4Initial || item.CD4Count || '1000'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Viral Load Initial:</span>
                  <span className="detail-value">{item.ViralLoadInitial || item.ViralLoad || '50000'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className="detail-value">
                    <span className="status-badge" style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      backgroundColor: '#fff3cd', 
                      color: '#856404',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {item.Status || 'Hoàn thành'}
                    </span>
                  </span>
                </div>
                
                {(item.RequestID || item.TreatmentPlantID || item.TestCode) && (
                  <>
                    <hr style={{margin: '16px 0', border: 'none', borderTop: '1px solid #eee'}}/>
                    <div className="detail-section">
                      <h5>Thông tin bổ sung</h5>
                      {item.RequestID && (
                        <div className="detail-row">
                          <span className="detail-label">Mã yêu cầu:</span>
                          <span className="detail-value">{item.RequestID}</span>
                        </div>
                      )}
                      {item.TreatmentPlantID && (
                        <div className="detail-row">
                          <span className="detail-label">Mã phác đồ:</span>
                          <span className="detail-value">{item.TreatmentPlantID}</span>
                        </div>
                      )}
                      {item.TestCode && (
                        <div className="detail-row">
                          <span className="detail-label">Mã xét nghiệm:</span>
                          <span className="detail-value">{item.TestCode}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {(item.ResultValue || item.Description) && (
                  <>
                    <hr style={{margin: '16px 0', border: 'none', borderTop: '1px solid #eee'}}/>
                    <div className="detail-section">
                      <h5>Chi tiết kết quả</h5>
                      {item.ResultValue && (
                        <div className="detail-row">
                          <span className="detail-label">Giá trị kết quả:</span>
                          <span className="detail-value">{item.ResultValue}</span>
                        </div>
                      )}
                      {item.Description && (
                        <div className="detail-row">
                          <span className="detail-label">Mô tả:</span>
                          <span className="detail-value">{item.Description}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {selectedLabTests.length > 1 && idx < selectedLabTests.length - 1 && (
                <hr style={{margin: '20px 0', border: 'none', borderTop: '2px solid #eee'}}/>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}
{showPopup && (
  <div className="popup-overlay" onClick={closePopup}>
    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
      <button className="popup-close" onClick={closePopup}>×</button>
      <h3>🧪 Thông tin thuốc: <span>{selectedDrug}</span></h3>

      {medicationInfo[selectedDrug] ? (
        <>
          <div className="info-section">
            <strong>Tác dụng:</strong>
            <p>{medicationInfo[selectedDrug].tacDung}</p>
          </div>
          <div className="info-section">
            <strong>Tác dụng phụ:</strong>
            <p>{medicationInfo[selectedDrug].tacDungPhu}</p>
          </div>
          <div className="info-section">
            <strong>Lưu ý:</strong>
            <p>{medicationInfo[selectedDrug].luuY}</p>
          </div>
        </>
      ) : (
        <p>Không có thông tin về loại thuốc này.</p>
      )}
    </div>
  </div>
)}

    </>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import '../styles/Doctor.css';
import '../styles/TreatmentPlan.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {bacsilaydanhsachbenhnhan} from '../api/auth';
import {bacsilaytreatmentplan} from '../api/auth';
import { cancelAppointment } from '../api/auth';
import { doctorcheckout } from '../api/auth';
import { getAllLabTests} from '../api/auth';
import { addLabTest} from '../api/auth';
import { updateLabTest} from '../api/auth';
import { deleteLabTest} from '../api/auth';
import { datlichtaikham } from '../api/auth';






const Doctor = () => {
  const [selected, setSelected] = useState('appointments');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [patientsError, setPatientsError] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [planPage, setPlanPage] = useState(0); // Pagination for treatment plans
  const [doctorStatus, setDoctorStatus] = useState('checked-out'); // Doctor's current status
  const [lastCheckoutTime, setLastCheckoutTime] = useState(new Date().toLocaleString('vi-VN'));
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // State cho modal xác nhận checkin
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [checkinAppointmentId, setCheckinAppointmentId] = useState(null);
  // Thêm state cho tab tất cả lịch hẹn
  const [allAppointments, setAllAppointments] = useState([]);
  const [labTestForm, setLabTestForm] = useState({
    RequestID: '',
    TreatmentPlantID: '',
    TestName: '',
    TestCode: '',
    TestType: '',
    ResultValue: '',
    CD4Initial: '',
    ViralLoadInitial: '',
    Status: 'Đang xử lý',
    Description: ''
  });
  const [labTestMessage, setLabTestMessage] = useState('');
  const [updateLabTestForm, setUpdateLabTestForm] = useState({
    labTestId: '',
    RequestID: '',
    TreatmentPlantID: '',
    TestName: '',
    TestCode: '',
    TestType: '',
    ResultValue: '',
    CD4Initial: '',
    ViralLoadInitial: '',
    Status: '',
    Description: ''
  });
  const [updateLabTestMessage, setUpdateLabTestMessage] = useState('');
  const [labTests, setLabTests] = useState([]);
  const [loadingLabTests, setLoadingLabTests] = useState(false);
  const [labTestsError, setLabTestsError] = useState(null);
  const [showDeleteLabTestModal, setShowDeleteLabTestModal] = useState(false);
  const [labTestToDelete, setLabTestToDelete] = useState(null);
  const [deleteLabTestMessage, setDeleteLabTestMessage] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // State for dropdown data
  const [dropdownData, setDropdownData] = useState({
    requestIds: [],
    treatmentPlanIds: [],
    labTestIds: []
  });
  const [loadingDropdownData, setLoadingDropdownData] = useState(false);
  // State for re-examination form
  const [reExamForm, setReExamForm] = useState({
    PatientID: '',
    DoctorID: '',
    BookingType: '',
    BookDate: '',
    BookTime: '',
    Note: ''
  });
  const [reExamMessage, setReExamMessage] = useState('');
  const [reExamLoading, setReExamLoading] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');


  const patientNameMap = {
    'PT000001': 'Trịnh Bá khá',
    'PT000002': 'Trần Thị Thắm',
    'PT000003': 'Lê Văn Anh',
    'PT000004': 'Phạm Thị Bích',
    'PT000005': 'Hoàng Văn Cảnh',
    'PT000006': 'Đỗ Thị Diệp',
    'PT000007': 'Vũ Văn Em',
    'PT000008': 'Đặng Thị Phúc',
    'PT000009': 'Mai Văn Giáp',
    'PT000010': 'Trịnh Thị Hòa',
    'PT000011': 'Nguyễn Thị Hồng',
    'PT000012': 'Phạm Văn Cường',
    'PT000013': 'Lê Thị Mai',
    'PT000014': 'Đỗ Mạnh Hùng',
    'PT000015': 'Trần Văn Bình',
    'PT000016': 'Huỳnh Thị Ngọc',
    'PT000017': 'Bùi Văn Long',
    'PT000018': 'Võ Thị Lan',
    'PT000019': 'Tạ Minh Đức',
    'PT000020': 'Ngô Quỳnh Anh',
  };

  // Fetch dropdown data for labtest forms
  const fetchDropdownData = async () => {
    setLoadingDropdownData(true);
    try {
      const labTestsData = await getAllLabTests();
      const labTests = Array.isArray(labTestsData) ? labTestsData : (labTestsData?.data || []);
      
      const treatmentPlansData = await bacsilaytreatmentplan();
      const treatmentPlans = Array.isArray(treatmentPlansData) ? treatmentPlansData : (treatmentPlansData?.data || []);
      
      // Extract unique IDs
      const requestIds = [...new Set(labTests.map(test => test.RequestID).filter(Boolean))];
      const treatmentPlanIds = [...new Set(treatmentPlans.map(plan => plan.TreatmentPlanID).filter(Boolean))];
      const labTestIds = [...new Set(labTests.map(test => test.LabTestID).filter(Boolean))];
      
      setDropdownData({
        requestIds,
        treatmentPlanIds,
        labTestIds
      });
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    } finally {
      setLoadingDropdownData(false);
    }
  };

  useEffect(() => {
    if (selected === 're-examination') {
      // Set default doctor ID when selecting the re-examination tab
      const doctorId = currentUser?.DoctorId || currentUser?.doctorId || currentUser?.DoctorID || 'DT000003'; // Fallback to DT000003 if no ID found
      setReExamForm(prev => ({
        ...prev,
        DoctorID: doctorId,
        BookingType: 'Tái khám' // Always set to "Tái khám" regardless of previous value
      }));
      
      // Fetch patients data if not already loaded
      if (patients.length === 0 && !loadingPatients) {
        setLoadingPatients(true);
        setPatientsError(null);
        bacsilaydanhsachbenhnhan()
          .then((data) => {
            const patientsData = Array.isArray(data) ? data : (data?.data || []);
            setPatients(patientsData);
            setLoadingPatients(false);
          })
          .catch((err) => {
            setPatientsError('Không thể tải danh sách bệnh nhân');
            setLoadingPatients(false);
          });
      }
    } else if (selected === 'appointments') {
      setLoading(true);
      setError(null);
      bacsilaydanhsachbenhnhan()
        .then((data) => {
          setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoading(false);
        })
        .catch((err) => {
          setError('Không thể tải danh sách lịch hẹn');
          setLoading(false);
        });
    } else if (selected === 'all-appointments') {
      setLoading(true);
      setError(null);
      bacsilaydanhsachbenhnhan()
        .then((data) => {
          setAllAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoading(false);
        })
        .catch((err) => {
          setError('Không thể tải tất cả lịch hẹn');
          setLoading(false);
        });
    } else if (selected === 'cancelled-appointments') {
      setLoading(true);
      setError(null);
      bacsilaydanhsachbenhnhan()
        .then((data) => {
          setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoading(false);
        })
        .catch((err) => {
          setError('Không thể tải danh sách lịch hẹn đã hủy');
          setLoading(false);
        });
    } else if (selected === 'patients') {
      setLoadingPlans(true);
      setPlanError(null);
      bacsilaytreatmentplan()
        .then((res) => {
          setTreatmentPlans(Array.isArray(res) ? res : (res?.data || []));
          setLoadingPlans(false);
        })
        .catch((err) => {
          setPlanError('Không thể tải hồ sơ điều trị');
          setLoadingPlans(false);
        });
    } else if (selected === 'my-patients') {
      setLoadingPatients(true);
      setPatientsError(null);
      bacsilaydanhsachbenhnhan()
        .then((res) => {
          setPatients(Array.isArray(res) ? res : (res?.data || []));
          setLoadingPatients(false);
        })
        .catch((err) => {
          setPatientsError('Không thể tải danh sách bệnh nhân');
          setLoadingPatients(false);
        });
    } else if (selected === 'all-labtests') {
      setLoadingLabTests(true);
      setLabTestsError(null);
      getAllLabTests()
        .then((data) => {
          setLabTests(Array.isArray(data) ? data : (data?.data || []));
          setLoadingLabTests(false);
        })
        .catch((err) => {
          setLabTestsError('Không thể tải danh sách LabTest');
          setLoadingLabTests(false);
        });
    }
  }, [selected, deleteLabTestMessage]);

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // useEffect(() => {
  //   if (doctorStatus !== 'checked-in') {
  //     setShowRequireCheckin(true);
  //   } else {
  //     setShowRequireCheckin(false);
  //   }
  // }, [doctorStatus]);

  useEffect(() => {
    if (location.state && location.state.tab) {
      setSelected(location.state.tab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (!currentUser || currentUser.role !== 'R003') {
    return (
      <div className="doctor-warning-banner" style={{flexDirection: 'column', gap: '18px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <span className="warning-icon">&#9888;</span>
          Không phận sự miễn vào !!!
        </div>
        <button className="doctor-warning-btn" onClick={() => navigate('/hospital')}>
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = async () => {
    await logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (!appointmentToCancel) return;
    console.log('Cancel payload:', cancelReason);
    cancelAppointment(appointmentToCancel.BookID, cancelReason)
      .then(() => {
        setShowCancelModal(false);
        setCancelReason('');
        setAppointmentToCancel(null);
        // Refresh danh sách lịch hẹn
        bacsilaydanhsachbenhnhan()
          .then((data) => {
            setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          });
      });
  };

  // Xử lý khi bác sĩ click vào lịch hẹn
  const handleAppointmentClick = async (appointment) => {
    try {
      if (appointment.Status === 'Đã xác nhận') {
        // Hiển thị confirm trước khi checkout
        const confirmed = window.confirm('Bạn đã khám bệnh nhân này chưa?');
        if (confirmed) {
          await doctorcheckout(appointment.BookID);
          // alert('Đã khám hoàn tất!');
          const data = await bacsilaydanhsachbenhnhan();
          setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
        }
        // Nếu chọn Không thì không làm gì, vẫn giữ trạng thái Đã xác nhận
      } else {
        // Nếu chưa check-in, hiển thị thông báo
        const today = new Date().toDateString();
        const appointmentDate = new Date(appointment.BookDate).toDateString();
        
        if (appointmentDate > today) {
          setModalMessage('❌ Chưa đến ngày hẹn. Vui lòng đợi đến ngày ' + new Date(appointment.BookDate).toLocaleDateString('vi-VN'));
        } else if (appointment.Status !== 'Đã checkin') {
          setModalMessage('❌ Bệnh nhân chưa xác nhận (check-in). Vui lòng yêu cầu bệnh nhân check-in trước khi khám.');
        }
        
        setSelectedAppointment(appointment);
        setShowAppointmentModal(true);
      }
    } catch (error) {
      console.error('Error handling appointment click:', error);
      alert('Có lỗi xảy ra khi xử lý lịch hẹn!');
    }
  };

  // Xử lý hoàn tất khám bệnh
  const handleExaminationComplete = async (bookId) => {
    try {
      await doctorcheckout(bookId);
      setSuccessMessage('✅ Đã khám hoàn tất!');
      setShowSuccessPopup(true);
      // Sau khi hoàn tất, chuyển về tab lịch hẹn của tôi
      setSelected('appointments');
      // Refresh danh sách lịch hẹn
      const data = await bacsilaydanhsachbenhnhan();
      setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
    } catch (error) {
      console.error('Error completing examination:', error);
      alert('Có lỗi khi hoàn tất khám bệnh!');
    }
  };

  // Lọc danh sách bệnh nhân không trùng lặp theo PatientID hoặc SĐT
  const uniquePatients = [];
  const seenPatientKeys = new Set();
  patients.forEach((p) => {
    const key = p.Patient?.PatientID || p.Patient?.Phone || p.PatientFullname;
    if (key && !seenPatientKeys.has(key)) {
      uniquePatients.push(p);
      seenPatientKeys.add(key);
    }
  });

  const handlePatientClick = async (patient) => {
    try {
      const patientId = patient.Patient?.PatientID || patient.PatientID;
      if (!patientId) {
        alert('Không tìm thấy mã bệnh nhân!');
        return;
      }
      const res = await bacsilaytreatmentplan();
      const plans = Array.isArray(res) ? res : (res?.data || []);
      const plan = plans.find(pl => pl.Patient?.PatientID === patientId || pl.PatientID === patientId);
      if (plan) {
        navigate(`/treatment-plan/${plan.TreatmentPlanID}`);
      } else {
        // Thử lấy tất cả trường có thể là mã bác sĩ
        const doctorId = currentUser?.DoctorId || currentUser?.DoctorID || currentUser?.doctorId || localStorage.getItem('DoctorId');
        console.log('doctorId:', doctorId);
        
        navigate(`/treatment-plan/add?patientId=${patientId}&doctorId=${doctorId}`);
      }
    } catch (error) {
      alert('Lỗi khi kiểm tra hồ sơ điều trị!');
    }
  };

  // Handler for re-examination form
  const handleReExamFormChange = (e) => {
    const { name, value } = e.target;
    setReExamForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit re-examination form
  const handleReExamSubmit = async (e) => {
    e.preventDefault();
    setReExamLoading(true);
    setReExamMessage('');
    
    try {
      // Make sure all required fields are filled properly
      if (!reExamForm.PatientID) {
        throw new Error('Vui lòng chọn bệnh nhân');
      }
      
      if (!reExamForm.BookDate) {
        throw new Error('Vui lòng chọn ngày tái khám');
      }
      
      if (!reExamForm.BookTime) {
        throw new Error('Vui lòng chọn giờ tái khám');
      }
      
      // Format date and time for API while preserving the exact time selected by user
      const [year, month, day] = reExamForm.BookDate.split('-');
      const [hours, minutes] = reExamForm.BookTime.split(':');
      
      // Log the original input values for debugging
      console.log('Original input - Date:', reExamForm.BookDate, 'Time:', reExamForm.BookTime);
      
      // Create a formatted date string in the format "YYYY-MM-DDThh:mm:00.000Z"
      // but keep the exact time as entered without timezone conversion
      const exactTimeFormatted = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
      
      // Log the formatted time to verify it's correct
      console.log('Formatted date time (preserving exact user input):', exactTimeFormatted);
      
      // Ensure DoctorID is in the correct format
      const doctorId = reExamForm.DoctorID || currentUser?.DoctorId || currentUser?.DoctorID || currentUser?.doctorId || 'DT000003';
      
      // BookingType is always "Tái khám", no need to validate
      
      // Prepare the data for submission according to the exact format in the screenshot
      const formData = {
        "PatientID": reExamForm.PatientID,
        "DoctorID": doctorId,
        "BookingType": "Tái khám", // Always set to "Tái khám"
        "BookDate": exactTimeFormatted,
        "note": reExamForm.Note || ""
      };
      
      console.log('Submitting re-examination appointment:', formData);
      const response = await datlichtaikham(formData);
      
      // Extract BookID from the response if available
      const bookId = response?.data?.BookID || response?.BookID;
      
      setReExamMessage(`Đặt lịch tái khám thành công${bookId ? ` với mã: ${bookId}` : ''}`);
      setShowSuccessPopup(true); // Show success popup
      setSuccessMessage(`Đặt lịch tái khám thành công${bookId ? ` với mã: ${bookId}` : ''}`);
      
      setReExamForm({
        PatientID: '',
        DoctorID: doctorId,
        BookingType: 'Tái khám', // Use a meaningful default value
        BookDate: '',
        BookTime: '',
        Note: ''
      });
      setSelectedPatientName('');
      console.log('Re-examination scheduled:', response);
    } catch (error) {
      console.error('Error scheduling re-examination:', error);
      setReExamMessage(error.message || 'Lỗi khi đặt lịch tái khám. Vui lòng thử lại.');
    } finally {
      setReExamLoading(false);
    }
  };

  const handleCheckin = async (bookId) => {
    const appointment = appointments.find(a => a.BookID === bookId);
    if (appointment && appointment.Status === 'Đã khám') {
      setModalMessage('✅ Bác sĩ đã khám bệnh nhân này rồi!');
      setShowAppointmentModal(true);
      return;
    }
    try {
      // Gọi API checkout ở đây
      await doctorcheckout(bookId);
      // Sau khi thành công, cập nhật lại danh sách lịch hẹn
      const data = await bacsilaydanhsachbenhnhan();
      setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
      setSuccessMessage('✅ Đã khám hoàn tất!');
      setShowSuccessPopup(true);
    } catch (error) {
      alert('Có lỗi khi checkin!');
    }
  };

  return (
    <div className="doctor-container">
      <aside className="doctor-sidebar">
        <div className="doctor-sidebar-user-row">
          <span className="doctor-sidebar-user">
            <span style={{ color: '#9de0ad', fontWeight: 'bold' }}>DOCTOR : </span> {currentUser?.name || 'Bác Sĩ'}
          </span>
          <button className="doctor-sidebar-logout-btn" onClick={handleLogout} title="Đăng xuất" aria-label="Đăng xuất">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <ul className="doctor-sidebar-menu">
          <li
            className={selected === 'appointments' ? 'active' : ''}
            onClick={() => setSelected('appointments')}
          >
            <i className="fas fa-calendar-check"></i>
            <span>Lịch hẹn của tôi</span>
          </li>
          <li
            className={selected === 'all-appointments' ? 'active' : ''}
            onClick={() => setSelected('all-appointments')}
          >
            <i className="fas fa-calendar-alt"></i>
            <span>Tất cả lịch hẹn</span>
          </li>
          <li
            className={selected === 'cancelled-appointments' ? 'active' : ''}
            onClick={() => setSelected('cancelled-appointments')}
          >
            <i className="fas fa-calendar-times"></i>
            <span>Hủy lịch hẹn</span>
          </li>
          <li
            className={selected === 'patients' ? 'active' : ''}
            onClick={() => setSelected('patients')}
          >
            <i className="fas fa-notes-medical"></i>
            <span>Danh sách hồ sơ điều trị</span>
          </li>
          <li
            className={selected === 'my-patients' ? 'active' : ''}
            onClick={() => setSelected('my-patients')}
          >
            <i className="fas fa-user-injured"></i>
            <span>Bệnh nhân của tôi</span>
          </li>
          <li
            className={selected === 're-examination' ? 'active' : ''}
            onClick={() => setSelected('re-examination')}
          >
            <i className="fas fa-calendar-plus"></i>
            <span>Đặt lịch tái khám</span>
          </li>
        </ul>
      </aside>
      <main className="doctor-main">
        {selected === 'appointments' && (
          <div className="doctor-content">
            
            <h2 className="doctor-table-title">Lịch hẹn của tôi</h2>
            {loading && <div>Đang tải...</div>}
            {error && <div style={{color: 'red'}}>{error}</div>}
            {!loading && !error && appointments.length === 0 && <div>Bác sĩ chưa có lịch hẹn nào.</div>}
            {!loading && !error && appointments.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Tên bệnh nhân</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Số điện thoại</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .filter(item => item.Status === 'Thành công' || item.Status === 'Đã xác nhận')
                      .map((item, idx ) => (
                        <tr 
                          key={item.BookID || idx}
                          onClick={() => handleAppointmentClick(item)}
                          style={{ cursor: 'pointer' }}
                          className="appointment-row"
                        >
                          <td>{item.BookID}</td>
                          <td>{item.PatientFullname}</td>
                          <td>{item.BookingType}</td>
                          <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                          <td>{item.Patient?.Phone || ''}</td>
                          <td
                            className={
                              item.Status === 'Đang chờ'
                                ? 'status-badge-2 status-pending-3'
                                : item.Status === 'Đã xác nhận'
                                ? 'status-badge-2 status-confirmed-3'
                                : item.Status === 'Đã checkin'
                                ? 'status-badge-2 status-checkedin-3'
                                : item.Status === 'Rejected'
                                ? 'status-badge-2 status-rejected-3'
                                : item.Status === 'Thành công'
                                ? 'status-badge-2 status-thanhcong-3'
                                : item.Status === 'Đã khám'
                                ? 'status-badge-2 status-examined-3'
                                : item.Status === 'Đã hủy'
                                ? 'status-badge-2 status-cancelled-3'
                                : 'status-badge-2'
                            }
                            style={
                              item.Status === 'Đã khám'
                                ? { color: '#FFD600', fontWeight: 'bold' }
                                : item.Status === 'Đã hủy'
                                ? { color: '#FF1744', fontWeight: 'bold' }
                                : {}
                            }
                          >
                            {item.Status || ''}
                            {item.Status === 'Đã xác nhận' && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setCheckinAppointmentId(item.BookID);
                                  setShowCheckinModal(true);
                                }}
                                style={{ color: 'green', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, marginLeft: 8 }}
                                title="Checkout"
                              >
                                Checkout
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {showCancelModal && (
              <div className="doctor-cancel-modal">
                <div className="doctor-cancel-container">
                  <h3>Hủy lịch hẹn</h3>
                  <p>Nhập lý do hủy:</p>
                  <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3} />
                  <div style={{marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center'}}>
                    <button onClick={handleCancelConfirm} className="doctor-cancel-confirm">Xác nhận hủy</button>
                    <button onClick={() => setShowCancelModal(false)} className="doctor-cancel-close">Hủy bỏ</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Tab tất cả lịch hẹn */}
        {selected === 'all-appointments' && (
          <div className="doctor-content">
            <h2 className="doctor-table-title">Tất cả lịch hẹn</h2>
            {loading && <div>Đang tải...</div>}
            {error && <div style={{color: 'red'}}>{error}</div>}
            {!loading && !error && allAppointments.length === 0 && <div>Không có lịch hẹn nào.</div>}
            {!loading && !error && allAppointments.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Tên bệnh nhân</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Số điện thoại</th>
                      <th>Trạng thái</th>
                      <th>Đã khám</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAppointments.map((item, idx ) => (
                      <tr 
                        key={item.BookID || idx}
                        onClick={() => handleAppointmentClick(item)}
                        style={{ cursor: 'pointer' }}
                        className="appointment-row"
                      >
                        <td>{item.BookID}</td>
                        <td>{item.PatientFullname}</td>
                        <td>{item.BookingType}</td>
                        <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                        <td>{item.Patient?.Phone || ''}</td>
                        <td
                          className={
                            item.Status === 'Đang chờ'
                              ? 'status-badge-2 status-pending-3'
                              : item.Status === 'Đã xác nhận'
                              ? 'status-badge-2 status-confirmed-3'
                              : item.Status === 'Đã checkin'
                              ? 'status-badge-2 status-checkedin-3'
                              : item.Status === 'Rejected'
                              ? 'status-badge-2 status-rejected-3'
                              : item.Status === 'Thành công'
                              ? 'status-badge-2 status-thanhcong-3'
                              : item.Status === 'Đã khám'
                              ? 'status-badge-2 status-examined-3'
                              : item.Status === 'Đã hủy'
                              ? 'status-badge-2 status-cancelled-3'
                              : 'status-badge-2'
                          }
                          style={
                            item.Status === 'Đã khám'
                              ? { color: '#FFD600', fontWeight: 'bold' }
                              : item.Status === 'Đã hủy'
                              ? { color: '#FF1744', fontWeight: 'bold' }
                              : {}
                          }
                        >
                          {item.Status || ''}
                          {item.Status === 'Đã xác nhận' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setCheckinAppointmentId(item.BookID);
                                setShowCheckinModal(true);
                              }}
                              style={{ color: 'green', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, marginLeft: 8 }}
                              title="Checkout"
                            >
                              Checkout
                            </button>
                          )}
                        </td>
                        <td style={{textAlign:'center'}}>
                          <input
                            type="checkbox"
                            checked={item.Status === 'Đã khám'}
                            disabled={item.Status !== 'Đã checkin'}
                            onChange={e => {
                              if (e.target.checked) handleExaminationComplete(item.BookID);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selected === 'cancelled-appointments' && (
          <div className="doctor-content">
            <h2 className="doctor-table-title">Danh sách lịch hẹn có thể hủy</h2>
            {loading && <div>Đang tải...</div>}
            {error && <div style={{color: 'red'}}>{error}</div>}
            {!loading && !error && appointments.length === 0 && <div>Bác sĩ chưa có lịch hẹn nào.</div>}
            {!loading && !error && appointments.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Tên bệnh nhân</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Số điện thoại</th>
                      <th>Ghi chú</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .filter(item => item.Status === 'Đã hủy' || item.Status === 'Thành công')
                      .map((item, idx) => (
                        <tr key={item.BookID || idx}>
                          <td>{item.BookID}</td>
                          <td>{item.PatientFullname}</td>
                          <td>{item.BookingType}</td>
                          <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                          <td>{item.Patient?.Phone || ''}</td>
                          <td>{item.Note || ''}</td>
                          <td className={
                            item.Status === 'Đã hủy'
                              ? 'status-badge-2 status-cancelled-3'
                              : item.Status === 'Thành công'
                              ? 'status-badge-2 status-thanhcong-3'
                              : 'status-badge-2'
                          }>
                            {item.Status || ''}
                          </td>
                          <td>
                            {item.Status !== 'Đã hủy' && (
                              <button
                                style={{
                                  marginLeft: 8,
                                  padding: '2px 8px',
                                  background: '#ff4d4f',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleCancelClick(item)}
                              >
                                Hủy lịch
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {showCancelModal && (
              <div className="doctor-cancel-modal">
                <div className="doctor-cancel-container">
                  <h3>Hủy lịch hẹn</h3>
                  <p>Nhập lý do hủy:</p>
                  <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3} />
                  <div style={{marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center'}}>
                    <button onClick={handleCancelConfirm} className="doctor-cancel-confirm">Xác nhận hủy</button>
                    <button onClick={() => setShowCancelModal(false)} className="doctor-cancel-close">Hủy bỏ</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {selected === 'patients' && (
          <div className="doctor-content">
            <h2 className="doctor-table-title">Danh sách hồ sơ điều trị</h2>
            {loadingPlans && <div className="loading-container"><div className="spinner"></div>Đang tải hồ sơ điều trị...</div>}
            {planError && <div style={{color: 'red'}}>{planError}</div>}
            {!loadingPlans && !planError && treatmentPlans.length === 0 && (
              <div className="no-plan-container">
                <i className="fas fa-notes-medical"></i>
                <h2>Chưa có hồ sơ điều trị nào</h2>
                <p>Bệnh nhân chưa có hồ sơ điều trị.</p>
              </div>
            )}
            {!loadingPlans && !planError && treatmentPlans.length > 0 && (
              <div className="treatment-content">
                <div className="container">
                  {/* Only show 1 plan at a time */}
                  {(() => {
                    const plan = treatmentPlans[planPage];
                    return (
                      <div className="plan-container" key={plan.TreatmentPlanID} style={{marginBottom: 32}}>
                        <div className="plan-summary">
                          <div className="summary-item">
                            <div className="summary-icon doctor-icon"><i className="fas fa-user-md"></i></div>
                            <div className="summary-details">
                              <h3>Mã hồ sơ</h3>
                              <p>{plan.TreatmentPlanID}</p>
                              <span>Bác sĩ: {currentUser?.name || '---'}</span>
                            </div>
                          </div>
                          <div className="summary-item">
                            <div className="summary-icon regimen-icon"><i className="fas fa-pills"></i></div>
                            <div className="summary-details">
                              <h3>Phác đồ ARV</h3>
                              <p>{plan.ARVProtocol || '---'}</p>
                              <span>Line: {plan.TreatmentLine || '---'}</span>
                            </div>
                          </div>
                          <div className="summary-item">
                            <div className="summary-icon status-icon"><i className="fas fa-notes-medical"></i></div>
                            <div className="summary-details">
                              <h3>Chẩn đoán</h3>
                              <p>{plan.Diagnosis || '---'}</p>
                              <span>Kết quả: {plan.TreatmentResult || '---'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="plan-tabs">
                          <button className="tab-btn active"><i className="fas fa-user-injured"></i> Thông tin bệnh nhân</button>
                          <button
                            className="tab-btn"
                            style={{marginLeft: 12, color: 'black', fontWeight: 500}}
                            onClick={() => navigate(`/treatment-plan/${plan.TreatmentPlanID}`)}
                          >
                            <i className="fas fa-eye"></i> Xem chi tiết
                          </button>
                        </div>
                        <div className="tab-content">
                          <div className="overview-grid">
                            <div className="overview-card">
                              <h3><i className="fas fa-id-card"></i> Mã bệnh nhân</h3>
                              <p>{plan.Patient?.PatientID || '---'}</p>
                              <span style={{color:'#1976d2', fontWeight:500}}>
                                {plan.Patient?.PatientID && patientNameMap[plan.Patient.PatientID] ? `(${patientNameMap[plan.Patient.PatientID]})` : ''}
                              </span>
                            </div>
                            <div className="overview-card">
                              <h3><i className="fas fa-birthday-cake"></i> Ngày sinh</h3>
                              <p>{plan.Patient?.DateOfBirth ? new Date(plan.Patient.DateOfBirth).toLocaleDateString('vi-VN') : '---'}</p>
                            </div>
                            <div className="overview-card">
                              <h3><i className="fas fa-venus-mars"></i> Giới tính</h3>
                              <p>{plan.Patient?.Gender || '---'}</p>
                            </div>
                            <div className="overview-card">
                              <h3><i className="fas fa-phone"></i> Số điện thoại</h3>
                              <p>{plan.Patient?.Phone || '---'}</p>
                            </div>
                            <div className="overview-card">
                              <h3><i className="fas fa-tint"></i> Nhóm máu</h3>
                              <p>{plan.Patient?.BloodType || '---'}</p>
                            </div>
                            <div className="overview-card">
                              <h3><i className="fas fa-allergies"></i> Dị ứng</h3>
                              <p>{plan.Patient?.Allergy || '---'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {/* Pagination controls */}
                  <div className="plan-pagination">
                    <button
                      className="plan-pagination-arrow"
                      onClick={() => setPlanPage((prev) => Math.max(prev - 1, 0))}
                      disabled={planPage === 0}
                      aria-label="Trang trước"
                    >
                      &lt;
                    </button>
                    <span className="plan-pagination-info">{planPage + 1} / {treatmentPlans.length}</span>
                    <button
                      className="plan-pagination-arrow"
                      onClick={() => setPlanPage((prev) => Math.min(prev + 1, treatmentPlans.length - 1))}
                      disabled={planPage === treatmentPlans.length - 1}
                      aria-label="Trang sau"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {selected === 'my-patients' && (
          <div className="doctor-content">
            <h2 className="doctor-table-title">Bệnh nhân của tôi</h2>
            {loadingPatients && <div className="loading-container"><div className="spinner"></div>Đang tải danh sách bệnh nhân...</div>}
            {patientsError && <div style={{color: 'red'}}>{patientsError}</div>}
            {!loadingPatients && !patientsError && uniquePatients.length === 0 && (
              <div className="no-plan-container">
                <i className="fas fa-users"></i>
                <h2>Chưa có bệnh nhân nào</h2>
                <p>Bạn chưa có bệnh nhân nào trong danh sách.</p>
              </div>
            )}
            {!loadingPatients && !patientsError && uniquePatients.length > 0 && (
              <div className="patient-list">
                {uniquePatients.map((p) => (
                  <div className="patient-card" key={p.BookID}>
                    <div className="patient-info">
                      <div className="patient-avatar"><i className="fas fa-user-injured"></i></div>
                      <div className="patient-details">  
                        <div className="patient-row"><span className="patient-label">Tên:</span> {p?.PatientFullname || p.Patient?.Name || '---'}</div>
                        <div className="patient-row"><span className="patient-label">Giới tính:</span> {p.Patient?.Gender || '---'}</div>
                        <div className="patient-row"><span className="patient-label">Ngày sinh:</span> {p.Patient?.DateOfBirth ? new Date(p.Patient.DateOfBirth).toLocaleDateString('vi-VN') : '---'}</div>
                        <div className="patient-row"><span className="patient-label">SĐT:</span> {p.Patient?.Phone || '---'}</div>
                        <div className="patient-row"><span className="patient-label">Nhóm máu:</span> {p.Patient?.BloodType || '---'}</div>
                        <div className="patient-row"><span className="patient-label">Ghi chú:</span> {p.Note || '---'}</div>
                        <div className="patient-row"><span className="patient-label">Dị ứng:</span> {p.Patient?.Allergy || '---'}</div>
                        <button
                          onClick={() => handlePatientClick(p)}
                          className="doctor-action-btn"
                          style={{marginTop: 8}}
                        >
                          Xem hồ sơ điều trị
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {selected === 're-examination' && (
          <div className="doctor-content">
            <h2 className="doctor-table-title">Đặt lịch tái khám</h2>
            {reExamMessage && !showSuccessPopup && (
              <div className={reExamMessage.includes('thành công') ? 'success-message' : 'error-message'} style={{marginBottom: '20px'}}>
                {reExamMessage}
              </div>
            )}
            
            {loadingPatients && (
              <div className="loading-dropdown" style={{margin: '20px 0'}}>
                <i className="fas fa-spinner fa-spin"></i> Đang tải danh sách bệnh nhân...
              </div>
            )}
            
            {patientsError && (
              <div className="error-message" style={{margin: '20px 0'}}>
                {patientsError}
              </div>
            )}
            
            <form onSubmit={handleReExamSubmit} className="labtest-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="PatientID">Tên bệnh nhân <span className="required">*</span></label>
                  <select
                    id="PatientID"
                    name="PatientID"
                    value={reExamForm.PatientID}
                    onChange={(e) => {
                      const selectedPatient = patients.find(p => 
                        p.Patient?.PatientID === e.target.value
                      );
                      const patientName = selectedPatient?.PatientFullname || 
                                         selectedPatient?.Patient?.User?.Fullname || 
                                         patientNameMap[e.target.value] ||
                                         e.target.value;
                      setSelectedPatientName(patientName);
                      handleReExamFormChange(e);
                    }}
                    required
                  >
                    <option value="">Chọn bệnh nhân</option>
                    {patients.map((p, idx) => (
                      <option key={p.Patient?.PatientID || idx} value={p.Patient?.PatientID}>
                        {p.PatientFullname || p.Patient?.User?.Fullname || patientNameMap[p.Patient?.PatientID] || p.Patient?.PatientID}
                      </option>
                    ))}
                    {Object.keys(patientNameMap).map(id => (
                      !patients.some(p => p.Patient?.PatientID === id) && 
                      <option key={id} value={id}>
                        {patientNameMap[id]} - {id}
                      </option>
                    ))}
                  </select>
                  {reExamForm.PatientID && (
                    <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                      Mã bệnh nhân: {reExamForm.PatientID}
                    </small>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="DoctorID">Bác sĩ phụ trách <span className="required">*</span></label>
                  <input
                    type="text"
                    value={currentUser?.name || 'Không xác định'}
                    disabled
                    style={{ background: '#f7fafd', fontWeight: 'bold' }}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group" style={{width: '100%'}}>
                  <label htmlFor="BookingType">Loại dịch vụ</label>
                  <input
                    type="text"
                    id="BookingType"
                    value="Tái khám"
                    disabled
                    style={{ background: '#f7fafd', fontWeight: 'bold' }}
                  />
                  <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                    Dịch vụ mặc định cho tái khám
                  </small>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="BookDate">Ngày khám <span className="required">*</span></label>
                  <input
                    type="date"
                    id="BookDate"
                    name="BookDate"
                    value={reExamForm.BookDate}
                    onChange={handleReExamFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="BookTime">Giờ khám <span className="required">*</span></label>
                  <input
                    type="time"
                    id="BookTime"
                    name="BookTime"
                    value={reExamForm.BookTime}
                    onChange={handleReExamFormChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group" style={{width: '100%'}}>
                  <label htmlFor="Note">Ghi chú</label>
                  <textarea
                    id="Note"
                    name="Note"
                    value={reExamForm.Note}
                    onChange={handleReExamFormChange}
                    placeholder="Nhập ghi chú về lý do tái khám"
                    rows="3"
                    style={{width: '100%'}}
                  />
                </div>
              </div>
              
              <div className="form-actions" style={{marginTop: '20px'}}>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={reExamLoading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: reExamLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {reExamLoading ? 'Đang xử lý...' : 'Đặt lịch tái khám'}
                </button>
              </div>
            </form>
          </div>
        )}
        
      </main>
      {showSuccessPopup && (
        <div className="doctor-success-popup-overlay">
          <div className="doctor-success-popup">
            <div className="success-icon"><i className="fas fa-check-circle"></i></div>
            <div className="success-message">{successMessage}</div>
            <button className="success-close-btn" onClick={() => setShowSuccessPopup(false)}>Đóng</button>
          </div>
        </div>
      )}
      {showAppointmentModal && (
        <div className="doctor-cancel-modal">
          <div className="doctor-cancel-container">
            <div className="warning-icon" style={{fontSize:'2.5rem', color:'#ff9800', marginBottom:12}}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 style={{color:'#333', marginBottom:16, textAlign:'center'}}>{modalMessage}</h3>
            <div style={{textAlign:'center'}}>
              <button 
                onClick={() => setShowAppointmentModal(false)} 
                className="doctor-cancel-close" 
                style={{background:'#2196F3', color:'#fff', fontWeight:600}}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
      {showCheckinModal && (
        <div className="doctor-cancel-modal">
          <div className="doctor-cancel-container" style={{maxWidth: 350, textAlign: 'center'}}>
            <div style={{fontSize: '2.5rem', color: '#f44336', marginBottom: 12}}>
              <i className="fas fa-question-circle"></i>
            </div>
            <h3 style={{color:'#333', marginBottom:16, fontWeight:600}}>Bạn xác nhận Check-out lịch hẹn này?</h3>
            <div style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
              <button
                onClick={() => setShowCheckinModal(false)}
                style={{background: '#f44336', color: '#fff', borderRadius: 6, padding: '8px 24px', fontWeight: 600, border: 'none'}}>
                Đóng
              </button>
              <button
                onClick={async () => {
                  setShowCheckinModal(false);
                  await handleCheckin(checkinAppointmentId);
                }}
                style={{background: '#4caf50', color: '#fff', borderRadius: 6, padding: '8px 24px', fontWeight: 600, border: 'none'}}>
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {showLogoutConfirm && (
        <div className="doctor-cancel-modal">
          <div className="doctor-cancel-container" style={{maxWidth: 350, textAlign: 'center'}}>
            <div style={{fontSize: '2.5rem', color: '#f44336', marginBottom: 12}}>
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <h3 style={{color:'#333', marginBottom:16, fontWeight:600}}>Bạn có chắc chắn muốn đăng xuất không?</h3>
            <div style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
              <button
                onClick={cancelLogout}
                style={{background: '#f44336', color: '#fff', borderRadius: 6, padding: '8px 24px', fontWeight: 600, border: 'none'}}>
                Hủy
              </button>
              <button
                onClick={confirmLogout}
                style={{background: '#4caf50', color: '#fff', borderRadius: 6, padding: '8px 24px', fontWeight: 600, border: 'none'}}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Popup for Re-examination */}
      {showSuccessPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px',
              fontSize: '30px',
              color: 'white'
            }}>
              ✓
            </div>
            <h3 style={{
              margin: '0 0 15px 0',
              color: '#333',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              {successMessage}
            </h3>
            <button
              onClick={() => setShowSuccessPopup(false)}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;

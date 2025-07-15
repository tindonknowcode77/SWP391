import React, { useState, useEffect } from 'react';
import '../styles/Doctor.css';
import '../styles/TreatmentPlan.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {bacsilaydanhsachbenhnhan} from '../api/auth';
import {bacsilaytreatmentplan} from '../api/auth';
import { cancelAppointment } from '../api/auth';
import { doctorcheckout } from '../api/auth';




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

  useEffect(() => {
    if (selected === 'appointments') {
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
    }
  }, [selected]);

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
    await logout();
    navigate('/login');
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
        <div className="sidebar-user-row">
          <span className="sidebar-user">{currentUser?.name || 'Bác sĩ'}</span>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Đăng xuất" aria-label="Đăng xuất">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <ul className="sidebar-menu">
          <li
            className={selected === 'appointments' ? 'active' : ''}
            onClick={() => setSelected('appointments')}
          >
            Lịch hẹn của tôi
          </li>
          <li
            className={selected === 'all-appointments' ? 'active' : ''}
            onClick={() => setSelected('all-appointments')}
          >
            Tất cả lịch hẹn
          </li>
          <li
            className={selected === 'cancelled-appointments' ? 'active' : ''}
            onClick={() => setSelected('cancelled-appointments')}
          >
            Hủy lịch hẹn 
          </li>
          <li
            className={selected === 'patients' ? 'active' : ''}
            onClick={() => setSelected('patients')}
          >
            Danh sách hồ sơ điều trị
          </li>
          <li
            className={selected === 'my-patients' ? 'active' : ''}
            onClick={() => setSelected('my-patients')}
          >
            Bệnh nhân của tôi
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
    </div>
  );
};

export default Doctor;

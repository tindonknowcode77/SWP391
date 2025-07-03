import React, { useState, useEffect } from 'react';
import '../styles/Doctor.css';
import '../styles/TreatmentPlan.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {xemdanhsachlichduocduyet} from '../api/auth';
import {bacsilaytreatmentplan} from '../api/auth';
import {bacsilaydanhsachbenhnhan} from '../api/auth';
import { cancelAppointment } from '../api/auth';
// import { PrescriptionByTreatmentPlan } from '../api/auth';



const Doctor = () => {
  const [selected, setSelected] = useState('appointments');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (selected === 'appointments') {
      setLoading(true);
      setError(null);
      xemdanhsachlichduocduyet()
        .then((data) => {
          setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoading(false);
        })
        .catch((err) => {
          setError('Không thể tải danh sách lịch hẹn');
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
        xemdanhsachlichduocduyet()
          .then((data) => {
            setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          });
      });
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
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item, idx ) => (
                      <tr key={item.BookID || idx}>
                        <td>{item.BookID}</td>
                        <td>{item.PatientFullname}</td>
                        <td>{item.BookingType}</td>
                        <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                        <td>{item.Patient?.Phone || ''}</td>
                        <td className={
                          item.Status === 'Đang chờ'
                            ? 'status-badge-2 status-pending-3'
                            : item.Status === 'Đã xác nhận'
                            ? 'status-badge-2 status-confirmed-3'
                            : item.Status === 'Rejected'
                            ? 'status-badge-2 status-rejected-3'
                            : item.Status === 'Thành công'
                            ? 'status-badge-2 status-thanhcong-3'
                            : 'status-badge-2'}>{item.Status || ''}
                        </td>
                        <td>
                          <button onClick={() => handleCancelClick(item)} style={{color: 'red'}}>Hủy lịch</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {showCancelModal && (
              <div className="modal-overlay">
                <div className="modal-container">
                  <h3>Hủy lịch hẹn</h3>
                  <p>Nhập lý do hủy:</p>
                  <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3} style={{width: '100%'}} />
                  <div style={{marginTop: 16, display: 'flex', gap: 12}}>
                    <button onClick={handleCancelConfirm} style={{background: 'red', color: '#fff', borderRadius: 6, padding: '8px 16px'}}>Xác nhận hủy</button>
                    <button onClick={() => setShowCancelModal(false)} style={{borderRadius: 6, padding: '8px 16px'}}>Hủy bỏ</button>
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
                              <span>Bác sĩ: {plan.DoctorID || '---'}</span>
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
                            style={{marginLeft: 12, background: '#1976d2', color: '#fff', borderRadius: 6, fontWeight: 500}}
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
            {!loadingPatients && !patientsError && patients.length === 0 && (
              <div className="no-plan-container">
                <i className="fas fa-users"></i>
                <h2>Chưa có bệnh nhân nào</h2>
                <p>Bạn chưa có bệnh nhân nào trong danh sách.</p>
              </div>
            )}
            {!loadingPatients && !patientsError && patients.length > 0 && (
              <div className="patient-list">
                {patients.map((p) => (
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctor;

import React, { useState, useEffect } from 'react';
import '../styles/Doctor.css';
import '../styles/TreatmentPlan.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {xemdanhsachlichduocduyet} from '../api/auth';
import {bacsilaytreatmentplan} from '../api/auth';



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
            Danh sách bệnh nhân
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
                      <th>Mã bệnh nhân</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Ghi chú</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item, idx) => (
                      <tr key={item.BookID || idx}>
                        <td>{item.BookID}</td>
                        <td>{item.PatientID}</td>
                        <td>{ item.BookingType}</td>
                        <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                        <td>{item.Note || ''}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  {treatmentPlans.map((plan) => (
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
                      </div>
                      <div className="tab-content">
                        <div className="overview-grid">
                          <div className="overview-card">
                            <h3><i className="fas fa-id-card"></i> Mã bệnh nhân</h3>
                            <p>{plan.Patient?.PatientID || '---'}</p>
                          </div>
                          <div className="overview-card">
                            <h3><i className="fas fa-user"></i> UserID</h3>
                            <p>{plan.Patient?.UserID || '---'}</p>
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctor;

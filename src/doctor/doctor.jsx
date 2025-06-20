import React, { useState, useEffect } from 'react';
import '../styles/Doctor.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {xemdanhsachlichduocduyet} from '../api/auth';

const SERVICE_NAME_MAP = {
  'SV000001': 'Khám tổng quát',
  'SV000002': 'Tư vấn điều trị',
  'SV000003': 'Xét nghiệm HIV',
  'SV000004': 'Xét nghiệm CD4',
  'SV000005': 'Tư vấn điều trị ARV',
  'SV000006': 'Xét nghiệm tải lượng virus',
};

const Doctor = () => {
  const [selected, setSelected] = useState('appointments');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
                        <td>{SERVICE_NAME_MAP[item.ServiceID] || item.ServiceID}</td>
                        <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                        <td>{item.Note || ''}</td>
                        <td className={
                            item.Status === 'Đang chờ'
                            ? 'status-badge-2 status-pending-3'
                            : item.Status === 'Đã xác nhận'
                            ? 'status-badge-2 status-confirmed-3'
                            : item.Status === 'Rejected'
                            ? 'status-badge-2 status-rejected-3'
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
            <h2 className="doctor-table-title">Danh sách bệnh nhân</h2>
            <div>Chức năng này dành cho bác sĩ. (Nội dung sẽ được phát triển sau)</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctor;

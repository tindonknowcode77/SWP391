import React, { useState, useEffect } from 'react';
import '../styles/Staff.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { xemdanhsachlichhen } from '../api/auth';

const Staff = () => {
  const [selected, setSelected] = useState('appointments');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  //Const cho API hoặc State nha ba !!! Tách ra cho dễ đọc dễ sửa
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!currentUser || currentUser.role !== 'R004') {
    return (
      <div className="staff-warning-banner" style={{flexDirection: 'column', gap: '18px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <span className="warning-icon">&#9888;</span>
          Không phận sự miễn vào !!!
        </div>
        <button className="staff-warning-btn" onClick={() => navigate('/hospital')}>
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (selected === 'appointments') {
      setLoading(true);
      setError(null);
      xemdanhsachlichhen()
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="staff-container">
      <aside className="staff-sidebar">
        <div className="sidebar-user-row">
          <span className="sidebar-user">{currentUser?.name || 'Nhân viên'}</span>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Đăng xuất" aria-label="Đăng xuất">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <ul className="sidebar-menu">
          <li
            className={selected === 'appointments' ? 'active' : ''}
            onClick={() => setSelected('appointments')}
          >
            Xem danh sách lịch hẹn
          </li>
          <li
            className={selected === 'confirm' ? 'active' : ''}
            onClick={() => setSelected('confirm')}
          >
            Xác nhận đặt lịch
          </li>
        </ul>
      </aside>
      <main className="staff-main">
        {selected === 'appointments' && (
          <div className="staff-content">
            <h2 className="staff-table-title">Danh sách lịch hẹn</h2>
            {loading && <div>Đang tải...</div>}
            {error && <div style={{color: 'red'}}>{error}</div>}
            {!loading && !error && appointments.length === 0 && <div>Không có lịch hẹn nào.</div>}
            {!loading && !error && appointments.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Mã bệnh nhân</th>
                      <th>Mã bác sĩ</th>
                      <th>Mã dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item, idx) => (
                      <tr key={item.BookID || idx}>
                        <td>{item.BookID}</td>
                        <td>{item.PatientID}</td>
                        <td>{item.DoctorID}</td>
                        <td>{item.ServiceID}</td>
                        <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                        <td>{item.Note || ''}</td>
                        <td className={item.Status === 'Đang chờ'? 'status-badge status-pending': item.Status === 'Đã xác nhận'? 'status-badge status-confirmed': 'status-badge'
                          }
                        >
                          {item.Status || ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selected === 'confirm' && (
          <div className="staff-content">
            <h2>Xác nhận đặt lịch</h2>
            {/* Nội dung xác nhận đặt lịch sẽ hiển thị ở đây */}
          </div>
        )}
      </main>
    </div>
  );
};

export default Staff;

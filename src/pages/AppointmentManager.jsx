import React, { useState, useEffect } from 'react';
import '../styles/AppointmentManager.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {datlichkham} from '../api/auth';
import Navbar from '../components/Navbar';
import { huylichthanhcong } from  '../api/auth';
import { patientcheckin } from '../api/auth';
import { doctorcheckout } from '../api/auth';

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
      datlichkham()
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

  if (!currentUser || currentUser.role !== 'R005') {
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

  const handleCancelAppointment = async (bookId) => {
    try {
      await huylichthanhcong(bookId, "Người dùng tự hủy ");
      setAppointments(prev =>
        prev.map(app =>
          app.BookID === bookId ? { ...app, Status: 'Đã hủy' } : app
        )
      );
      alert('Hủy lịch thành công!');
    } catch (error) {
      alert('Hủy lịch thất bại!');
    }
  };

  // Hàm check-in cho bệnh nhân
  const handleCheckIn = async (bookId) => {
    try {
      await patientcheckin(bookId);
      setAppointments(prev =>
        prev.map(app =>
          app.BookID === bookId ? { ...app, Status: 'Đã checkin' } : app
        )
      );
      alert('✅ Check-in thành công!');
    } catch (error) {
      alert('❌ Check-in thất bại: ' + (error.response?.data || error.message));
    }
  };

  // Hàm kiểm tra ngày hôm nay
  const isToday = (bookDate) => {
    const today = new Date().toISOString().split('T')[0];
    const book = new Date(bookDate).toISOString().split('T')[0];
    return book === today;
  };

  // Sắp xếp lịch hẹn: chưa hủy/thành công lên trên, đã hủy/rejected xuống dưới
  const sortedAppointments = [...appointments].sort((a, b) => {
    const isCancelledA = a.Status === 'Đã hủy' || a.Status === 'rejected';
    const isCancelledB = b.Status === 'Đã hủy' || b.Status === 'rejected';
    if (isCancelledA === isCancelledB) return 0;
    return isCancelledA ? 1 : -1;
  });

  return (
    <>
      <Navbar />
      <div className="doctor-container-1">
        <aside className="doctor-sidebar">
          <ul className="sidebar-menu">
            <li
              className={selected === 'appointments' ? 'active' : ''}
              onClick={() => setSelected('appointments')}
            >
              Danh Sách Lịch Hẹn Đã Xác Nhận
            </li>
            <li
              className={selected === 'patients' ? 'active' : ''}
              onClick={() => setSelected('patients')}
            >
             Hủy Lịch Khám
            </li>
            {/* <li
              className={selected === 'patients' ? 'active' : ''}
              onClick={() => setSelected('patients')}
            >
            Checkin
            </li> */}
          </ul>
        </aside>
        <main className="doctor-main">
          {selected === 'appointments' && (
            <div className="doctor-content">
              <h2 className="doctor-table-title">Lịch Hẹn Của Tôi</h2>
              {loading && <div>Đang tải...</div>}
              {error && <div style={{color: 'red'}}>{error}</div>}
              {!loading && !error && appointments.length === 0 && <div>Chưa có lịch hẹn nào.</div>}
              {!loading && !error && appointments.length > 0 && (
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
                      {sortedAppointments
                        .filter(item => item.Status === 'Đã khám' || item.Status === 'Đã xác nhận')
                        .map((item, idx) => (
                          <tr key={item.BookID || idx}>
                            <td>{item.BookID}</td>
                            <td>{item.PatientFullname}</td>
                            <td>{ item.BookingType}</td>
                            <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                            <td>{item.Note || ''}</td>
                            <td className={
                                item.Status === 'Đã khám'
                                ? 'status-badge-2 status-pending-3'
                                : item.Status === 'Đã xác nhận'
                                ? 'status-badge-2 status-confirmed-3'
                                : item.Status === 'rejected'
                                ? 'status-badge-2 status-rejected-3'
                                : item.Status === 'Đã hủy'
                                ? 'status-badge-2 status-cancelled-3'
                                : item.Status === 'Thành công'
                                ? 'status-badge-2 status-thanhcong-3'
                                : 'status-badge-2'
                              }>
                              {item.Status || ''}

                              {/* Nút Check-in cho lịch hẹn hôm nay */}
                              {isToday(item.BookDate) && item.Status === 'Thành công' && (
                                <button
                                  style={{
                                    marginLeft: 8,
                                    padding: '2px 8px',
                                    background: '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleCheckIn(item.BookID)}
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
          {selected === 'patients' && (
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
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAppointments
                        .filter(item => item.Status === 'Thành công' || item.Status === 'Đã hủy')
                        .map((item, idx) => (
                          <tr key={item.BookID || idx}>
                            <td>{item.BookID}</td>
                            <td>{item.PatientFullname}</td>
                            <td>{ item.BookingType}</td>
                            <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                            <td>{item.Note || ''}</td>
                            <td className={
                                item.Status === 'Đã khám'
                                ? 'status-badge-2 status-pending-3'
                                : item.Status === 'Đã xác nhận'
                                ? 'status-badge-2 status-confirmed-3'
                                : item.Status === 'rejected'
                                ? 'status-badge-2 status-rejected-3'
                                : item.Status === 'Đã hủy'
                                ? 'status-badge-2 status-cancelled-3'
                                : item.Status === 'Thành công'
                                ? 'status-badge-2 status-thanhcong-3'
                                : 'status-badge-2'
                              }>
                              {item.Status || ''}

                              {/* Nút Hủy lịch */}
                              {(item.Status !== 'Đã hủy' && item.Status !== 'rejected' && item.Status !== 'Đã xác nhận') && (
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
                                  onClick={() => handleCancelAppointment(item.BookID)}
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
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Doctor;

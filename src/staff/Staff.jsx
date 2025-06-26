import React, { useState, useEffect, useRef } from 'react';
import '../styles/Staff.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { xemdanhsachlichhendathanhcong } from '../api/auth';
import {xacnhanlich} from '../api/auth';
import { xemdanhsachlichhendahuy } from '../api/auth';
import { xemdanhsachlichhendone } from '../api/auth';
import { xemdanhsachlichhendahoanthanh } from '../api/auth';




const DOCTOR_NAME_MAP = {
  'DT000001': 'Nguyễn Văn A',
  'DT000002': 'Nguyễn Văn B',
};

const Staff = () => {
  const [selected, setSelected] = useState('all');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [allAppointments, setAllAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCancelled, setLoadingCancelled] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [errorAll, setErrorAll] = useState(null);
  const [error, setError] = useState(null);
  const [errorCancelled, setErrorCancelled] = useState(null);
  const [errorCompleted, setErrorCompleted] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmingBookID, setConfirmingBookID] = useState(null);
  const [statusFilterAll, setStatusFilterAll] = useState('Tất cả');
  const [statusFilterSuccess, setStatusFilterSuccess] = useState('Tất cả');
  const [statusFilterCancelled, setStatusFilterCancelled] = useState('Tất cả');
  const [statusFilterCompleted, setStatusFilterCompleted] = useState('Tất cả');
  const [showStatusDropdown, setShowStatusDropdown] = useState('');
  const dropdownRef = useRef();

  const statusOptions = ['Tất cả', 'Đang chờ', 'Đã xác nhận', 'Thành công', 'Đã hủy'];

  useEffect(() => {
    if (selected === 'all') {
      setLoadingAll(true);
      setErrorAll(null);
      xemdanhsachlichhendone()
        .then((data) => {
          setAllAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoadingAll(false);
        })
        .catch((err) => {
          setErrorAll('Không thể tải danh sách tất cả lịch hẹn');
          setLoadingAll(false);
        });
    } else if (selected === 'appointments') {
      setLoading(true);
      setError(null);
      xemdanhsachlichhendathanhcong()
        .then((data) => {
          setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoading(false);
        })
        .catch((err) => {
          setError('Không thể tải danh sách lịch hẹn');
          setLoading(false);
        });
    } else if (selected === 'cancelled') {
      setLoadingCancelled(true);
      setErrorCancelled(null);
      xemdanhsachlichhendahuy()
        .then((data) => {
          setCancelledAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoadingCancelled(false);
        })
        .catch((err) => {
          setErrorCancelled('Không thể tải danh sách lịch hẹn đã hủy');
          setLoadingCancelled(false);
        });
    } else if (selected === 'completed') {
      setLoadingCompleted(true);
      setErrorCompleted(null);
      xemdanhsachlichhendahoanthanh()
        .then((data) => {
          setCompletedAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoadingCompleted(false);
        })
        .catch((err) => {
          setErrorCompleted('Không thể tải danh sách lịch hẹn đã hoàn thành');
          setLoadingCompleted(false);
        });
    }
  }, [selected]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown('');
      }
    }
    if (showStatusDropdown === 'all') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleConfirmClick = (bookID) => {
    setConfirmingBookID(bookID);
    setShowConfirmPopup(true);
  };

  const handleConfirmYes = async () => {
    if (confirmingBookID) {
      try {
        await xacnhanlich(confirmingBookID);
        setShowConfirmPopup(false);
        setConfirmingBookID(null);
        setLoading(true);
        setError(null);
        xemdanhsachlichhendathanhcong()
          .then((data) => {
            setAppointments(Array.isArray(data) ? data : (data?.appointments || []));
            setLoading(false);
          })
          .catch((err) => {
            setError('Không thể tải danh sách lịch hẹn');
            setLoading(false);
          });
      } catch (e) {
        alert('Xác nhận lịch thất bại!');
      }
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmPopup(false);
    setConfirmingBookID(null);
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
            className={selected === 'all' ? 'active' : ''}
            onClick={() => setSelected('all')}
          >
            Xem Tất Cả Lịch Hẹn
          </li>
          <li
            className={selected === 'appointments' ? 'active' : ''}
            onClick={() => setSelected('appointments')}
          >
            Xem Danh Sách Lịch Hẹn Đã Thành Công  
          </li>
          <li
            className={selected === 'cancelled' ? 'active' : ''}
            onClick={() => setSelected('cancelled')}
          >
            Xem Danh Sách Lịch Hẹn Đã Hủy
          </li>
          <li
            className={selected === 'completed' ? 'active' : ''}
            onClick={() => setSelected('completed')}
          >
            Danh Sách Lịch Hẹn Đã Hoàn Thành
          </li>
        </ul>
      </aside>
      <main className="staff-main">
        {selected === 'all' && (
          <div className="staff-content">
            <h2 className="staff-table-title">Tất Cả Lịch Hẹn</h2>
            {loadingAll && <div>Đang tải...</div>}
            {errorAll && <div style={{color: 'red'}}>{errorAll}</div>}
            {!loadingAll && !errorAll && allAppointments.length === 0 && <div>Không có lịch hẹn nào.</div>}
            {!loadingAll && !errorAll && allAppointments.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Mã bệnh nhân</th>
                      <th>Tên bác sĩ</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Ghi chú</th>
                      <th style={{position: 'relative', cursor: 'pointer'}} onClick={() => setShowStatusDropdown(showStatusDropdown === 'all' ? '' : 'all')}>
                        Trạng thái
                        <span style={{marginLeft: 6, fontSize: 12}}>▼</span>
                        {showStatusDropdown === 'all' && (
                          <div
                            ref={dropdownRef}
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              background: '#fff',
                              border: '1px solid #ccc',
                              zIndex: 10,
                              minWidth: 120,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                          >
                            {statusOptions.map(opt => (
                              <div
                                key={opt}
                                style={{
                                  padding: 8,
                                  cursor: 'pointer',
                                  background: statusFilterAll === opt ? '#eee' : '#fff',
                                  color: '#222'
                                }}
                                onClick={e => {
                                  e.stopPropagation();
                                  setStatusFilterAll(opt);
                                  setShowStatusDropdown('');
                                }}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAppointments.filter(item => 
                      statusFilterAll === 'Tất cả' ||
                      (item.Status && item.Status.trim().toLowerCase() === statusFilterAll.trim().toLowerCase())
                    ).map((item, idx) => (
                      <tr key={item.BookID || idx}>
                        <td>{item.BookID}</td>
                        <td>{item.PatientID}</td>
                        <td>{DOCTOR_NAME_MAP[item.DoctorID] || item.DoctorID}</td>
                        <td>{item.BookingType || item.BookingType}</td>
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
                            ? 'status-badge-2 status-successful-3'
                            : item.Status === 'Đã hủy'
                            ? 'status-badge-2 status-cancelled-3'
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
        {selected === 'appointments' && (
          <div className="staff-content">
            <h2 className="staff-table-title">Danh Sách Lịch Hẹn Đã Thành Công</h2>
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
                      <th>Tên bác sĩ</th>
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
                        <td>{DOCTOR_NAME_MAP[item.DoctorID] || item.DoctorID}</td>
                        <td>{item.BookingType || item.BookingType}</td>
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
                            ? 'status-badge-2 status-successful-3'
                            : item.Status === 'Đã hủy'
                            ? 'status-badge-2 status-cancelled-3'
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
        {selected === 'cancelled' && (
          <div className="staff-content">
            <h2 className="staff-table-title">Danh Sách Lịch Hẹn Đã Hủy</h2>
            {loadingCancelled && <div>Đang tải...</div>}
            {errorCancelled && <div style={{color: 'red'}}>{errorCancelled}</div>}
            {!loadingCancelled && !errorCancelled && cancelledAppointments.length === 0 && <div>Không có lịch hẹn nào.</div>}
            {!loadingCancelled && !errorCancelled && cancelledAppointments.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Mã bệnh nhân</th>
                      <th>Tên bác sĩ</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Ghi chú</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancelledAppointments.map((item, idx) => (
                      <tr key={item.BookID || idx}>
                        <td>{item.BookID}</td>
                        <td>{item.PatientID}</td>
                        <td>{DOCTOR_NAME_MAP[item.DoctorID] || item.DoctorID}</td>
                        <td>{item.BookingType || item.BookingType}</td>
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
                            ? 'status-badge-2 status-successful-3'
                            : item.Status === 'Đã hủy'
                            ? 'status-badge-2 status-cancelled-3'
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
        {selected === 'completed' && (
          <div className="staff-content">
            <h2 className="staff-table-title">Danh Sách Lịch Hẹn Đã Hoàn Thành</h2>
            {loadingCompleted && <div>Đang tải...</div>}
            {errorCompleted && <div style={{color: 'red'}}>{errorCompleted}</div>}
            {!loadingCompleted && !errorCompleted && completedAppointments.length === 0 && <div>Không có lịch hẹn nào.</div>}
            {!loadingCompleted && !errorCompleted && completedAppointments.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Mã bệnh nhân</th>
                      <th>Tên bác sĩ</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Ghi chú</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedAppointments.map((item, idx) => (
                      <tr key={item.BookID || idx}>
                        <td>{item.BookID}</td>
                        <td>{item.PatientID}</td>
                        <td>{DOCTOR_NAME_MAP[item.DoctorID] || item.DoctorID}</td>
                        <td>{item.BookingType || item.BookingType}</td>
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
                            ? 'status-badge-2 status-successful-3'
                            : item.Status === 'Đã hủy'
                            ? 'status-badge-2 status-cancelled-3'
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
      </main>
    </div>
  );
};

export default Staff;

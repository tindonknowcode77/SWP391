import React, { useState, useEffect } from 'react';
import '../styles/Staff.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { xemdanhsachlichhen } from '../api/auth';
import {xacnhanlich} from '../api/auth';
import { xemdanhsachlichhenpending } from '../api/auth';
import { huylich } from '../api/auth';

const SERVICE_NAME_MAP = {
  'SV000001': 'Khám tổng quát',
  'SV000002': 'Tư vấn điều trị',
  'SV000003': 'Xét nghiệm HIV',
  'SV000004': 'Xét nghiệm CD4',
  'SV000005': 'Tư vấn điều trị ARV',
  'SV000006': 'Xét nghiệm tải lượng virus',
};

const DOCTOR_NAME_MAP = {
  'DT000001': 'Nguyễn Văn A',
  'DT000002': 'Nguyễn Văn B',
};

const Staff = () => {
  const [selected, setSelected] = useState('appointments');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmingBookID, setConfirmingBookID] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [errorPending, setErrorPending] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancellingBookID, setCancellingBookID] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

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
    } else if (selected === 'confirm') {
      setLoadingPending(true);
      setErrorPending(null);
      xemdanhsachlichhenpending()
        .then((data) => {
          setPendingAppointments(Array.isArray(data) ? data : (data?.appointments || []));
          setLoadingPending(false);
        })
        .catch((err) => {
          setErrorPending('Không thể tải danh sách lịch hẹn chờ xác nhận');
          setLoadingPending(false);
        });
    }
  }, [selected]);

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
        setLoadingPending(true);
        setErrorPending(null);
        xemdanhsachlichhenpending()
          .then((data) => {
            setPendingAppointments(Array.isArray(data) ? data : (data?.appointments || []));
            setLoadingPending(false);
          })
          .catch((err) => {
            setErrorPending('Không thể tải danh sách lịch hẹn chờ xác nhận');
            setLoadingPending(false);
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

  const handleCancelClick = (bookID) => {
    setCancellingBookID(bookID);
    setShowCancelPopup(true);
    setCancelReason('');
  };

  const handleCancelYes = async () => {
    if (cancellingBookID && cancelReason.trim()) {
      try {
        await huylich(cancellingBookID, cancelReason);
        setShowCancelPopup(false);
        setCancellingBookID(null);
        setCancelReason('');
        setLoadingPending(true);
        setErrorPending(null);
        xemdanhsachlichhenpending()
          .then((data) => {
            setPendingAppointments(Array.isArray(data) ? data : (data?.appointments || []));
            setLoadingPending(false);
          })
          .catch((err) => {
            setErrorPending('Không thể tải danh sách lịch hẹn chờ xác nhận');
            setLoadingPending(false);
          });
      } catch (e) {
        alert('Hủy lịch thất bại!');
      }
    }
  };

  const handleCancelCancel = () => {
    setShowCancelPopup(false);
    setCancellingBookID(null);
    setCancelReason('');
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
        {selected === 'confirm' && (
          <div className="staff-content">
            <h2 className="staff-table-title" >Xác nhận đặt lịch</h2>
            {loadingPending && <div>Đang tải...</div>}
            {errorPending && <div style={{color: 'red'}}>{errorPending}</div>}
            {!loadingPending && !errorPending && pendingAppointments.length === 0 && <div>Không có lịch hẹn nào.</div>}
            {!loadingPending && !errorPending && pendingAppointments.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Mã bệnh nhân</th>
                      <th>Tên bác sĩ</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Xác nhận/Hủy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAppointments.map((item, idx) => (
                      <tr key={item.BookID || idx}>
                        <td>{item.BookID}</td>
                        <td>{item.PatientID}</td>
                        <td>{DOCTOR_NAME_MAP[item.DoctorID] || item.DoctorID}</td>
                        <td>{SERVICE_NAME_MAP[item.ServiceID] || item.ServiceID}</td>
                        <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : ''}</td>
                        <td className={item.Status === 'Đang chờ'? 'status-badge-1 status-pending-1': item.Status === 'Đã xác nhận'? 'status-badge-1 status-confirmed-1': 'status-badge-1'}>
                          {item.Status || ''}
                        </td>
                        <td className="action-buttons-col">
                          <button
                            title="Xác nhận"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'green', fontSize: 18 }}
                            onClick={() => handleConfirmClick(item.BookID)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            title="Xóa lịch hẹn"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontSize: 18 }}
                            onClick={() => handleCancelClick(item.BookID)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {showConfirmPopup && (
              <div className="popup-overlay">
                <div className="popup-confirm">
                  <div className="popup-title">Chắc chắn xác nhận lịch?</div>
                  <div className="popup-actions">
                    <button className="popup-btn-yes" onClick={handleConfirmYes}>Yes</button>
                    <button className="popup-btn-cancel" onClick={handleConfirmCancel}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {showCancelPopup && (
              <div className="popup-overlay">
                <div className="popup-confirm">
                  <div className="popup-title">Bạn chắc chắn muốn hủy lịch?</div>
                  <textarea
                    className="popup-reason-box"
                    placeholder="Lý do hủy..."
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    rows={3}
                    style={{width: '100%', marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', padding: 8, fontSize: '1rem'}}
                  />
                  <div className="popup-actions">
                    <button className="popup-btn-yes" onClick={handleCancelYes} disabled={!cancelReason.trim()}>Yes</button>
                    <button className="popup-btn-cancel" onClick={handleCancelCancel}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Staff;

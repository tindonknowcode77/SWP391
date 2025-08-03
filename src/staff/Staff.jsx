import React, { useState, useEffect, useRef } from 'react';
import '../styles/Staff.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { xemdanhsachlichhendathanhcong } from '../api/auth';
import {xacnhanlich} from '../api/auth';
import { xemdanhsachlichhendahuy } from '../api/auth';
import { xemdanhsachlichhendone } from '../api/auth';
import { xemdanhsachlichhendahoanthanh } from '../api/auth';
import {getAllLabTests } from '../api/auth';
import {getLabTestById } from '../api/auth';
import {addLabTest } from '../api/auth';
import {updateLabTest } from '../api/auth';
import {deleteLabTest } from '../api/auth';
import {getLabTestBookings } from '../api/auth';







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
  const [labTests, setLabTests] = useState([]);
  const [loadingLabTests, setLoadingLabTests] = useState(false);
  const [errorLabTests, setErrorLabTests] = useState(null);
  const [labTestBookings, setLabTestBookings] = useState([]);
  const [loadingLabTestBookings, setLoadingLabTestBookings] = useState(false);
  const [errorLabTestBookings, setErrorLabTestBookings] = useState(null);
  const [showDeleteLabTestModal, setShowDeleteLabTestModal] = useState(false);
  const [deletingLabTestId, setDeletingLabTestId] = useState(null);
  const [showUpdateLabTestModal, setShowUpdateLabTestModal] = useState(false);
  const [updatingLabTest, setUpdatingLabTest] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});
  const [showAddLabTestModal, setShowAddLabTestModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    RequestID: '',
    TestName: '',
    TestType: '',
    ResultValue: '',
    CD4Initial: '',
    ViralLoadInitial: '',
    Status: '',
    Description: ''
  });
  const [selectedBookingForLabTest, setSelectedBookingForLabTest] = useState(null);
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
    } else if (selected === 'labtestbookings') {
      setLoadingLabTestBookings(true);
      setErrorLabTestBookings(null);
      getLabTestBookings()
        .then((data) => {
          setLabTestBookings(Array.isArray(data) ? data : (data?.bookings || []));
          setLoadingLabTestBookings(false);
        })
        .catch((err) => {
          setErrorLabTestBookings('Không thể tải danh sách lịch xét nghiệm');
          setLoadingLabTestBookings(false);
        });
    } else if (selected === 'labtests') {
      setLoadingLabTests(true);
      setErrorLabTests(null);
      getAllLabTests()
        .then((data) => {
          setLabTests(Array.isArray(data) ? data : (data?.data || []));
          setLoadingLabTests(false);
        })
        .catch((err) => {
          setErrorLabTests('Không thể tải danh sách xét nghiệm');
          setLoadingLabTests(false);
        });
    } else if (selected === 'labtestbookings') {
      setLoadingLabTestBookings(true);
      setErrorLabTestBookings(null);
      getLabTestBookings()
        .then((data) => {
          setLabTestBookings(Array.isArray(data) ? data : (data?.data || []));
          setLoadingLabTestBookings(false);
        })
        .catch((err) => {
          setErrorLabTestBookings('Không thể tải danh sách lịch xét nghiệm');
          setLoadingLabTestBookings(false);
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

  const handleDeleteLabTest = (labTestId) => {
    setDeletingLabTestId(labTestId);
    setShowDeleteLabTestModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingLabTestId) {
      try {
        await deleteLabTest(deletingLabTestId);
        setShowDeleteLabTestModal(false);
        setDeletingLabTestId(null);
        
        // Show success message
        alert('Xóa xét nghiệm thành công!');
        
        // Refresh lab tests data
        setLoadingLabTests(true);
        setErrorLabTests(null);
        getAllLabTests()
          .then((data) => {
            setLabTests(Array.isArray(data) ? data : (data?.data || []));
            setLoadingLabTests(false);
          })
          .catch((err) => {
            setErrorLabTests('Không thể tải danh sách xét nghiệm');
            setLoadingLabTests(false);
          });
      } catch (e) {
        alert('Xóa xét nghiệm thất bại!');
        setShowDeleteLabTestModal(false);
        setDeletingLabTestId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteLabTestModal(false);
    setDeletingLabTestId(null);
  };

  const handleUpdateLabTest = (labTest) => {
    setUpdatingLabTest(labTest);
    setUpdateFormData({
      RequestID: labTest.RequestID || '',
      TestName: labTest.TestName || '',
      TestType: labTest.TestType || '',
      ResultValue: labTest.ResultValue || '',
      CD4Initial: labTest.CD4Initial || '',
      ViralLoadInitial: labTest.ViralLoadInitial || '',
      Status: labTest.Status || '',
      Description: labTest.Description || ''
    });
    setShowUpdateLabTestModal(true);
  };

  const handleUpdateConfirm = async () => {
    if (updatingLabTest) {
      try {
        await updateLabTest(updatingLabTest.LabTestID, updateFormData);
        setShowUpdateLabTestModal(false);
        setUpdatingLabTest(null);
        setUpdateFormData({});
        
        // Show success message
        alert('Cập nhật xét nghiệm thành công!');
        
        // Refresh lab tests data
        setLoadingLabTests(true);
        setErrorLabTests(null);
        getAllLabTests()
          .then((data) => {
            setLabTests(Array.isArray(data) ? data : (data?.data || []));
            setLoadingLabTests(false);
          })
          .catch((err) => {
            setErrorLabTests('Không thể tải danh sách xét nghiệm');
            setLoadingLabTests(false);
          });
      } catch (e) {
        alert('Cập nhật xét nghiệm thất bại!');
      }
    }
  };

  const handleUpdateCancel = () => {
    setShowUpdateLabTestModal(false);
    setUpdatingLabTest(null);
    setUpdateFormData({});
  };

  const handleFormChange = (field, value) => {
    setUpdateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFormChange = (field, value) => {
    setAddFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLabTestForBooking = (booking) => {
    setSelectedBookingForLabTest(booking);
    setAddFormData({
      RequestID: booking.BookID || booking.ID || '',
      TestName: '',
      TestType: '',
      ResultValue: '',
      CD4Initial: '',
      ViralLoadInitial: '',
      Status: 'Đang xử lý',
      Description: `Lab test cho lịch hẹn ${booking.BookID || booking.ID}`
    });
    setShowAddLabTestModal(true);
  };

  const handleAddConfirm = async () => {
    try {
      await addLabTest(addFormData);
      setShowAddLabTestModal(false);
      setSelectedBookingForLabTest(null);
      setAddFormData({
        RequestID: '',
        TestName: '',
        TestType: '',
        ResultValue: '',
        CD4Initial: '',
        ViralLoadInitial: '',
        Status: '',
        Description: ''
      });
      
      // Show success message
      alert('Thêm xét nghiệm thành công!');
    } catch (e) {
      alert('Thêm xét nghiệm thất bại!');
    }
  };

  const handleAddCancel = () => {
    setShowAddLabTestModal(false);
    setSelectedBookingForLabTest(null);
    setAddFormData({
      RequestID: '',
      TestName: '',
      TestType: '',
      ResultValue: '',
      CD4Initial: '',
      ViralLoadInitial: '',
      Status: '',
      Description: ''
    });
  };

  return (
    <div className="staff-container">
      <aside className="staff-sidebar">
        <div className="sidebar-user-row">
        <span className="sidebar-user">
          <span style={{ color: '#9de0ad', fontWeight: 'bold' }}>STAFF</span> : {currentUser?.name || 'Nhân viên'}</span>
          <button className="admin-sidebar-logout-btn" onClick={handleLogout} title="Đăng xuất" aria-label="Đăng xuất">
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
          <li
            className={selected === 'labtests' ? 'active' : ''}
            onClick={() => setSelected('labtests')}
          >
            Danh Sách Xét Nghiệm
          </li>
          <li
            className={selected === 'labtestbookings' ? 'active' : ''}
            onClick={() => setSelected('labtestbookings')}
          >
            Lịch Xét Nghiệm
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
                        <td>{item.Patient?.User?.Fullname}</td>
                        <td>{item.Doctor?.User?.Fullname || item.DoctorID}</td>
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
                        <td>{item.Patient?.User?.Fullname}</td>
                        <td>{item.Doctor?.User?.Fullname || item.DoctorID}</td>
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
                        <td>{item.Patient?.User?.Fullname}</td>
                        <td>{item.Doctor?.User?.Fullname || item.DoctorID}</td>
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
                        <td>{item.Patient?.User?.Fullname}</td>
                        <td>{item.Doctor?.User?.Fullname || item.DoctorID}</td>
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
        {selected === 'labtests' && (
          <div className="staff-content">
            <h2 className="staff-table-title">Danh Sách Xét Nghiệm</h2>
            {loadingLabTests && <div>Đang tải...</div>}
            {errorLabTests && <div style={{color: 'red'}}>{errorLabTests}</div>}
            {!loadingLabTests && !errorLabTests && labTests.length === 0 && <div>Không có xét nghiệm nào.</div>}
            {!loadingLabTests && !errorLabTests && labTests.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>ID Xét nghiệm</th>
                      <th>Mã yêu cầu</th>
                      <th>Tên xét nghiệm</th>
                      <th>Loại xét nghiệm</th>
                      <th>Kết quả</th>
                      <th>CD4 ban đầu</th>
                      <th>Viral Load ban đầu</th>
                      <th>Trạng thái</th>
                      <th>Mô tả</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labTests.map((item, idx) => (
                      <tr key={item.LabTestID || idx}>
                        <td>{item.LabTestID}</td>
                        <td>{item.RequestID || ''}</td>
                        <td>{item.TestName || ''}</td>
                        <td>{item.TestType || ''}</td>
                        <td>{item.ResultValue || ''}</td>
                        <td>{item.CD4Initial || ''}</td>
                        <td>{item.ViralLoadInitial || ''}</td>
                        <td className={
                          item.Status === 'In Progress' || item.Status === 'Đang xử lý'
                            ? 'status-badge-2 status-pending-3'
                            : item.Status === 'Completed' || item.Status === 'Hoàn thành'
                            ? 'status-badge-2 status-successful-3'
                            : 'status-badge-2'
                        }>
                          {item.Status === 'In Progress' ? 'Đang xử lý' : 
                           item.Status === 'Completed' ? 'Hoàn thành' : 
                           item.Status || ''}
                        </td>
                        <td>{item.Description || ''}</td>
                        <td>
                          <button
                            onClick={() => handleUpdateLabTest(item)}
                            style={{
                              backgroundColor: '#1890ff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              marginRight: '8px'
                            }}
                            title="Cập nhật xét nghiệm"
                          >
                            Cập nhật
                          </button>
                          <button
                            onClick={() => handleDeleteLabTest(item.LabTestID)}
                            style={{
                              backgroundColor: '#ff4d4f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                            title="Xóa xét nghiệm"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selected === 'labtestbookings' && (
          <div className="staff-content">
            <h2 className="staff-table-title">Lịch Xét Nghiệm</h2>
            <p style={{marginBottom: '16px', color: '#666', fontStyle: 'italic'}}>
              💡 Click vào dòng lịch hẹn để thêm lab test cho lịch đó
            </p>
            {loadingLabTestBookings && <div>Đang tải...</div>}
            {errorLabTestBookings && <div style={{color: 'red'}}>{errorLabTestBookings}</div>}
            {!loadingLabTestBookings && !errorLabTestBookings && labTestBookings.length === 0 && <div>Không có lịch xét nghiệm nào.</div>}
            {!loadingLabTestBookings && !errorLabTestBookings && labTestBookings.length > 0 && (
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Tên bệnh nhân</th>
                      <th>Loại dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labTestBookings.map((item, idx) => (
                      <tr key={item.BookID || item.ID || idx} 
                          style={{cursor: 'pointer'}} 
                          onClick={() => handleAddLabTestForBooking(item)}
                          title="Click để thêm lab test cho lịch này">
                        <td>{item.BookID || item.ID || ''}</td>
                        <td>{item.Patient?.User?.Fullname || item.Fullname || ''}</td>
                        <td>{item.BookingType || 'Xét nghiệm'}</td>
                        <td>{item.BookDate ? new Date(item.BookDate).toLocaleString('vi-VN') : (item.BookingDate ? new Date(item.BookingDate).toLocaleString('vi-VN') : '')}</td>
                        <td className={
                          item.Status === 'Đang chờ' || item.Status === 'Pending'
                            ? 'status-badge-2 status-pending-3'
                            : item.Status === 'Đã xác nhận' || item.Status === 'Confirmed'
                            ? 'status-badge-2 status-confirmed-3'
                            : item.Status === 'Rejected' || item.Status === 'Từ chối'
                            ? 'status-badge-2 status-rejected-3'
                            : item.Status === 'Thành công' || item.Status === 'Completed'
                            ? 'status-badge-2 status-successful-3'
                            : item.Status === 'Đã hủy' || item.Status === 'Cancelled'
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
      
      {/* Add Lab Test Modal for Booking */}
      {showAddLabTestModal && selectedBookingForLabTest && (
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
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: '#333',
              fontSize: '20px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Thêm Lab Test cho Lịch Hẹn #{selectedBookingForLabTest.BookID || selectedBookingForLabTest.ID}
            </h3>
            
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
              <strong>Thông tin lịch hẹn:</strong><br/>
              <span>Bệnh nhân: {selectedBookingForLabTest.Patient?.User?.Fullname || selectedBookingForLabTest.Fullname}</span><br/>
              <span>Thời gian: {selectedBookingForLabTest.BookDate ? new Date(selectedBookingForLabTest.BookDate).toLocaleString('vi-VN') : ''}</span>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Mã yêu cầu: <span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <input
                type="text"
                value={addFormData.RequestID || ''}
                onChange={(e) => handleAddFormChange('RequestID', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Tên xét nghiệm: <span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <input
                type="text"
                value={addFormData.TestName || ''}
                onChange={(e) => handleAddFormChange('TestName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Loại xét nghiệm: <span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <input
                type="text"
                value={addFormData.TestType || ''}
                onChange={(e) => handleAddFormChange('TestType', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Kết quả:
              </label>
              <input
                type="text"
                value={addFormData.ResultValue || ''}
                onChange={(e) => handleAddFormChange('ResultValue', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                CD4 ban đầu:
              </label>
              <input
                type="text"
                value={addFormData.CD4Initial || ''}
                onChange={(e) => handleAddFormChange('CD4Initial', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Viral Load ban đầu:
              </label>
              <input
                type="text"
                value={addFormData.ViralLoadInitial || ''}
                onChange={(e) => handleAddFormChange('ViralLoadInitial', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Trạng thái: <span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <select
                value={addFormData.Status || ''}
                onChange={(e) => handleAddFormChange('Status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Chọn trạng thái</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Mô tả:
              </label>
              <textarea
                value={addFormData.Description || ''}
                onChange={(e) => handleAddFormChange('Description', e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleAddCancel}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleAddConfirm}
                style={{
                  backgroundColor: '#52c41a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Thêm Lab Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lab Test Confirmation Modal */}
      {showDeleteLabTestModal && (
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
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              fontSize: '2rem',
              color: '#ff4d4f',
              marginBottom: '16px'
            }}>
              ⚠️
            </div>
            <h3 style={{
              margin: '0 0 16px 0',
              color: '#333',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Xác nhận xóa xét nghiệm
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              color: '#666',
              fontSize: '14px'
            }}>
              Bạn có chắc chắn muốn xóa xét nghiệm này không? Hành động này không thể hoàn tác.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleDeleteCancel}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Lab Test Modal */}
      {showUpdateLabTestModal && (
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
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: '#333',
              fontSize: '20px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Cập nhật xét nghiệm
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Mã yêu cầu:
              </label>
              <input
                type="text"
                value={updateFormData.RequestID || ''}
                onChange={(e) => handleFormChange('RequestID', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Tên xét nghiệm:
              </label>
              <input
                type="text"
                value={updateFormData.TestName || ''}
                onChange={(e) => handleFormChange('TestName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Loại xét nghiệm:
              </label>
              <input
                type="text"
                value={updateFormData.TestType || ''}
                onChange={(e) => handleFormChange('TestType', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Kết quả:
              </label>
              <input
                type="text"
                value={updateFormData.ResultValue || ''}
                onChange={(e) => handleFormChange('ResultValue', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                CD4 ban đầu:
              </label>
              <input
                type="text"
                value={updateFormData.CD4Initial || ''}
                onChange={(e) => handleFormChange('CD4Initial', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Viral Load ban đầu:
              </label>
              <input
                type="text"
                value={updateFormData.ViralLoadInitial || ''}
                onChange={(e) => handleFormChange('ViralLoadInitial', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Trạng thái:
              </label>
              <select
                value={updateFormData.Status || ''}
                onChange={(e) => handleFormChange('Status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Chọn trạng thái</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                Mô tả:
              </label>
              <textarea
                value={updateFormData.Description || ''}
                onChange={(e) => handleFormChange('Description', e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleUpdateCancel}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateConfirm}
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;

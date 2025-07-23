import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import {tatcacacuser} from '../api/auth';
import { getAllDoctorsManager} from '../api/auth';
import { getAllDoctorWorkSchedules } from '../api/auth';
import {  addDoctor } from '../api/auth';
import { updateDoctor } from '../api/auth';
import {addDoctorWorkSchedule, updateDoctorWorkSchedule} from '../api/auth';
import {addARVProtocol} from '../api/auth';
import { capnhatARVProtocol } from '../api/auth';
import { addStaff } from '../api/auth';
import { updateStaff } from '../api/auth';
import { deleteDoctorWorkScheduleadmin } from '../api/auth';

const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('appointments');

  if (!currentUser || currentUser.role !== 'R001') {
    return (
      <div className="admin-warning-banner" style={{flexDirection: 'column', gap: '18px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <span className="admin-warning-icon">&#9888;</span>
          Không phận sự miễn vào !!!
        </div>
        <button className="admin-warning-btn" onClick={() => navigate('/hospital')}>
          Quay lại trang chủ
        </button>
      </div>
    );
  }
  // Placeholder states for admin data
  
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [addDoctorForm, setAddDoctorForm] = useState({
    FullName: '',
    Password: '',
    Email: '',
    Specialization: '',
    LicenseNumber: '',
    ExperienceYears: '',
    Address: '',
    Image: ''
  });
  const [addDoctorMsg, setAddDoctorMsg] = useState('');
  const [addedDoctor, setAddedDoctor] = useState(null);

  const [selectedTab, setSelectedTab] = useState('adddoctor');
  const [updateDoctorId, setUpdateDoctorId] = useState('');
  const [updateDoctorForm, setUpdateDoctorForm] = useState({
    FullName: '',
    Password: '',
    Email: '',
    Specialization: '',
    LicenseNumber: '',
    ExperienceYears: '',
    Address: '',
    Image: ''
  });
  const [updateDoctorMsg, setUpdateDoctorMsg] = useState('');
  const [updatedDoctor, setUpdatedDoctor] = useState(null);

  const [addScheduleForm, setAddScheduleForm] = useState({
    DoctorID: '',
    SlotID: '',
    DateWork: ''
  });
  const [addScheduleMsg, setAddScheduleMsg] = useState('');
  const [addedSchedule, setAddedSchedule] = useState(null);

  const [updateScheduleId, setUpdateScheduleId] = useState('');
  const [updateScheduleForm, setUpdateScheduleForm] = useState({
    DoctorID: '',
    SlotID: '',
    DateWork: ''
  });
  const [updateScheduleMsg, setUpdateScheduleMsg] = useState('');
  const [updatedSchedule, setUpdatedSchedule] = useState(null);

  const [addARVForm, setAddARVForm] = useState({
    ARVCode: '',
    ARVName: '',
    Description: '',
    AgeRange: '',
    ForGroup: ''
  });
  const [addARVMsg, setAddARVMsg] = useState('');
  const [addedARV, setAddedARV] = useState(null);

  const [updateARVForm, setUpdateARVForm] = useState({
    ARVID: '',
    ARVCode: '',
    ARVName: '',
    Description: '',
    AgeRange: '',
    ForGroup: ''
  });
  const [updateARVMsg, setUpdateARVMsg] = useState('');
  const [updatedARV, setUpdatedARV] = useState(null);

  const [addStaffForm, setAddStaffForm] = useState({
    Fullname: '',
    Email: '',
    Password: '',
    Address: '',
    Image: ''
  });
  const [addStaffMsg, setAddStaffMsg] = useState('');
  const [addedStaff, setAddedStaff] = useState(null);

  const [updateStaffId, setUpdateStaffId] = useState('');
  const [updateStaffForm, setUpdateStaffForm] = useState({
    Fullname: '',
    Email: '',
    Address: '',
    Image: ''
  });
  const [updateStaffMsg, setUpdateStaffMsg] = useState('');
  const [updatedStaff, setUpdatedStaff] = useState(null);

  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);

  const handleAddDoctorChange = (e) => {
    const { name, value } = e.target;
    setAddDoctorForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    setAddDoctorMsg('');
    try {
      const dataToSend = {
        ...addDoctorForm,
        ExperienceYears: Number(addDoctorForm.ExperienceYears)
      };
      await addDoctor(dataToSend);
      setAddDoctorMsg('Thêm bác sĩ thành công!');
      setAddedDoctor(dataToSend);
      setAddDoctorForm({
        FullName: '', Password: '', Email: '', Specialization: '', LicenseNumber: '', ExperienceYears: '', Address: '', Image: ''
      });
    } catch (err) {
      setAddDoctorMsg('Thêm bác sĩ thất bại!');
      setAddedDoctor(null);
    }
  };

  const handleUpdateDoctorChange = (e) => {
    const { name, value } = e.target;
    setUpdateDoctorForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateDoctorSubmit = async (e) => {
    e.preventDefault();
    setUpdateDoctorMsg('');
    if (!updateDoctorId) {
      setUpdateDoctorMsg('Vui lòng nhập ID bác sĩ!');
      return;
    }
    try {
      await updateDoctor(updateDoctorId, {
        ...updateDoctorForm,
        ExperienceYears: Number(updateDoctorForm.ExperienceYears)
      });
      setUpdateDoctorMsg('Cập nhật thông tin bác sĩ thành công!');
      setUpdatedDoctor({
        ...updateDoctorForm,
        ExperienceYears: Number(updateDoctorForm.ExperienceYears)
      });
    } catch (err) {
      setUpdateDoctorMsg('Cập nhật thất bại!');
      setUpdatedDoctor(null);
    }
  };

  const handleAddScheduleChange = (e) => {
    const { name, value } = e.target;
    setAddScheduleForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddScheduleSubmit = async (e) => {
    e.preventDefault();
    setAddScheduleMsg('');
    try {
      await addDoctorWorkSchedule({
        ...addScheduleForm,
        DateWork: new Date(addScheduleForm.DateWork).toISOString()
      });
      setAddScheduleMsg('Thêm lịch làm việc thành công!');
      setAddedSchedule({ ...addScheduleForm });
      setAddScheduleForm({ DoctorID: '', SlotID: '', DateWork: '' });
    } catch (err) {
      setAddScheduleMsg('Thêm lịch làm việc thất bại!');
      setAddedSchedule(null);
    }
  };
  const handleUpdateScheduleChange = (e) => {
    const { name, value } = e.target;
    setUpdateScheduleForm(prev => ({ ...prev, [name]: value }));
  };
  const handleUpdateScheduleSubmit = async (e) => {
    e.preventDefault();
    setUpdateScheduleMsg('');
    if (!updateScheduleId) {
      setUpdateScheduleMsg('Vui lòng nhập ScheduleID!');
      return;
    }
    try {
      await updateDoctorWorkSchedule(updateScheduleId, {
        ...updateScheduleForm,
        DateWork: new Date(updateScheduleForm.DateWork).toISOString()
      });
      setUpdateScheduleMsg('Cập nhật lịch làm việc thành công!');
      setUpdatedSchedule({ ...updateScheduleForm });
    } catch (err) {
      setUpdateScheduleMsg('Cập nhật lịch làm việc thất bại!');
      setUpdatedSchedule(null);
    }
  };

  const handleAddARVChange = (e) => {
    const { name, value } = e.target;
    setAddARVForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddARVSubmit = async (e) => {
    e.preventDefault();
    setAddARVMsg('');
    try {
      await addARVProtocol(addARVForm);
      setAddARVMsg('Thêm ARV thành công!');
      setAddedARV({ ...addARVForm });
      setAddARVForm({ ARVCode: '', ARVName: '', Description: '', AgeRange: '', ForGroup: '' });
    } catch (err) {
      setAddARVMsg('Thêm ARV thất bại!');
      setAddedARV(null);
    }
  };

  const handleUpdateARVChange = (e) => {
    const { name, value } = e.target;
    setUpdateARVForm(prev => ({ ...prev, [name]: value }));
  };
  const handleUpdateARVSubmit = async (e) => {
    e.preventDefault();
    setUpdateARVMsg('');
    try {
      await capnhatARVProtocol(updateARVForm);
      setUpdateARVMsg('Cập nhật ARV thành công!');
      setUpdatedARV({ ...updateARVForm });
    } catch (err) {
      setUpdateARVMsg('Cập nhật ARV thất bại!');
      setUpdatedARV(null);
    }
  };

  const handleAddStaffChange = (e) => {
    const { name, value } = e.target;
    setAddStaffForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    setAddStaffMsg('');
    try {
      await addStaff(addStaffForm);
      setAddStaffMsg('Thêm nhân viên thành công!');
      setAddedStaff({ ...addStaffForm });
      setAddStaffForm({ Fullname: '', Email: '', Password: '', Address: '', Image: '' });
    } catch (err) {
      setAddStaffMsg('Thêm nhân viên thất bại!');
      setAddedStaff(null);
    }
  };
  const handleUpdateStaffChange = (e) => {
    const { name, value } = e.target;
    setUpdateStaffForm(prev => ({ ...prev, [name]: value }));
  };
  const handleUpdateStaffSubmit = async (e) => {
    e.preventDefault();
    setUpdateStaffMsg('');
    if (!updateStaffId) {
      setUpdateStaffMsg('Vui lòng nhập userId!');
      return;
    }
    try {
      await updateStaff(updateStaffId, updateStaffForm);
      setUpdateStaffMsg('Cập nhật nhân viên thành công!');
      setUpdatedStaff({ ...updateStaffForm });
    } catch (err) {
      setUpdateStaffMsg('Cập nhật nhân viên thất bại!');
      setUpdatedStaff(null);
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert('Đăng xuất thất bại!');
    }
    setShowLogoutConfirm(false);
  };
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Lấy danh sách lịch làm việc bác sĩ
  const fetchDoctorSchedules = async () => {
    try {
      const res = await getAllDoctorWorkSchedules();
      setDoctorSchedules(res);
    } catch (err) {
      setDoctorSchedules([]);
    }
  };

  // Lấy danh sách bác sĩ
  const fetchDoctorsList = async () => {
    try {
      const res = await getAllDoctorsManager();
      setDoctorsList(res);
    } catch (err) {
      setDoctorsList([]);
    }
  };

  // Khi chọn tab, load danh sách
  useEffect(() => {
    if (selectedTab === 'doctorschedule') {
      fetchDoctorSchedules();
    }
    if (selectedTab === 'addschedule' || selectedTab === 'updateschedule') {
      fetchDoctorsList();
    }
  }, [selectedTab]);

  // Hàm xử lý xóa
  const handleDeleteSchedule = (schedule) => {
    setScheduleToDelete(schedule);
    setShowDeletePopup(true);
    setDeleteMsg('');
  };
  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    try {
      await deleteDoctorWorkScheduleadmin(scheduleToDelete.ScheduleID);
      setDeleteMsg('Xóa lịch thành công!');
      setShowDeletePopup(false);
      setScheduleToDelete(null);
      fetchDoctorSchedules();
    } catch (err) {
      setDeleteMsg('Xóa lịch thất bại!');
    }
  };
  const cancelDeleteSchedule = () => {
    setShowDeletePopup(false);
    setScheduleToDelete(null);
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-user-row">
          <span className="admin-sidebar-user">{currentUser?.name || 'Admin'}</span>
          <button
            className="admin-sidebar-logout-btn"
            title="Đăng xuất"
            aria-label="Đăng xuất"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <ul className="admin-sidebar-menu">
          <li className={selectedTab === 'adddoctor' ? 'active' : ''} onClick={() => setSelectedTab('adddoctor')}>
            <i className="fas fa-user-md"></i>
            <span>Thêm bác sĩ</span>
          </li>
          <li className={selectedTab === 'updatedoctor' ? 'active' : ''} onClick={() => setSelectedTab('updatedoctor')}>
            <i className="fas fa-user-edit"></i>
            <span>Cập nhật bác sĩ</span>
          </li>
          <li className={selectedTab === 'doctorschedule' ? 'active' : ''} onClick={() => setSelectedTab('doctorschedule')}>
            <i className="fas fa-calendar"></i>
            <span>Lịch khám bác sĩ</span>
          </li>
          <li className={selectedTab === 'addschedule' ? 'active' : ''} onClick={() => setSelectedTab('addschedule')}>
            <i className="fas fa-calendar-plus"></i>
            <span>Thêm lịch làm việc</span>
          </li>
          <li className={selectedTab === 'updateschedule' ? 'active' : ''} onClick={() => setSelectedTab('updateschedule')}>
            <i className="fas fa-calendar-alt"></i>
            <span>Cập nhật lịch làm việc</span>
          </li>
          <li className={selectedTab === 'addarv' ? 'active' : ''} onClick={() => setSelectedTab('addarv')}>
            <i className="fas fa-pills"></i>
            <span>Thêm ARV</span>
          </li>
          <li className={selectedTab === 'updatearv' ? 'active' : ''} onClick={() => setSelectedTab('updatearv')}>
            <i className="fas fa-capsules"></i>
            <span>Cập nhật ARV</span>
          </li>
          <li className={selectedTab === 'addstaff' ? 'active' : ''} onClick={() => setSelectedTab('addstaff')}>
            <i className="fas fa-user-plus"></i>
            <span>Thêm nhân viên</span>
          </li>
          <li className={selectedTab === 'updatestaff' ? 'active' : ''} onClick={() => setSelectedTab('updatestaff')}>
            <i className="fas fa-user-friends"></i>
            <span>Cập nhật nhân viên</span>
          </li>
        
        </ul>
      </aside>
      <main className="admin-main">
        {selectedTab === 'adddoctor' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Thêm bác sĩ mới</h2>
            <form className="add-doctor-form" onSubmit={handleAddDoctorSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>Họ tên</label>
                <input name="FullName" value={addDoctorForm.FullName} onChange={handleAddDoctorChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="Email" value={addDoctorForm.Email} onChange={handleAddDoctorChange} required type="email" />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input name="Password" value={addDoctorForm.Password} onChange={handleAddDoctorChange} required type="password" />
              </div>
              <div className="form-group">
                <label>Chuyên khoa</label>
                <input name="Specialization" value={addDoctorForm.Specialization} onChange={handleAddDoctorChange} required />
              </div>
              <div className="form-group">
                <label>Mã số hành nghề</label>
                <input name="LicenseNumber" value={addDoctorForm.LicenseNumber} onChange={handleAddDoctorChange} required />
              </div>
              <div className="form-group">
                <label>Số năm kinh nghiệm</label>
                <input name="ExperienceYears" value={addDoctorForm.ExperienceYears} onChange={handleAddDoctorChange} required type="number" min="0" />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input name="Address" value={addDoctorForm.Address} onChange={handleAddDoctorChange} required />
              </div>
              <div className="form-group">
                <label>Ảnh (URL)</label>
                <input name="Image" value={addDoctorForm.Image} onChange={handleAddDoctorChange} />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Thêm bác sĩ</button>
              {addDoctorMsg && <div style={{marginTop: 12, color: addDoctorMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{addDoctorMsg}</div>}
              {addedDoctor && addDoctorMsg.includes('thành công') && (
                <div style={{marginTop: 32}}>
                  <h3>Thông tin bác sĩ vừa thêm</h3>
                  <table className="admin-appointments-table">
                    <thead>
                      <tr>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Chuyên khoa</th>
                        <th>Mã số hành nghề</th>
                        <th>Kinh nghiệm (năm)</th>
                        <th>Địa chỉ</th>
                        <th>Ảnh</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{addedDoctor.FullName}</td>
                        <td>{addedDoctor.Email}</td>
                        <td>{addedDoctor.Specialization}</td>
                        <td>{addedDoctor.LicenseNumber}</td>
                        <td>{addedDoctor.ExperienceYears}</td>
                        <td>{addedDoctor.Address}</td>
                        <td>{addedDoctor.Image ? <img src={addedDoctor.Image} alt="doctor" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} /> : 'Không có'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </form>
          </div>
        )}
        {selectedTab === 'updatedoctor' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Cập nhật thông tin bác sĩ</h2>
            <form className="add-doctor-form" onSubmit={handleUpdateDoctorSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>ID bác sĩ</label>
                <input name="doctorId" value={updateDoctorId} onChange={e => setUpdateDoctorId(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Họ tên</label>
                <input name="FullName" value={updateDoctorForm.FullName} onChange={handleUpdateDoctorChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="Email" value={updateDoctorForm.Email} onChange={handleUpdateDoctorChange} type="email" />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input name="Password" value={updateDoctorForm.Password} onChange={handleUpdateDoctorChange} type="password" />
              </div>
              <div className="form-group">
                <label>Chuyên khoa</label>
                <input name="Specialization" value={updateDoctorForm.Specialization} onChange={handleUpdateDoctorChange} />
              </div>
              <div className="form-group">
                <label>Mã số hành nghề</label>
                <input name="LicenseNumber" value={updateDoctorForm.LicenseNumber} onChange={handleUpdateDoctorChange} />
              </div>
              <div className="form-group">
                <label>Số năm kinh nghiệm</label>
                <input name="ExperienceYears" value={updateDoctorForm.ExperienceYears} onChange={handleUpdateDoctorChange} type="number" min="0" />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input name="Address" value={updateDoctorForm.Address} onChange={handleUpdateDoctorChange} />
              </div>
              <div className="form-group">
                <label>Ảnh (URL)</label>
                <input name="Image" value={updateDoctorForm.Image} onChange={handleUpdateDoctorChange} />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Cập nhật bác sĩ</button>
              {updateDoctorMsg && <div style={{marginTop: 12, color: updateDoctorMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{updateDoctorMsg}</div>}
              {updatedDoctor && updateDoctorMsg.includes('thành công') && (
                <div style={{marginTop: 32}}>
                  <h3>Thông tin bác sĩ vừa cập nhật</h3>
                  <table className="admin-appointments-table">
                    <thead>
                      <tr>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Chuyên khoa</th>
                        <th>Mã số hành nghề</th>
                        <th>Kinh nghiệm (năm)</th>
                        <th>Địa chỉ</th>
                        <th>Ảnh</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{updatedDoctor.FullName}</td>
                        <td>{updatedDoctor.Email}</td>
                        <td>{updatedDoctor.Specialization}</td>
                        <td>{updatedDoctor.LicenseNumber}</td>
                        <td>{updatedDoctor.ExperienceYears}</td>
                        <td>{updatedDoctor.Address}</td>
                        <td>{updatedDoctor.Image ? <img src={updatedDoctor.Image} alt="doctor" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} /> : 'Không có'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </form>
          </div>
        )}
        {selectedTab === 'addschedule' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Thêm lịch làm việc bác sĩ</h2>
            <form className="add-doctor-form" onSubmit={handleAddScheduleSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>DoctorID</label>
                <select name="DoctorID" value={addScheduleForm.DoctorID} onChange={handleAddScheduleChange} required>
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctorsList.map(doctor => (
                    <option key={doctor.DoctorId} value={doctor.DoctorId}>
                      {doctor.DoctorId} - {doctor.Fullname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>SlotID</label>
                <input name="SlotID" value={addScheduleForm.SlotID} onChange={handleAddScheduleChange} required />
              </div>
              <div className="form-group">
                <label>DateWork</label>
                <input name="DateWork" value={addScheduleForm.DateWork} onChange={handleAddScheduleChange} required type="datetime-local" />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Thêm lịch</button>
              {addScheduleMsg && <div style={{marginTop: 12, color: addScheduleMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{addScheduleMsg}</div>}
            </form>
            {addedSchedule && addScheduleMsg.includes('thành công') && (
              <div style={{marginTop: 32}}>
                <h3>Thông tin lịch vừa thêm</h3>
                <table className="admin-appointments-table">
                  <thead>
                    <tr>
                      <th>DoctorID</th>
                      <th>SlotID</th>
                      <th>DateWork</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{addedSchedule.DoctorID}</td>
                      <td>{addedSchedule.SlotID}</td>
                      <td>{addedSchedule.DateWork}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'updateschedule' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Cập nhật lịch làm việc bác sĩ</h2>
            <form className="add-doctor-form" onSubmit={handleUpdateScheduleSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>ScheduleID</label>
                <input name="ScheduleID" value={updateScheduleId} onChange={e => setUpdateScheduleId(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>DoctorID</label>
                <select name="DoctorID" value={updateScheduleForm.DoctorID} onChange={handleUpdateScheduleChange} required>
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctorsList.map(doctor => (
                    <option key={doctor.DoctorId} value={doctor.DoctorId}>
                      {doctor.DoctorId} - {doctor.Fullname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>SlotID</label>
                <input name="SlotID" value={updateScheduleForm.SlotID} onChange={handleUpdateScheduleChange} required />
              </div>
              <div className="form-group">
                <label>DateWork</label>
                <input name="DateWork" value={updateScheduleForm.DateWork} onChange={handleUpdateScheduleChange} required type="datetime-local" />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Cập nhật lịch</button>
              {updateScheduleMsg && <div style={{marginTop: 12, color: updateScheduleMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{updateScheduleMsg}</div>}
            </form>
            {updatedSchedule && updateScheduleMsg.includes('thành công') && (
              <div style={{marginTop: 32}}>
                <h3>Thông tin lịch vừa cập nhật</h3>
                <table className="admin-appointments-table">
                  <thead>
                    <tr>
                      <th>DoctorID</th>
                      <th>SlotID</th>
                      <th>DateWork</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{updatedSchedule.DoctorID}</td>
                      <td>{updatedSchedule.SlotID}</td>
                      <td>{updatedSchedule.DateWork}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'addarv' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Thêm ARV Protocol</h2>
            <form className="add-doctor-form" onSubmit={handleAddARVSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>ARVCode</label>
                <input name="ARVCode" value={addARVForm.ARVCode} onChange={handleAddARVChange} required />
              </div>
              <div className="form-group">
                <label>ARVName</label>
                <input name="ARVName" value={addARVForm.ARVName} onChange={handleAddARVChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input name="Description" value={addARVForm.Description} onChange={handleAddARVChange} required />
              </div>
              <div className="form-group">
                <label>AgeRange</label>
                <input name="AgeRange" value={addARVForm.AgeRange} onChange={handleAddARVChange} required />
              </div>
              <div className="form-group">
                <label>ForGroup</label>
                <input name="ForGroup" value={addARVForm.ForGroup} onChange={handleAddARVChange} required />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Thêm ARV</button>
              {addARVMsg && <div style={{marginTop: 12, color: addARVMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{addARVMsg}</div>}
            </form>
            {addedARV && addARVMsg.includes('thành công') && (
              <div style={{marginTop: 32}}>
                <h3>Thông tin ARV vừa thêm</h3>
                <table className="admin-appointments-table">
                  <thead>
                    <tr>
                      <th>ARVCode</th>
                      <th>ARVName</th>
                      <th>Description</th>
                      <th>AgeRange</th>
                      <th>ForGroup</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{addedARV.ARVCode}</td>
                      <td>{addedARV.ARVName}</td>
                      <td>{addedARV.Description}</td>
                      <td>{addedARV.AgeRange}</td>
                      <td>{addedARV.ForGroup}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'updatearv' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Cập nhật ARV Protocol</h2>
            <form className="add-doctor-form" onSubmit={handleUpdateARVSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>ARVID</label>
                <input name="ARVID" value={updateARVForm.ARVID} onChange={handleUpdateARVChange} required />
              </div>
              <div className="form-group">
                <label>ARVCode</label>
                <input name="ARVCode" value={updateARVForm.ARVCode} onChange={handleUpdateARVChange} required />
              </div>
              <div className="form-group">
                <label>ARVName</label>
                <input name="ARVName" value={updateARVForm.ARVName} onChange={handleUpdateARVChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input name="Description" value={updateARVForm.Description} onChange={handleUpdateARVChange} required />
              </div>
              <div className="form-group">
                <label>AgeRange</label>
                <input name="AgeRange" value={updateARVForm.AgeRange} onChange={handleUpdateARVChange} required />
              </div>
              <div className="form-group">
                <label>ForGroup</label>
                <input name="ForGroup" value={updateARVForm.ForGroup} onChange={handleUpdateARVChange} required />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Cập nhật ARV</button>
              {updateARVMsg && <div style={{marginTop: 12, color: updateARVMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{updateARVMsg}</div>}
            </form>
            {updatedARV && updateARVMsg.includes('thành công') && (
              <div style={{marginTop: 32}}>
                <h3>Thông tin ARV vừa cập nhật</h3>
                <table className="admin-appointments-table">
                  <thead>
                    <tr>
                      <th>ARVID</th>
                      <th>ARVCode</th>
                      <th>ARVName</th>
                      <th>Description</th>
                      <th>AgeRange</th>
                      <th>ForGroup</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{updatedARV.ARVID}</td>
                      <td>{updatedARV.ARVCode}</td>
                      <td>{updatedARV.ARVName}</td>
                      <td>{updatedARV.Description}</td>
                      <td>{updatedARV.AgeRange}</td>
                      <td>{updatedARV.ForGroup}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'addstaff' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Thêm nhân viên</h2>
            <form className="add-doctor-form" onSubmit={handleAddStaffSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>Họ tên</label>
                <input name="Fullname" value={addStaffForm.Fullname} onChange={handleAddStaffChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="Email" value={addStaffForm.Email} onChange={handleAddStaffChange} required type="email" />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input name="Password" value={addStaffForm.Password} onChange={handleAddStaffChange} required type="password" />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input name="Address" value={addStaffForm.Address} onChange={handleAddStaffChange} required />
              </div>
              <div className="form-group">
                <label>Ảnh (URL)</label>
                <input name="Image" value={addStaffForm.Image} onChange={handleAddStaffChange} />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Thêm nhân viên</button>
              {addStaffMsg && <div style={{marginTop: 12, color: addStaffMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{addStaffMsg}</div>}
            </form>
            {addedStaff && addStaffMsg.includes('thành công') && (
              <div style={{marginTop: 32}}>
                <h3>Thông tin nhân viên vừa thêm</h3>
                <table className="admin-appointments-table">
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Địa chỉ</th>
                      <th>Ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{addedStaff.Fullname}</td>
                      <td>{addedStaff.Email}</td>
                      <td>{addedStaff.Address}</td>
                      <td>{addedStaff.Image ? <img src={addedStaff.Image} alt="staff" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} /> : 'Không có'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'updatestaff' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Cập nhật nhân viên</h2>
            <form className="add-doctor-form" onSubmit={handleUpdateStaffSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>UserId</label>
                <input name="userId" value={updateStaffId} onChange={e => setUpdateStaffId(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Họ tên</label>
                <input name="Fullname" value={updateStaffForm.Fullname} onChange={handleUpdateStaffChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="Email" value={updateStaffForm.Email} onChange={handleUpdateStaffChange} type="email" />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input name="Address" value={updateStaffForm.Address} onChange={handleUpdateStaffChange} />
              </div>
              <div className="form-group">
                <label>Ảnh (URL)</label>
                <input name="Image" value={updateStaffForm.Image} onChange={handleUpdateStaffChange} />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Cập nhật nhân viên</button>
              {updateStaffMsg && <div style={{marginTop: 12, color: updateStaffMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{updateStaffMsg}</div>}
            </form>
            {updatedStaff && updateStaffMsg.includes('thành công') && (
              <div style={{marginTop: 32}}>
                <h3>Thông tin nhân viên vừa cập nhật</h3>
                <table className="admin-appointments-table">
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Địa chỉ</th>
                      <th>Ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{updatedStaff.Fullname}</td>
                      <td>{updatedStaff.Email}</td>
                      <td>{updatedStaff.Address}</td>
                      <td>{updatedStaff.Image ? <img src={updatedStaff.Image} alt="staff" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} /> : 'Không có'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'doctorschedule' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Lịch khám của bác sĩ</h2>
            {deleteMsg && <div style={{color: deleteMsg.includes('thành công') ? '#27ae60' : '#e74c3c', marginBottom: 12}}>{deleteMsg}</div>}
            <table className="admin-appointments-table">
              <thead>
                <tr>
                  <th>ScheduleID</th>
                  <th>DoctorID</th>
                  <th>SlotID</th>
                  <th>DateWork</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {doctorSchedules && doctorSchedules.length > 0 ? doctorSchedules.map(sch => (
                  <tr key={sch.ScheduleID}>
                    <td>{sch.ScheduleID}</td>
                    <td>{sch.DoctorID}</td>
                    <td>{sch.SlotID}</td>
                    <td>{sch.DateWork}</td>
                    <td>
                      <button className="admin-action-btn" style={{background:'#e74c3c'}} onClick={() => handleDeleteSchedule(sch)}>Xóa</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{textAlign:'center'}}>Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
            {/* Popup xác nhận xóa */}
            {showDeletePopup && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <h3>Xác nhận xóa lịch</h3>
                  <p>Bạn có chắc chắn muốn xóa lịch này không?</p>
                  <div style={{marginBottom:8}}>
                    <b>ScheduleID:</b> {scheduleToDelete?.ScheduleID}<br/>
                    <b>DoctorID:</b> {scheduleToDelete?.DoctorID}<br/>
                    <b>SlotID:</b> {scheduleToDelete?.SlotID}<br/>
                    <b>DateWork:</b> {scheduleToDelete?.DateWork}
                  </div>
                  <button className="admin-action-btn" style={{background:'#red', marginRight:8}} onClick={confirmDeleteSchedule}>Xóa</button>
                  <button className="admin-action-btn" onClick={cancelDeleteSchedule}>Hủy</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      {showLogoutConfirm && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Xác nhận đăng xuất</h3>
            <p>Bạn có chắc chắn muốn đăng xuất không?</p>
            <button className="admin-action-btn" style={{background:'#e74c3c', marginRight:8}} onClick={confirmLogout}>Đăng xuất</button>
            <button className="admin-action-btn" onClick={cancelLogout}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

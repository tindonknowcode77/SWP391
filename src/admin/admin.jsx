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
import { addStaff } from '../api/auth';
import { updateStaff } from '../api/auth';
import { deleteDoctorWorkScheduleadmin } from '../api/auth';
import { getAllStaff } from '../api/auth';
import { xoastaff } from '../api/auth';
import { laytatcaquanly } from '../api/auth';
import { themManager } from '../api/auth';
import { layManagerById } from '../api/auth';
import { capnhatManager } from '../api/auth';
import { xoaManager } from '../api/auth';
const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('appointments');

  // if (!currentUser || currentUser.role !== 'R001') {
  //   return (
  //     <div className="admin-warning-banner" style={{flexDirection: 'column', gap: '18px'}}>
  //       <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
  //         <span className="admin-warning-icon">&#9888;</span>
  //         Không phận sự miễn vào !!!
  //       </div>
  //       <button className="admin-warning-btn" onClick={() => navigate('/hospital')}>
  //         Quay lại trang chủ
  //       </button>
  //     </div>
  //   );
  // }
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
  const [showScheduleUpdateModal, setShowScheduleUpdateModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [showDeleteStaffPopup, setShowDeleteStaffPopup] = useState(false);
  const [deleteStaffMsg, setDeleteStaffMsg] = useState('');
  const [showStaffUpdateModal, setShowStaffUpdateModal] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState(null);
  const [showDeleteManagerPopup, setShowDeleteManagerPopup] = useState(false);
  const [deleteManagerMsg, setDeleteManagerMsg] = useState('');
  const [showManagerUpdateModal, setShowManagerUpdateModal] = useState(false);
  const [showDoctorUpdateModal, setShowDoctorUpdateModal] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [managersList, setManagersList] = useState([]);
  
  // State cho form thêm quản lý
  const [addManagerForm, setAddManagerForm] = useState({
    Fullname: '',
    Email: '',
    Password: '',
    Address: '',
    Image: ''
  });
  const [addManagerMsg, setAddManagerMsg] = useState('');
  const [addedManager, setAddedManager] = useState(null);
  
  // State cho form cập nhật quản lý
  const [updateManagerId, setUpdateManagerId] = useState('');
  const [updateManagerForm, setUpdateManagerForm] = useState({
    Fullname: '',
    Email: '',
    Address: '',
    Image: ''
  });
  const [updateManagerMsg, setUpdateManagerMsg] = useState('');
  const [updatedManager, setUpdatedManager] = useState(null);

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
      // Refresh dashboard data
      fetchDashboardData();
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
      
      // Refresh danh sách bác sĩ nếu đang ở tab danh sách
      if (selectedTab === 'alldoctors') {
        fetchDoctorsList();
      }
      
      // Hiển thị thông báo toàn trang
      const successNotification = document.createElement('div');
      successNotification.className = 'global-success-notification';
      successNotification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Đã cập nhật bác sĩ <strong>${updateDoctorForm.FullName}</strong> thành công
      `;
      document.body.appendChild(successNotification);
      
      // Xóa thông báo sau 3 giây
      setTimeout(() => {
        successNotification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(successNotification), 300);
      }, 3000);
      
      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        setShowDoctorUpdateModal(false);
      }, 1500);
      
    } catch (err) {
      setUpdateDoctorMsg('Cập nhật thất bại!');
      setUpdatedDoctor(null);
    }
  };

  const handleAddScheduleChange = (e) => {
    const { name, value } = e.target;
    setAddScheduleForm(prev => ({ ...prev, [name]: value }));
    
    // Xóa thông báo cũ khi người dùng thay đổi dữ liệu
    if (addScheduleMsg) {
      setAddScheduleMsg('');
    }
    if (addedSchedule) {
      setAddedSchedule(null);
    }
  };
  const handleAddScheduleSubmit = async (e) => {
    e.preventDefault();
    setAddScheduleMsg('');
    setAddedSchedule(null);
    
    try {
      const response = await addDoctorWorkSchedule({
        ...addScheduleForm,
        DateWork: new Date(addScheduleForm.DateWork).toISOString()
      });
      
      console.log('Add schedule response:', response);
      
      // Hiển thị thông báo thành công và thông tin lịch vừa thêm
      setAddScheduleMsg('Thêm lịch làm việc thành công!');
      setAddedSchedule({ 
        ...addScheduleForm,
        DateWork: new Date(addScheduleForm.DateWork).toLocaleDateString('vi-VN')
      });
      
      // Reset form
      setAddScheduleForm({ DoctorID: '', SlotID: '', DateWork: '' });
      
      // Refresh danh sách lịch làm việc nếu đang ở tab đó
      if (selectedTab === 'doctorschedule') {
        try {
          await fetchDoctorSchedules();
        } catch (refreshErr) {
          console.log('Không thể refresh danh sách lịch làm việc:', refreshErr);
        }
      }
      
    } catch (err) {
      console.error('Error adding schedule:', err);
      
      // Kiểm tra nếu server trả về thành công nhưng có format khác
      if (err.response && 
          (err.response.status === 200 || 
           err.response.status === 201 || 
           err.response.status === 204)) {
        // Thực tế thành công
        setAddScheduleMsg('Thêm lịch làm việc thành công!');
        setAddedSchedule({ 
          ...addScheduleForm,
          DateWork: new Date(addScheduleForm.DateWork).toLocaleDateString('vi-VN')
        });
        setAddScheduleForm({ DoctorID: '', SlotID: '', DateWork: '' });
        
        if (selectedTab === 'doctorschedule') {
          try {
            await fetchDoctorSchedules();
          } catch (refreshErr) {
            console.log('Không thể refresh danh sách lịch làm việc:', refreshErr);
          }
        }
      } else {
        // Thực sự lỗi
        let errorMsg = 'Thêm lịch làm việc thất bại!';
        
        if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response?.status === 400) {
          errorMsg = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!';
        } else if (err.response?.status === 409) {
          errorMsg = 'Lịch làm việc này đã tồn tại. Vui lòng chọn thời gian khác!';
        } else if (err.response?.status === 500) {
          errorMsg = 'Lỗi server. Vui lòng thử lại sau!';
        }
        
        setAddScheduleMsg(errorMsg);
        setAddedSchedule(null);
      }
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
      
      // Refresh danh sách lịch làm việc nếu đang ở tab danh sách
      if (selectedTab === 'doctorschedule') {
        fetchDoctorSchedules();
      }
      
      // Hiển thị thông báo toàn trang
      const successNotification = document.createElement('div');
      successNotification.className = 'global-success-notification';
      successNotification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Đã cập nhật lịch làm việc thành công
      `;
      document.body.appendChild(successNotification);
      
      // Xóa thông báo sau 3 giây
      setTimeout(() => {
        successNotification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(successNotification), 300);
      }, 3000);
      
      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        setShowScheduleUpdateModal(false);
      }, 1500);
      
    } catch (err) {
      setUpdateScheduleMsg('Cập nhật lịch làm việc thất bại!');
      setUpdatedSchedule(null);
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
      // Refresh dashboard data
      fetchDashboardData();
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
      
      // Refresh danh sách nhân viên nếu đang ở tab danh sách
      if (selectedTab === 'allstaff') {
        fetchStaffList();
      }
      
      // Hiển thị thông báo toàn trang
      const successNotification = document.createElement('div');
      successNotification.className = 'global-success-notification';
      successNotification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Đã cập nhật nhân viên <strong>${updateStaffForm.Fullname}</strong> thành công
      `;
      document.body.appendChild(successNotification);
      
      // Xóa thông báo sau 3 giây
      setTimeout(() => {
        successNotification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(successNotification), 300);
      }, 3000);
      
      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        setShowStaffUpdateModal(false);
      }, 1500);
      
    } catch (err) {
      setUpdateStaffMsg('Cập nhật nhân viên thất bại!');
      setUpdatedStaff(null);
    }
  };
  
  // Handlers cho form thêm quản lý
  const handleAddManagerChange = (e) => {
    const { name, value } = e.target;
    setAddManagerForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddManagerSubmit = async (e) => {
    e.preventDefault();
    setAddManagerMsg('');
    try {
      await themManager(addManagerForm);
      setAddManagerMsg('Thêm quản lý thành công!');
      setAddedManager({ ...addManagerForm });
      
      // Hiển thị thông báo toàn trang
      const successNotification = document.createElement('div');
      successNotification.className = 'global-success-notification';
      successNotification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Đã thêm quản lý <strong>${addManagerForm.Fullname}</strong> thành công
      `;
      document.body.appendChild(successNotification);
      
      // Xóa thông báo sau 3 giây
      setTimeout(() => {
        successNotification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(successNotification), 300);
      }, 3000);
      
      // Reset form
      setAddManagerForm({ Fullname: '', Email: '', Password: '', Address: '', Image: '' });
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      setAddManagerMsg('Thêm quản lý thất bại!');
      setAddedManager(null);
    }
  };
  
  // Handlers cho form cập nhật quản lý
  const handleUpdateManagerChange = (e) => {
    const { name, value } = e.target;
    setUpdateManagerForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Tải thông tin quản lý khi nhập ID
  const loadManagerData = async () => {
    if (!updateManagerId) return;
    
    setUpdateManagerMsg('Đang tìm thông tin quản lý...');
    try {
      const manager = await layManagerById(updateManagerId);
      if (manager) {
        setUpdateManagerForm({
          Fullname: manager.fullname || '',
          Email: manager.email || '',
          Address: manager.address || '',
          Image: manager.image || ''
        });
        setUpdateManagerMsg('Đã tìm thấy thông tin quản lý');
      } else {
        setUpdateManagerMsg('Không tìm thấy quản lý với ID này');
        setUpdateManagerForm({
          Fullname: '',
          Email: '',
          Address: '',
          Image: ''
        });
      }
    } catch (err) {
      setUpdateManagerMsg('Không thể tải thông tin quản lý');
      setUpdateManagerForm({
        Fullname: '',
        Email: '',
        Address: '',
        Image: ''
      });
    }
  };
  
  // Effect để tải thông tin quản lý khi ID thay đổi và có giá trị
  // Effect removed as updatemanager tab has been removed
  
  const handleUpdateManagerSubmit = async (e) => {
    e.preventDefault();
    setUpdateManagerMsg('');
    if (!updateManagerId) {
      setUpdateManagerMsg('Vui lòng nhập ID quản lý!');
      return;
    }
    try {
      await capnhatManager(updateManagerId, updateManagerForm);
      setUpdateManagerMsg('Cập nhật quản lý thành công!');
      setUpdatedManager({ ...updateManagerForm });
      
      // Refresh danh sách quản lý
      if (selectedTab === 'allmanagers') {
        fetchManagersList();
      }
      
      // Hiển thị thông báo toàn trang
      const successNotification = document.createElement('div');
      successNotification.className = 'global-success-notification';
      successNotification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Đã cập nhật quản lý <strong>${updateManagerForm.Fullname}</strong> thành công
      `;
      document.body.appendChild(successNotification);
      
      // Xóa thông báo sau 3 giây
      setTimeout(() => {
        successNotification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(successNotification), 300);
      }, 3000);
      
      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        setShowManagerUpdateModal(false);
      }, 1500);
      
    } catch (err) {
      setUpdateManagerMsg('Cập nhật quản lý thất bại!');
      setUpdatedManager(null);
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

  // Lấy danh sách nhân viên
  const fetchStaffList = async () => {
    try {
      const res = await getAllStaff();
      setStaffList(res);
    } catch (err) {
      setStaffList([]);
    }
  };
  
  // Lấy danh sách quản lý
  const fetchManagersList = async () => {
    try {
      const res = await laytatcaquanly();
      setManagersList(res);
    } catch (err) {
      setManagersList([]);
      console.error("Lỗi khi lấy danh sách quản lý:", err);
    }
  };

  // Khi chọn tab, load danh sách
  useEffect(() => {
    if (selectedTab === 'doctorschedule') {
      fetchDoctorSchedules();
    }
    if (selectedTab === 'addschedule' || selectedTab === 'alldoctors') {
      fetchDoctorsList();
    }
    if (selectedTab === 'allstaff') {
      fetchStaffList();
    }
    if (selectedTab === 'allmanagers') {
      fetchManagersList();
    }
  }, [selectedTab]);

  // Hàm xử lý xóa
  const handleDeleteSchedule = (schedule) => {
    setScheduleToDelete(schedule);
    setShowDeletePopup(true);
    setDeleteMsg('');
  };
  
  // Hàm xử lý cập nhật lịch làm việc từ danh sách
  const handleUpdateSchedule = (schedule) => {
    setUpdateScheduleId(schedule.ScheduleID);
    setUpdateScheduleForm({
      DoctorID: schedule.DoctorID || '',
      SlotID: schedule.SlotID || '',
      DateWork: schedule.DateWork ? new Date(schedule.DateWork).toISOString().split('T')[0] : ''
    });
    setShowScheduleUpdateModal(true);
    setUpdateScheduleMsg('');
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
  
  // Hàm xử lý xóa nhân viên
  const handleDeleteStaff = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteStaffPopup(true);
    setDeleteStaffMsg('');
  };
  
  // Hàm xử lý cập nhật nhân viên từ danh sách
  const handleUpdateStaff = (staff) => {
    setUpdateStaffId(staff.UserID || staff.UserId || staff.ID);
    setUpdateStaffForm({
      Fullname: staff.Fullname || staff.FullName || '',
      Email: staff.Email || '',
      Address: staff.Address || '',
      Image: staff.Image || ''
    });
    setShowStaffUpdateModal(true);
  };
  
  const confirmDeleteStaff = async () => {
    if (!staffToDelete) return;
    try {
      const deletedStaffName = staffToDelete?.Fullname || staffToDelete?.FullName || 'Nhân viên';
      await xoastaff(staffToDelete.UserID || staffToDelete.UserId || staffToDelete.ID);
      
      // Hiển thị thông báo trong popup
      setDeleteStaffMsg('Xóa nhân viên thành công!');
      
      // Đóng popup sau 1 giây để người dùng thấy thông báo thành công
      setTimeout(() => {
        setShowDeleteStaffPopup(false);
        setStaffToDelete(null);
        
        // Hiển thị thông báo toàn trang sau khi đóng popup
        const successNotification = document.createElement('div');
        successNotification.className = 'global-success-notification';
        successNotification.innerHTML = `
          <i class="fas fa-check-circle"></i>
          Đã xóa thành công nhân viên <strong>${deletedStaffName}</strong>
        `;
        document.body.appendChild(successNotification);
        
        // Xóa thông báo sau 3 giây
        setTimeout(() => {
          successNotification.style.opacity = '0';
          setTimeout(() => document.body.removeChild(successNotification), 300);
        }, 3000);
        
        // Cập nhật danh sách nhân viên
        fetchStaffList();
        // Refresh dashboard data
        fetchDashboardData();
      }, 1000);
    } catch (err) {
      setDeleteStaffMsg('Xóa nhân viên thất bại!');
    }
  };
  
  const cancelDeleteStaff = () => {
    setShowDeleteStaffPopup(false);
    setStaffToDelete(null);
  };
  
  // Hàm xử lý xóa quản lý
  const handleDeleteManager = (manager) => {
    setManagerToDelete(manager);
    setShowDeleteManagerPopup(true);
    setDeleteManagerMsg('');
  };
  
  // Hàm xử lý cập nhật quản lý từ danh sách
  const handleUpdateManager = (manager) => {
    setUpdateManagerId(manager.UserID || manager.UserId || manager.ID);
    setUpdateManagerForm({
      Fullname: manager.Fullname || manager.FullName || '',
      Email: manager.Email || '',
      Address: manager.Address || '',
      Image: manager.Image || ''
    });
    setShowManagerUpdateModal(true);
  };
  
  // Hàm xử lý cập nhật bác sĩ từ danh sách
  const handleUpdateDoctor = (doctor) => {
    setUpdateDoctorId(doctor.DoctorId);
    setUpdateDoctorForm({
      FullName: doctor.Fullname || '',
      Email: doctor.Email || '',
      Specialization: doctor.Specialization || '',
      LicenseNumber: doctor.LicenseNumber || '',
      ExperienceYears: doctor.ExperienceYears || '',
      Address: doctor.Address || '',
      Image: doctor.Image || ''
    });
    setShowDoctorUpdateModal(true);
    setUpdateDoctorMsg('');
  };
  
  const confirmDeleteManager = async () => {
    if (!managerToDelete) return;
    try {
      const deletedManagerName = managerToDelete?.Fullname || managerToDelete?.FullName || 'Quản lý';
      await xoaManager(managerToDelete.UserID || managerToDelete.UserId || managerToDelete.ID);
      
      // Hiển thị thông báo trong popup
      setDeleteManagerMsg('Xóa quản lý thành công!');
      
      // Đóng popup sau 1 giây để người dùng thấy thông báo thành công
      setTimeout(() => {
        setShowDeleteManagerPopup(false);
        setManagerToDelete(null);
        
        // Hiển thị thông báo toàn trang sau khi đóng popup
        const successNotification = document.createElement('div');
        successNotification.className = 'global-success-notification';
        successNotification.innerHTML = `
          <i class="fas fa-check-circle"></i>
          Đã xóa thành công quản lý <strong>${deletedManagerName}</strong>
        `;
        document.body.appendChild(successNotification);
        
        // Xóa thông báo sau 3 giây
        setTimeout(() => {
          successNotification.style.opacity = '0';
          setTimeout(() => document.body.removeChild(successNotification), 300);
        }, 3000);
        
        // Cập nhật danh sách quản lý
        fetchManagersList();
        // Refresh dashboard data
        fetchDashboardData();
      }, 1000);
    } catch (err) {
      setDeleteManagerMsg('Xóa quản lý thất bại!');
    }
  };
  
  const cancelDeleteManager = () => {
    setShowDeleteManagerPopup(false);
    setManagerToDelete(null);
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
          <li className={selectedTab === 'alldoctors' ? 'active' : ''} onClick={() => setSelectedTab('alldoctors')}>
            <i className="fas fa-users"></i>
            <span>Danh sách tất cả bác sĩ</span>
          </li>
          <li className={selectedTab === 'doctorschedule' ? 'active' : ''} onClick={() => setSelectedTab('doctorschedule')}>
            <i className="fas fa-calendar"></i>
            <span>Lịch khám bác sĩ</span>
          </li>
          <li className={selectedTab === 'addschedule' ? 'active' : ''} onClick={() => setSelectedTab('addschedule')}>
            <i className="fas fa-calendar-plus"></i>
            <span>Thêm lịch làm việc</span>
          </li>
          <li className={selectedTab === 'addstaff' ? 'active' : ''} onClick={() => setSelectedTab('addstaff')}>
            <i className="fas fa-user-plus"></i>
            <span>Thêm nhân viên</span>
          </li>
          <li className={selectedTab === 'allstaff' ? 'active' : ''} onClick={() => setSelectedTab('allstaff')}>
            <i className="fas fa-users"></i>
            <span>Danh sách tất cả các nhân viên</span>
          </li>
          <li className={selectedTab === 'allmanagers' ? 'active' : ''} onClick={() => setSelectedTab('allmanagers')}>
            <i className="fas fa-user-tie"></i>
            <span>Danh sách tất cả các quản lý</span>
          </li>
          <li className={selectedTab === 'addmanager' ? 'active' : ''} onClick={() => setSelectedTab('addmanager')}>
            <i className="fas fa-user-plus"></i>
            <span>Thêm quản lý</span>
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
              <select name="SlotID" value={addScheduleForm.SlotID} onChange={handleAddScheduleChange} required>
                  <option value="">-- Chọn SlotID --</option>
                  <option value="SL000001">Slot 1</option>
                  <option value="SL000002">Slot 2</option>
                  <option value="SL000003">Slot 3</option>
                  <option value="SL000004">Slot 4</option>
                  <option value="SL000005">Slot 5</option>
                </select>
              </div>
              <div className="form-group">
                <label>DateWork</label>
                <input name="DateWork" value={addScheduleForm.DateWork} onChange={handleAddScheduleChange} required type="date" />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Thêm lịch</button>
              {addScheduleMsg && <div style={{marginTop: 12, color: addScheduleMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{addScheduleMsg}</div>}
            </form>
            {addedSchedule && addScheduleMsg.includes('thành công') && (
              <div style={{marginTop: 32}}>
                <h3 style={{color: '#27ae60', display: 'flex', alignItems: 'center'}}>
                  <i className="fas fa-check-circle" style={{marginRight: '10px'}}></i>
                  Thông tin lịch vừa thêm
                </h3>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #27ae60',
                  borderRadius: '8px',
                  padding: '20px',
                  marginTop: '15px'
                }}>
                  <table className="admin-appointments-table" style={{margin: 0}}>
                    <thead>
                      <tr>
                        <th>Mã bác sĩ</th>
                        <th>Tên bác sĩ</th>
                        <th>Khung giờ</th>
                        <th>Ngày làm việc</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{addedSchedule.DoctorID}</td>
                        <td>
                          {doctorsList.find(doc => doc.DoctorId === addedSchedule.DoctorID)?.Fullname || 'Không tìm thấy'}
                        </td>
                        <td>
                          {(() => {
                            const slotNames = {
                              'SL000001': 'Slot 1 ',
                              'SL000002': 'Slot 2 ',
                              'SL000003': 'Slot 3 ',
                              'SL000004': 'Slot 4 ',
                              'SL000005': 'Slot 5 '
                            };
                            return slotNames[addedSchedule.SlotID] || addedSchedule.SlotID;
                          })()}
                        </td>
                        <td>{addedSchedule.DateWork}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#d4edda',
                    borderRadius: '5px',
                    color: '#155724',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-calendar-check" style={{marginRight: '8px'}}></i>
                    Lịch làm việc đã được thêm thành công vào hệ thống!
                  </div>
                </div>
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
        {selectedTab === 'allstaff' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Danh sách tất cả các nhân viên</h2>
            <table className="admin-appointments-table">
              <thead>
                <tr>
                  <th>UserID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Địa chỉ</th>
                  <th>Ảnh</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {staffList && staffList.length > 0 ? staffList.map((staff, index) => (
                  <tr key={staff.UserID || staff.UserId || staff.ID || index}>
                    <td>{staff.UserID || staff.UserId || staff.ID || 'N/A'}</td>
                    <td>{staff.Fullname || staff.FullName || 'N/A'}</td>
                    <td>{staff.Email || 'N/A'}</td>
                    <td>{staff.Address || 'N/A'}</td>
                    <td>
                      {staff.Image ? 
                        <img src={staff.Image} alt="staff" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} /> : 
                        'Không có'
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleUpdateStaff(staff)} 
                          className="admin-action-btn" 
                          style={{
                            backgroundColor: '#3498db', 
                            padding: '6px 12px', 
                            fontSize: '14px', 
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 5px rgba(52, 152, 219, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                          title="Cập nhật thông tin nhân viên này"
                        >
                          <i className="fas fa-edit"></i> Cập nhật
                        </button>
                        <button 
                          onClick={() => handleDeleteStaff(staff)} 
                          className="admin-action-btn" 
                          style={{
                            backgroundColor: '#e74c3c', 
                            padding: '6px 12px', 
                            fontSize: '14px', 
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 5px rgba(231, 76, 60, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                          title="Xóa nhân viên này"
                        >
                          <i className="fas fa-trash-alt"></i> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{textAlign:'center'}}>Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
            
            {/* Popup xác nhận xóa nhân viên */}
            {showDeleteStaffPopup && (
              <div className="delete-popup-overlay">
                <div className="delete-popup">
                  <h3>Xác nhận xóa nhân viên</h3>
                  <p>
                    Bạn có chắc chắn muốn xóa nhân viên <strong>{staffToDelete?.Fullname || staffToDelete?.FullName}</strong> với ID: <strong>{staffToDelete?.UserID || staffToDelete?.UserId || staffToDelete?.ID}</strong>?
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '-5px' }}>
                    Hành động này không thể hoàn tác sau khi đã thực hiện.
                  </p>
                  <div className="delete-popup-buttons">
                    <button className="delete-popup-btn cancel" onClick={cancelDeleteStaff}>
                      <i className="fas fa-times" style={{ marginRight: '5px' }}></i> Hủy
                    </button>
                    <button className="delete-popup-btn confirm" onClick={confirmDeleteStaff}>
                      <i className="fas fa-trash-alt" style={{ marginRight: '5px' }}></i> Xác nhận xóa
                    </button>
                  </div>
                  {deleteStaffMsg && <p className={deleteStaffMsg.includes("thành công") ? "success-msg" : "error-msg"}>{deleteStaffMsg}</p>}
                </div>
              </div>
            )}
            
            {/* Popup cập nhật thông tin nhân viên */}
            {showStaffUpdateModal && (
              <div className="delete-popup-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <div className="delete-popup" style={{ 
                  width: '600px',
                  maxWidth: '90%',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                  padding: '25px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '2px solid #3498db',
                    paddingBottom: '15px',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ 
                      margin: '0', 
                      color: '#2c3e50',
                      fontWeight: '700',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <i className="fas fa-user-edit" style={{ marginRight: '10px', color: '#3498db' }}></i>
                      Cập nhật thông tin nhân viên
                    </h3>
                    <button 
                      onClick={() => setShowStaffUpdateModal(false)} 
                      style={{ 
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#7f8c8d'
                      }}
                      title="Đóng"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateStaffSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-fingerprint" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        ID Nhân viên:
                      </label>
                      <input 
                        type="text" 
                        value={updateStaffId}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          backgroundColor: '#f0f0f0',
                          fontWeight: '600',
                          color: '#555'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-user" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Họ và tên:
                      </label>
                      <input 
                        type="text" 
                        name="Fullname"
                        value={updateStaffForm.Fullname}
                        onChange={handleUpdateStaffChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Email:
                      </label>
                      <input 
                        type="email" 
                        name="Email"
                        value={updateStaffForm.Email}
                        onChange={handleUpdateStaffChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Địa chỉ:
                      </label>
                      <input 
                        type="text" 
                        name="Address"
                        value={updateStaffForm.Address}
                        onChange={handleUpdateStaffChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-image" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        URL ảnh:
                      </label>
                      <input 
                        type="text" 
                        name="Image"
                        value={updateStaffForm.Image}
                        onChange={handleUpdateStaffChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '15px',
                      marginTop: '25px',
                      borderTop: '1px solid #eee',
                      paddingTop: '20px'
                    }}>
                      <button 
                        type="button"
                        onClick={() => setShowStaffUpdateModal(false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#e74c3c',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                        Hủy bỏ
                      </button>
                      <button 
                        type="submit"
                        style={{
                          padding: '10px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#2ecc71',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                        Lưu thay đổi
                      </button>
                    </div>
                    
                    {updateStaffMsg && (
                      <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        borderRadius: '4px',
                        backgroundColor: updateStaffMsg.includes('thành công') ? '#d4edda' : '#f8d7da',
                        color: updateStaffMsg.includes('thành công') ? '#155724' : '#721c24',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        <i className={updateStaffMsg.includes('thành công') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'} style={{ marginRight: '8px' }}></i>
                        {updateStaffMsg}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'addmanager' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Thêm quản lý</h2>
            <form className="add-doctor-form" onSubmit={handleAddManagerSubmit} style={{maxWidth: 500, margin: '0 auto'}}>
              <div className="form-group">
                <label>Họ tên</label>
                <input name="Fullname" value={addManagerForm.Fullname} onChange={handleAddManagerChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="Email" value={addManagerForm.Email} onChange={handleAddManagerChange} required type="email" />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input name="Password" value={addManagerForm.Password} onChange={handleAddManagerChange} required type="password" />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input name="Address" value={addManagerForm.Address} onChange={handleAddManagerChange} required />
              </div>
              <div className="form-group">
                <label>Ảnh (URL)</label>
                <input name="Image" value={addManagerForm.Image} onChange={handleAddManagerChange} />
              </div>
              <button type="submit" className="admin-action-btn" style={{marginTop: 16}}>Thêm quản lý</button>
              {addManagerMsg && <div style={{marginTop: 12, color: addManagerMsg.includes('thành công') ? '#27ae60' : '#e74c3c'}}>{addManagerMsg}</div>}
            </form>
            {addedManager && addManagerMsg.includes('thành công') && (
              <div style={{marginTop: 32}}>
                <h3>Thông tin quản lý vừa thêm</h3>
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
                      <td>{addedManager.Fullname}</td>
                      <td>{addedManager.Email}</td>
                      <td>{addedManager.Address}</td>
                      <td>{addedManager.Image ? <img src={addedManager.Image} alt="manager" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} /> : 'Không có'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        

        {selectedTab === 'allmanagers' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Danh sách tất cả các quản lý</h2>
            <table className="admin-appointments-table">
              <thead>
                <tr>
                  <th>UserID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Địa chỉ</th>
                  <th>Ảnh</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {managersList && managersList.length > 0 ? managersList.map((manager, index) => (
                  <tr key={manager.UserID || manager.UserId || manager.ID || index}>
                    <td>{manager.UserID || manager.UserId || manager.ID || 'N/A'}</td>
                    <td>{manager.Fullname || manager.FullName || 'N/A'}</td>
                    <td>{manager.Email || 'N/A'}</td>
                    <td>{manager.Address || 'N/A'}</td>
                    <td>
                      {manager.Image ? 
                        <img src={manager.Image} alt="manager" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} /> : 
                        'Không có'
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleUpdateManager(manager)} 
                          className="admin-action-btn" 
                          style={{
                            backgroundColor: '#3498db', 
                            padding: '6px 12px', 
                            fontSize: '14px', 
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 5px rgba(52, 152, 219, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                          title="Cập nhật thông tin quản lý này"
                        >
                          <i className="fas fa-edit"></i> Cập nhật
                        </button>
                        <button 
                          onClick={() => handleDeleteManager(manager)} 
                          className="admin-action-btn" 
                          style={{
                            backgroundColor: '#e74c3c', 
                            padding: '6px 12px', 
                            fontSize: '14px', 
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 5px rgba(231, 76, 60, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                          title="Xóa quản lý này"
                        >
                          <i className="fas fa-trash-alt"></i> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{textAlign:'center'}}>Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
            
            {/* Popup xác nhận xóa quản lý */}
            {showDeleteManagerPopup && (
              <div className="delete-popup-overlay">
                <div className="delete-popup">
                  <h3>Xác nhận xóa quản lý</h3>
                  <p>
                    Bạn có chắc chắn muốn xóa quản lý <strong>{managerToDelete?.Fullname || managerToDelete?.FullName}</strong> với ID: <strong>{managerToDelete?.UserID || managerToDelete?.UserId || managerToDelete?.ID}</strong>?
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '-5px' }}>
                    Hành động này không thể hoàn tác sau khi đã thực hiện.
                  </p>
                  <div className="delete-popup-buttons">
                    <button className="delete-popup-btn cancel" onClick={cancelDeleteManager}>
                      <i className="fas fa-times" style={{ marginRight: '5px' }}></i> Hủy
                    </button>
                    <button className="delete-popup-btn confirm" onClick={confirmDeleteManager}>
                      <i className="fas fa-trash-alt" style={{ marginRight: '5px' }}></i> Xác nhận xóa
                    </button>
                  </div>
                  {deleteManagerMsg && <p className={deleteManagerMsg.includes("thành công") ? "success-msg" : "error-msg"}>{deleteManagerMsg}</p>}
                </div>
              </div>
            )}
            
            {/* Popup cập nhật thông tin quản lý */}
            {showManagerUpdateModal && (
              <div className="delete-popup-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <div className="delete-popup" style={{ 
                  width: '600px',
                  maxWidth: '90%',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                  padding: '25px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '2px solid #3498db',
                    paddingBottom: '15px',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ 
                      margin: '0', 
                      color: '#2c3e50',
                      fontWeight: '700',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <i className="fas fa-user-edit" style={{ marginRight: '10px', color: '#3498db' }}></i>
                      Cập nhật thông tin quản lý
                    </h3>
                    <button 
                      onClick={() => setShowManagerUpdateModal(false)} 
                      style={{ 
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#7f8c8d'
                      }}
                      title="Đóng"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateManagerSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-fingerprint" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        ID Quản lý:
                      </label>
                      <input 
                        type="text" 
                        value={updateManagerId}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          backgroundColor: '#f0f0f0',
                          fontWeight: '600',
                          color: '#555'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-user" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Họ và tên:
                      </label>
                      <input 
                        type="text" 
                        name="Fullname"
                        value={updateManagerForm.Fullname}
                        onChange={handleUpdateManagerChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Email:
                      </label>
                      <input 
                        type="email" 
                        name="Email"
                        value={updateManagerForm.Email}
                        onChange={handleUpdateManagerChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Địa chỉ:
                      </label>
                      <input 
                        type="text" 
                        name="Address"
                        value={updateManagerForm.Address}
                        onChange={handleUpdateManagerChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-image" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        URL ảnh:
                      </label>
                      <input 
                        type="text" 
                        name="Image"
                        value={updateManagerForm.Image}
                        onChange={handleUpdateManagerChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '15px',
                      marginTop: '25px',
                      borderTop: '1px solid #eee',
                      paddingTop: '20px'
                    }}>
                      <button 
                        type="button"
                        onClick={() => setShowManagerUpdateModal(false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#e74c3c',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                        Hủy bỏ
                      </button>
                      <button 
                        type="submit"
                        style={{
                          padding: '10px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#2ecc71',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                        Lưu thay đổi
                      </button>
                    </div>
                    
                    {updateManagerMsg && (
                      <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        borderRadius: '4px',
                        backgroundColor: updateManagerMsg.includes('thành công') ? '#d4edda' : '#f8d7da',
                        color: updateManagerMsg.includes('thành công') ? '#155724' : '#721c24',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        <i className={updateManagerMsg.includes('thành công') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'} style={{ marginRight: '8px' }}></i>
                        {updateManagerMsg}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'alldoctors' && (
          <div className="admin-content">
            <h2 className="admin-table-title">Danh sách tất cả bác sĩ</h2>
            <table className="admin-appointments-table">
              <thead>
                <tr>
                  <th>DoctorId</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Chuyên khoa</th>
                  <th>Mã số hành nghề</th>
                  <th>Kinh nghiệm (năm)</th>
                  <th>Ảnh</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {doctorsList && doctorsList.length > 0 ? doctorsList.map(doctor => (
                  <tr key={doctor.DoctorId}>
                    <td>{doctor.DoctorId}</td>
                    <td>{doctor.Fullname}</td>
                    <td>{doctor.Email}</td>
                    <td>{doctor.Specialization}</td>
                    <td>{doctor.LicenseNumber}</td>
                    <td>{doctor.ExperienceYears}</td>
                    <td>
                      {doctor.Image ? 
                        <img src={doctor.Image} alt="doctor" style={{width:40, height:40, objectFit:'cover', borderRadius:4}} /> : 
                        'Không có'
                      }
                    </td>
                    <td>
                      <button 
                        onClick={() => handleUpdateDoctor(doctor)} 
                        className="admin-action-btn" 
                        style={{backgroundColor: '#4a90e2', fontSize: '12px', padding: '4px 8px'}}
                      >
                        <i className="fas fa-edit"></i> Cập nhật
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} style={{textAlign:'center'}}>Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
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
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleUpdateSchedule(sch)} 
                          className="admin-action-btn" 
                          style={{
                            backgroundColor: '#3498db', 
                            padding: '6px 12px', 
                            fontSize: '14px', 
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 5px rgba(52, 152, 219, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <i className="fas fa-edit"></i> Cập nhật
                        </button>
                        <button 
                          className="admin-action-btn" 
                          style={{
                            background:'#e74c3c',
                            padding: '6px 12px', 
                            fontSize: '14px', 
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 5px rgba(231, 76, 60, 0.2)',
                            transition: 'all 0.2s ease'
                          }} 
                          onClick={() => handleDeleteSchedule(sch)}
                        >
                          <i className="fas fa-trash-alt"></i> Xóa
                        </button>
                      </div>
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
            
            {/* Popup cập nhật lịch làm việc */}
            {showScheduleUpdateModal && (
              <div className="delete-popup-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <div className="delete-popup" style={{ 
                  width: '500px',
                  maxWidth: '90%',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                  padding: '25px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '2px solid #3498db',
                    paddingBottom: '15px',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ 
                      margin: '0', 
                      color: '#2c3e50',
                      fontWeight: '700',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <i className="fas fa-calendar-alt" style={{ marginRight: '10px', color: '#3498db' }}></i>
                      Cập nhật lịch làm việc
                    </h3>
                    <button 
                      onClick={() => setShowScheduleUpdateModal(false)} 
                      style={{ 
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#7f8c8d'
                      }}
                      title="Đóng"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateScheduleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-fingerprint" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Mã lịch (ScheduleID):
                      </label>
                      <input 
                        type="text" 
                        value={updateScheduleId}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          backgroundColor: '#f0f0f0',
                          fontWeight: '600',
                          color: '#555'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-user-md" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Mã bác sĩ (DoctorID):
                      </label>
                      <input 
                        type="text" 
                        name="DoctorID"
                        value={updateScheduleForm.DoctorID}
                        onChange={handleUpdateScheduleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-clock" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Mã khung giờ (SlotID):
                      </label>
                      <input 
                        type="text" 
                        name="SlotID"
                        value={updateScheduleForm.SlotID}
                        onChange={handleUpdateScheduleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#2c3e50'
                      }}>
                        <i className="fas fa-calendar-day" style={{ marginRight: '8px', color: '#3498db' }}></i>
                        Ngày làm việc (DateWork):
                      </label>
                      <input 
                        type="date" 
                        name="DateWork"
                        value={updateScheduleForm.DateWork}
                        onChange={handleUpdateScheduleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '15px',
                      marginTop: '25px',
                      borderTop: '1px solid #eee',
                      paddingTop: '20px'
                    }}>
                      <button 
                        type="button"
                        onClick={() => setShowScheduleUpdateModal(false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#e74c3c',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                        Hủy bỏ
                      </button>
                      <button 
                        type="submit"
                        style={{
                          padding: '10px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#2ecc71',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                        Lưu thay đổi
                      </button>
                    </div>
                    
                    {updateScheduleMsg && (
                      <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        borderRadius: '4px',
                        backgroundColor: updateScheduleMsg.includes('thành công') ? '#d4edda' : '#f8d7da',
                        color: updateScheduleMsg.includes('thành công') ? '#155724' : '#721c24',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        <i className={updateScheduleMsg.includes('thành công') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'} style={{ marginRight: '8px' }}></i>
                        {updateScheduleMsg}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal cập nhật bác sĩ */}
        {showDoctorUpdateModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h3>Cập nhật thông tin bác sĩ</h3>
                <button className="close-btn" onClick={() => setShowDoctorUpdateModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <form className="update-form" onSubmit={handleUpdateDoctorSubmit}>
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input name="FullName" value={updateDoctorForm.FullName} onChange={handleUpdateDoctorChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="Email" value={updateDoctorForm.Email} onChange={handleUpdateDoctorChange} required type="email" />
                  </div>
                  <div className="form-group">
                    <label>Chuyên khoa</label>
                    <input name="Specialization" value={updateDoctorForm.Specialization} onChange={handleUpdateDoctorChange} required />
                  </div>
                  <div className="form-group">
                    <label>Mã số hành nghề</label>
                    <input name="LicenseNumber" value={updateDoctorForm.LicenseNumber} onChange={handleUpdateDoctorChange} required />
                  </div>
                  <div className="form-group">
                    <label>Kinh nghiệm (năm)</label>
                    <input name="ExperienceYears" value={updateDoctorForm.ExperienceYears} onChange={handleUpdateDoctorChange} required type="number" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ</label>
                    <input name="Address" value={updateDoctorForm.Address} onChange={handleUpdateDoctorChange} required />
                  </div>
                  <div className="form-group">
                    <label>Ảnh (URL)</label>
                    <input name="Image" value={updateDoctorForm.Image} onChange={handleUpdateDoctorChange} />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowDoctorUpdateModal(false)}>Hủy bỏ</button>
                    <button type="submit" className="submit-btn">Cập nhật</button>
                  </div>
                  {updateDoctorMsg && (
                    <div className={`message ${updateDoctorMsg.includes('thành công') ? 'success' : 'error'}`} style={{
                      marginTop: '15px',
                      padding: '10px',
                      borderRadius: '4px',
                      backgroundColor: updateDoctorMsg.includes('thành công') ? '#d4edda' : '#f8d7da',
                      color: updateDoctorMsg.includes('thành công') ? '#155724' : '#721c24',
                      textAlign: 'center'
                    }}>
                      <i className={updateDoctorMsg.includes('thành công') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'} style={{ marginRight: '8px' }}></i>
                      {updateDoctorMsg}
                    </div>
                  )}
                </form>
              </div>
            </div>
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

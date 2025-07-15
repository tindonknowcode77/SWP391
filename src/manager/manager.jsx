import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Manager.css';
import { taotaikhoanbasi } from '../api/auth';

const initialForm = {
  FullName: '',
  Password: '',
  Email: '',
  Specialization: '',
  LicenseNumber: '',
  ExperienceYears: '',
  Address: '',
  Image: ''
};

const Manager = () => {
  const { currentUser , logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selected, setSelected] = useState('appointments');
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser || currentUser.role !== 'R002') {
    return (
      <div className="manager-warning-banner" style={{flexDirection: 'column', gap: '18px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <span className="manager-warning-icon">&#9888;</span>
          Không phận sự miễn vào !!!
        </div>
        <button className="manager-warning-btn" onClick={() => navigate('/hospital')}>
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      await taotaikhoanbasi({
        ...form,
        ExperienceYears: Number(form.ExperienceYears)
      });
      setSubmitting(false);
      setSuccess(true);
      setShowSuccessPopup(true);
      setForm(initialForm);
    } catch (err) {
      setSubmitting(false);
      setError('Tạo tài khoản thất bại. Vui lòng kiểm tra lại thông tin hoặc thử lại.');
    }
  };

  return (
    <div className="manager-container">
      <aside className="manager-sidebar">
        <div className="manager-sidebar-user-row">
        <span className="sidebar-user">
        <span style={{ color: '#9de0ad', fontWeight: 'bold' }}>MANAGER</span> : {currentUser?.name || 'Quản lý'}</span>
          <button className="admin-sidebar-logout-btn" onClick={handleLogout} title="Đăng xuất" aria-label="Đăng xuất">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <span className="manager-sidebar-user" style={{marginTop: 24, fontWeight: 700, fontSize: '1.1rem', display: 'block', textAlign: 'center'}}>Tạo tài khoản bác sĩ</span>
      </aside>
      <main className="manager-main">
        <div className="manager-content" style={{maxWidth: 500, margin: '0 auto'}}>
          <h2 className="manager-table-title">Tạo tài khoản bác sĩ</h2>
          <form className="manager-register-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="manager-form-group">
              <label htmlFor="FullName">Họ và tên Bác Sĩ</label>
              <input type="text" id="FullName" name="FullName" value={form.FullName} onChange={handleChange} required />
            </div>
            <div className="manager-form-group">
              <label htmlFor="Password">Mật khẩu</label>
              <input type="password" id="Password" name="Password" value={form.Password} onChange={handleChange} required />
            </div>
            <div className="manager-form-group">
              <label htmlFor="Email">Email</label>
              <input type="email" id="Email" name="Email" value={form.Email} onChange={handleChange} required />
            </div>
            <div className="manager-form-group">
              <label htmlFor="Specialization">Chuyên khoa</label>
              <input type="text" id="Specialization" name="Specialization" value={form.Specialization} onChange={handleChange} required />
            </div>
            <div className="manager-form-group">
              <label htmlFor="LicenseNumber">Số giấy phép hành nghề</label>
              <input type="text" id="LicenseNumber" name="LicenseNumber" value={form.LicenseNumber} onChange={handleChange} required />
            </div>
            <div className="manager-form-group">
              <label htmlFor="ExperienceYears">Số năm kinh nghiệm</label>
              <input type="number" id="ExperienceYears" name="ExperienceYears" value={form.ExperienceYears} onChange={handleChange} min="0" required />
            </div>
            <div className="manager-form-group">
              <label htmlFor="Address">Địa chỉ</label>
              <input type="text" id="Address" name="Address" value={form.Address} onChange={handleChange} required />
            </div>
            <div className="manager-form-group">
               <label>Ảnh (URL)</label>
              <input type="text" id="Image" name="Image" value={form.Image} onChange={handleChange} required />
            </div>
            {error && <div className="manager-form-error">{error}</div>}
            {success && <div className="manager-form-success">Tạo tài khoản thành công!</div>}
            <button className="manager-action-btn" type="submit" disabled={submitting} style={{width: '100%', marginTop: 18}}>
              {submitting ? 'Đang tạo...' : 'Tạo tài khoản bác sĩ'}
            </button>
          </form>
        </div>
        {showSuccessPopup && (
          <div className="manager-success-popup-overlay">
            <div className="manager-success-popup">
              <div className="manager-success-icon"><i className="fas fa-check-circle"></i></div>
              <div className="manager-success-message">Bạn đã tạo tài khoản bác sĩ thành công</div>
              <button className="manager-success-close-btn" onClick={() => setShowSuccessPopup(false)}>Đóng</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Manager;

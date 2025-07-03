import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Register.css';
import {dangky} from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    gender: '',
    agreeTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState(1);
  
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    
    if (formData.password.length < 8) {
      setFormError('Mật khẩu phải có ít nhất 8 ký tự');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp');
      return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setFormError('Email không hợp lệ');
      return false;
    }
    
    return true;
  };


  const handleNext = () => {
    if (validateStep1()) {
      setFormError('');
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    
  
    setIsSubmitting(true);
    setFormError('');
  
    try {
      const payload = {
        Fullname: formData.fullName, 
        Email: formData.email,
        Password: formData.password,
        Address: formData.address,
      };
  
      // Tạo bản sao và ẩn password khi log
      const safePayload = { ...payload, Password: '******' };
      console.log('Sending payload:', safePayload);
  
      const success = await dangky(payload); 
  
      if (success) {
        navigate('/login', { state: { newUser: true } });
      } else {
        setFormError('Đăng ký thất bại');
      }
    } catch (err) {
      setFormError('Đã xảy ra lỗi khi đăng ký');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2>Đăng ký tài khoản</h2>
            <p>Tạo tài khoản để quản lý việc điều trị HIV của bạn</p>
          </div>
          
          {formError && <div className="register-error">{formError}</div>}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label-3" >Họ và tên</label>
                <div className="input-row">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label-3">Email</label>
                <div className="input-row">
                  <i className="fas fa-envelope input-icon"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label-3">Mật khẩu</label>
                <div className="input-row">
                  <i className="fas fa-lock input-icon"></i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label-3">Xác nhận mật khẩu</label>
                <div className="input-row">
                  <i className="fas fa-lock input-icon"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label-3">Địa chỉ</label>
                <div className="input-row">
                  <i className="fas fa-map-marker-alt input-icon"></i>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ của bạn"
                    required
                  />
                </div>
              </div>

              <div className="form-group terms-group">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="agreeTerms">
                    Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="register-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                </button>
              </div>
            </div>
          </form>
          
          <div className="register-footer">
            <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
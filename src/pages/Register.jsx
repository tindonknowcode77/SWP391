import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
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

  const validateStep2 = () => {
    if (!formData.phoneNumber || !formData.dateOfBirth || !formData.gender) {
      setFormError('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    
    if (!formData.agreeTerms) {
      setFormError('Bạn cần đồng ý với điều khoản dịch vụ');
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
    
    if (!validateStep2()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const success = await register(
        formData.fullName,
        formData.email, 
        formData.password
      );
      
      if (success) {
        navigate('/profile', { state: { newUser: true } });
      } else {
        setFormError(error || 'Đăng ký thất bại');
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
            
            <div className="register-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-text">Thông tin tài khoản</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-text">Thông tin cá nhân</div>
              </div>
            </div>
          </div>
          
          {formError && <div className="register-error">{formError}</div>}
          
          <form onSubmit={handleSubmit} className="register-form">
            {step === 1 && (
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="fullName">Họ và tên</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user"></i>
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
                  <label htmlFor="email">Email</label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope"></i>
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
                  <label htmlFor="password">Mật khẩu</label>
                  <div className="input-with-icon">
                    <i className="fas fa-lock"></i>
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
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <div className="input-with-icon">
                    <i className="fas fa-lock"></i>
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
                
                <button 
                  type="button" 
                  className="register-button"
                  onClick={handleNext}
                >
                  Tiếp theo
                </button>
              </div>
            )}
            
            {step === 2 && (
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Số điện thoại</label>
                  <div className="input-with-icon">
                    <i className="fas fa-phone"></i>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Ngày sinh</label>
                  <div className="input-with-icon">
                    <i className="fas fa-calendar"></i>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Giới tính</label>
                  <div className="gender-options">
                    <div className="gender-option">
                      <input 
                        type="radio" 
                        id="male" 
                        name="gender" 
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="male">Nam</label>
                    </div>
                    
                    <div className="gender-option">
                      <input 
                        type="radio" 
                        id="female" 
                        name="gender" 
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                      />
                      <label htmlFor="female">Nữ</label>
                    </div>
                    
                    <div className="gender-option">
                      <input 
                        type="radio" 
                        id="other" 
                        name="gender" 
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleChange}
                      />
                      <label htmlFor="other">Khác</label>
                    </div>
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
                    type="button" 
                    className="back-button"
                    onClick={handleBack}
                  >
                    Quay lại
                  </button>
                  
                  <button 
                    type="submit" 
                    className="register-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                  </button>
                </div>
              </div>
            )}
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
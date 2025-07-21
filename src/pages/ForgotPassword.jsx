import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/ForgotPassword.css';
import { quenmatkhau} from '../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  
  const { resetPassword, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra hai mật khẩu mới phải giống nhau
    if (newPassword !== confirmPassword) {
      setShowSuccessPopup(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await quenmatkhau({ email, newPassword });
      setShowSuccessPopup(true);
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#27ae60"/>
                <path d="M14 25L21 32L34 19" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="success-message">
              {newPassword !== confirmPassword
                ? 'Mật khẩu mới và nhập lại mật khẩu mới phải giống nhau'
                : 'Bạn đã đổi mật khẩu thành công'}
            </div>
            <button className="close-popup-btn" onClick={() => { setShowSuccessPopup(false); navigate('/login'); }}>Đóng</button>
          </div>
        </div>
      )}
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h2>Quên mật khẩu</h2>
            <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
          </div>
          
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email đã đăng ký"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nhập mật khẩu mới</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  required
                />
              </div>
            </div>
            {/* Thêm ô nhập lại mật khẩu mới */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Nhập lại mật khẩu mới</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="reset-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Gửi yêu cầu đặt lại mật khẩu'}
            </button>
          </form>
          
          <div className="forgot-password-footer">
            <div className="footer-link">
              <i className="fas fa-arrow-left"></i>
              <Link to="/login">Quay lại trang đăng nhập</Link>
            </div>
            <div className="footer-link">
              <i className="fas fa-question-circle"></i>
              <Link to="/help">Cần trợ giúp?</Link>
            </div>
          </div>
          
          <div className="support-info">
            <p>Bạn gặp vấn đề khi đặt lại mật khẩu?</p>
            <p>Liên hệ hỗ trợ: <a href="mailto:support@hivhospital.vn">support@hivhospital.vn</a> hoặc gọi <a href="tel:+84123456789">0123 456 789</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
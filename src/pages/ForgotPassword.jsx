import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const { resetPassword, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Vui lòng nhập địa chỉ email');
      setMessageType('error');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const success = await resetPassword(email);
      
      if (success) {
        setMessage('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(error || 'Không thể gửi yêu cầu đặt lại mật khẩu');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Đã xảy ra lỗi khi gửi yêu cầu');
      setMessageType('error');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h2>Quên mật khẩu</h2>
            <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
          </div>
          
          {message && (
            <div className={`forgot-password-message ${messageType}`}>
              {message}
            </div>
          )}
          
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
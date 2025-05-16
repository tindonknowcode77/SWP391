import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy đường dẫn redirect từ state (nếu có), mặc định là "/"
  const redirectPath = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        // Chuyển về trang trước đó hoặc trang chủ
        navigate(redirectPath, { replace: true });
      } else {
        setFormError(error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setFormError('Đã xảy ra lỗi khi đăng nhập');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p>Vui lòng nhập thông tin đăng nhập của bạn để tiếp tục</p>
          </div>
          
          {formError && <div className="login-error">{formError}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
              <Link to="/forgot-password" className="forgot-link">Quên mật khẩu?</Link>
            </div>
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
          
          <div className="login-divider">
            <span>Hoặc đăng nhập với</span>
          </div>
          
          <div className="social-login">
            <button className="google-btn">
              <i className="fab fa-google"></i>
              Google
            </button>
            <button className="facebook-btn">
              <i className="fab fa-facebook-f"></i>
              Facebook
            </button>
          </div>
          
          <div className="login-footer">
            <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
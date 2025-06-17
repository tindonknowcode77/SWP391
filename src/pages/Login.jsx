import React, {useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import {useAuth} from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Login.css';
import {login} from '../api/auth';
import {session} from '../api/auth';
import { saveUserToLocalStorage } from '../utils/helpers';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const {error, setCurrentUser} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy đường dẫn redirect từ state (nếu có), mặc định là "/"
  const redirectPath = location.state?.from?.pathname || "/";

  // useEffect(() => {
  //   session()
  //     .then(res => {
  //       console.log("Session response:", res);
  //       // Lưu thông tin người dùng vào context nếu có session
  //       if (res && res.user) {
  //         const userData = res.user;
  //         const user = {
  //           id: userData.userId || '',
  //           name: userData.fullname || userData.email,
  //           email: userData.email,
  //           role: userData.roleId || "patient",
  //           accountStatus: "active",
  //           accountType: userData.roleId === "R001" ? "Quản trị viên" : "Bệnh nhân"
  //         };
  //         console.log("Saving session user data:", user);
  //         setCurrentUser(user);
  //         localStorage.setItem('hivAppUser', JSON.stringify(user));
  //       }
  //       navigate('/hospital', { replace: true });
  //     })
  //     .catch(err => {
  //       console.log("Không tìm thấy session hoặc đã hết hạn:", err);
  //     });
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setLoading(true);

    const request = {email, password};

    try {
      const result = await login(request);
      console.log('Login result:', result);
      
      if (!result) {
        setFormError('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.');
        return;
      }
      setFormError('');

      const roleMap = {
        R001: 'Admin',
        R002: 'Manager',
        R003: 'Doctor',
        R004: 'Staff',
        R005: 'Patient'
      };
      
      const user = {
        id: result.UserId || '',
        name: result.Fullname || '', 
        email: result.Email || '',
        role: result.RoleId || 'patient',
        accountStatus: 'active',
        accountType: roleMap[result.RoleId] || 'Không xác định',
        token: result.Token || ''
      };
      
      console.log('User object created:', user);
      
      // Lưu vào localStorage và context
      localStorage.setItem('hivAppUser', JSON.stringify(user));
      setCurrentUser(user);
      
      // Chuyển hướng người dùng
      navigate("/hospital", {
        replace: true,
        state: {
          showAccountStatus: true,
          accountStatus: 'active',
          accountType: 'Bệnh nhân'
        }
      });
    } catch (error) {
      // Nếu API trả lỗi 400/401 từ BE
      if (error.response && error.response.status === 401) {
        setFormError('Sai email hoặc mật khẩu.');
      } else if (error.response && error.response.data) {
        setFormError(error.response.data);
      } else {
        setFormError('Đã xảy ra lỗi khi đăng nhập.');
      }

      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
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
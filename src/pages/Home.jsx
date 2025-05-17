import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Quản lý điều trị HIV một cách hiệu quả</h1>
            <p>Ứng dụng toàn diện giúp bạn theo dõi điều trị, quản lý lịch hẹn và kết nối với đội ngũ y tế</p>
            
            <div className="hero-buttons">
              {currentUser ? (
                <Link to="/profile" className="primary-button">
                  <i className="fas fa-user-circle"></i>
                  Hồ sơ của tôi
                </Link>
              ) : (
                <Link to="/login" className="primary-button">
                  <i className="fas fa-sign-in-alt"></i>
                  Đăng nhập
                </Link>
              )}
              <Link to="/hospital" className="secondary-button">
                <i className="fas fa-hospital"></i>
                Trang bệnh viện
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/hero-image.jpg" alt="HIV Treatment App" />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>Tính năng nổi bật</h2>
            <p>Ứng dụng cung cấp các công cụ cần thiết để quản lý việc điều trị HIV của bạn</p>
          </div>
          
          <div className="features-container">
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/assets/images/medication.png" alt="Medication Icon" />
              </div>
              <h3>Quản lý thuốc</h3>
              <p>Theo dõi lịch uống thuốc, nhận thông báo nhắc nhở và quản lý toa thuốc của bạn</p>
              <Link to="/medication" className="feature-link">
                Xem chi tiết
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/assets/images/appointment.png" alt="Appointment Icon" />
              </div>
              <h3>Đặt lịch khám</h3>
              <p>Đặt lịch hẹn trực tuyến, nhận thông báo và theo dõi các cuộc hẹn sắp tới</p>
              <Link to="/appointments" className="feature-link">
                Xem chi tiết
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/assets/images/treatment.png" alt="Treatment Icon" />
              </div>
              <h3>Kế hoạch điều trị</h3>
              <p>Xem và theo dõi kế hoạch điều trị cá nhân do bác sĩ của bạn đề xuất</p>
              <Link to="/treatment-plan" className="feature-link">
                Xem chi tiết
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="section-header">
            <h2>Cách thức hoạt động</h2>
            <p>Ba bước đơn giản để bắt đầu quản lý việc điều trị HIV của bạn</p>
          </div>
          
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Tạo tài khoản</h3>
                <p>Đăng ký một tài khoản miễn phí để bắt đầu sử dụng ứng dụng và truy cập các tính năng</p>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Cập nhật thông tin</h3>
                <p>Nhập thông tin cá nhân, lịch trình thuốc và kế hoạch điều trị của bạn</p>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Bắt đầu quản lý</h3>
                <p>Nhận thông báo, theo dõi tiến trình và duy trì kết nối với đội ngũ y tế của bạn</p>
              </div>
            </div>
          </div>
          
          <div className="cta-container">
            <Link to="/register" className="cta-button">
              Đăng ký ngay
              <i className="fas fa-user-plus"></i>
            </Link>
          </div>
        </section>
        
        {/* Resources Section */}
        <section className="resources-section">
          <div className="section-header">
            <h2>Tài nguyên hữu ích</h2>
            <p>Khám phá các thông tin giáo dục và tài liệu hỗ trợ về HIV/AIDS</p>
          </div>
          
          <div className="resources-grid">
            <div className="resource-item">
              <div className="resource-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <h3>Thông tin về HIV</h3>
              <p>Tìm hiểu thêm về HIV, cách lây truyền, phòng ngừa và điều trị</p>
              <Link to="/resources" className="resource-link">Khám phá</Link>
            </div>
            
            <div className="resource-item">
              <div className="resource-icon">
                <i className="fas fa-pills"></i>
              </div>
              <h3>Thông tin về thuốc ARV</h3>
              <p>Tìm hiểu về các loại thuốc kháng virus, cách dùng và tác dụng phụ</p>
              <Link to="/resources" className="resource-link">Khám phá</Link>
            </div>
            
            <div className="resource-item">
              <div className="resource-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Nhóm hỗ trợ</h3>
              <p>Kết nối với cộng đồng và nhóm hỗ trợ cho người sống với HIV</p>
              <Link to="/resources" className="resource-link">Khám phá</Link>
            </div>
            
            <div className="resource-item">
              <div className="resource-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <h3>Câu hỏi thường gặp</h3>
              <p>Tìm câu trả lời cho các câu hỏi thường gặp về HIV và việc điều trị</p>
              <Link to="/resources" className="resource-link">Khám phá</Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="section-header">
            <h2>Chia sẻ từ người dùng</h2>
            <p>Những gì mọi người nói về ứng dụng của chúng tôi</p>
          </div>
          
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Ứng dụng này đã thay đổi cách tôi quản lý việc điều trị HIV. Tôi không bao giờ quên uống thuốc và luôn cập nhật về tình trạng sức khỏe của mình."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="/testimonial-1.jpg" alt="User Avatar" />
                </div>
                <div className="author-info">
                  <h4>Nguyễn V.A</h4>
                  <p>Đang sử dụng ứng dụng 1 năm</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Rất dễ sử dụng và hữu ích. Các nhắc nhở uống thuốc và lịch hẹn đã giúp tôi duy trì việc điều trị một cách đều đặn."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="/testimonial-2.jpg" alt="User Avatar" />
                </div>
                <div className="author-info">
                  <h4>Trần T.B</h4>
                  <p>Đang sử dụng ứng dụng 6 tháng</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Bắt đầu quản lý việc điều trị HIV của bạn ngay hôm nay</h2>
            <p>Đăng ký miễn phí và trải nghiệm các tính năng toàn diện mà ứng dụng của chúng tôi cung cấp</p>
            
            <div className="cta-buttons">
              <Link to="/register" className="primary-button large">
                Đăng ký ngay
                <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/resources" className="text-button">
                Tìm hiểu thêm
                <i className="fas fa-info-circle"></i>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}        <footer className="home-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/assets/images/logo.png" alt="HIV Treatment App Logo" />
              <h3>HIV Treatment App</h3>
            </div>
            
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Trang chủ</h4>
                <ul>
                  <li><Link to="/">Trang chủ</Link></li>
                  <li><Link to="/hospital">Bệnh viện</Link></li>
                  <li><Link to="/hiv-department">Khoa HIV</Link></li>
                  <li><Link to="/resources">Tài nguyên</Link></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h4>Tính năng</h4>
                <ul>
                  <li><Link to="/medication">Quản lý thuốc</Link></li>
                  <li><Link to="/appointments">Đặt lịch khám</Link></li>
                  <li><Link to="/treatment-plan">Kế hoạch điều trị</Link></li>
                  <li><Link to="/profile">Hồ sơ cá nhân</Link></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h4>Hỗ trợ</h4>
                <ul>
                  <li><Link to="/resources">Câu hỏi thường gặp</Link></li>
                  <li><Link to="/resources">Hướng dẫn sử dụng</Link></li>
                  <li><a href="mailto:support@hivhospital.vn">Liên hệ hỗ trợ</a></li>
                  <li><Link to="/resources">Nhóm hỗ trợ</Link></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h4>Pháp lý</h4>
                <ul>
                  <li><Link to="#">Điều khoản sử dụng</Link></li>
                  <li><Link to="#">Chính sách bảo mật</Link></li>
                  <li><Link to="#">Quyền riêng tư</Link></li>
                  <li><Link to="#">Cookies</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link"><i className="fab fa-youtube"></i></a>
            </div>
            
            <div className="copyright">
              <p>&copy; 2025 HIV Treatment App. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
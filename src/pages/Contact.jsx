import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send the form data to a server here
    console.log('Form data submitted:', formData);
    setFormSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <div className="contact-header">
          <h1>Liên Hệ Với Chúng Tôi</h1>
          <p>Chúng tôi luôn sẵn sàng để hỗ trợ bạn. Vui lòng để lại thông tin liên hệ và chúng tôi sẽ phản hồi sớm nhất có thể.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Địa Chỉ</h3>
              <p>123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3>Điện Thoại</h3>
              <p>Hotline: 1900-6889</p>
              <p>Tư vấn: 0909-123-456</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>info@hivhospital.vn</p>
              <p>support@hivhospital.vn</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Giờ Làm Việc</h3>
              <p>Thứ Hai - Thứ Sáu: 7:30 - 17:00</p>
              <p>Thứ Bảy: 8:00 - 12:00</p>
              <p>Chủ Nhật: Nghỉ</p>
            </div>

            <div className="social-connect">
              <h3>Kết Nối Với Chúng Tôi</h3>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Gửi Tin Nhắn</h2>
            {formSubmitted ? (
              <div className="form-success-message">
                <i className="fas fa-check-circle"></i>
                <h3>Cảm ơn bạn đã liên hệ!</h3>
                <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên <span className="required">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Nhập địa chỉ email của bạn"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại của bạn"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Chủ đề <span className="required">*</span></label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="appointment">Đặt lịch khám</option>
                      <option value="medication">Thông tin thuốc</option>
                      <option value="treatment">Kế hoạch điều trị</option>
                      <option value="feedback">Góp ý, phản hồi</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Nội dung tin nhắn <span className="required">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Nhập nội dung tin nhắn của bạn"
                  ></textarea>
                </div>
                
                <div className="form-privacy">
                  <p>Bằng cách gửi biểu mẫu này, bạn đồng ý với <Link to="#">Chính sách bảo mật</Link> của chúng tôi.</p>
                </div>
                
                <button type="submit" className="submit-button">
                  Gửi tin nhắn
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="map-container">
          <h2>Bản Đồ Đường Đi</h2>
          <div className="map-iframe">
            {/* In a real application, you would use your actual Google Maps API key */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0435706484374!2d106.70522931092595!3d10.728248082517172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f7d00d1dd45%3A0xb7723c098323c382!2zMTIzIMSQxrDhu51uZyBOZ3V54buFbiBWxINuIExpbmgsIFTDom4gUGjDuiwgUXXhuq1uIDcsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1715046425089!5m2!1svi!2s" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="faq-section">
          <h2>Câu Hỏi Thường Gặp</h2>
          <div className="faq-container">
            <div className="faq-item">
              <h3>Làm thế nào để đặt lịch khám?</h3>
              <p>Bạn có thể đặt lịch khám qua ứng dụng, website, hoặc gọi trực tiếp đến số hotline 1900-6889. Chúng tôi sẽ xác nhận lịch hẹn qua email hoặc tin nhắn SMS.</p>
            </div>
            
            <div className="faq-item">
              <h3>Bệnh viện có phục vụ vào cuối tuần không?</h3>
              <p>Bệnh viện phục vụ vào các ngày trong tuần từ Thứ Hai đến Thứ Sáu (7:30 - 17:00) và Thứ Bảy (8:00 - 12:00). Chúng tôi nghỉ vào Chủ Nhật và các ngày lễ.</p>
            </div>
            
            <div className="faq-item">
              <h3>Tôi có thể nhận tư vấn y tế trực tuyến không?</h3>
              <p>Có, chúng tôi cung cấp dịch vụ tư vấn y tế trực tuyến qua video call hoặc chat với đội ngũ y tế chuyên nghiệp. Vui lòng đăng nhập vào tài khoản để sử dụng dịch vụ này.</p>
            </div>
            
            <div className="faq-item">
              <h3>Làm thế nào để nhận kết quả xét nghiệm?</h3>
              <p>Kết quả xét nghiệm sẽ được cập nhật trên hệ thống và bạn có thể xem trong phần "Hồ sơ bệnh án" trên ứng dụng. Ngoài ra, bạn cũng sẽ nhận được thông báo qua email khi có kết quả mới.</p>
            </div>
          </div>
          
          <div className="faq-more">
            <Link to="/resources" className="faq-link">
              Xem thêm câu hỏi khác
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
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
    </>
  );
};

export default Contact;

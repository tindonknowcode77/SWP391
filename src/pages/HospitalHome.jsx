import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/HospitalHome.css';

const HospitalHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mô phỏng việc tải dữ liệu từ API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Trong dự án thực tế, bạn sẽ gọi API thực sự
        setTimeout(() => {
          setNews([
            {
              id: 1,
              title: 'Kỷ niệm Ngày Thế giới phòng chống HIV/AIDS',
              image: '/news-1.jpg',
              date: '01/12/2024',
              summary: 'Bệnh viện tổ chức chuỗi hoạt động nâng cao nhận thức cộng đồng về HIV/AIDS...'
            },
            {
              id: 2,
              title: 'Thêm phác đồ điều trị HIV mới được phê duyệt',
              image: '/news-2.jpg',
              date: '15/10/2024',
              summary: 'Bộ Y tế phê duyệt phác đồ điều trị HIV mới, hỗ trợ bệnh nhân giảm tác dụng phụ...'
            },
            {
              id: 3,
              title: 'Chương trình tư vấn dinh dưỡng cho người nhiễm HIV',
              image: '/news-3.jpg',
              date: '05/09/2024',
              summary: 'Bệnh viện triển khai chương trình tư vấn dinh dưỡng miễn phí cho bệnh nhân HIV...'
            },
          ]);

          setDoctors([
            {
              id: 1,
              name: 'BS. Nguyễn Văn A',
              specialty: 'Trưởng khoa HIV/AIDS',
              image: '/doctor-1.jpg',
              experience: '15 năm kinh nghiệm'
            },
            {
              id: 2,
              name: 'BS. Phạm Thị B',
              specialty: 'Bác sĩ điều trị HIV',
              image: '/doctor-2.jpg',
              experience: '10 năm kinh nghiệm'
            },
            {
              id: 3,
              name: 'BS. Trần Văn C',
              specialty: 'Chuyên gia tư vấn HIV',
              image: '/doctor-3.jpg',
              experience: '12 năm kinh nghiệm'
            },
          ]);
          
          setIsLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        setIsLoading(false);
      }
    };

    fetchData();

    // Auto slideshow
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const slides = [
    {
      id: 1,
      image: '/slide-1.jpg',
      title: 'Chăm sóc toàn diện cho người nhiễm HIV',
      description: 'Hệ thống y tế chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm',
      link: '/hospital/dich-vu'
    },
    {
      id: 2,
      image: '/slide-2.jpg',
      title: 'Phác đồ điều trị HIV hiện đại',
      description: 'Áp dụng các phương pháp tiên tiến nhất trong điều trị HIV/AIDS',
      link: '/hospital/chuyen-khoa'
    },
    {
      id: 3,
      image: '/slide-3.jpg',
      title: 'Đặt lịch khám trực tuyến',
      description: 'Dễ dàng đặt lịch khám chỉ trong vài phút, không cần chờ đợi',
      link: '/hospital/lich-kham'
    }
  ];

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="hospital-home">
      <Navbar />
      
      {/* Hero Slider */}
      <div className="hero-slider">
        <div className="slides-container">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <Link to={slide.link} className="slide-btn">Tìm hiểu thêm</Link>
              </div>
            </div>
          ))}
        </div>
        
        <button className="slider-btn prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="slider-btn next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
        
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>
      
      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Dịch vụ của chúng tôi</h2>
            <p>Cung cấp các dịch vụ y tế chất lượng cao cho bệnh nhân HIV/AIDS</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>Tư vấn HIV/AIDS</h3>
              <p>Dịch vụ tư vấn trước và sau xét nghiệm HIV từ đội ngũ chuyên gia tâm lý.</p>
              <Link to="/hospital/dich-vu/tu-van" className="read-more">Xem thêm</Link>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-pills"></i>
              </div>
              <h3>Điều trị ARV</h3>
              <p>Cung cấp phác đồ điều trị ARV hiện đại giúp kiểm soát virus HIV hiệu quả.</p>
              <Link to="/hospital/dich-vu/dieu-tri-arv" className="read-more">Xem thêm</Link>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-vial"></i>
              </div>
              <h3>Xét nghiệm HIV</h3>
              <p>Xét nghiệm nhanh, chính xác và bảo mật với công nghệ tiên tiến.</p>
              <Link to="/hospital/dich-vu/xet-nghiem" className="read-more">Xem thêm</Link>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>Điều trị bệnh đồng nhiễm</h3>
              <p>Điều trị toàn diện các bệnh đồng nhiễm như viêm gan, lao, STIs...</p>
              <Link to="/hospital/dich-vu/benh-dong-nhiem" className="read-more">Xem thêm</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Doctor Section */}
      <section className="doctors-section">
        <div className="container">
          <div className="section-header">
            <h2>Đội ngũ bác sĩ</h2>
            <p>Các chuyên gia y tế giàu kinh nghiệm trong lĩnh vực HIV/AIDS</p>
          </div>
          
          <div className="doctors-grid">
            {doctors.map(doctor => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-image">
                  <img src={doctor.image} alt={doctor.name} />
                </div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="specialty">{doctor.specialty}</p>
                  <p className="experience">{doctor.experience}</p>
                  <div className="doctor-contact">
                    <Link to={`/hospital/bac-si/${doctor.id}`} className="doctor-btn">Xem hồ sơ</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* News Section */}
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h2>Tin tức - Sự kiện</h2>
            <p>Cập nhật thông tin mới nhất về HIV/AIDS và hoạt động của bệnh viện</p>
          </div>
          
          <div className="news-grid">
            {news.map(item => (
              <div className="news-card" key={item.id}>
                <div className="news-image">
                  <img src={item.image} alt={item.title} />
                  <div className="news-date">{item.date}</div>
                </div>
                <div className="news-content">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <Link to={`/hospital/tin-tuc/${item.id}`} className="read-more">Đọc tiếp</Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="view-all-news">
            <Link to="/hospital/tin-tuc" className="view-all-btn">Xem tất cả tin tức</Link>
          </div>
        </div>
      </section>
      
      {/* Appointment Section */}
      <section className="appointment-section">
        <div className="container">
          <div className="appointment-grid">
            <div className="appointment-info">
              <h2>Đặt lịch khám</h2>
              <p>Đặt lịch khám trực tuyến để tiết kiệm thời gian và nhận được sự chăm sóc tốt nhất.</p>
              <ul className="appointment-benefits">
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Dễ dàng đặt lịch chỉ trong vài phút</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Lựa chọn bác sĩ và thời gian phù hợp</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Nhận thông báo nhắc lịch khám qua email hoặc SMS</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Hỗ trợ trực tuyến từ đội ngũ nhân viên chăm sóc khách hàng</span>
                </li>
              </ul>
              <Link to="/hospital/lich-kham" className="appointment-btn">Đặt lịch ngay</Link>
            </div>
            
            <div className="appointment-image">
              <img src="/appointment-banner.jpg" alt="Đặt lịch khám" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="container">
          <div className="statistics-grid">
            <div className="statistic-item">
              <div className="statistic-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="statistic-number">50+</div>
              <div className="statistic-title">Bác sĩ chuyên khoa</div>
            </div>
            
            <div className="statistic-item">
              <div className="statistic-icon">
                <i className="fas fa-procedures"></i>
              </div>
              <div className="statistic-number">10.000+</div>
              <div className="statistic-title">Bệnh nhân điều trị</div>
            </div>
            
            <div className="statistic-item">
              <div className="statistic-icon">
                <i className="fas fa-hospital"></i>
              </div>
              <div className="statistic-number">15+</div>
              <div className="statistic-title">Năm kinh nghiệm</div>
            </div>
            
            <div className="statistic-item">
              <div className="statistic-icon">
                <i className="fas fa-award"></i>
              </div>
              <div className="statistic-number">20+</div>
              <div className="statistic-title">Giải thưởng</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Ý kiến bệnh nhân</h2>
            <p>Những chia sẻ từ bệnh nhân đã điều trị tại bệnh viện</p>
          </div>
          
          <div className="testimonials-wrapper">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="testimonial-content">
                "Tôi đã được chẩn đoán nhiễm HIV từ 5 năm trước và được điều trị tại đây. Tôi rất hài lòng với sự chăm sóc tận tình của đội ngũ y bác sĩ. Giờ đây sức khỏe của tôi đã ổn định và tôi có thể sống một cuộc sống bình thường."
              </p>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/testimonial-1.jpg" alt="Nguyễn Văn X" />
                </div>
                <div className="author-info">
                  <h4>Nguyễn Văn X</h4>
                  <p>Bệnh nhân điều trị 5 năm</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="testimonial-content">
                "Phòng khám có quy trình bảo mật thông tin rất tốt, điều này giúp tôi an tâm khi đến khám và điều trị. Các bác sĩ tư vấn rất tận tâm và giúp tôi hiểu rõ về tình trạng sức khỏe cũng như cách điều trị hiệu quả."
              </p>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/testimonial-2.jpg" alt="Trần Thị Y" />
                </div>
                <div className="author-info">
                  <h4>Trần Thị Y</h4>
                  <p>Bệnh nhân điều trị 3 năm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Liên hệ với chúng tôi</h2>
              <p>Hãy liên hệ nếu bạn có bất kỳ câu hỏi nào về dịch vụ của chúng tôi.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Địa chỉ</h4>
                    <p>78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Hotline</h4>
                    <p>1900-6889</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Email</h4>
                    <p>info@hivhospital.vn</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-text">
                    <h4>Giờ làm việc</h4>
                    <p>Thứ 2 - Thứ 6: 7:30 - 17:00</p>
                    <p>Thứ 7: 7:30 - 12:00</p>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            
            <div className="contact-form-container">
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Họ tên</label>
                  <input type="text" id="name" name="name" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input type="tel" id="phone" name="phone" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Chủ đề</label>
                  <input type="text" id="subject" name="subject" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Nội dung</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                
                <button type="submit" className="submit-btn">Gửi tin nhắn</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="hospital-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-column">
              <div className="footer-logo">
                <img src="/hospital-logo.png" alt="Bệnh viện Logo" />
                <span>BỆNH VIỆN ĐIỀU TRỊ HIV</span>
              </div>
              <p className="footer-desc">
                Bệnh viện chuyên điều trị HIV/AIDS hàng đầu Việt Nam, cung cấp dịch vụ chăm sóc y tế toàn diện và chất lượng cao.
              </p>
            </div>
            
            <div className="footer-column">
              <h3>Liên kết nhanh</h3>
              <ul className="footer-links">
                <li><Link to="/hospital">Trang chủ</Link></li>
                <li><Link to="/hospital/gioi-thieu">Giới thiệu</Link></li>
                <li><Link to="/hospital/chuyen-khoa">Chuyên khoa</Link></li>
                <li><Link to="/hospital/lich-kham">Đặt lịch khám</Link></li>
                <li><Link to="/hospital/tin-tuc">Tin tức</Link></li>
                <li><Link to="/hospital/lien-he">Liên hệ</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Dịch vụ</h3>
              <ul className="footer-links">
                <li><Link to="/hospital/dich-vu/tu-van">Tư vấn HIV/AIDS</Link></li>
                <li><Link to="/hospital/dich-vu/dieu-tri-arv">Điều trị ARV</Link></li>
                <li><Link to="/hospital/dich-vu/xet-nghiem">Xét nghiệm HIV</Link></li>
                <li><Link to="/hospital/dich-vu/benh-dong-nhiem">Điều trị bệnh đồng nhiễm</Link></li>
                <li><Link to="/hospital/dich-vu/dinh-duong">Tư vấn dinh dưỡng</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Liên hệ</h3>
              <ul className="footer-contact">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội</span>
                </li>
                <li>
                  <i className="fas fa-phone-alt"></i>
                  <span>1900-6889</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>info@hivhospital.vn</span>
                </li>
              </ul>
              
              <div className="footer-social">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Bệnh viện Điều trị HIV. Tất cả quyền được bảo lưu.</p>
            <ul className="footer-legal">
              <li><Link to="/hospital/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/hospital/dieu-khoan-su-dung">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HospitalHome;
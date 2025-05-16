import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Department.css';

const HIVDepartment = () => {
  // Mô phỏng dữ liệu đội ngũ y tế
  const medicalTeam = [
    {
      id: 1,
      name: 'GS.TS. Nguyễn Văn A',
      role: 'Trưởng khoa HIV/AIDS',
      image: '/doctor-1.jpg',
      specialization: 'Chuyên gia về bệnh truyền nhiễm & HIV',
      experience: '30 năm kinh nghiệm',
      education: 'Tiến sĩ Y khoa, Đại học Y Hà Nội',
      bio: 'GS.TS. Nguyễn Văn A là một trong những chuyên gia hàng đầu về HIV/AIDS tại Việt Nam. Ông đã có nhiều đóng góp quan trọng trong lĩnh vực nghiên cứu và điều trị HIV.'
    },
    {
      id: 2,
      name: 'PGS.TS. Trần Thị B',
      role: 'Phó khoa HIV/AIDS',
      image: '/doctor-2.jpg',
      specialization: 'Chuyên gia về điều trị ARV & nhiễm trùng cơ hội',
      experience: '25 năm kinh nghiệm',
      education: 'Tiến sĩ Y khoa, Đại học Y Dược TP.HCM',
      bio: 'PGS.TS. Trần Thị B có nhiều năm nghiên cứu và điều trị các bệnh nhiễm trùng cơ hội ở bệnh nhân HIV/AIDS. Bà đã tham gia nhiều dự án quốc tế về phòng chống HIV.'
    },
    {
      id: 3,
      name: 'TS.BS. Lê Văn C',
      role: 'Trưởng đơn vị điều trị',
      image: '/doctor-3.jpg',
      specialization: 'Chuyên gia về quản lý điều trị HIV & đồng nhiễm HIV-Lao',
      experience: '20 năm kinh nghiệm',
      education: 'Tiến sĩ Y khoa, Đại học Y Hà Nội',
      bio: 'TS.BS. Lê Văn C là chuyên gia về quản lý điều trị HIV và đồng nhiễm HIV-Lao. Ông đã có nhiều công trình nghiên cứu được đăng trên các tạp chí quốc tế uy tín.'
    },
    {
      id: 4,
      name: 'ThS.BS. Phạm Thị D',
      role: 'Trưởng đơn vị tư vấn',
      image: '/doctor-4.jpg',
      specialization: 'Chuyên gia tư vấn tâm lý & tuân thủ điều trị',
      experience: '15 năm kinh nghiệm',
      education: 'Thạc sĩ Tâm lý học lâm sàng, Đại học Khoa học Xã hội và Nhân văn',
      bio: 'ThS.BS. Phạm Thị D chuyên về tư vấn tâm lý và hỗ trợ bệnh nhân tuân thủ điều trị. Bà đã phát triển nhiều chương trình tư vấn hiệu quả cho người nhiễm HIV.'
    }
  ];

  // Mô phỏng dữ liệu dịch vụ của khoa
  const services = [
    {
      id: 1,
      title: 'Xét nghiệm và chẩn đoán HIV',
      icon: 'fa-vial',
      description: 'Xét nghiệm nhanh và chính xác với công nghệ tiên tiến, đảm bảo kết quả chính xác và bảo mật.',
      features: [
        'Xét nghiệm sàng lọc HIV',
        'Xét nghiệm khẳng định HIV',
        'Xét nghiệm tải lượng virus',
        'Xét nghiệm CD4'
      ]
    },
    {
      id: 2,
      title: 'Điều trị ARV',
      icon: 'fa-pills',
      description: 'Phác đồ điều trị ARV hiện đại theo hướng dẫn quốc gia và quốc tế, giúp kiểm soát virus HIV hiệu quả.',
      features: [
        'Phác đồ điều trị cá nhân hóa',
        'Thuốc ARV thế hệ mới',
        'Theo dõi điều trị định kỳ',
        'Quản lý tác dụng phụ'
      ]
    },
    {
      id: 3,
      title: 'Quản lý và điều trị bệnh đồng nhiễm',
      icon: 'fa-virus',
      description: 'Điều trị toàn diện các bệnh đồng nhiễm thường gặp ở người nhiễm HIV như lao, viêm gan virus.',
      features: [
        'Điều trị đồng nhiễm HIV-Lao',
        'Điều trị đồng nhiễm HIV-Viêm gan',
        'Quản lý nhiễm trùng cơ hội',
        'Phòng ngừa bệnh đồng nhiễm'
      ]
    },
    {
      id: 4,
      title: 'Tư vấn và hỗ trợ tâm lý',
      icon: 'fa-hands-helping',
      description: 'Dịch vụ tư vấn chuyên nghiệp, giúp người bệnh và gia đình đối phó với thách thức tâm lý khi sống với HIV.',
      features: [
        'Tư vấn trước và sau xét nghiệm',
        'Tư vấn tuân thủ điều trị',
        'Hỗ trợ tâm lý cá nhân và nhóm',
        'Kết nối với nhóm hỗ trợ đồng đẳng'
      ]
    },
    {
      id: 5,
      title: 'Phòng ngừa lây truyền HIV',
      icon: 'fa-shield-alt',
      description: 'Các biện pháp can thiệp hiệu quả để ngăn ngừa lây truyền HIV từ mẹ sang con và giữa các cá nhân.',
      features: [
        'Dự phòng trước phơi nhiễm (PrEP)',
        'Dự phòng sau phơi nhiễm (PEP)',
        'Phòng lây truyền từ mẹ sang con',
        'Tư vấn giảm hại'
      ]
    },
    {
      id: 6,
      title: 'Chăm sóc dinh dưỡng',
      icon: 'fa-apple-alt',
      description: 'Đánh giá và tư vấn dinh dưỡng cá nhân hóa để nâng cao sức khỏe và hiệu quả điều trị cho người nhiễm HIV.',
      features: [
        'Đánh giá tình trạng dinh dưỡng',
        'Lập kế hoạch dinh dưỡng cá nhân',
        'Tư vấn bổ sung vi chất',
        'Quản lý tác dụng phụ qua dinh dưỡng'
      ]
    }
  ];

  // Mô phỏng dữ liệu thành tựu và con số
  const statistics = [
    { id: 1, number: '15,000+', title: 'Bệnh nhân được điều trị', icon: 'fa-user-md' },
    { id: 2, number: '95%', title: 'Tỷ lệ điều trị thành công', icon: 'fa-chart-line' },
    { id: 3, number: '25+', title: 'Năm kinh nghiệm', icon: 'fa-history' },
    { id: 4, number: '30+', title: 'Chuyên gia y tế', icon: 'fa-users' }
  ];

  // Mô phỏng dữ liệu công trình nghiên cứu
  const researchProjects = [
    {
      id: 1,
      title: 'Nghiên cứu hiệu quả của phác đồ điều trị ARV mới trên bệnh nhân HIV tại Việt Nam',
      authors: 'GS.TS. Nguyễn Văn A, PGS.TS. Trần Thị B',
      year: '2022',
      journal: 'Tạp chí Y học Việt Nam',
      summary: 'Nghiên cứu đánh giá hiệu quả của phác đồ điều trị ARV thế hệ mới trên 500 bệnh nhân HIV tại Việt Nam.'
    },
    {
      id: 2,
      title: 'Đánh giá tác động của chương trình tư vấn tuân thủ điều trị cho bệnh nhân HIV',
      authors: 'ThS.BS. Phạm Thị D, TS.BS. Lê Văn C',
      year: '2023',
      journal: 'Tạp chí Y tế Công cộng',
      summary: 'Nghiên cứu cho thấy chương trình tư vấn tuân thủ điều trị làm tăng tỷ lệ tuân thủ từ 70% lên 92%.'
    },
    {
      id: 3,
      title: 'Phân tích các yếu tố ảnh hưởng đến chất lượng cuộc sống của người sống với HIV tại Việt Nam',
      authors: 'PGS.TS. Trần Thị B và cộng sự',
      year: '2024',
      journal: 'International Journal of HIV Research',
      summary: 'Nghiên cứu phân tích các yếu tố xã hội, kinh tế và y tế ảnh hưởng đến chất lượng cuộc sống của 1,200 người sống với HIV.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="department-container">
        {/* Banner Section */}
        <div className="department-banner">
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <h1>Khoa HIV/AIDS</h1>
            <p>Chăm sóc toàn diện và chất lượng cao cho người sống với HIV</p>
          </div>
        </div>
        
        {/* Introduction Section */}
        <section className="department-intro">
          <div className="section-container">
            <div className="section-header">
              <h2>Giới thiệu khoa HIV/AIDS</h2>
              <div className="section-divider"></div>
            </div>
            
            <div className="intro-content">
              <div className="intro-text">
                <p className="intro-highlight">Khoa HIV/AIDS được thành lập từ năm 2000, là một trong những đơn vị chuyên khoa hàng đầu về điều trị và chăm sóc HIV/AIDS tại Việt Nam.</p>
                
                <p>Với đội ngũ y bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại, chúng tôi cung cấp dịch vụ chăm sóc toàn diện cho người sống với HIV, bao gồm chẩn đoán, điều trị, tư vấn tâm lý và hỗ trợ xã hội.</p>
                
                <p>Khoa HIV/AIDS là đơn vị tiên phong trong việc ứng dụng các phác đồ điều trị tiên tiến và tham gia nhiều nghiên cứu quốc tế về HIV/AIDS. Chúng tôi cam kết mang lại dịch vụ chăm sóc chất lượng cao trong một môi trường tôn trọng, riêng tư và không phân biệt đối xử.</p>
              </div>
              
              <div className="intro-image">
                <img src="/department-image.jpg" alt="Khoa HIV/AIDS" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="department-services">
          <div className="section-container">
            <div className="section-header">
              <h2>Dịch vụ của chúng tôi</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">Khoa HIV/AIDS cung cấp các dịch vụ chăm sóc toàn diện cho người sống với HIV</p>
            </div>
            
            <div className="services-grid">
              {services.map(service => (
                <div className="service-card" key={service.id}>
                  <div className="service-icon">
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Statistics Section */}
        <section className="department-statistics">
          <div className="statistics-overlay"></div>
          <div className="section-container">
            <div className="statistics-grid">
              {statistics.map(stat => (
                <div className="statistic-item" key={stat.id}>
                  <div className="statistic-icon">
                    <i className={`fas ${stat.icon}`}></i>
                  </div>
                  <div className="statistic-number">{stat.number}</div>
                  <div className="statistic-title">{stat.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Medical Team Section */}
        <section className="department-team">
          <div className="section-container">
            <div className="section-header">
              <h2>Đội ngũ y tế</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">Gặp gỡ các chuyên gia đầu ngành của chúng tôi trong lĩnh vực HIV/AIDS</p>
            </div>
            
            <div className="team-grid">
              {medicalTeam.map(doctor => (
                <div className="doctor-card" key={doctor.id}>
                  <div className="doctor-image">
                    <img src={doctor.image} alt={doctor.name} />
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <div className="doctor-role">{doctor.role}</div>
                    <div className="doctor-specialization">{doctor.specialization}</div>
                    <p className="doctor-bio">{doctor.bio}</p>
                    <div className="doctor-details">
                      <div className="detail-item">
                        <i className="fas fa-graduation-cap"></i>
                        <span>{doctor.education}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-briefcase"></i>
                        <span>{doctor.experience}</span>
                      </div>
                    </div>
                    <button className="appointment-btn">
                      <i className="fas fa-calendar-check"></i>
                      Đặt lịch hẹn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Research Section */}
        <section className="department-research">
          <div className="section-container">
            <div className="section-header">
              <h2>Nghiên cứu khoa học</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">Các công trình nghiên cứu nổi bật từ đội ngũ chuyên gia của chúng tôi</p>
            </div>
            
            <div className="research-list">
              {researchProjects.map(project => (
                <div className="research-item" key={project.id}>
                  <div className="research-content">
                    <h3>{project.title}</h3>
                    <div className="research-meta">
                      <div className="meta-item">
                        <i className="fas fa-users"></i>
                        <span>{project.authors}</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{project.year}</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-book-open"></i>
                        <span>{project.journal}</span>
                      </div>
                    </div>
                    <p>{project.summary}</p>
                  </div>
                  <div className="research-actions">
                    <button className="research-btn">
                      <i className="fas fa-file-pdf"></i>
                      Xem bài nghiên cứu
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="research-more">
              <button className="view-all-btn">
                <span>Xem tất cả nghiên cứu</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </section>
        
        {/* Appointment Section */}
        <section className="department-appointment">
          <div className="section-container">
            <div className="appointment-box">
              <div className="appointment-content">
                <h2>Đặt lịch khám tại Khoa HIV/AIDS</h2>
                <p>Hãy đặt lịch hẹn trực tuyến để được khám và tư vấn bởi các chuyên gia đầu ngành của chúng tôi.</p>
                <div className="appointment-features">
                  <div className="feature-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Đội ngũ y bác sĩ chuyên khoa giàu kinh nghiệm</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Trang thiết bị hiện đại, phương pháp điều trị tiên tiến</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Môi trường riêng tư, tôn trọng và bảo mật thông tin</span>
                  </div>
                </div>
                <Link to="/appointments" className="make-appointment-btn">
                  <i className="fas fa-calendar-plus"></i>
                  Đặt lịch ngay
                </Link>
              </div>
              <div className="appointment-image">
                <img src="/appointment-image.jpg" alt="Đặt lịch khám" />
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="department-faq">
          <div className="section-container">
            <div className="section-header">
              <h2>Câu hỏi thường gặp</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">Giải đáp những thắc mắc phổ biến về HIV/AIDS và dịch vụ của chúng tôi</p>
            </div>
            
            <div className="faq-container">
              <div className="faq-item">
                <div className="faq-question">
                  <h3>Khi nào tôi nên xét nghiệm HIV?</h3>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>Bạn nên xét nghiệm HIV nếu bạn có nguy cơ phơi nhiễm như quan hệ tình dục không bảo vệ, dùng chung kim tiêm, hoặc tiếp xúc với máu của người nhiễm HIV. Việc xét nghiệm định kỳ được khuyến nghị cho những người có nhiều bạn tình hoặc thuộc nhóm nguy cơ cao.</p>
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question">
                  <h3>Thuốc ARV có tác dụng phụ gì không?</h3>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>Thuốc ARV hiện đại có ít tác dụng phụ hơn so với trước đây. Các tác dụng phụ thường gặp có thể bao gồm buồn nôn, đau đầu, mệt mỏi trong vài tuần đầu điều trị. Hầu hết tác dụng phụ sẽ giảm dần theo thời gian. Tuy nhiên, mỗi người có thể có phản ứng khác nhau với thuốc, vì vậy cần thông báo cho bác sĩ nếu gặp bất kỳ vấn đề nào.</p>
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question">
                  <h3>Tôi có thể sống bao lâu nếu nhiễm HIV?</h3>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>Với các phác đồ điều trị ARV hiện đại, người nhiễm HIV có thể sống khỏe mạnh và có tuổi thọ gần như bình thường. Điều quan trọng là phát hiện sớm, điều trị ARV đúng cách và tuân thủ phác đồ điều trị. Nhiều người nhiễm HIV hiện nay có thể sống hàng chục năm mà không phát triển thành AIDS.</p>
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question">
                  <h3>Làm thế nào để đăng ký khám tại Khoa HIV/AIDS?</h3>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>Bạn có thể đăng ký khám tại Khoa HIV/AIDS bằng cách đặt lịch trực tuyến thông qua website hoặc ứng dụng của bệnh viện, gọi điện đến số hotline 1900-6889, hoặc đến trực tiếp quầy đăng ký của khoa. Chúng tôi khuyến khích đặt lịch trước để giảm thời gian chờ đợi và chuẩn bị tốt nhất cho buổi khám.</p>
                </div>
              </div>
            </div>
            
            <div className="faq-more">
              <Link to="/resources" className="view-more-btn">
                <span>Xem thêm câu hỏi thường gặp</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="department-contact">
          <div className="section-container">
            <div className="contact-box">
              <div className="contact-info">
                <h2>Liên hệ với chúng tôi</h2>
                <p>Nếu bạn có bất kỳ câu hỏi nào hoặc cần được tư vấn, vui lòng liên hệ với chúng tôi qua:</p>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <i className="fas fa-phone-alt"></i>
                    <div>
                      <h3>Điện thoại</h3>
                      <p>Hotline: 1900-6889</p>
                      <p>Văn phòng khoa: 024-1234-5678</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <h3>Email</h3>
                      <p>hiv.department@hivhospital.vn</p>
                      <p>info@hivhospital.vn</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <h3>Địa chỉ</h3>
                      <p>Khoa HIV/AIDS - Tầng 3, Nhà A1</p>
                      <p>Bệnh viện Bạch Mai, Hà Nội, Việt Nam</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <h3>Giờ làm việc</h3>
                      <p>Thứ Hai - Thứ Sáu: 7:30 - 17:00</p>
                      <p>Thứ Bảy: 7:30 - 12:00</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="contact-form">
                <h3>Gửi tin nhắn cho chúng tôi</h3>
                <form>
                  <div className="form-group">
                    <input type="text" placeholder="Họ và tên" required />
                  </div>
                  
                  <div className="form-group">
                    <input type="email" placeholder="Email" required />
                  </div>
                  
                  <div className="form-group">
                    <input type="tel" placeholder="Số điện thoại" />
                  </div>
                  
                  <div className="form-group">
                    <select>
                      <option value="">Chọn chủ đề</option>
                      <option value="appointment">Đặt lịch khám</option>
                      <option value="consultation">Tư vấn điều trị</option>
                      <option value="information">Thông tin chung</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <textarea placeholder="Nội dung tin nhắn" rows="5" required></textarea>
                  </div>
                  
                  <button type="submit" className="send-message-btn">
                    <i className="fas fa-paper-plane"></i>
                    Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HIVDepartment;
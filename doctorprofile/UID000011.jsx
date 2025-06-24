import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import '../src/styles/DoctorDetail.css';
import { getAllDoctors } from '../src/api/auth';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDoctorData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Lấy tất cả bác sĩ từ API
        const allDoctors = await getAllDoctors();
        console.log('All doctors from API:', allDoctors);
        
        // Tìm bác sĩ theo ID
        const foundDoctor = allDoctors.find(doc => doc.UserID === id);
        
        if (foundDoctor) {
          // Format dữ liệu bác sĩ với thông tin bổ sung
          const formattedDoctor = {
            ...foundDoctor,
            ImageUrl: foundDoctor.ImageUrl || "https://randomuser.me/api/portraits/men/32.jpg",
            ExperienceYears: foundDoctor.ExperienceYears || 5,
            LicenseNumber: foundDoctor.LicenseNumber || "BS-2024-0000",
            Email: foundDoctor.Email || "doctor@hospital.com",
            Phone: foundDoctor.Phone || "090-000-0000",
            Education: "Đại học Y Hà Nội - Chuyên ngành Nội khoa",
            Certifications: [
              "Chứng chỉ chuyên khoa HIV/AIDS",
              "Chứng chỉ điều trị ARV",
              "Chứng chỉ tư vấn sức khỏe tâm thần"
            ],
            Languages: ["Tiếng Việt", "Tiếng Anh"],
            WorkingHours: {
              "Thứ 2 - Thứ 6": "08:00 - 17:00",
              "Thứ 7": "08:00 - 12:00",
              "Chủ nhật": "Nghỉ"
            },
            Biography: `Bác sĩ ${foundDoctor.FullName || foundDoctor.Fullname} là một chuyên gia có kinh nghiệm trong lĩnh vực ${foundDoctor.Specialization || foundDoctor.specialization || 'y tế'}. 
            Với ${foundDoctor.ExperienceYears || 5} năm kinh nghiệm, bác sĩ đã tham gia điều trị cho nhiều bệnh nhân và có nhiều đóng góp quan trọng trong việc chăm sóc sức khỏe cộng đồng.`,
            Specializations: [
              foundDoctor.Specialization || foundDoctor.specialization || "Chuyên khoa chung",
              "Điều trị ARV",
              "Tư vấn sức khỏe tâm thần",
              "Quản lý bệnh mãn tính",
              "Tư vấn dinh dưỡng"
            ],
            Awards: [
              "Giải thưởng Bác sĩ xuất sắc năm 2023",
              "Chứng nhận từ Hiệp hội Y khoa Việt Nam",
              "Giải thưởng nghiên cứu y khoa 2022"
            ],
            Publications: [
              "Nghiên cứu về hiệu quả điều trị bệnh nhân",
              "Hướng dẫn điều trị cho bác sĩ đa khoa",
              "Tài liệu tư vấn dinh dưỡng cho bệnh nhân"
            ]
          };
          setDoctor(formattedDoctor);
        } else {
          setError(`Không tìm thấy bác sĩ với ID: ${id}`);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bác sĩ:', error);
        setError('Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.');
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải thông tin bác sĩ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-profile-page">
        <Navbar />
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Không thể tải thông tin bác sĩ</h2>
          <p>{error}</p>
          <Link to="/hospital/bac-si" className="back-button">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-page">
        <Navbar />
        <div className="error-container">
          <h2>Không tìm thấy thông tin bác sĩ</h2>
          <Link to="/hospital/bac-si" className="back-button">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-profile-page">
      <Navbar />
      
      <div className="doctor-profile-hero">
        <div className="container">
          <div className="doctor-profile-header">
            <div className="doctor-avatar">
              <img src={doctor.ImageUrl} alt={doctor.FullName || doctor.Fullname} />
            </div>
            <div className="doctor-basic-info">
              <h1>{doctor.FullName || doctor.Fullname}</h1>
              <p className="specialty">
                <i className="fas fa-stethoscope"></i>
                {doctor.Specialization || doctor.specialization}
              </p>
              <p className="experience">
                <i className="fas fa-history"></i>
                {doctor.ExperienceYears} năm kinh nghiệm
              </p>
              <p className="license">
                <i className="fas fa-id-card"></i>
                Giấy phép: {doctor.LicenseNumber}
              </p>
              <div className="doctor-actions">
                <Link to="/hospital/lich-kham" className="book-appointment-btn">
                  <i className="fas fa-calendar-plus"></i>
                  Đặt lịch khám
                </Link>
                {/* <Link to="/hospital/consulting" className="consult-btn">
                  <i className="fas fa-comments"></i>
                  Tư vấn trực tuyến
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="doctor-profile-content">
        <div className="container">
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan
            </button>
            <button 
              className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              Kinh nghiệm & Chứng chỉ
            </button>
            <button 
              className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              Lịch làm việc
            </button>
            <button 
              className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Liên hệ
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="biography-section">
                  <h3>Tiểu sử</h3>
                  <p>{doctor.Biography}</p>
                </div>
                
                <div className="specializations-section">
                  <h3>Chuyên môn</h3>
                  <div className="specializations-grid">
                    {doctor.Specializations.map((spec, index) => (
                      <div key={index} className="specialization-item">
                        <i className="fas fa-check-circle"></i>
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="languages-section">
                  <h3>Ngôn ngữ</h3>
                  <div className="languages-list">
                    {doctor.Languages.map((lang, index) => (
                      <span key={index} className="language-tag">{lang}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="experience-tab">
                <div className="education-section">
                  <h3>Học vấn</h3>
                  <div className="education-item">
                    <i className="fas fa-graduation-cap"></i>
                    <div>
                      <h4>Đại học Y Hà Nội</h4>
                      <p>Chuyên ngành Nội khoa</p>
                    </div>
                  </div>
                </div>

                <div className="certifications-section">
                  <h3>Chứng chỉ</h3>
                  <div className="certifications-list">
                    {doctor.Certifications.map((cert, index) => (
                      <div key={index} className="certification-item">
                        <i className="fas fa-certificate"></i>
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="awards-section">
                  <h3>Giải thưởng & Thành tựu</h3>
                  <div className="awards-list">
                    {doctor.Awards.map((award, index) => (
                      <div key={index} className="award-item">
                        <i className="fas fa-trophy"></i>
                        {award}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="publications-section">
                  <h3>Công trình nghiên cứu</h3>
                  <div className="publications-list">
                    {doctor.Publications.map((pub, index) => (
                      <div key={index} className="publication-item">
                        <i className="fas fa-book"></i>
                        {pub}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="schedule-tab">
                <h3>Lịch làm việc</h3>
                <div className="schedule-grid">
                  {Object.entries(doctor.WorkingHours).map(([day, hours]) => (
                    <div key={day} className="schedule-item">
                      <div className="day">{day}</div>
                      <div className="hours">{hours}</div>
                    </div>
                  ))}
                </div>
                <div className="schedule-note">
                  <p><i className="fas fa-info-circle"></i> Lịch có thể thay đổi. Vui lòng liên hệ để xác nhận.</p>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="contact-tab">
                <h3>Thông tin liên hệ</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <h4>Email</h4>
                      <p>{doctor.Email}</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <div>
                      <h4>Điện thoại</h4>
                      <p>{doctor.Phone}</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <h4>Địa chỉ</h4>
                      <p>Khoa HIV/AIDS - Bệnh viện Đa khoa Trung ương</p>
                    </div>
                  </div>
                </div>
                
                <div className="contact-actions">
                  <button className="contact-btn">
                    <i className="fas fa-phone"></i>
                    Gọi điện
                  </button>
                  <button className="contact-btn">
                    <i className="fas fa-envelope"></i>
                    Gửi email
                  </button>
                  <button className="contact-btn">
                    <i className="fas fa-video"></i>
                    Video call
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Đặt lịch khám với bác sĩ {doctor.FullName || doctor.Fullname}</h2>
            <p>Đặt lịch hẹn trực tuyến nhanh chóng và tiện lợi</p>
            <Link to="/hospital/lich-kham" className="cta-button">Đặt lịch ngay</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorProfile;

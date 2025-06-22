import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DoctorDetail.css';
import { getDoctorById, getAllDoctors } from '../api/auth';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const navigate = useNavigate();  useEffect(() => {
    // Fetch doctor data from API
    const fetchDoctor = async () => {
      setIsLoading(true);
      try {
        // Call API to get doctor details by ID
        const doctorData = await getDoctorById(id);
        
        if (doctorData) {
          setDoctor(doctorData);
          
          // Fetch related doctors with same specialty
          try {
            const allDoctors = await getAllDoctors();
            if (allDoctors && allDoctors.length > 0) {
              // Filter doctors with the same specialty, excluding current doctor
              const related = allDoctors
                .filter(doc => doc.specialty === doctorData.specialty && doc.id !== doctorData.id)
                .slice(0, 3); // Get max 3 related doctors
              setRelatedDoctors(related);
            }
          } catch (relatedError) {
            console.error('Lỗi khi tải danh sách bác sĩ liên quan:', relatedError);
          }
        } else {
          setError('Không tìm thấy thông tin bác sĩ');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thông tin bác sĩ:', error);
        setError('Đã xảy ra lỗi khi tải thông tin bác sĩ');
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

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
      <div className="error-container">
        <Navbar />
        <div className="error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>{error}</h2>
          <p>Vui lòng thử lại sau hoặc quay lại trang danh sách bác sĩ</p>
          <button onClick={handleGoBack} className="back-button">
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="not-found-container">
        <Navbar />
        <div className="not-found-content">
          <i className="fas fa-user-md"></i>
          <h2>Không tìm thấy thông tin bác sĩ</h2>
          <p>Bác sĩ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
          <Link to="/hospital/bac-si" className="back-button">
            <i className="fas fa-arrow-left"></i> Xem danh sách bác sĩ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-detail-page">
      <Navbar />
      
      <div className="doctor-detail-container">
        <div className="container">
          <div className="back-link">
            <button onClick={handleGoBack}>
              <i className="fas fa-arrow-left"></i> Quay lại
            </button>
          </div>
          
          <div className="doctor-profile">
            <div className="doctor-profile-header">
              <div className="doctor-image">
                <img src={doctor.image} alt={doctor.name} />
              </div>
              
              <div className="doctor-info">
                <h1>{doctor.name}</h1>
                <p className="specialty">{doctor.specialty}</p>
                <div className="doctor-meta">
                  <div className="meta-item">
                    <i className="fas fa-graduation-cap"></i>
                    <span>{doctor.education}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{doctor.workSchedule}</span>
                  </div>
                </div>
                
                <div className="doctor-actions">
                  <Link to="/hospital/lich-kham" className="appointment-btn">
                    <i className="fas fa-calendar-plus"></i> Đặt lịch hẹn
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="doctor-profile-content">
              <div className="profile-section">
                <h2>Giới thiệu</h2>
                <p>{doctor.description}</p>
                <p>{doctor.bio}</p>
              </div>
              
              <div className="profile-section">
                <h2>Chứng chỉ và đào tạo</h2>
                <ul className="certificate-list">
                  {doctor.certifications.map((cert, index) => (
                    <li key={index}><i className="fas fa-certificate"></i> {cert}</li>
                  ))}
                </ul>
              </div>
              
              {doctor.researchPapers && doctor.researchPapers.length > 0 && (
                <div className="profile-section">
                  <h2>Nghiên cứu khoa học</h2>
                  <ul className="research-list">
                    {doctor.researchPapers.map((paper, index) => (
                      <li key={index}><i className="fas fa-file-alt"></i> {paper}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="profile-section">
                <h2>Thông tin thêm</h2>
                <div className="additional-info">
                  <div className="info-item">
                    <h3>Ngôn ngữ</h3>
                    <p>{doctor.languages.join(', ')}</p>
                  </div>
                  
                  {doctor.awards && doctor.awards.length > 0 && (
                    <div className="info-item">
                      <h3>Giải thưởng</h3>
                      <ul>
                        {doctor.awards.map((award, index) => (
                          <li key={index}>{award}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <section className="related-doctors">
        <div className="container">
          <h2>Bác sĩ cùng chuyên khoa</h2>
          <div className="doctors-slider">
            {relatedDoctors.length > 0 ? (
              relatedDoctors.map(relatedDoctor => (
                <div className="doctor-card" key={relatedDoctor.id}>
                  <div className="doctor-image">
                    <img src={relatedDoctor.image || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                         alt={relatedDoctor.name} />
                  </div>
                  <div className="doctor-info">
                    <h3>{relatedDoctor.name}</h3>
                    <p>{relatedDoctor.specialty}</p>
                    <Link to={`/hospital/bac-si/${relatedDoctor.id}`} className="view-profile">
                      Xem hồ sơ
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-related-doctors">
                <p>Không có bác sĩ khác trong cùng chuyên khoa</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Bạn cần tư vấn thêm?</h2>
            <p>Liên hệ với chúng tôi để được hỗ trợ</p>
            <Link to="/hospital/lien-he" className="cta-button">Liên hệ ngay</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorDetail;

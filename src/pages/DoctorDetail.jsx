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
          console.log('Doctor detail data from API:', doctorData);
          setDoctor(doctorData);
          
          // Fetch related doctors with same specialty
          try {
            const allDoctors = await getAllDoctors();
            console.log('All doctors data for related doctors:', allDoctors);
            
            if (allDoctors && Array.isArray(allDoctors) && allDoctors.length > 0) {
              // Get current doctor's specialty
              const currentSpecialty = doctorData.Specialization || doctorData.specialty;
              
              // Filter doctors with the same specialty, excluding current doctor
              const related = allDoctors
                .filter(doc => {
                  const docSpecialty = doc.Specialization || doc.specialty;
                  const docId = doc.UserID || doc.id;
                  const currentId = doctorData.UserID || doctorData.id;
                  return docSpecialty === currentSpecialty && docId !== currentId;
                })
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
                <img 
                  src={doctor.image || "https://randomuser.me/api/portraits/med/men/32.jpg"} 
                  alt={doctor.Fullname || doctor.name || "Bác sĩ"} 
                />
              </div>
              
              <div className="doctor-info">
                <h1>{doctor.Fullname || doctor.name}</h1>
                <p className="specialty">{doctor.Specialization || doctor.specialty || "Chuyên khoa chung"}</p>
                <div className="doctor-meta">
                  <div className="meta-item">
                    <i className="fas fa-id-card"></i>
                    <span>Số giấy phép: {doctor.LicenseNumber || "N/A"}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{doctor.ExperienceYears ? `${doctor.ExperienceYears} năm kinh nghiệm` : doctor.experience || "Chưa cập nhật kinh nghiệm"}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-envelope"></i>
                    <span>{doctor.Email || "Email chưa cập nhật"}</span>
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
                <p>{doctor.Description || doctor.description || "Thông tin giới thiệu về bác sĩ đang được cập nhật."}</p>
                {doctor.bio && <p>{doctor.bio}</p>}
              </div>
              
              {(doctor.Certifications || doctor.certifications) && (
                <div className="profile-section">
                  <h2>Chứng chỉ và đào tạo</h2>
                  <ul className="certificate-list">
                    {doctor.Certifications ? (
                      <li><i className="fas fa-certificate"></i> {doctor.Certifications}</li>
                    ) : doctor.certifications && doctor.certifications.map ? (
                      doctor.certifications.map((cert, index) => (
                        <li key={index}><i className="fas fa-certificate"></i> {cert}</li>
                      ))
                    ) : null}
                  </ul>
                </div>
              )}
              
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
                  {doctor.languages && (
                    <div className="info-item">
                      <h3>Ngôn ngữ</h3>
                      <p>{Array.isArray(doctor.languages) ? doctor.languages.join(', ') : doctor.languages}</p>
                    </div>
                  )}
                  
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
                  
                  {doctor.UserID && (
                    <div className="info-item">
                      <h3>Mã bác sĩ</h3>
                      <p>{doctor.UserID}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>        <section className="related-doctors">
        <div className="container">
          <h2>Bác sĩ cùng chuyên khoa</h2>
          <div className="doctors-slider">
            {relatedDoctors.length > 0 ? (
              relatedDoctors.map(relatedDoctor => (
                <div className="doctor-card" key={relatedDoctor.UserID || relatedDoctor.id}>
                  <div className="doctor-image">
                    <img src={relatedDoctor.image || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                         alt={relatedDoctor.Fullname || relatedDoctor.name || 'Bác sĩ'} />
                  </div>
                  <div className="doctor-info">
                    <h3>{relatedDoctor.Fullname || relatedDoctor.name}</h3>
                    <p>{relatedDoctor.Specialization || relatedDoctor.specialty || 'Chuyên khoa chung'}</p>
                    <Link to={`/hospital/bac-si/${relatedDoctor.UserID || relatedDoctor.id}`} className="view-profile">
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

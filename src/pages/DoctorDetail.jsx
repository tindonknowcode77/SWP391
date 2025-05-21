import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DoctorDetail.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // This would be an API call in production
    const fetchDoctor = async () => {
      setIsLoading(true);
      try {
        // Simulating API call
        setTimeout(() => {
          // Sample doctors data
          const doctors = [
            {
              id: 1,
              name: 'BS. Nguyễn Văn A',
              specialty: 'Trưởng khoa HIV/AIDS',
              image: '/doctor-1.jpg',
              experience: '15 năm kinh nghiệm',
              education: 'Đại học Y Hà Nội',
              description: 'Bác sĩ Nguyễn Văn A là chuyên gia hàng đầu trong lĩnh vực điều trị HIV/AIDS với hơn 15 năm kinh nghiệm. Bác sĩ đã tham gia nhiều nghiên cứu quốc tế và có nhiều công trình nghiên cứu được công bố.',
              bio: 'Sau khi tốt nghiệp Đại học Y Hà Nội, bác sĩ A đã hoàn thành chương trình đào tạo chuyên khoa và bắt đầu sự nghiệp tại Bệnh viện điều trị HIV. Với hơn 15 năm kinh nghiệm, bác sĩ đã giúp hàng nghìn bệnh nhân điều trị thành công.',
              certifications: ['Bác sĩ chuyên khoa II', 'Thành viên Hội đồng Y khoa Việt Nam'],
              workSchedule: 'Thứ 2, 4, 6: 8:00 - 16:00',
              researchPapers: [
                'Nghiên cứu hiệu quả điều trị ARV tại Việt Nam (2018)',
                'Tác động của dinh dưỡng lên hiệu quả điều trị HIV (2020)'
              ],
              languages: ['Tiếng Việt', 'Tiếng Anh'],
              awards: ['Bác sĩ xuất sắc năm 2019', 'Giải thưởng y học Việt Nam 2021']
            },
            {
              id: 2,
              name: 'BS. Phạm Thị B',
              specialty: 'Bác sĩ điều trị HIV',
              image: '/doctor-2.jpg',
              experience: '10 năm kinh nghiệm',
              education: 'Đại học Y Dược TP.HCM',
              description: 'Bác sĩ Phạm Thị B chuyên về điều trị và theo dõi người nhiễm HIV. Với kinh nghiệm 10 năm trong lĩnh vực, bác sĩ đã giúp hàng nghìn bệnh nhân kiểm soát hiệu quả tình trạng bệnh.',
              bio: 'Bác sĩ B tốt nghiệp Đại học Y Dược TP.HCM và hoàn thành chương trình đào tạo chuyên khoa I về bệnh truyền nhiễm. Bác sĩ đặc biệt quan tâm đến việc cải thiện chất lượng cuộc sống cho người nhiễm HIV.',
              certifications: ['Bác sĩ chuyên khoa I', 'Chứng chỉ điều trị HIV quốc tế'],
              workSchedule: 'Thứ 3, 5, 7: 8:00 - 16:00',
              researchPapers: [
                'Nghiên cứu tác dụng phụ của ARV tại Việt Nam (2019)'
              ],
              languages: ['Tiếng Việt', 'Tiếng Anh'],
              awards: ['Bác sĩ tiêu biểu năm 2020']
            },
            {
              id: 3,
              name: 'BS. Trần Văn C',
              specialty: 'Chuyên gia tư vấn HIV',
              image: '/doctor-3.jpg',
              experience: '12 năm kinh nghiệm',
              education: 'Đại học Y Huế',
              description: 'Bác sĩ Trần Văn C là chuyên gia tư vấn tâm lý cho người nhiễm HIV và gia đình. Với phương pháp tiếp cận đặc biệt, bác sĩ đã giúp nhiều bệnh nhân vượt qua khó khăn tâm lý.',
              bio: 'Bác sĩ C tốt nghiệp Đại học Y Huế và là Tiến sĩ Y học chuyên ngành tâm lý lâm sàng. Với phương pháp tiếp cận toàn diện, bác sĩ chú trọng vào sức khỏe thể chất và tinh thần của người bệnh.',
              certifications: ['Tiến sĩ Y học', 'Chuyên gia tư vấn tâm lý lâm sàng'],
              workSchedule: 'Thứ 2, 3, 4, 5: 13:00 - 17:00',
              researchPapers: [
                'Tác động tâm lý của HIV đối với bệnh nhân Việt Nam (2017)',
                'Phương pháp tư vấn tâm lý cho người nhiễm HIV (2021)'
              ],
              languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Pháp'],
              awards: ['Giải thưởng tư vấn tâm lý xuất sắc 2018']
            },
            {
              id: 4,
              name: 'BS. Lê Thị D',
              specialty: 'Bác sĩ điều trị nhiễm trùng cơ hội',
              image: '/doctor-4.jpg',
              experience: '8 năm kinh nghiệm',
              education: 'Đại học Y Hà Nội',
              description: 'Bác sĩ Lê Thị D chuyên về chẩn đoán và điều trị các bệnh nhiễm trùng cơ hội liên quan đến HIV/AIDS. Bác sĩ có kinh nghiệm đặc biệt trong điều trị lao và các bệnh nấm ở bệnh nhân HIV.',
              bio: 'Sau khi tốt nghiệp Đại học Y Hà Nội, bác sĩ D đã tham gia nhiều khóa đào tạo chuyên sâu về các bệnh nhiễm trùng cơ hội ở người nhiễm HIV. Bác sĩ có kinh nghiệm đặc biệt trong chẩn đoán và điều trị lao.',
              certifications: ['Bác sĩ chuyên khoa I', 'Chứng chỉ về bệnh nhiễm trùng'],
              workSchedule: 'Thứ 2, 3, 4: 8:00 - 12:00, Thứ 5, 6: 13:00 - 17:00',
              researchPapers: [
                'Phòng ngừa và điều trị nhiễm trùng cơ hội ở bệnh nhân HIV (2020)'
              ],
              languages: ['Tiếng Việt', 'Tiếng Anh'],
              awards: []
            },
            {
              id: 5,
              name: 'BS. Đỗ Văn E',
              specialty: 'Chuyên gia dinh dưỡng HIV/AIDS',
              image: '/doctor-5.jpg',
              experience: '9 năm kinh nghiệm',
              education: 'Đại học Y Dược TP.HCM',
              description: 'Bác sĩ Đỗ Văn E là chuyên gia về dinh dưỡng cho người nhiễm HIV/AIDS. Bác sĩ giúp bệnh nhân xây dựng chế độ dinh dưỡng phù hợp để tăng cường hệ miễn dịch và cải thiện chất lượng cuộc sống.',
              bio: 'Bác sĩ E tốt nghiệp Đại học Y Dược TP.HCM và hoàn thành khóa đào tạo chuyên sâu về dinh dưỡng lâm sàng. Bác sĩ đặc biệt quan tâm đến vai trò của dinh dưỡng trong việc hỗ trợ điều trị HIV/AIDS.',
              certifications: ['Thạc sĩ Y học', 'Chuyên gia dinh dưỡng lâm sàng'],
              workSchedule: 'Thứ 3, 5: 8:00 - 16:00',
              researchPapers: [
                'Vai trò của dinh dưỡng trong điều trị HIV/AIDS (2019)',
                'Chế độ dinh dưỡng cho bệnh nhân HIV đang dùng ARV (2022)'
              ],
              languages: ['Tiếng Việt', 'Tiếng Anh'],
              awards: ['Giải thưởng nghiên cứu dinh dưỡng 2020']
            },
          ];

          const foundDoctor = doctors.find(doc => doc.id === parseInt(id));
          
          if (foundDoctor) {
            setDoctor(foundDoctor);
          } else {
            setError('Không tìm thấy thông tin bác sĩ');
          }
          
          setIsLoading(false);
        }, 1000);
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
            {/* This would be populated from an API with doctors of the same specialty */}
            <div className="doctor-card">
              <div className="doctor-image">
                <img src="/doctor-2.jpg" alt="Bác sĩ liên quan" />
              </div>
              <div className="doctor-info">
                <h3>BS. Phạm Thị B</h3>
                <p>Bác sĩ điều trị HIV</p>
                <Link to="/hospital/bac-si/2" className="view-profile">Xem hồ sơ</Link>
              </div>
            </div>
            
            <div className="doctor-card">
              <div className="doctor-image">
                <img src="/doctor-3.jpg" alt="Bác sĩ liên quan" />
              </div>
              <div className="doctor-info">
                <h3>BS. Trần Văn C</h3>
                <p>Chuyên gia tư vấn HIV</p>
                <Link to="/hospital/bac-si/3" className="view-profile">Xem hồ sơ</Link>
              </div>
            </div>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DoctorsList.css';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');

  useEffect(() => {
    // Fetch doctors data - this would be replaced with an actual API call in production
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          setDoctors([
            {
              id: 1,
              name: 'BS. Nguyễn Văn A',
              specialty: 'Trưởng khoa HIV/AIDS',
              image: '/doctor-1.jpg',
              experience: '15 năm kinh nghiệm',
              education: 'Đại học Y Hà Nội',
              description: 'Bác sĩ Nguyễn Văn A là chuyên gia hàng đầu trong lĩnh vực điều trị HIV/AIDS với hơn 15 năm kinh nghiệm. Bác sĩ đã tham gia nhiều nghiên cứu quốc tế và có nhiều công trình nghiên cứu được công bố.',
              certifications: ['Bác sĩ chuyên khoa II', 'Thành viên Hội đồng Y khoa Việt Nam']
            },
            {
              id: 2,
              name: 'BS. Phạm Thị B',
              specialty: 'Bác sĩ điều trị HIV',
              image: '/doctor-2.jpg',
              experience: '10 năm kinh nghiệm',
              education: 'Đại học Y Dược TP.HCM',
              description: 'Bác sĩ Phạm Thị B chuyên về điều trị và theo dõi người nhiễm HIV. Với kinh nghiệm 10 năm trong lĩnh vực, bác sĩ đã giúp hàng nghìn bệnh nhân kiểm soát hiệu quả tình trạng bệnh.',
              certifications: ['Bác sĩ chuyên khoa I', 'Chứng chỉ điều trị HIV quốc tế']
            },
            {
              id: 3,
              name: 'BS. Trần Văn C',
              specialty: 'Chuyên gia tư vấn HIV',
              image: '/doctor-3.jpg',
              experience: '12 năm kinh nghiệm',
              education: 'Đại học Y Huế',
              description: 'Bác sĩ Trần Văn C là chuyên gia tư vấn tâm lý cho người nhiễm HIV và gia đình. Với phương pháp tiếp cận đặc biệt, bác sĩ đã giúp nhiều bệnh nhân vượt qua khó khăn tâm lý.',
              certifications: ['Tiến sĩ Y học', 'Chuyên gia tư vấn tâm lý lâm sàng']
            },
            {
              id: 4,
              name: 'BS. Lê Thị D',
              specialty: 'Bác sĩ điều trị nhiễm trùng cơ hội',
              image: '/doctor-4.jpg',
              experience: '8 năm kinh nghiệm',
              education: 'Đại học Y Hà Nội',
              description: 'Bác sĩ Lê Thị D chuyên về chẩn đoán và điều trị các bệnh nhiễm trùng cơ hội liên quan đến HIV/AIDS. Bác sĩ có kinh nghiệm đặc biệt trong điều trị lao và các bệnh nấm ở bệnh nhân HIV.',
              certifications: ['Bác sĩ chuyên khoa I', 'Chứng chỉ về bệnh nhiễm trùng']
            },
            {
              id: 5,
              name: 'BS. Đỗ Văn E',
              specialty: 'Chuyên gia dinh dưỡng HIV/AIDS',
              image: '/doctor-5.jpg',
              experience: '9 năm kinh nghiệm',
              education: 'Đại học Y Dược TP.HCM',
              description: 'Bác sĩ Đỗ Văn E là chuyên gia về dinh dưỡng cho người nhiễm HIV/AIDS. Bác sĩ giúp bệnh nhân xây dựng chế độ dinh dưỡng phù hợp để tăng cường hệ miễn dịch và cải thiện chất lượng cuộc sống.',
              certifications: ['Thạc sĩ Y học', 'Chuyên gia dinh dưỡng lâm sàng']
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bác sĩ:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === '' || doctor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filter dropdown
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải danh sách bác sĩ...</p>
      </div>
    );
  }

  return (
    <div className="doctors-list-page">
      <Navbar />
      
      <div className="doctors-list-hero">
        <div className="container">
          <h1>Đội ngũ bác sĩ</h1>
          <p>Gặp gỡ những chuyên gia y tế giàu kinh nghiệm của chúng tôi</p>
        </div>
      </div>
      
      <div className="doctors-list-container">
        <div className="container">
          <div className="doctors-filter">
            <div className="search-filter">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên hoặc chuyên khoa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="specialty-filter">
              <select 
                value={filterSpecialty} 
                onChange={(e) => setFilterSpecialty(e.target.value)}
              >
                <option value="">Tất cả chuyên khoa</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="doctors-grid">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doctor => (
                <div className="doctor-card" key={doctor.id}>
                  <div className="doctor-image">
                    <img src={doctor.image} alt={doctor.name} />
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="specialty">{doctor.specialty}</p>
                    <p className="experience">{doctor.experience}</p>
                    <p className="education">{doctor.education}</p>
                    <div className="doctor-contact">
                      <Link to={`/hospital/bac-si/${doctor.id}`} className="doctor-btn">Xem hồ sơ</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <i className="fas fa-user-md"></i>
                <h3>Không tìm thấy bác sĩ phù hợp</h3>
                <p>Vui lòng thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Bạn cần đặt lịch khám?</h2>
            <p>Đặt lịch hẹn trực tuyến nhanh chóng và tiện lợi</p>
            <Link to="/hospital/lich-kham" className="cta-button">Đặt lịch ngay</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsList;

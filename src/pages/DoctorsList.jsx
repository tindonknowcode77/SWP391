import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DoctorsList.css';
import { getAllDoctors } from '../api/auth';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // Pagination for doctors
  const doctorsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctors data from API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Calling API to get all doctors
        const doctorsData = await getAllDoctors();
        console.log('Doctors data from API:', doctorsData);
        
        // Check if API returned valid data
        if (doctorsData && Array.isArray(doctorsData)) {
          setDoctors(doctorsData);
        } else {
          console.error('API không trả về dữ liệu bác sĩ dạng mảng:', doctorsData);
          setDoctors([]); // Set empty array if data format is incorrect
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bác sĩ từ API:', error);
        setIsLoading(false);
        navigate('/login');
      }
    };

    fetchData();
  }, []);
  // Helper function for safe toLowerCase handling
  const safeToLowerCase = (text) => {
    if (text && typeof text === 'string') {
      return text.toLowerCase();
    }
    return '';
  };
  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const doctorName = safeToLowerCase(doctor.Fullname || doctor.name);
    const doctorSpecialty = safeToLowerCase(doctor.specialization || doctor.specialty);
    const doctorEmail = safeToLowerCase(doctor.Email);
    const searchTermLower = safeToLowerCase(searchTerm);
    
    const matchesSearch = doctorName.includes(searchTermLower) ||
                         doctorSpecialty.includes(searchTermLower) ||
                         doctorEmail.includes(searchTermLower);
                         
    const matchesSpecialty = filterSpecialty === '' || 
                            (doctor.specialization === filterSpecialty) || 
                            (doctor.specialty === filterSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filter dropdown
  const specialties = [...new Set(doctors.map(doctor => doctor.specialization || doctor.specialty).filter(Boolean))];

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
          <p></p>
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
              filteredDoctors
                .slice(currentPage * doctorsPerPage, currentPage * doctorsPerPage + doctorsPerPage)
                .map(doctor => (
                  <div className="doctor-card" key={doctor.UserID || doctor.id}>
                    <div className="doctor-image">
                      <img 
                        src={doctor.image || "https://randomuser.me/api/portraits/med/men/32.jpg"} 
                        alt={doctor.Fullname || doctor.name || "Bác sĩ"} 
                      />
                    </div>
                    <div className="doctor-info">
                      <h3>{doctor.Fullname || doctor.name}</h3>
                      <p className="specialty">
                        <i className="fas fa-stethoscope"></i> {doctor.Specialization || doctor.Specialty || "Chuyên khoa chung"}
                      </p>
                      <p className="experience">
                        <i className="fas fa-history"></i> {doctor.ExperienceYears ? `${doctor.ExperienceYears} năm kinh nghiệm` : doctor.Experience || ""}
                      </p>
                      <p className="license-number">
                        <i className="fas fa-id-card"></i> Số giấy phép: {doctor.LicenseNumber || "N/A"}
                      </p>
                      <p className="email">
                        <i className="fas fa-envelope"></i> {doctor.Email || "Email không có sẵn"}
                      </p>
                      <div className="doctor-contact">
                        <Link to={`/hospital/bac-si/${doctor.UserID || doctor.id}`} className="doctor-btn">Xem hồ sơ</Link>
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
          {/* Pagination controls */}
          {filteredDoctors.length > doctorsPerPage && (
            <div className="doctor-pagination">
              <button
                className="doctor-pagination-arrow"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                aria-label="Trang trước"
              >
                &lt;
              </button>
              <span className="doctor-pagination-info">{currentPage + 1} / {Math.ceil(filteredDoctors.length / doctorsPerPage)}</span>
              <button
                className="doctor-pagination-arrow"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredDoctors.length / doctorsPerPage) - 1))}
                disabled={currentPage === Math.ceil(filteredDoctors.length / doctorsPerPage) - 1}
                aria-label="Trang sau"
              >
                &gt;
              </button>
            </div>
          )}
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

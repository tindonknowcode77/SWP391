import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/HIVTesting.css";
import Navbar from '../components/Navbar';
import { datxetnghiem, pantient } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const HIVTesting = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    PatientID: '',
    BookingType: 'Xét nghiệm',
    BookDate: '',
    Note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Lấy thông tin bệnh nhân khi component mount
  useEffect(() => {
    const fetchPatientInfo = async () => {
      if (!currentUser?.id) return;
      
      setIsLoadingPatient(true);
      try {
        const response = await pantient(currentUser.id);
        console.log('Patient info response:', response);
        
        if (response) {
          const patient = {
            PatientID: response.PatientId || response.PatientID,
            PatientFullname: response.Fullname || response.PatientFullname || currentUser.fullname
          };
          setPatientInfo(patient);
          
          // Tự động điền PatientID vào form
          setBookingData(prev => ({
            ...prev,
            PatientID: patient.PatientID || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching patient info:', error);
      } finally {
        setIsLoadingPatient(false);
      }
    };

    fetchPatientInfo();
  }, [currentUser]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleBookingClick = () => {
    // Tự động điền thông tin khi mở modal
    if (patientInfo) {
      setBookingData(prev => ({
        ...prev,
        PatientID: patientInfo.PatientID || ''
      }));
    }
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    // Reset form nhưng giữ lại tên bệnh nhân
    setBookingData({
      PatientID: patientInfo ? patientInfo.PatientID : '',
      BookingType: 'Xét nghiệm',
      BookDate: '',
      Note: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await datxetnghiem(bookingData);
      handleCloseModal();
      setShowSuccessModal(true);
    } catch (error) {
      alert('Đặt lịch thất bại. Vui lòng thử lại sau.');
      console.error('Error booking test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Chuyển hướng đến trang Profile với tab appointments
    navigate('/profile', { state: { tab: 'appointments' } });
  };

  const faqData = [
    {
      question: "Khi nào tôi nên xét nghiệm HIV?",
      answer: "Bạn nên xét nghiệm HIV nếu bạn: đã có quan hệ tình dục không an toàn; dùng chung kim tiêm; có quan hệ tình dục với người nhiễm HIV; có nhiều bạn tình; đang mang thai hoặc dự định mang thai; được chuẩn đoán mắc bệnh lây truyền qua đường tình dục; có triệu chứng giống bệnh cúm kéo dài sau khi có hành vi nguy cơ. Ngoài ra, các tổ chức y tế khuyến cáo mọi người từ 13-64 tuổi nên xét nghiệm HIV ít nhất một lần trong đời."
    },
    {
      question: "Xét nghiệm HIV có đau không?",
      answer: "Các xét nghiệm HIV hiện đại rất ít gây đau. Xét nghiệm nhanh thường chỉ cần lấy một giọt máu từ đầu ngón tay (tương tự như đo đường huyết), gây khó chịu nhẹ trong giây lát. Xét nghiệm từ dịch mô miệng thậm chí không gây đau đớn gì. Đối với xét nghiệm ELISA hoặc Western blot, cần lấy một lượng máu nhỏ từ tĩnh mạch, có thể gây khó chịu nhẹ tương tự như khi lấy máu xét nghiệm thông thường."
    },
    {
      question: "Tôi có thể xét nghiệm HIV ở đâu?",
      answer: "Bạn có thể xét nghiệm HIV tại nhiều nơi như bệnh viện công, phòng khám tư nhân, trung tâm tư vấn và xét nghiệm HIV tự nguyện (VCT), trung tâm kiểm soát bệnh tật (CDC) các tỉnh/thành phố, và một số tổ chức phi chính phủ làm việc trong lĩnh vực HIV/AIDS. Tại cơ sở y tế của chúng tôi, chúng tôi cung cấp dịch vụ xét nghiệm HIV chất lượng cao, bảo mật và nhanh chóng."
    },
    {
      question: "Sau khi có hành vi nguy cơ, bao lâu tôi nên đi xét nghiệm?",
      answer: "Sau khi có hành vi nguy cơ, cần một khoảng thời gian để cơ thể tạo ra đủ kháng thể hoặc kháng nguyên để xét nghiệm có thể phát hiện được, gọi là 'thời kỳ cửa sổ'. Các xét nghiệm thế hệ mới nhất (xét nghiệm kháng nguyên p24 và kháng thể) có thể phát hiện HIV sau khoảng 18-45 ngày. Xét nghiệm NAT (Nucleic Acid Testing) có thể phát hiện virus sớm hơn, chỉ sau khoảng 10-33 ngày. Tuy nhiên, nếu kết quả âm tính, bạn nên xét nghiệm lại sau 3 tháng để chắc chắn."
    },
    {
      question: "Có phải xét nghiệm HIV luôn chính xác không?",
      answer: "Các xét nghiệm HIV hiện đại có độ chính xác rất cao, trên 99%. Tuy nhiên, không có xét nghiệm nào đạt độ chính xác 100%. Trong một số trường hợp hiếm gặp, có thể có kết quả dương tính giả hoặc âm tính giả, đặc biệt nếu xét nghiệm được thực hiện trong thời kỳ cửa sổ. Đó là lý do tại sao các xét nghiệm dương tính cần được xác nhận bằng xét nghiệm thứ hai, và các xét nghiệm âm tính có thể cần được lặp lại sau thời gian thích hợp."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="testing-page">
        <div className="testing-header">
          
          <div className="cta-box-header">
            <h3>Bạn muốn xét nghiệm HIV?</h3>
            <p>Hãy đến với chúng tôi để được tư vấn và xét nghiệm bảo mật, chính xác</p>
            <button onClick={handleBookingClick} className="cta-btn-header">
              <i className="fas fa-calendar-check"></i> Đặt lịch xét nghiệm ngay
            </button>
          </div>
        </div>

        <div className="testing-content">
          <section className="section">
            <h2>Về dịch vụ xét nghiệm HIV</h2>
            <p>
              Xét nghiệm HIV là bước quan trọng trong việc phát hiện sớm nhiễm HIV, giúp người nhiễm tiếp cận sớm với
              dịch vụ chăm sóc và điều trị, từ đó nâng cao chất lượng cuộc sống và giảm nguy cơ lây truyền cho người khác.
            </p>
            <p>
              Tại cơ sở y tế của chúng tôi, chúng tôi cung cấp các dịch vụ xét nghiệm HIV hiện đại, nhanh chóng và chính xác
              với quy trình đảm bảo tính bảo mật cao nhất cho khách hàng. Đội ngũ tư vấn viên và kỹ thuật viên được đào tạo
              chuyên nghiệp sẽ hỗ trợ bạn trong suốt quá trình xét nghiệm.
            </p>
            <div className="confidentiality-box">
              <h3>Cam kết bảo mật</h3>
              <p>
                Chúng tôi hiểu tầm quan trọng của việc bảo mật thông tin cá nhân và kết quả xét nghiệm. Mọi thông tin của bạn
                sẽ được bảo vệ nghiêm ngặt theo quy định của pháp luật và chỉ được chia sẻ với các nhân viên y tế liên quan
                trực tiếp đến việc chăm sóc sức khỏe của bạn.
              </p>
            </div>
          </section>

          <section className="section">
            <h2>Các loại xét nghiệm HIV</h2>
            <p>
              Chúng tôi cung cấp đa dạng các phương pháp xét nghiệm HIV phù hợp với nhu cầu và hoàn cảnh của từng cá nhân.
              Mỗi loại xét nghiệm có ưu điểm và thời gian phát hiện khác nhau.
            </p>

            <div className="testing-types">
              <div className="testing-type-card">
                <div className="icon">
                  <i className="fas fa-stopwatch"></i>
                </div>
                <h3>Xét nghiệm nhanh</h3>
                <p>
                  Cung cấp kết quả trong vòng 15-20 phút. Được thực hiện bằng cách lấy mẫu máu từ đầu ngón tay hoặc dịch mô miệng.
                  Phù hợp cho những người cần biết kết quả ngay.
                </p>
              </div>

              <div className="testing-type-card">
                <div className="icon">
                  <i className="fas fa-vial"></i>
                </div>
                <h3>ELISA</h3>
                <p>
                  Phương pháp xét nghiệm tiêu chuẩn với độ nhạy và độ đặc hiệu cao. Cần lấy máu tĩnh mạch và có kết quả sau 1-2 ngày.
                  Thường được dùng để xác nhận kết quả của xét nghiệm nhanh.
                </p>
              </div>

              <div className="testing-type-card">
                <div className="icon">
                  <i className="fas fa-dna"></i>
                </div>
                <h3>NAT (Nucleic Acid Testing)</h3>
                <p>
                  Phát hiện trực tiếp vật liệu di truyền của virus HIV trong máu. Có thể phát hiện nhiễm HIV sớm chỉ sau 10-33 ngày
                  kể từ khi phơi nhiễm. Tuy nhiên, chi phí cao hơn các phương pháp khác.
                </p>
              </div>

              <div className="testing-type-card">
                <div className="icon">
                  <i className="fas fa-home"></i>
                </div>
                <h3>Tự xét nghiệm tại nhà</h3>
                <p>
                  Bộ kit xét nghiệm HIV có thể sử dụng tại nhà với hướng dẫn đơn giản. Chúng tôi cung cấp bộ kit chất lượng cao
                  cùng với dịch vụ tư vấn qua điện thoại hoặc trực tuyến.
                </p>
              </div>
            </div>

            <h3 style={{ marginTop: '30px' }}>So sánh các phương pháp xét nghiệm</h3>
            <table className="accuracy-table">
              <thead>
                <tr>
                  <th>Loại xét nghiệm</th>
                  <th>Thời gian có kết quả</th>
                  <th>Độ chính xác</th>
                  <th>Thời gian phát hiện sau phơi nhiễm</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Xét nghiệm nhanh</td>
                  <td>15-20 phút</td>
                  <td>99.5%</td>
                  <td>23-90 ngày</td>
                </tr>
                <tr>
                  <td>ELISA</td>
                  <td>1-2 ngày</td>
                  <td>99.7%</td>
                  <td>18-45 ngày</td>
                </tr>
                <tr>
                  <td>Western blot</td>
                  <td>1-2 ngày</td>
                  <td>99.9%</td>
                  <td>28-90 ngày</td>
                </tr>
                <tr>
                  <td>NAT</td>
                  <td>2-3 ngày</td>
                  <td>99.9%</td>
                  <td>10-33 ngày</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="section">
            <h2>Quy trình xét nghiệm HIV</h2>
            <p>
              Chúng tôi đảm bảo quy trình xét nghiệm HIV đơn giản, tôn trọng sự riêng tư và tạo sự thoải mái cho khách hàng.
            </p>

            <ul className="process-steps">
              <li>
                <h4>Đăng ký và tư vấn trước xét nghiệm</h4>
                <p>
                  Khi đến trung tâm, bạn sẽ được đón tiếp và tư vấn viên sẽ giải thích về quy trình xét nghiệm, lợi ích,
                  ý nghĩa của kết quả và các biện pháp phòng ngừa. Mọi thông tin cá nhân của bạn sẽ được bảo mật.
                </p>
              </li>
              <li>
                <h4>Lấy mẫu</h4>
                <p>
                  Tùy thuộc vào loại xét nghiệm, nhân viên y tế sẽ lấy mẫu máu từ đầu ngón tay hoặc tĩnh mạch, hoặc lấy mẫu dịch mô miệng.
                  Quá trình này chỉ mất vài phút và gây khó chịu tối thiểu.
                </p>
              </li>
              <li>
                <h4>Xét nghiệm</h4>
                <p>
                  Mẫu bệnh phẩm sẽ được xét nghiệm ngay tại chỗ (đối với xét nghiệm nhanh) hoặc được gửi đến phòng xét nghiệm
                  (đối với ELISA, Western blot, NAT). Các quy trình kiểm soát chất lượng nghiêm ngặt được áp dụng để đảm bảo kết quả chính xác.
                </p>
              </li>
              <li>
                <h4>Nhận kết quả và tư vấn sau xét nghiệm</h4>
                <p>
                  Kết quả xét nghiệm sẽ được thông báo trực tiếp cho bạn trong một không gian riêng tư. Tư vấn viên sẽ giải thích
                  ý nghĩa của kết quả và cung cấp các thông tin, hỗ trợ cần thiết dựa trên kết quả xét nghiệm.
                </p>
              </li>
              <li>
                <h4>Kết nối với dịch vụ chăm sóc và điều trị (nếu cần)</h4>
                <p>
                  Nếu kết quả xét nghiệm dương tính, tư vấn viên sẽ hỗ trợ bạn tiếp cận với các dịch vụ chăm sóc và điều trị HIV
                  phù hợp, bao gồm điều trị ARV, tư vấn tâm lý và các dịch vụ hỗ trợ khác.
                </p>
              </li>
            </ul>
          </section>

          <section className="section">
            <h2>Địa điểm xét nghiệm</h2>
            <div className="testing-locations">
              <div className="location-card">
                <div className="location-info">
                  <h4>Trung tâm Xét nghiệm và Tư vấn HIV</h4>
                  <p><i className="fas fa-map-marker-alt"></i> 78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội</p>
                  <p><i className="fas fa-phone"></i> 0987 654 321</p>
                  <p><i className="fas fa-clock"></i> Thứ Hai - Thứ Sáu: 8:00 - 17:00</p>
                  <p><i className="fas fa-clock"></i> Thứ Bảy: 8:00 - 12:00</p>
                </div>
                <div className="map-container">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7286260798505!2d105.83975807600669!3d21.00226328063235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad3edb6f2f15%3A0xb5e982bd60abaaef!2zQuG7h25oIHZp4buHbiBCYcyDbSDEkGE!5e0!3m2!1svi!2s!4v1701341033966!5m2!1svi!2s" title="Địa điểm xét nghiệm" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
              <div className="location-card">
                <div className="location-info">
                  <h4>Phòng khám Ngoại trú - Khoa Truyền nhiễm</h4>
                  <p><i className="fas fa-map-marker-alt"></i> 87 Giải Phóng, Phương Mai, Đống Đa, Hà Nội</p>
                  <p><i className="fas fa-phone"></i> 0987 654 322</p>
                  <p><i className="fas fa-clock"></i> Thứ Hai - Thứ Sáu: 8:00 - 16:30</p>
                  <p><i className="fas fa-star"></i> Có dịch vụ xét nghiệm ẩn danh</p>
                </div>
                <div className="map-container">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7286260798505!2d105.83975807600669!3d21.00226328063235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad3edb6f2f15%3A0xb5e982bd60abaaef!2zQuG7h25oIHZp4buHbiBCYcyDbSDEkGE!5e0!3m2!1svi!2s!4v1701341033966!5m2!1svi!2s" title="Địa điểm xét nghiệm" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Câu hỏi thường gặp</h2>
            <div className="faq-list">
              {faqData.map((faq, index) => (
                <div className="faq-item" key={index}>
                  <div className="faq-question" onClick={() => toggleFAQ(index)}>
                    {faq.question}
                    <span>{activeIndex === index ? '−' : '+'}</span>
                  </div>
                  {activeIndex === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '2px solid #f0f0f0',
                paddingBottom: '15px'
              }}>
                <h3 style={{
                  margin: 0,
                  color: '#2c5aa0',
                  fontSize: '24px',
                  fontWeight: '600'
                }}>
                  Đặt lịch xét nghiệm HIV
                </h3>
                <button
                  onClick={handleCloseModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '5px'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitBooking}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '16px'
                  }}>
                    Họ và Tên : <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={patientInfo?.PatientFullname || ''}
                    readOnly
                    placeholder="Tên bệnh nhân"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                  <input
                    type="hidden"
                    name="PatientID"
                    value={bookingData.PatientID}
                  />
                  {patientInfo && (
                    <p style={{
                      margin: '8px 0 0 0',
                      fontSize: '14px',
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      Mã bệnh nhân: {patientInfo.PatientID}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '16px'
                  }}>
                    Loại dịch vụ:
                  </label>
                  <input
                    type="text"
                    name="BookingType"
                    value={bookingData.BookingType}
                    onChange={handleInputChange}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '16px'
                  }}>
                    Ngày giờ mong muốn: <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="BookDate"
                    value={bookingData.BookDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '16px'
                  }}>
                    Ghi chú:
                  </label>
                  <textarea
                    name="Note"
                    value={bookingData.Note}
                    onChange={handleInputChange}
                    placeholder="Nhập ghi chú (nếu có)"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical',
                      transition: 'border-color 0.3s'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isSubmitting ? '#ccc' : '#2c5aa0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Đặt lịch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1001,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '450px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.4s ease-out',
              position: 'relative'
            }}>
              {/* Success Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                animation: 'scaleIn 0.6s ease-out 0.2s both'
              }}>
                <i className="fas fa-check" style={{
                  fontSize: '40px',
                  color: 'white'
                }}></i>
              </div>

              {/* Success Message */}
              <h2 style={{
                color: '#1f2937',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '12px',
                animation: 'fadeInUp 0.5s ease-out 0.4s both'
              }}>
                Đặt lịch thành công!
              </h2>
              
              <p style={{
                color: '#6b7280',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '30px',
                animation: 'fadeInUp 0.5s ease-out 0.6s both'
              }}>
                Lịch xét nghiệm HIV của bạn đã được đặt thành công. 
                
              </p>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                animation: 'fadeInUp 0.5s ease-out 0.8s both'
              }}>
                <button
                  onClick={handleSuccessModalClose}
                  style={{
                    backgroundColor: '#2c5aa0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 28px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(44, 90, 160, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1e40af';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(44, 90, 160, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#2c5aa0';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(44, 90, 160, 0.3)';
                  }}
                >
                  <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                  Xem lịch hẹn
                </button>
              </div>

              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '40px',
                height: '40px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                opacity: '0.8',
                animation: 'float 3s ease-in-out infinite'
              }}></div>
              
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '-15px',
                width: '60px',
                height: '60px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                opacity: '0.6',
                animation: 'float 3s ease-in-out infinite 1.5s'
              }}></div>
            </div>
          </div>
        )}

        {/* Add CSS animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateY(30px) scale(0.9); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0; 
              transform: scale(0); 
            }
            to { 
              opacity: 1; 
              transform: scale(1); 
            }
          }
          
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </>
  );
};

export default HIVTesting;

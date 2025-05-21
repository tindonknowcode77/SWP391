import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Consulting.css";
import Navbar from '../components/Navbar';

const Consulting = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Tư vấn HIV là gì?",
      answer: "Tư vấn HIV là quá trình cung cấp thông tin, hỗ trợ tâm lý và giúp đỡ khách hàng đưa ra quyết định liên quan đến việc xét nghiệm, điều trị và sống chung với HIV/AIDS. Việc tư vấn được thực hiện bởi các chuyên gia y tế hoặc tư vấn viên được đào tạo chuyên nghiệp."
    },
    {
      question: "Ai nên tham gia tư vấn HIV?",
      answer: "Bất kỳ ai có nguy cơ nhiễm HIV, đã xét nghiệm dương tính với HIV, hoặc là người thân của người nhiễm HIV đều nên tham gia tư vấn. Dịch vụ này cũng dành cho những người cần thông tin về phòng ngừa HIV hoặc có lo lắng về tình trạng sức khỏe của mình."
    },
    {
      question: "Tư vấn HIV có đảm bảo bí mật không?",
      answer: "Có, tất cả các buổi tư vấn HIV đều tuân thủ nguyên tắc bảo mật nghiêm ngặt. Thông tin cá nhân và nội dung tư vấn của bạn sẽ được giữ bí mật và chỉ được chia sẻ với những chuyên gia y tế liên quan trực tiếp đến việc chăm sóc sức khỏe của bạn, và chỉ khi có sự đồng ý của bạn."
    },
    {
      question: "Tôi có phải trả phí cho dịch vụ tư vấn HIV không?",
      answer: "Nhiều dịch vụ tư vấn HIV được cung cấp miễn phí thông qua các chương trình y tế công cộng hoặc tổ chức phi chính phủ. Tại cơ sở của chúng tôi, chúng tôi cung cấp cả dịch vụ tư vấn miễn phí và các dịch vụ chuyên sâu có tính phí. Bạn có thể liên hệ với chúng tôi để biết thêm chi tiết."
    },
    {
      question: "Làm thế nào để đặt lịch tư vấn HIV?",
      answer: "Bạn có thể đặt lịch tư vấn HIV bằng cách liên hệ trực tiếp với trung tâm qua số điện thoại, email hoặc sử dụng hệ thống đặt lịch trực tuyến trên trang web của chúng tôi. Ngoài ra, bạn cũng có thể đến trực tiếp cơ sở y tế để được hướng dẫn."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="consulting-page">
        <div className="consulting-header">
          <h1>Tư vấn HIV/AIDS</h1>
          <p>Hỗ trợ tâm lý và thông tin chuyên sâu từ đội ngũ tư vấn viên có kinh nghiệm</p>
        </div>

        <div className="consulting-content">
          <section className="section">
            <h2>Giới thiệu về dịch vụ tư vấn HIV/AIDS</h2>
            <p>
              Dịch vụ tư vấn HIV/AIDS của chúng tôi cung cấp sự hỗ trợ toàn diện, thông tin chính xác và hướng dẫn
              chuyên sâu cho người nhiễm HIV, người có nguy cơ cao và các thành viên gia đình. Đội ngũ tư vấn viên
              chuyên nghiệp của chúng tôi được đào tạo bài bản về các khía cạnh y tế, tâm lý và xã hội của HIV/AIDS.
            </p>
            <p>
              Chúng tôi cam kết cung cấp môi trường an toàn, tôn trọng và bảo mật cho tất cả các khách hàng,
              giúp họ đưa ra quyết định sáng suốt và xây dựng chiến lược để sống khỏe mạnh dài lâu.
            </p>
          </section>

          <section className="section">
            <h2>Các hình thức tư vấn</h2>
            <div className="consulting-types">
              <div className="consulting-type-card">
                <div className="icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>Tư vấn trước xét nghiệm</h3>
                <p>
                  Cung cấp thông tin về HIV/AIDS, quy trình xét nghiệm, ý nghĩa của kết quả và các biện pháp phòng ngừa.
                  Giúp khách hàng đánh giá nguy cơ và chuẩn bị tâm lý cho việc xét nghiệm.
                </p>
              </div>

              <div className="consulting-type-card">
                <div className="icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <h3>Tư vấn sau xét nghiệm</h3>
                <p>
                  Giải thích kết quả xét nghiệm, cung cấp hỗ trợ tâm lý và các bước tiếp theo cho cả kết quả âm tính và
                  dương tính. Kết nối với các dịch vụ chăm sóc và điều trị nếu cần.
                </p>
              </div>

              <div className="consulting-type-card">
                <div className="icon">
                  <i className="fas fa-user-friends"></i>
                </div>
                <h3>Tư vấn cho cặp đôi</h3>
                <p>
                  Hỗ trợ các cặp đôi trong việc thảo luận về tình trạng HIV, phòng ngừa lây nhiễm cho bạn tình,
                  kế hoạch gia đình và các vấn đề liên quan đến mối quan hệ.
                </p>
              </div>

              <div className="consulting-type-card">
                <div className="icon">
                  <i className="fas fa-pills"></i>
                </div>
                <h3>Tư vấn tuân thủ điều trị</h3>
                <p>
                  Hướng dẫn về việc tuân thủ phác đồ điều trị ARV, quản lý tác dụng phụ, và duy trì lối sống
                  lành mạnh để nâng cao hiệu quả điều trị.
                </p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Lợi ích của dịch vụ tư vấn</h2>
            <ul className="benefits-list">
              <li>Tiếp cận thông tin chính xác và cập nhật về HIV/AIDS</li>
              <li>Giảm lo lắng và căng thẳng liên quan đến tình trạng HIV</li>
              <li>Hỗ trợ đưa ra quyết định sáng suốt về xét nghiệm và điều trị</li>
              <li>Nâng cao hiệu quả điều trị thông qua sự tuân thủ tốt hơn</li>
              <li>Được kết nối với mạng lưới hỗ trợ và các dịch vụ cần thiết khác</li>
              <li>Cải thiện chất lượng cuộc sống và sức khỏe tổng thể</li>
              <li>Giảm thiểu nguy cơ lây truyền HIV cho người khác</li>
            </ul>
          </section>

          <section className="section">
            <h2>Quy trình tư vấn</h2>
            <ol className="process-steps">
              <li>
                <strong>Đặt lịch hẹn:</strong> Liên hệ qua điện thoại, email hoặc hệ thống đặt lịch trực tuyến.
              </li>
              <li>
                <strong>Buổi tư vấn đầu tiên:</strong> Gặp gỡ tư vấn viên, chia sẻ nhu cầu và mối quan tâm của bạn.
              </li>
              <li>
                <strong>Đánh giá cá nhân:</strong> Tư vấn viên sẽ đánh giá tình trạng sức khỏe, nhu cầu tâm lý và các yếu tố xã hội.
              </li>
              <li>
                <strong>Xây dựng kế hoạch:</strong> Cùng với tư vấn viên, bạn sẽ xây dựng kế hoạch hành động phù hợp với nhu cầu cá nhân.
              </li>
              <li>
                <strong>Buổi tư vấn tiếp theo:</strong> Các buổi tư vấn định kỳ để theo dõi tiến triển và điều chỉnh kế hoạch nếu cần.
              </li>
              <li>
                <strong>Kết nối với các dịch vụ:</strong> Giới thiệu và kết nối với các dịch vụ y tế, tâm lý và xã hội khác khi cần.
              </li>
            </ol>
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

          <div className="cta-box">
            <h3>Bạn cần hỗ trợ hoặc tư vấn về HIV/AIDS?</h3>
            <p>Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
            <Link to="/hospital/lich-kham" className="cta-btn">Đặt lịch tư vấn ngay</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Consulting;

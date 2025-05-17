import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Specialty.css';

const Specialty = () => (
  <>
    <Navbar />
    <div className="specialty-page">
      <div className="specialty-container">
        <h1 className="specialty-title">Chuyên khoa HIV/AIDS</h1>
        <section className="specialty-section">
          <h2 className="specialty-section-title">1. Kiến thức chuyên sâu về HIV/AIDS</h2>
          <ul className="specialty-list">
            <li>
              <b>Giải thích về HIV/AIDS:</b> HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người, làm cơ thể mất khả năng chống lại các bệnh nhiễm trùng và ung thư. AIDS (Acquired Immunodeficiency Syndrome) là giai đoạn cuối của nhiễm HIV. <br/>
              <b>Nguyên nhân:</b> Lây truyền qua máu, quan hệ tình dục không an toàn, từ mẹ sang con.<br/>
              <b>Giai đoạn bệnh:</b> Gồm giai đoạn cấp tính, tiềm tàng, và AIDS.
            </li>
            <li>
              <b>Các phác đồ điều trị hiện tại:</b> Sử dụng thuốc ARV (Antiretroviral), tuân thủ phác đồ giúp kiểm soát virus, nâng cao chất lượng sống. <br/>
              <b>Cập nhật mới nhất:</b> Theo khuyến cáo của WHO và Bộ Y tế Việt Nam, điều trị sớm ngay khi phát hiện nhiễm HIV.
            </li>
            <li>
              <b>Tác dụng phụ của thuốc ARV và cách quản lý:</b> Có thể gặp buồn nôn, mệt mỏi, rối loạn tiêu hóa, phát ban... Cần thông báo cho bác sĩ để được tư vấn và điều chỉnh phù hợp.
            </li>
          </ul>
        </section>
        <section className="specialty-section">
          <h2 className="specialty-section-title">2. Tư vấn và hỗ trợ bệnh nhân</h2>
          <ul className="specialty-list">
            <li>
              <b>Quy trình xét nghiệm, điều trị, và tư vấn tâm lý:</b> Bệnh nhân được xét nghiệm miễn phí, tư vấn trước và sau xét nghiệm, điều trị ARV, hỗ trợ tâm lý xuyên suốt quá trình điều trị.
            </li>
            <li>
              <b>Chia sẻ câu chuyện thực tế của người bệnh:</b> Những tấm gương vượt qua mặc cảm, tuân thủ điều trị, sống khỏe mạnh và hòa nhập cộng đồng.
            </li>
            <li>
              <b>Nhóm hỗ trợ cộng đồng, đường dây nóng:</b> Tham gia các nhóm hỗ trợ, gọi đường dây nóng 1900-6889 để được tư vấn, hỗ trợ kịp thời.
            </li>
          </ul>
        </section>
        <section className="specialty-section">
          <h2 className="specialty-section-title">3. Nghiên cứu và cập nhật y khoa</h2>
          <ul className="specialty-list">
            <li>
              <b>Các nghiên cứu mới về HIV/AIDS:</b> Liên tục cập nhật các nghiên cứu về vaccine, thuốc mới, phòng ngừa lây nhiễm.
            </li>
            <li>
              <b>Công nghệ điều trị tiên tiến:</b> Ứng dụng liệu pháp gen, thuốc ARV thế hệ mới, điều trị cá thể hóa.
            </li>
            <li>
              <b>Hội nghị, hội thảo chuyên ngành:</b> Thường xuyên tổ chức, cập nhật kiến thức cho đội ngũ y tế và cộng đồng.
            </li>
          </ul>
        </section>
      </div>
    </div>
  </>
);

export default Specialty;

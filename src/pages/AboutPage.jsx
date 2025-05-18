import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/AboutPage.css';

const AboutPage = () => (
  <>
    <Navbar />
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Giới thiệu về WebApp Hỗ Trợ Điều Trị HIV</h1>
          <p>
            WebApp Hỗ Trợ Điều Trị HIV là nền tảng số hiện đại được phát triển để hỗ trợ bệnh nhân, bác sĩ và cộng đồng trong việc phòng ngừa, điều trị và quản lý HIV/AIDS một cách an toàn, hiệu quả và bảo mật.
          </p>
        </div>
      </section>

      <section className="about-section">
        <h2>Mục tiêu của WebApp</h2>
        <ul>
          <li>Quản lý lịch khám, nhắc uống thuốc và theo dõi sức khỏe cá nhân.</li>
          <li>Kết nối bảo mật giữa bệnh nhân và bác sĩ qua tư vấn trực tuyến.</li>
          <li>Cung cấp kiến thức chính xác về HIV/AIDS, giảm kỳ thị và nâng cao nhận thức.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Tính năng nổi bật</h2>
        <ul>
          <li>Đặt lịch khám, theo dõi hồ sơ y tế.</li>
          <li>Nhắc nhở điều trị định kỳ qua hệ thống thông minh.</li>
          <li>Tư vấn trực tuyến với bác sĩ chuyên khoa.</li>
          <li>Tra cứu tài liệu, tin tức cập nhật.</li>
          <li>Bảo mật thông tin cá nhân tuyệt đối.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Cam kết & Giá trị</h2>
        <p>
          Chúng tôi tin rằng công nghệ có thể giúp cuộc sống người nhiễm HIV trở nên tốt hơn – khỏe mạnh hơn, ít kỳ thị hơn và đầy hy vọng hơn. WebApp cam kết bảo vệ quyền riêng tư, đồng hành lâu dài cùng người bệnh và mang lại trải nghiệm y tế nhân văn.
        </p>
      </section>

      <section className="about-cta">
        <p><strong>Hãy bắt đầu hành trình chăm sóc sức khỏe của bạn với WebApp ngay hôm nay!</strong></p>
      </section>
    </main>
  </>
);

export default AboutPage;

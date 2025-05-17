import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/AboutPage.css';

const AboutPage = () => (
  <>
    <Navbar />
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">Giới thiệu về WebApp Hỗ Trợ Điều Trị HIV</h1>
        <p className="about-intro">
          <b>WebApp Hỗ Trợ Điều Trị HIV</b> là nền tảng trực tuyến hiện đại, được xây dựng nhằm hỗ trợ bệnh nhân, bác sĩ và cộng đồng trong công tác phòng ngừa, điều trị và quản lý HIV/AIDS một cách hiệu quả, bảo mật và thân thiện.
        </p>
        <h2 className="about-section-title">Mục tiêu của WebApp</h2>
        <ul className="about-list">
          <li>Hỗ trợ bệnh nhân HIV quản lý lịch khám, nhắc nhở uống thuốc, theo dõi sức khỏe cá nhân.</li>
          <li>Kết nối nhanh chóng giữa bệnh nhân và đội ngũ y tế, tư vấn trực tuyến an toàn, bảo mật.</li>
          <li>Cung cấp thông tin, kiến thức chính xác về HIV/AIDS, phòng ngừa lây nhiễm và nâng cao nhận thức cộng đồng.</li>
        </ul>
        <h2 className="about-section-title">Tính năng nổi bật</h2>
        <ul className="about-list">
          <li>Đặt lịch khám, quản lý lịch sử khám chữa bệnh.</li>
          <li>Nhắc nhở uống thuốc, tái khám tự động qua hệ thống.</li>
          <li>Tư vấn sức khỏe trực tuyến với bác sĩ chuyên khoa.</li>
          <li>Tra cứu thông tin, tin tức, tài liệu về HIV/AIDS cập nhật liên tục.</li>
          <li>Bảo mật thông tin cá nhân tuyệt đối.</li>
        </ul>
        <h2 className="about-section-title">Ý nghĩa & Cam kết</h2>
        <p className="about-meaning">
          Chúng tôi tin rằng công nghệ có thể giúp mọi người sống khỏe mạnh hơn, giảm kỳ thị và nâng cao chất lượng cuộc sống cho người nhiễm HIV. WebApp cam kết đồng hành cùng bạn trên hành trình điều trị, bảo vệ quyền riêng tư và mang lại trải nghiệm tốt nhất.
        </p>
        <div className="about-invite">
          <b>Hãy trải nghiệm WebApp ngay hôm nay để nhận được sự hỗ trợ tốt nhất cho bạn và cộng đồng!</b>
        </div>
      </div>
    </div>
  </>
);

export default AboutPage;

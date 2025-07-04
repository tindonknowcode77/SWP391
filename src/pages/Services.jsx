import React from "react";
import { Link } from "react-router-dom";
import "../styles/Services.css";
import Navbar from '../components/Navbar';

const Services = () => (
    <>
    <Navbar />
  <section className="services-sections">
    <div className="container">
      <div className="section-header-services">
        <h2>Dịch vụ của chúng tôi</h2>
        <p>Cung cấp các dịch vụ y tế chất lượng cao cho bệnh nhân HIV/AIDS</p>
      </div>
      <div className="services-grid">
        <div className="service-card">
          <div className="service-icon">
            <i className="fas fa-user-md"></i>
          </div>
          <h3>Điều Trị HIV</h3>
          <p>Dịch vụ điều trị xét nghiệm HIV từ đội ngũ chuyên gia tâm lý hàng đầu.</p>
          <Link to="/hospital/dich-vu/xet-nghiem" className="read-more">Xem thêm</Link>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <i className="fas fa-pills"></i>
          </div>
          <h3>Điều trị ARV</h3>
          <p>Cung cấp phác đồ điều trị ARV hiện đại giúp kiểm soát virus HIV hiệu quả.</p>
          <Link to="/hospital/dich-vu/dieu-tri-arv" className="read-more">Xem thêm</Link>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <i className="fas fa-vial"></i>
          </div>
          <h3>Xét nghiệm HIV</h3>
          <p>Xét nghiệm nhanh, chính xác và bảo mật với công nghệ tiên tiến.</p>
          <Link to="/hospital/dich-vu/xet-nghiem" className="read-more">Xem thêm</Link>
        </div>
      </div>
    </div>
  </section>
  </> 
);

export default Services;

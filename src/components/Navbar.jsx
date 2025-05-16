import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`hospital-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/hospital">
            <img src="/hospital-logo.png" alt="Bệnh viện Logo" />
            <span>BỆNH VIỆN ĐIỀU TRỊ HIV</span>
          </Link>
        </div>

        <div className="navbar-contact">
          <div className="contact-item">
            <i className="fas fa-phone-alt"></i>
            <span>Hotline: 1900-6889</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <span>Email: info@hivhospital.vn</span>
          </div>
        </div>

        <div className="navbar-toggle" onClick={handleMenuToggle}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li className={isActive('/hospital') ? 'active' : ''}>
              <Link to="/hospital" onClick={closeMenu}>Trang chủ</Link>
            </li>
            <li className={isActive('/hospital/gioi-thieu') ? 'active' : ''}>
              <Link to="/hospital/gioi-thieu" onClick={closeMenu}>Giới thiệu</Link>
            </li>
            <li className={isActive('/hospital/chuyen-khoa') ? 'active' : ''}>
              <Link to="/hospital/chuyen-khoa" onClick={closeMenu}>Chuyên khoa</Link>
            </li>
            <li className={isActive('/hospital/lich-kham') ? 'active' : ''}>
              <Link to="/hospital/lich-kham" onClick={closeMenu}>Lịch khám</Link>
            </li>
            <li className={isActive('/hospital/tin-tuc') ? 'active' : ''}>
              <Link to="/hospital/tin-tuc" onClick={closeMenu}>Tin tức</Link>
            </li>
            <li className={isActive('/hospital/lien-he') ? 'active' : ''}>
              <Link to="/hospital/lien-he" onClick={closeMenu}>Liên hệ</Link>
            </li>
          </ul>
        </div>        <div className="navbar-actions">
          {currentUser ? (
            <Link to="/profile" className="login-button">
              <i className="fas fa-user"></i>
              <span>{currentUser.name}</span>
              {currentUser.accountStatus === 'active' && (
                <span className="account-status active">
                  <i className="fas fa-circle"></i>
                </span>
              )}
              {currentUser.accountStatus !== 'active' && (
                <span className="account-status inactive">
                  <i className="fas fa-circle"></i>
                </span>
              )}
            </Link>
          ) : (
            <Link to="/login" className="login-button">
              <i className="fas fa-user"></i>
              <span>Đăng nhập</span>
            </Link>
          )}
          <div className="search-form">
            <input type="text" placeholder="Tìm kiếm..." />
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
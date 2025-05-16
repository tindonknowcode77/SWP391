import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { filterResources, formatDate, formatFileSize } from '../utils/helpers';
import useResponsive from '../hooks/useResponsive';
import '../styles/Resources.css';

const CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'education', name: 'Giáo dục' },
  { id: 'treatment', name: 'Điều trị' },
  { id: 'support', name: 'Hỗ trợ' },
  { id: 'nutrition', name: 'Dinh dưỡng' },
  { id: 'research', name: 'Nghiên cứu' },
  { id: 'community', name: 'Cộng đồng' }
];

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 9;
  const searchInputRef = useRef(null);
  const { isMobile } = useResponsive();

  // Fetch resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await apiService.getResources();
        setResources(data);
        
        // Set featured resources (top 3 with featured flag)
        const featured = data.filter(resource => resource.featured).slice(0, 3);
        setFeaturedResources(featured);
        
        // Set initial filtered resources
        setFilteredResources(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources when category or search term changes
  useEffect(() => {
    const filtered = filterResources(resources, selectedCategory, searchTerm);
    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [selectedCategory, searchTerm, resources]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInputRef.current.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current.value = '';
  };

  // Pagination logic
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get resource type icon
  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <i className="fas fa-file-pdf resource-icon pdf"></i>;
      case 'video':
        return <i className="fas fa-video resource-icon video"></i>;
      case 'link':
        return <i className="fas fa-link resource-icon link"></i>;
      case 'image':
        return <i className="fas fa-image resource-icon image"></i>;
      case 'doc':
        return <i className="fas fa-file-word resource-icon doc"></i>;
      default:
        return <i className="fas fa-file resource-icon"></i>;
    }
  };

  return (
    <div className="resources-page">
      {/* Hero Section */}
      <section className="resources-hero">
        <div className="resources-hero-content">
          <h1>Tài Nguyên Hỗ Trợ</h1>
          <p>
            Khám phá thông tin, tài liệu và hướng dẫn giúp bạn hiểu rõ hơn về 
            HIV/AIDS, các phương pháp điều trị và cách chăm sóc sức khỏe tốt nhất.
          </p>
          
          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Tìm kiếm tài nguyên..."
                ref={searchInputRef}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="clear-search-btn"
                  onClick={clearSearch}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
              {!isMobile() && "Tìm kiếm"}
            </button>
          </form>
        </div>
      </section>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <section className="featured-resources">
          <div className="container">
            <h2 className="section-title">Tài Nguyên Nổi Bật</h2>
            <div className="featured-resources-grid">
              {featuredResources.map(resource => (
                <div className="featured-resource-card" key={resource.id}>
                  <div className="featured-resource-image">
                    <img src={resource.thumbnail} alt={resource.title} />
                    {resource.type === 'video' && (
                      <div className="play-button">
                        <i className="fas fa-play"></i>
                      </div>
                    )}
                  </div>
                  <div className="featured-resource-content">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div className="featured-resource-meta">
                      <span className="resource-date">
                        <i className="far fa-calendar-alt"></i> {formatDate(resource.publishDate)}
                      </span>
                      <span className="resource-type">
                        {getResourceTypeIcon(resource.type)}
                        {resource.type.toUpperCase()}
                      </span>
                    </div>
                    <a 
                      href={resource.url} 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="featured-resource-link"
                    >
                      Xem ngay <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Resources Section */}
      <section className="resources-main">
        <div className="container">
          <div className="resources-container">
            {/* Categories */}
            <div className="resources-sidebar">
              <h3>Danh Mục</h3>
              <ul className="category-list">
                {CATEGORIES.map(category => (
                  <li 
                    key={category.id}
                    className={selectedCategory === category.id ? 'active' : ''}
                  >
                    <button onClick={() => handleCategoryChange(category.id)}>
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="contact-help">
                <h4>Cần trợ giúp?</h4>
                <p>Liên hệ với nhóm tư vấn của chúng tôi nếu bạn không tìm thấy tài nguyên mình cần.</p>
                <Link to="/contact" className="contact-btn">
                  Liên hệ hỗ trợ
                </Link>
              </div>
            </div>
            
            {/* Resources List */}
            <div className="resources-content">
              <div className="resources-header">
                <h2>
                  {selectedCategory === 'all' 
                    ? 'Tất Cả Tài Nguyên' 
                    : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </h2>
                <div className="resources-count">
                  Hiển thị {filteredResources.length} tài nguyên
                </div>
              </div>
              
              {loading ? (
                <div className="resources-loading">
                  <div className="spinner"></div>
                  <p>Đang tải tài nguyên...</p>
                </div>
              ) : (
                <>
                  {currentResources.length === 0 ? (
                    <div className="no-resources">
                      <i className="fas fa-search fa-3x"></i>
                      <h3>Không tìm thấy tài nguyên</h3>
                      <p>Không có tài nguyên nào phù hợp với tìm kiếm của bạn. Hãy thử tìm kiếm khác hoặc xóa bộ lọc.</p>
                      {searchTerm && (
                        <button className="clear-filters-btn" onClick={clearSearch}>
                          Xóa tìm kiếm
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="resources-grid">
                        {currentResources.map(resource => (
                          <div className="resource-card" key={resource.id}>
                            <div className="resource-card-header">
                              <div className="resource-type-badge">
                                {getResourceTypeIcon(resource.type)}
                                <span>{resource.type.toUpperCase()}</span>
                              </div>
                              {resource.thumbnail ? (
                                <img 
                                  src={resource.thumbnail} 
                                  alt={resource.title} 
                                  className="resource-thumbnail"
                                />
                              ) : (
                                <div className="resource-thumbnail-placeholder">
                                  <i className="fas fa-file-alt"></i>
                                </div>
                              )}
                            </div>
                            <div className="resource-card-body">
                              <h3 className="resource-title">{resource.title}</h3>
                              <p className="resource-description">{resource.description}</p>
                              <div className="resource-meta">
                                <span className="resource-date">
                                  <i className="far fa-calendar-alt"></i> {formatDate(resource.publishDate)}
                                </span>
                                {resource.fileSize && (
                                  <span className="resource-size">
                                    <i className="fas fa-file-download"></i> {formatFileSize(resource.fileSize)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="resource-card-footer">
                              <div className="resource-category">
                                <span className="badge">
                                  {CATEGORIES.find(c => c.id === resource.category)?.name || resource.category}
                                </span>
                              </div>
                              <a 
                                href={resource.url} 
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="resource-link"
                              >
                                {resource.type === 'pdf' || resource.type === 'doc' ? 'Tải xuống' : 'Xem ngay'}
                                <i className={`fas fa-${resource.type === 'pdf' || resource.type === 'doc' ? 'download' : 'external-link-alt'}`}></i>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="pagination">
                          <button 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-arrow"
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          
                          <div className="pagination-numbers">
                            {[...Array(totalPages).keys()].map(number => (
                              <button
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                                className={currentPage === number + 1 ? 'active' : ''}
                              >
                                {number + 1}
                              </button>
                            ))}
                          </div>
                          
                          <button 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-arrow"
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="resources-subscribe">
        <div className="container">
          <div className="subscribe-content">
            <h2>Nhận Thông Tin Mới Nhất</h2>
            <p>Đăng ký nhận thông báo khi có tài nguyên mới hoặc cập nhật quan trọng về điều trị HIV.</p>
            <form className="subscribe-form">
              <input type="email" placeholder="Địa chỉ email của bạn" required />
              <button type="submit">Đăng ký</button>
            </form>
            <div className="privacy-note">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Thông tin của bạn sẽ được bảo mật.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/News.css';
import logo from '../assets/images/icon.png';

const News = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsArticles, setNewsArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  
  // Mock data for news articles
  useEffect(() => {
    // In a real application, this would be fetched from an API
    const articles = [
      {
        id: 1,
        title: 'Nghiên cứu mới về thuốc điều trị HIV',
        summary: 'Các nhà khoa học đã tìm ra phương pháp điều trị mới giúp giảm tác dụng phụ của thuốc ARV.',
        content: 'Các nhà nghiên cứu từ Đại học Y Hà Nội đã công bố kết quả nghiên cứu mới về thuốc điều trị HIV, giúp giảm thiểu các tác dụng phụ thường gặp như mệt mỏi, buồn nôn và rối loạn tiêu hóa. Nghiên cứu này đã được thực hiện trên 500 bệnh nhân trong vòng 2 năm và cho thấy kết quả đầy hứa hẹn.',
        image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&w=600&q=80',
        category: 'research',
        author: 'TS. Nguyễn Văn Minh',
        date: '15/05/2025',
        tags: ['nghiên cứu', 'thuốc ARV', 'tác dụng phụ']
      },
      {
        id: 2,
        title: 'Hội thảo về sức khỏe tâm lý cho người sống chung với HIV',
        summary: 'Hội thảo cung cấp các kỹ năng quản lý sức khỏe tâm lý cho người sống chung với HIV.',
        content: 'Vào ngày 20/05/2025, Bệnh viện Điều trị HIV sẽ tổ chức Hội thảo về sức khỏe tâm lý dành cho người sống chung với HIV. Chương trình sẽ có sự tham gia của các chuyên gia tâm lý, bác sĩ tâm thần và các nhóm hỗ trợ. Hội thảo sẽ cung cấp các kỹ năng quản lý stress, lo âu và trầm cảm - những vấn đề thường gặp ở người nhiễm HIV.',
        image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=600&q=80',
        category: 'event',
        author: 'ThS. Trần Thị Hương',
        date: '12/05/2025',
        tags: ['hội thảo', 'sức khỏe tâm lý', 'stress']
      },
      {
        id: 3,
        title: 'Chính sách mới về bảo hiểm y tế cho bệnh nhân HIV',
        summary: 'Từ tháng 6/2025, bệnh nhân HIV sẽ được hưởng thêm nhiều quyền lợi từ bảo hiểm y tế.',
        content: 'Bộ Y tế vừa thông báo về chính sách mới liên quan đến bảo hiểm y tế cho bệnh nhân HIV. Theo đó, từ tháng 6/2025, người nhiễm HIV sẽ được bảo hiểm y tế chi trả 100% chi phí thuốc ARV và các xét nghiệm định kỳ. Đây là một bước tiến quan trọng trong việc đảm bảo tiếp cận điều trị cho tất cả bệnh nhân HIV tại Việt Nam.',
        image: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&w=600&q=80',
        category: 'policy',
        author: 'PGS.TS. Lê Văn Đức',
        date: '10/05/2025',
        tags: ['chính sách', 'bảo hiểm y tế', 'quyền lợi']
      },
      {
        id: 4,
        title: 'Kỹ thuật xét nghiệm HIV mới có độ chính xác cao hơn',
        summary: 'Kỹ thuật xét nghiệm mới giúp phát hiện sớm nhiễm HIV chỉ sau 7 ngày tiếp xúc.',
        content: 'Bệnh viện Điều trị HIV vừa triển khai kỹ thuật xét nghiệm HIV thế hệ mới với độ nhạy và độ đặc hiệu cao hơn. Kỹ thuật này có thể phát hiện nhiễm HIV chỉ sau 7 ngày tiếp xúc với virus, sớm hơn so với các phương pháp trước đây. Điều này giúp rút ngắn thời gian cửa sổ và tăng hiệu quả trong phát hiện sớm và điều trị kịp thời.',
        image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&w=600&q=80',
        category: 'technology',
        author: 'TS. Phạm Thị Lan',
        date: '08/05/2025',
        tags: ['xét nghiệm', 'công nghệ mới', 'phát hiện sớm']
      },
      {
        id: 5,
        title: 'Chương trình giáo dục cộng đồng về phòng chống HIV/AIDS',
        summary: 'Chiến dịch nâng cao nhận thức về HIV/AIDS được triển khai tại các trường học.',
        content: 'Bệnh viện Điều trị HIV phối hợp với Sở Giáo dục và Đào tạo TP.HCM triển khai chương trình giáo dục cộng đồng về phòng chống HIV/AIDS tại các trường trung học phổ thông. Chương trình bao gồm các buổi nói chuyện chuyên đề, hội thảo và các hoạt động tương tác nhằm nâng cao kiến thức và xóa bỏ kỳ thị đối với người nhiễm HIV.',
        image: 'https://images.pexels.com/photos/256369/pexels-photo-256369.jpeg?auto=compress&w=600&q=80',
        category: 'education',
        author: 'ThS. Nguyễn Thị Mai',
        date: '05/05/2025',
        tags: ['giáo dục', 'nhận thức', 'phòng chống HIV']
      },
      {
        id: 6,
        title: 'Thử nghiệm lâm sàng vaccine HIV giai đoạn 2',
        summary: 'Vaccine phòng HIV bước vào giai đoạn thử nghiệm lâm sàng thứ 2 tại Việt Nam.',
        content: 'Viện Pasteur TP.HCM vừa công bố thông tin về việc bắt đầu thử nghiệm lâm sàng giai đoạn 2 của vaccine phòng HIV tại Việt Nam. Đây là một phần của dự án nghiên cứu toàn cầu về vaccine HIV. Giai đoạn thử nghiệm này sẽ được thực hiện trên 200 tình nguyện viên tại 3 trung tâm y tế lớn trên cả nước.',
        image: 'https://images.pexels.com/photos/3652098/pexels-photo-3652098.jpeg?auto=compress&w=600&q=80',
        category: 'research',
        author: 'GS.TS. Trần Văn Hùng',
        date: '03/05/2025',
        tags: ['vaccine', 'thử nghiệm lâm sàng', 'phòng ngừa']
      },
      {
        id: 7,
        title: 'Ứng dụng trí tuệ nhân tạo trong điều trị HIV',
        summary: 'AI hỗ trợ bác sĩ trong việc tối ưu hóa phác đồ điều trị HIV cá nhân hóa.',
        content: 'Bệnh viện Điều trị HIV vừa triển khai hệ thống trí tuệ nhân tạo (AI) để hỗ trợ các bác sĩ trong việc xây dựng và tối ưu hóa phác đồ điều trị HIV cho từng bệnh nhân. Hệ thống này phân tích dữ liệu từ hàng nghìn ca điều trị thành công để đề xuất liều lượng thuốc phù hợp nhất, giảm thiểu tác dụng phụ và tăng hiệu quả điều trị.',
        image: 'https://images.pexels.com/photos/386148/pexels-photo-386148.jpeg?auto=compress&w=600&q=80',
        category: 'technology',
        author: 'TS. Lê Minh Tâm',
        date: '01/05/2025',
        tags: ['trí tuệ nhân tạo', 'AI', 'điều trị cá nhân hóa']
      },
      {
        id: 8,
        title: 'Câu chuyện của những người chiến thắng HIV',
        summary: 'Những câu chuyện truyền cảm hứng từ người sống chung với HIV hơn 20 năm.',
        content: 'Nhân ngày Thế giới phòng chống AIDS, Bệnh viện Điều trị HIV đã tổ chức chương trình chia sẻ câu chuyện từ những người đã sống chung với HIV hơn 20 năm. Những câu chuyện đầy cảm động và truyền cảm hứng về cuộc sống, công việc và hạnh phúc gia đình của họ đã cho thấy HIV không còn là bản án tử hình và người nhiễm HIV vẫn có thể sống khỏe mạnh, hạnh phúc và đóng góp cho xã hội.',
        image: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&w=600&q=80',
        category: 'story',
        author: 'ThS. Nguyễn Thị Thanh',
        date: '28/04/2025',
        tags: ['câu chuyện', 'người nhiễm HIV', 'truyền cảm hứng']
      }
    ];
    
    setNewsArticles(articles);
    setFilteredArticles(articles);
  }, []);

  // Filter articles based on category and search term
  useEffect(() => {
    let filtered = [...newsArticles];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(article => article.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredArticles(filtered);
  }, [activeCategory, searchTerm, newsArticles]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="news-container">
        <div className="news-header">
          <h1>Tin Tức & Sự Kiện</h1>
          <p>Cập nhật thông tin mới nhất về HIV/AIDS, sự kiện, nghiên cứu và các chính sách liên quan</p>
        </div>

        <div className="news-filters">
          <div className="categories">
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              Tất cả
            </button>
            <button 
              className={`category-btn ${activeCategory === 'research' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('research')}
            >
              Nghiên cứu
            </button>
            <button 
              className={`category-btn ${activeCategory === 'event' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('event')}
            >
              Sự kiện
            </button>
            <button 
              className={`category-btn ${activeCategory === 'policy' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('policy')}
            >
              Chính sách
            </button>
            <button 
              className={`category-btn ${activeCategory === 'technology' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('technology')}
            >
              Công nghệ
            </button>
            <button 
              className={`category-btn ${activeCategory === 'education' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('education')}
            >
              Giáo dục
            </button>
            <button 
              className={`category-btn ${activeCategory === 'story' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('story')}
            >
              Câu chuyện
            </button>
          </div>
          
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Tìm kiếm tin tức..." 
              value={searchTerm}
              onChange={handleSearch}
            />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-newspaper"></i>
            <h3>Không tìm thấy bài viết</h3>
            <p>Không có bài viết nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với từ khóa hoặc danh mục khác.</p>
          </div>
        ) : (
          <div className="news-grid">
            {filteredArticles.map(article => (
              <div className="news-card" key={article.id}>
                <div className="news-image">
                  <img src={article.image} alt={article.title} />
                  <span className="news-category">{getCategoryName(article.category)}</span>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date"><i className="far fa-calendar-alt"></i> {article.date}</span>
                    <span className="news-author"><i className="far fa-user"></i> {article.author}</span>
                  </div>
                  <h3 className="news-title">{article.title}</h3>
                  <p className="news-summary">{article.summary}</p>
                  <Link to={`/news/${article.id}`} className="read-more">
                    Đọc tiếp <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
                <div className="news-tags">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="news-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="news-pagination">
          <button className="pagination-arrow disabled">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="pagination-number active">1</button>
          <button className="pagination-number">2</button>
          <button className="pagination-number">3</button>
          <button className="pagination-arrow">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="subscribe-section">
          <div className="subscribe-content">
            <h2>Đăng ký nhận tin tức mới nhất</h2>
            <p>Nhận thông tin cập nhật mới nhất về HIV/AIDS, các nghiên cứu và sự kiện quan trọng qua email</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Nhập địa chỉ email của bạn" />
              <button>
                Đăng ký
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <p className="privacy-notice">Bằng cách đăng ký, bạn đồng ý với <Link to="#">Chính sách bảo mật</Link> của chúng tôi.</p>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="HIV Treatment App Logo" />
            <h3>HIV Treatment App</h3>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Trang chủ</h4>
              <ul>
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/hospital">Bệnh viện</Link></li>
                <li><Link to="/hiv-department">Khoa HIV</Link></li>
                <li><Link to="/resources">Tài nguyên</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Tính năng</h4>
              <ul>
                <li><Link to="/medication">Quản lý thuốc</Link></li>
                <li><Link to="/appointments">Đặt lịch khám</Link></li>
                <li><Link to="/treatment-plan">Kế hoạch điều trị</Link></li>
                <li><Link to="/profile">Hồ sơ cá nhân</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><Link to="/resources">Câu hỏi thường gặp</Link></li>
                <li><Link to="/resources">Hướng dẫn sử dụng</Link></li>
                <li><a href="mailto:support@hivhospital.vn">Liên hệ hỗ trợ</a></li>
                <li><Link to="/resources">Nhóm hỗ trợ</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Pháp lý</h4>
              <ul>
                <li><Link to="#">Điều khoản sử dụng</Link></li>
                <li><Link to="#">Chính sách bảo mật</Link></li>
                <li><Link to="#">Quyền riêng tư</Link></li>
                <li><Link to="#">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-link"><i className="fab fa-youtube"></i></a>
          </div>
          
          <div className="copyright">
            <p>&copy; 2025 HIV Treatment App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

// Helper function to get category name in Vietnamese
function getCategoryName(category) {
  const categoryMap = {
    'research': 'Nghiên cứu',
    'event': 'Sự kiện',
    'policy': 'Chính sách',
    'technology': 'Công nghệ',
    'education': 'Giáo dục',
    'story': 'Câu chuyện'
  };
  
  return categoryMap[category] || category;
}

export default News;

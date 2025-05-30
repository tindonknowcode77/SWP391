import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/News.css';

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // In a real application, fetch article data from an API
    // Mock data for demonstration
    setTimeout(() => {
      const mockArticle = {
        id: parseInt(id),
        title: 'Nghiên cứu mới về thuốc điều trị HIV',
        summary: 'Các nhà khoa học đã tìm ra phương pháp điều trị mới giúp giảm tác dụng phụ của thuốc ARV.',
        content: `
          <p>Các nhà nghiên cứu từ Đại học Y Hà Nội đã công bố kết quả nghiên cứu mới về thuốc điều trị HIV, giúp giảm thiểu các tác dụng phụ thường gặp như mệt mỏi, buồn nôn và rối loạn tiêu hóa.</p>
          
          <p>Nghiên cứu này đã được thực hiện trên 500 bệnh nhân trong vòng 2 năm và cho thấy kết quả đầy hứa hẹn. Theo PGS.TS Nguyễn Văn Minh, trưởng nhóm nghiên cứu, phương pháp mới này kết hợp liệu pháp thuốc với chế độ dinh dưỡng đặc biệt, giúp giảm tác dụng phụ mà không làm giảm hiệu quả điều trị.</p>
          
          <h3>Tác dụng phụ - rào cản lớn trong điều trị HIV</h3>
          
          <p>Một trong những thách thức lớn nhất trong điều trị HIV là tác dụng phụ của thuốc ARV. Nhiều bệnh nhân gặp phải các vấn đề như mệt mỏi, chóng mặt, buồn nôn, tiêu chảy, và trong một số trường hợp, gây ra các biến chứng nghiêm trọng hơn như tổn thương gan, thận.</p>
          
          <p>"Tác dụng phụ là lý do chính khiến nhiều bệnh nhân không tuân thủ điều trị, dẫn đến giảm hiệu quả của thuốc và tăng nguy cơ kháng thuốc," TS. Minh giải thích. "Vì vậy, việc tìm ra phương pháp giảm thiểu tác dụng phụ mà không ảnh hưởng đến hiệu quả điều trị là một bước tiến quan trọng."</p>
          
          <h3>Phương pháp mới: Kết hợp liệu pháp thuốc và dinh dưỡng</h3>
          
          <p>Phương pháp mới này bao gồm việc điều chỉnh liều lượng thuốc ARV dựa trên đặc điểm sinh học của từng cá nhân, kết hợp với chế độ dinh dưỡng giàu chất chống oxy hóa và vi chất dinh dưỡng cụ thể.</p>
          
          <p>Nghiên cứu cho thấy, nhóm bệnh nhân áp dụng phương pháp mới này có tỷ lệ gặp tác dụng phụ giảm tới 65% so với nhóm điều trị truyền thống. Đặc biệt, các triệu chứng về tiêu hóa như buồn nôn và tiêu chảy giảm đáng kể, giúp cải thiện chất lượng cuộc sống của bệnh nhân.</p>
          
          <h3>Triển vọng và kế hoạch trong tương lai</h3>
          
          <p>Các nhà nghiên cứu đang lên kế hoạch mở rộng nghiên cứu này với quy mô lớn hơn, bao gồm nhiều đối tượng bệnh nhân hơn và theo dõi trong thời gian dài hơn.</p>
          
          <p>"Chúng tôi hy vọng phương pháp này sẽ sớm được áp dụng rộng rãi trong các chương trình điều trị HIV quốc gia, giúp cải thiện tuân thủ điều trị và chất lượng cuộc sống của người sống chung với HIV," TS. Minh kết luận.</p>
          
          <p>Bộ Y tế đang xem xét kết quả nghiên cứu này và có thể sẽ cập nhật hướng dẫn điều trị HIV trong thời gian tới.</p>
        `,
        image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&w=600&q=80',
        category: 'research',
        author: 'TS. Nguyễn Văn Minh',
        date: '15/05/2025',
        tags: ['nghiên cứu', 'thuốc ARV', 'tác dụng phụ'],
        comments: [
          {
            id: 1,
            author: 'Lê Thị Hoa',
            avatar: '/assets/images/avatars/avatar-1.jpg',
            text: 'Thông tin rất hữu ích. Tôi đang điều trị ARV và gặp nhiều tác dụng phụ, hy vọng phương pháp mới này sẽ sớm được áp dụng.',
            time: '2 giờ trước',
            likes: 5
          },
          {
            id: 2,
            author: 'Trần Văn Bình',
            avatar: '/assets/images/avatars/avatar-2.jpg',
            text: 'Tôi muốn biết thêm về chế độ dinh dưỡng đặc biệt được đề cập trong bài viết. Có thể chia sẻ thêm thông tin không?',
            time: '5 giờ trước',
            likes: 3
          }
        ]
      };
      
      setArticle(mockArticle);
      
      // Mock related articles
      const mockRelated = [
        {
          id: 3,
          title: 'Chính sách mới về bảo hiểm y tế cho bệnh nhân HIV',
          image: '/assets/images/news/insurance.jpg',
          date: '10/05/2025'
        },
        {
          id: 6,
          title: 'Thử nghiệm lâm sàng vaccine HIV giai đoạn 2',
          image: '/assets/images/news/vaccine.jpg',
          date: '03/05/2025'
        },
        {
          id: 7,
          title: 'Ứng dụng trí tuệ nhân tạo trong điều trị HIV',
          image: '/assets/images/news/ai-treatment.jpg',
          date: '01/05/2025'
        }
      ];
      
      setRelatedArticles(mockRelated);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // In a real application, send comment to server
    alert('Bình luận của bạn đã được gửi và đang chờ xét duyệt.');
    setComment('');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="article-detail loading">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Đang tải bài viết...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="article-detail">
        <div className="article-header">
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="article-meta-item">
              <i className="far fa-calendar-alt"></i>
              <span>{article.date}</span>
            </div>
            
            <div className="article-meta-item">
              <i className="far fa-user"></i>
              <span>{article.author}</span>
            </div>
            
            <div className="article-meta-item">
              <span className="article-category">{getCategoryName(article.category)}</span>
            </div>
          </div>
        </div>
        
        <div className="article-image">
          <img src={article.image} alt={article.title} />
        </div>
        
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        <div className="article-tags">
          {article.tags.map((tag, index) => (
            <span key={index} className="article-tag">#{tag}</span>
          ))}
        </div>
        
        <div className="article-share">
          <span className="share-label">Chia sẻ bài viết:</span>
          <div className="share-buttons">
            <a href="#" className="share-button share-facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="share-button share-twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="share-button share-linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="share-button share-email">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
        
        <div className="related-articles">
          <h2 className="related-title">Bài Viết Liên Quan</h2>
          <div className="related-grid">
            {relatedArticles.map(related => (
              <Link to={`/news/${related.id}`} className="related-card" key={related.id}>
                <div className="related-card-image">
                  <img src={related.image} alt={related.title} />
                </div>
                <div className="related-card-content">
                  <h3 className="related-card-title">{related.title}</h3>
                  <div className="related-card-date">
                    <i className="far fa-calendar-alt"></i> {related.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="comment-section">
          <h2 className="comment-title">Bình Luận ({article.comments.length})</h2>
          
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <h3 className="comment-form-title">Để lại bình luận của bạn</h3>
            <textarea 
              className="comment-input"
              rows="4"
              placeholder="Viết bình luận của bạn ở đây..."
              value={comment}
              onChange={handleCommentChange}
            ></textarea>
            <div className="comment-form-buttons">
              <button type="button" className="cancel-button" onClick={() => setComment('')}>
                Hủy
              </button>
              <button type="submit" className="submit-button">
                Gửi bình luận
              </button>
            </div>
          </form>
          
          <div className="comments-list">
            {article.comments.map(comment => (
              <div className="comment" key={comment.id}>
                <div className="comment-avatar">
                  <img src={comment.avatar} alt={comment.author} />
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-time">{comment.time}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <span className="comment-action">
                      <i className="far fa-thumbs-up"></i> Thích ({comment.likes})
                    </span>
                    <span className="comment-action">
                      <i className="far fa-comment"></i> Phản hồi
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="load-more">
            <button className="load-more-button">
              Xem thêm bình luận
            </button>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/assets/images/logo.png" alt="HIV Treatment App Logo" />
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

export default NewsDetail;

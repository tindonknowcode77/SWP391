import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { formatDate, analyzeCD4Trend, analyzeViralLoadTrend } from '../utils/helpers';
import '../styles/TreatmentPlan.css';

const TreatmentPlan = () => {
  const { currentUser } = useContext(AuthContext);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [labResults, setLabResults] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  useEffect(() => {
    const fetchTreatmentData = async () => {
      try {
        setLoading(true);
        
        // Fetch treatment plan data
        const planData = await apiService.getTreatmentPlan(currentUser.id);
        setTreatmentPlan(planData);
        
        // Fetch lab results
        const labData = await apiService.getLabResults(currentUser.id);
        setLabResults(labData);
        
        // Fetch medications
        const medData = await apiService.getMedications(currentUser.id);
        setMedications(medData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching treatment data:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchTreatmentData();
    }
  }, [currentUser]);

  // Calculate CD4 and viral load trends
  const cd4Trend = labResults.length >= 2 ? analyzeCD4Trend(labResults) : null;
  const viralLoadTrend = labResults.length >= 2 ? analyzeViralLoadTrend(labResults) : null;

  // Sort lab results by date (newest first)
  const sortedLabResults = [...labResults].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Get latest lab results
  const latestLabResults = sortedLabResults.length > 0 ? sortedLabResults[0] : null;

  // Format medication schedule
  const formatSchedule = (schedule) => {
    if (!schedule || !schedule.length) return 'N/A';
    return schedule.join(', ');
  };

  // Toggle print preview
  const handlePrint = () => {
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
      setShowPrintPreview(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="treatment-plan-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải thông tin kế hoạch điều trị...</p>
        </div>
      </div>
    );
  }

  if (!treatmentPlan) {
    return (
      <div className="treatment-plan-page">
        <div className="no-plan-container">
          <i className="fas fa-clipboard-list fa-4x"></i>
          <h2>Chưa có kế hoạch điều trị</h2>
          <p>Bạn chưa có kế hoạch điều trị nào. Vui lòng liên hệ với bác sĩ để được tư vấn.</p>
          <Link to="/appointment" className="btn btn-primary">Đặt lịch hẹn</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`treatment-plan-page ${showPrintPreview ? 'print-preview' : ''}`}>
      {/* Header Section */}
      <section className="treatment-header">
        <div className="container">
          <div className="treatment-header-content">
            <h1>Kế Hoạch Điều Trị HIV</h1>
            <p>Theo dõi và quản lý kế hoạch điều trị HIV hiệu quả</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="treatment-content">
        <div className="container">
          <div className="plan-container">
            {/* Top Action Bar */}
            <div className="plan-actions">
              <h2>Kế Hoạch Điều Trị Của {currentUser.firstName}</h2>
              <div className="action-buttons">
                <button className="action-btn print-btn" onClick={handlePrint}>
                  <i className="fas fa-print"></i> In kế hoạch
                </button>
                <Link to="/appointment" className="action-btn appointment-btn">
                  <i className="fas fa-calendar-alt"></i> Đặt lịch hẹn
                </Link>
              </div>
            </div>

            {/* Plan Summary */}
            <div className="plan-summary">
              <div className="summary-item">
                <div className="summary-icon doctor-icon">
                  <i className="fas fa-user-md"></i>
                </div>
                <div className="summary-details">
                  <h3>Bác sĩ điều trị</h3>
                  <p>{treatmentPlan.doctor.name}</p>
                  <span>{treatmentPlan.doctor.specialty}</span>
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-icon regimen-icon">
                  <i className="fas fa-pills"></i>
                </div>
                <div className="summary-details">
                  <h3>Phác đồ điều trị</h3>
                  <p>{treatmentPlan.regimenName}</p>
                  <span>Áp dụng từ {formatDate(treatmentPlan.startDate)}</span>
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-icon status-icon">
                  <i className={`fas fa-${treatmentPlan.status === 'active' ? 'check-circle' : 'exclamation-circle'}`}></i>
                </div>
                <div className="summary-details">
                  <h3>Trạng thái</h3>
                  <p className={`status-${treatmentPlan.status}`}>
                    {treatmentPlan.status === 'active' ? 'Đang điều trị' : 'Tạm ngưng'}
                  </p>
                  <span>Cập nhật: {formatDate(treatmentPlan.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="plan-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-home"></i> Tổng quan
              </button>
              <button 
                className={`tab-btn ${activeTab === 'medications' ? 'active' : ''}`}
                onClick={() => setActiveTab('medications')}
              >
                <i className="fas fa-pills"></i> Thuốc điều trị
              </button>
              <button 
                className={`tab-btn ${activeTab === 'labResults' ? 'active' : ''}`}
                onClick={() => setActiveTab('labResults')}
              >
                <i className="fas fa-flask"></i> Kết quả xét nghiệm
              </button>
              <button 
                className={`tab-btn ${activeTab === 'instructions' ? 'active' : ''}`}
                onClick={() => setActiveTab('instructions')}
              >
                <i className="fas fa-list-ul"></i> Hướng dẫn
              </button>
              <button 
                className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                <i className="fas fa-calendar-check"></i> Lịch hẹn
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-grid">
                    <div className="overview-card health-indicators">
                      <h3><i className="fas fa-heartbeat"></i> Chỉ số sức khỏe gần đây</h3>
                      {latestLabResults ? (
                        <div className="indicators-grid">
                          <div className="indicator">
                            <h4>CD4</h4>
                            <div className="indicator-value">
                              {latestLabResults.cd4Count}
                              <span>tế bào/mm³</span>
                            </div>
                            {cd4Trend && (
                              <div className={`trend-badge ${cd4Trend.direction}`}>
                                <i className={`fas fa-arrow-${cd4Trend.direction === 'increasing' ? 'up' : cd4Trend.direction === 'decreasing' ? 'down' : 'right'}`}></i>
                                {cd4Trend.percentage}%
                              </div>
                            )}
                          </div>
                          
                          <div className="indicator">
                            <h4>Tải lượng vi-rút</h4>
                            <div className="indicator-value">
                              {latestLabResults.viralLoad}
                              <span>bản sao/ml</span>
                            </div>
                            {viralLoadTrend && (
                              <div className={`trend-badge ${viralLoadTrend.direction === 'decreasing' ? 'positive' : viralLoadTrend.direction === 'increasing' ? 'negative' : 'neutral'}`}>
                                <i className={`fas fa-arrow-${viralLoadTrend.direction === 'decreasing' ? 'down' : viralLoadTrend.direction === 'increasing' ? 'up' : 'right'}`}></i>
                                {viralLoadTrend.percentage}%
                              </div>
                            )}
                          </div>
                          
                          <div className="indicator">
                            <h4>Ngày xét nghiệm</h4>
                            <div className="indicator-date">
                              {formatDate(latestLabResults.date)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="no-data-message">
                          <p>Chưa có dữ liệu xét nghiệm. Vui lòng liên hệ với bác sĩ để được tư vấn.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="overview-card next-steps">
                      <h3><i className="fas fa-tasks"></i> Các bước tiếp theo</h3>
                      <ul className="steps-list">
                        {treatmentPlan.nextSteps.map((step, index) => (
                          <li key={index}>
                            <div className={`step-status ${step.completed ? 'completed' : 'pending'}`}>
                              {step.completed ? (
                                <i className="fas fa-check-circle"></i>
                              ) : (
                                <span className="step-number">{index + 1}</span>
                              )}
                            </div>
                            <div className="step-details">
                              <h4>{step.title}</h4>
                              <p>{step.description}</p>
                              {step.dueDate && (
                                <span className="step-date">Hạn: {formatDate(step.dueDate)}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="overview-section treatment-goals">
                    <h3><i className="fas fa-bullseye"></i> Mục tiêu điều trị</h3>
                    <div className="goals-container">
                      {treatmentPlan.goals.map((goal, index) => (
                        <div key={index} className="goal-card">
                          <div className="goal-icon">
                            <i className={`fas fa-${goal.icon}`}></i>
                          </div>
                          <h4>{goal.title}</h4>
                          <p>{goal.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="overview-section doctor-notes">
                    <h3><i className="fas fa-comment-medical"></i> Ghi chú của bác sĩ</h3>
                    <div className="notes-container">
                      {treatmentPlan.doctorNotes ? (
                        <div className="note-content">
                          <p>{treatmentPlan.doctorNotes}</p>
                          <div className="note-meta">
                            <span className="note-doctor">{treatmentPlan.doctor.name}</span>
                            <span className="note-date">{formatDate(treatmentPlan.updatedAt)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="no-data-message">
                          <p>Không có ghi chú nào từ bác sĩ.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Medications Tab */}
              {activeTab === 'medications' && (
                <div className="medications-tab">
                  <div className="medications-header">
                    <h3><i className="fas fa-prescription-bottle-alt"></i> Thuốc điều trị hiện tại</h3>
                    <p>Phác đồ: <strong>{treatmentPlan.regimenName}</strong></p>
                  </div>
                  
                  {medications.length > 0 ? (
                    <div className="medications-list">
                      {medications.map(medication => (
                        <div key={medication.id} className="medication-card">
                          <div className="medication-header">
                            <h4>{medication.name}</h4>
                            <span className={`status-badge ${medication.active ? 'active' : 'inactive'}`}>
                              {medication.active ? 'Đang dùng' : 'Đã ngưng'}
                            </span>
                          </div>
                          
                          <div className="medication-details">
                            <div className="detail-item">
                              <i className="fas fa-pills"></i>
                              <div className="detail-content">
                                <span className="label">Liều lượng:</span>
                                <span>{medication.dosage} {medication.unit}</span>
                              </div>
                            </div>
                            
                            <div className="detail-item">
                              <i className="fas fa-clock"></i>
                              <div className="detail-content">
                                <span className="label">Thời gian:</span>
                                <span>{formatSchedule(medication.schedule)}</span>
                              </div>
                            </div>
                            
                            <div className="detail-item">
                              <i className="fas fa-calendar-day"></i>
                              <div className="detail-content">
                                <span className="label">Tần suất:</span>
                                <span>{medication.frequency}</span>
                              </div>
                            </div>
                            
                            <div className="detail-item">
                              <i className="fas fa-utensils"></i>
                              <div className="detail-content">
                                <span className="label">Hướng dẫn:</span>
                                <span>{medication.instructions || 'Không có hướng dẫn đặc biệt'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="medication-notes">
                            <h5>Ghi chú:</h5>
                            <p>{medication.notes || 'Không có ghi chú'}</p>
                          </div>
                          
                          <div className="medication-dates">
                            <div className="date-item">
                              <span className="label">Bắt đầu:</span>
                              <span>{formatDate(medication.startDate)}</span>
                            </div>
                            {medication.endDate && (
                              <div className="date-item">
                                <span className="label">Kết thúc:</span>
                                <span>{formatDate(medication.endDate)}</span>
                              </div>
                            )}
                          </div>
                          
                          <Link to={`/medications/${medication.id}`} className="medication-details-link">
                            Xem chi tiết <i className="fas fa-chevron-right"></i>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data-message">
                      <p>Không có thông tin về thuốc điều trị. Vui lòng liên hệ với bác sĩ để được tư vấn.</p>
                    </div>
                  )}
                  
                  <div className="medications-info">
                    <h4>Tại sao việc tuân thủ điều trị rất quan trọng?</h4>
                    <p>
                      Uống thuốc ARV đúng giờ và đều đặn sẽ giúp duy trì nồng độ thuốc trong máu ở mức hiệu quả, 
                      ức chế sự nhân lên của HIV, bảo vệ hệ miễn dịch và ngăn ngừa kháng thuốc.
                    </p>
                    <Link to="/resources" className="link-with-arrow">
                      Tìm hiểu thêm về thuốc ARV <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Lab Results Tab */}
              {activeTab === 'labResults' && (
                <div className="lab-results-tab">
                  <div className="lab-results-header">
                    <h3><i className="fas fa-flask"></i> Kết quả xét nghiệm</h3>
                    {sortedLabResults.length > 0 && (
                      <div className="lab-summary">
                        <div className={`summary-status ${viralLoadTrend?.status || 'unknown'}`}>
                          {viralLoadTrend?.status === 'suppressed' && 'Đã kiểm soát vi-rút'}
                          {viralLoadTrend?.status === 'partially suppressed' && 'Kiểm soát vi-rút một phần'}
                          {viralLoadTrend?.status === 'unsuppressed' && 'Chưa kiểm soát vi-rút'}
                          {!viralLoadTrend?.status && 'Chưa xác định'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {sortedLabResults.length > 0 ? (
                    <>
                      <div className="lab-charts">
                        <div className="chart-container">
                          <h4>CD4 (tế bào/mm³)</h4>
                          <div className="chart-placeholder cd4-chart">
                            {/* Chart would be implemented with a library like Chart.js */}
                            <div className="chart-note">Biểu đồ CD4 sẽ được hiển thị ở đây</div>
                          </div>
                        </div>
                        
                        <div className="chart-container">
                          <h4>Tải lượng vi-rút (bản sao/ml)</h4>
                          <div className="chart-placeholder viral-load-chart">
                            {/* Chart would be implemented with a library like Chart.js */}
                            <div className="chart-note">Biểu đồ tải lượng vi-rút sẽ được hiển thị ở đây</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lab-results-table">
                        <h4>Lịch sử xét nghiệm</h4>
                        <div className="table-container">
                          <table>
                            <thead>
                              <tr>
                                <th>Ngày</th>
                                <th>CD4 (tế bào/mm³)</th>
                                <th>Tải lượng vi-rút (bản sao/ml)</th>
                                <th>ALT (U/L)</th>
                                <th>AST (U/L)</th>
                                <th>Creatinine (µmol/L)</th>
                                <th>Ghi chú</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedLabResults.map((result, index) => (
                                <tr key={index}>
                                  <td>{formatDate(result.date)}</td>
                                  <td className={result.cd4Count < 200 ? 'warning' : result.cd4Count > 500 ? 'success' : ''}>
                                    {result.cd4Count}
                                  </td>
                                  <td className={result.viralLoad < 200 ? 'success' : result.viralLoad > 1000 ? 'warning' : ''}>
                                    {result.viralLoad}
                                  </td>
                                  <td className={result.alt > 40 ? 'warning' : ''}>{result.alt}</td>
                                  <td className={result.ast > 40 ? 'warning' : ''}>{result.ast}</td>
                                  <td className={result.creatinine > 115 ? 'warning' : ''}>{result.creatinine}</td>
                                  <td>{result.notes || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="lab-interpretation">
                        <h4><i className="fas fa-info-circle"></i> Hiểu về kết quả xét nghiệm của bạn</h4>
                        <div className="interpretation-grid">
                          <div className="interpretation-item">
                            <h5>CD4</h5>
                            <p>
                              Tế bào CD4 là một loại tế bào bạch cầu giúp cơ thể chống lại nhiễm trùng. 
                              Mục tiêu là duy trì số lượng CD4 trên 500 tế bào/mm³. 
                              Số lượng CD4 dưới 200 tế bào/mm³ được coi là suy giảm miễn dịch nghiêm trọng.
                            </p>
                          </div>
                          
                          <div className="interpretation-item">
                            <h5>Tải lượng vi-rút</h5>
                            <p>
                              Tải lượng vi-rút là số lượng vi-rút HIV trong máu. 
                              Mục tiêu điều trị là giảm tải lượng vi-rút đến mức không phát hiện được (&lt;50 bản sao/ml). 
                              Tải lượng vi-rút thấp giảm nguy cơ lây truyền và bảo vệ hệ miễn dịch.
                            </p>
                          </div>
                          
                          <div className="interpretation-item">
                            <h5>ALT và AST</h5>
                            <p>
                              ALT và AST là enzym gan, giúp đánh giá chức năng gan. 
                              Một số thuốc ARV có thể ảnh hưởng đến gan, vì vậy cần theo dõi các chỉ số này.
                            </p>
                          </div>
                          
                          <div className="interpretation-item">
                            <h5>Creatinine</h5>
                            <p>
                              Creatinine giúp đánh giá chức năng thận. 
                              Một số thuốc ARV có thể ảnh hưởng đến thận, vì vậy cần theo dõi chỉ số này.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="no-data-message">
                      <p>Chưa có dữ liệu xét nghiệm. Vui lòng liên hệ với bác sĩ để được tư vấn.</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Instructions Tab */}
              {activeTab === 'instructions' && (
                <div className="instructions-tab">
                  <div className="instructions-header">
                    <h3><i className="fas fa-list-ul"></i> Hướng dẫn điều trị</h3>
                  </div>
                  
                  <div className="instructions-grid">
                    <div className="instruction-card">
                      <div className="instruction-icon medication-icon">
                        <i className="fas fa-pills"></i>
                      </div>
                      <h4>Uống thuốc</h4>
                      <ul>
                        <li>Uống thuốc đúng liều lượng và thời gian quy định</li>
                        <li>Không bỏ liều, ngay cả khi cảm thấy khỏe</li>
                        <li>Nếu quên uống thuốc, hãy uống ngay khi nhớ ra</li>
                        <li>Lưu ý tương tác thuốc có thể xảy ra với các loại thuốc khác</li>
                        <li>Luôn mang theo thuốc dự phòng khi đi xa</li>
                      </ul>
                    </div>
                    
                    <div className="instruction-card">
                      <div className="instruction-icon monitoring-icon">
                        <i className="fas fa-stethoscope"></i>
                      </div>
                      <h4>Theo dõi sức khỏe</h4>
                      <ul>
                        <li>Khám định kỳ 3-6 tháng/lần theo lịch hẹn</li>
                        <li>Xét nghiệm CD4 và tải lượng vi-rút định kỳ</li>
                        <li>Theo dõi các tác dụng phụ có thể xảy ra</li>
                        <li>Báo cáo với bác sĩ về bất kỳ triệu chứng mới nào</li>
                        <li>Kiểm tra sức khỏe răng miệng định kỳ</li>
                      </ul>
                    </div>
                    
                    <div className="instruction-card">
                      <div className="instruction-icon nutrition-icon">
                        <i className="fas fa-apple-alt"></i>
                      </div>
                      <h4>Dinh dưỡng</h4>
                      <ul>
                        <li>Duy trì chế độ ăn cân bằng và đa dạng</li>
                        <li>Uống đủ nước (ít nhất 2 lít/ngày)</li>
                        <li>Hạn chế rượu bia và đồ uống có cồn</li>
                        <li>Ăn nhiều trái cây, rau xanh và protein</li>
                        <li>Tham khảo ý kiến bác sĩ về chế độ ăn phù hợp</li>
                      </ul>
                    </div>
                    
                    <div className="instruction-card">
                      <div className="instruction-icon lifestyle-icon">
                        <i className="fas fa-running"></i>
                      </div>
                      <h4>Lối sống</h4>
                      <ul>
                        <li>Tập thể dục đều đặn (ít nhất 30 phút/ngày)</li>
                        <li>Tránh hút thuốc lá và các chất kích thích</li>
                        <li>Duy trì giấc ngủ đủ và chất lượng</li>
                        <li>Quản lý stress thông qua các hoạt động thư giãn</li>
                        <li>Tham gia các nhóm hỗ trợ nếu cần</li>
                      </ul>
                    </div>
                    
                    <div className="instruction-card">
                      <div className="instruction-icon prevention-icon">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <h4>Phòng ngừa</h4>
                      <ul>
                        <li>Thực hành tình dục an toàn</li>
                        <li>Tiêm phòng các bệnh truyền nhiễm theo khuyến cáo</li>
                        <li>Tránh tiếp xúc với người mắc bệnh truyền nhiễm</li>
                        <li>Giữ vệ sinh cá nhân tốt</li>
                        <li>Thông báo cho đối tác về tình trạng HIV của bạn</li>
                      </ul>
                    </div>
                    
                    <div className="instruction-card">
                      <div className="instruction-icon mental-icon">
                        <i className="fas fa-brain"></i>
                      </div>
                      <h4>Sức khỏe tâm thần</h4>
                      <ul>
                        <li>Nhận biết dấu hiệu trầm cảm và lo âu</li>
                        <li>Tìm kiếm sự hỗ trợ tâm lý khi cần</li>
                        <li>Duy trì kết nối xã hội và mối quan hệ</li>
                        <li>Thực hành các kỹ thuật thư giãn như thiền</li>
                        <li>Đặt mục tiêu thực tế và tích cực</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="special-instructions">
                    <h4><i className="fas fa-exclamation-circle"></i> Hướng dẫn đặc biệt</h4>
                    <div className="special-instructions-content">
                      <p>{treatmentPlan.specialInstructions || 'Không có hướng dẫn đặc biệt nào từ bác sĩ.'}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div className="appointments-tab">
                  <div className="appointments-header">
                    <h3><i className="fas fa-calendar-check"></i> Lịch hẹn khám</h3>
                    <Link to="/appointment" className="new-appointment-btn">
                      <i className="fas fa-plus"></i> Đặt lịch hẹn mới
                    </Link>
                  </div>
                  
                  {treatmentPlan.appointments && treatmentPlan.appointments.length > 0 ? (
                    <>
                      <div className="next-appointment">
                        <h4>Lịch hẹn sắp tới</h4>
                        {treatmentPlan.appointments.filter(app => new Date(app.date) > new Date()).length > 0 ? (
                          <div className="next-appointment-card">
                            {(() => {
                              const nextApp = treatmentPlan.appointments
                                .filter(app => new Date(app.date) > new Date())
                                .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
                              
                              return (
                                <>
                                  <div className="appointment-date">
                                    <div className="date-card">
                                      <div className="date-month">{new Date(nextApp.date).toLocaleString('vi', { month: 'short' })}</div>
                                      <div className="date-day">{new Date(nextApp.date).getDate()}</div>
                                      <div className="date-year">{new Date(nextApp.date).getFullYear()}</div>
                                    </div>
                                    <div className="date-time">{nextApp.time}</div>
                                  </div>
                                  
                                  <div className="appointment-info">
                                    <h5>{nextApp.type}</h5>
                                    <div className="info-item">
                                      <i className="fas fa-user-md"></i>
                                      <span>{nextApp.doctor.name}</span>
                                    </div>
                                    <div className="info-item">
                                      <i className="fas fa-clinic-medical"></i>
                                      <span>{nextApp.location}</span>
                                    </div>
                                    <div className="info-item">
                                      <i className="fas fa-info-circle"></i>
                                      <span>{nextApp.notes || 'Không có ghi chú'}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="appointment-actions">
                                    <button className="action-btn reschedule-btn">
                                      <i className="fas fa-sync-alt"></i> Đổi lịch
                                    </button>
                                    <button className="action-btn cancel-btn">
                                      <i className="fas fa-times"></i> Hủy
                                    </button>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="no-data-message">
                            <p>Không có lịch hẹn sắp tới. <Link to="/appointment">Đặt lịch hẹn mới</Link></p>
                          </div>
                        )}
                      </div>
                      
                      <div className="appointments-history">
                        <h4>Lịch sử khám</h4>
                        <div className="table-container">
                          <table>
                            <thead>
                              <tr>
                                <th>Ngày</th>
                                <th>Thời gian</th>
                                <th>Loại</th>
                                <th>Bác sĩ</th>
                                <th>Địa điểm</th>
                                <th>Kết quả</th>
                              </tr>
                            </thead>
                            <tbody>
                              {treatmentPlan.appointments
                                .filter(app => new Date(app.date) < new Date())
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((appointment, index) => (
                                  <tr key={index}>
                                    <td>{formatDate(appointment.date)}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.type}</td>
                                    <td>{appointment.doctor.name}</td>
                                    <td>{appointment.location}</td>
                                    <td>
                                      {appointment.status === 'completed' ? (
                                        <span className="status-badge completed">Đã khám</span>
                                      ) : appointment.status === 'cancelled' ? (
                                        <span className="status-badge cancelled">Đã hủy</span>
                                      ) : (
                                        <span className="status-badge pending">Chưa khám</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="no-data-message">
                      <p>Không có thông tin về lịch hẹn khám. <Link to="/appointment">Đặt lịch hẹn</Link> để được tư vấn.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action Bar */}
      <div className="fixed-action-bar">
        <div className="container">
          <div className="action-bar-content">
            <div className="action-info">
              <i className="fas fa-info-circle"></i>
              <span>Cần trợ giúp? Liên hệ đường dây nóng: <strong>1800 1234</strong></span>
            </div>
            <div className="action-buttons">
              <Link to="/profile" className="action-btn">
                <i className="fas fa-user"></i> Hồ sơ
              </Link>
              <Link to="/resources" className="action-btn">
                <i className="fas fa-book-medical"></i> Tài nguyên
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlan;
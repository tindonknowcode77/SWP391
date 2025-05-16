import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { formatDate, getTimeOfDay } from '../utils/helpers';
import useResponsive from '../hooks/useResponsive';
import '../styles/MedicationManager.css';

const MedicationManager = () => {
  const { currentUser } = useContext(AuthContext);
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('current');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderSettings, setReminderSettings] = useState({
    enabled: false,
    timesPerDay: 2,
    times: ['08:00', '20:00'],
    notificationType: 'push',
  });
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [intakeTime, setIntakeTime] = useState('');
  const [intakeNote, setIntakeNote] = useState('');
  const { isMobile } = useResponsive();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        
        // Fetch current medications
        const medData = await apiService.getMedications(currentUser.id);
        setMedications(medData);
        
        // Fetch medication history
        const historyData = await apiService.getMedicationHistory(currentUser.id);
        setHistory(historyData);
        
        // Fetch reminder settings
        const settings = await apiService.getMedicationReminders(currentUser.id);
        if (settings) {
          setReminderSettings(settings);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medication data:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMedications();
    }
  }, [currentUser]);

  // Group medications by time of day
  const groupedMedications = medications.reduce((acc, med) => {
    if (!med.active) return acc;
    
    med.schedule.forEach(time => {
      const timeOfDay = getTimeOfDay(time);
      if (!acc[timeOfDay]) {
        acc[timeOfDay] = [];
      }
      
      // Check if medication is already in this time slot
      const isAdded = acc[timeOfDay].some(item => item.id === med.id);
      if (!isAdded) {
        acc[timeOfDay].push({
          ...med,
          specificTime: time
        });
      }
    });
    
    return acc;
  }, {});

  // Time of day order
  const timeOfDayOrder = ['morning', 'afternoon', 'evening', 'night'];

  // Format schedule for display
  const formatSchedule = (schedule) => {
    if (!schedule || !schedule.length) return 'N/A';
    return schedule.join(', ');
  };

  // Open reminder settings modal
  const handleOpenReminderSettings = () => {
    setShowReminderModal(true);
  };

  // Save reminder settings
  const handleSaveReminderSettings = async () => {
    try {
      await apiService.updateMedicationReminders(currentUser.id, reminderSettings);
      setShowReminderModal(false);
      // Show success message
      alert('Cài đặt nhắc nhở đã được cập nhật');
    } catch (error) {
      console.error('Error updating reminder settings:', error);
      // Show error message
      alert('Đã xảy ra lỗi khi cập nhật cài đặt nhắc nhở');
    }
  };

  // Handle reminder times change
  const handleReminderTimeChange = (index, value) => {
    const updatedTimes = [...reminderSettings.times];
    updatedTimes[index] = value;
    setReminderSettings({
      ...reminderSettings,
      times: updatedTimes
    });
  };

  // Handle times per day change
  const handleTimesPerDayChange = (value) => {
    const newTimesPerDay = parseInt(value);
    let updatedTimes = [...reminderSettings.times];
    
    if (newTimesPerDay > reminderSettings.times.length) {
      // Add more times
      for (let i = reminderSettings.times.length; i < newTimesPerDay; i++) {
        updatedTimes.push('12:00');
      }
    } else {
      // Remove extra times
      updatedTimes = updatedTimes.slice(0, newTimesPerDay);
    }
    
    setReminderSettings({
      ...reminderSettings,
      timesPerDay: newTimesPerDay,
      times: updatedTimes
    });
  };

  // Open medication intake modal
  const handleOpenIntakeModal = (medication) => {
    setSelectedMedication(medication);
    setIntakeTime(new Date().toTimeString().substring(0, 5));
    setIntakeNote('');
    setShowIntakeModal(true);
  };

  // Record medication intake
  const handleRecordIntake = async () => {
    try {
      if (!selectedMedication) return;
      
      await apiService.recordMedicationIntake(
        currentUser.id,
        selectedMedication.id,
        {
          date: new Date().toISOString().split('T')[0],
          time: intakeTime,
          notes: intakeNote
        }
      );
      
      setShowIntakeModal(false);
      
      // Refresh history
      const historyData = await apiService.getMedicationHistory(currentUser.id);
      setHistory(historyData);
      
      // Show success message
      alert('Đã ghi nhận việc uống thuốc');
    } catch (error) {
      console.error('Error recording medication intake:', error);
      // Show error message
      alert('Đã xảy ra lỗi khi ghi nhận việc uống thuốc');
    }
  };

  // Calculate adherence rate
  const calculateAdherence = () => {
    if (!history.length) return 0;
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentHistory = history.filter(record => 
      new Date(record.date) >= last30Days
    );
    
    let expectedDoses = 0;
    medications.forEach(med => {
      if (med.active) {
        expectedDoses += (med.schedule.length * 30);
      }
    });
    
    if (expectedDoses === 0) return 0;
    
    return Math.min(Math.round((recentHistory.length / expectedDoses) * 100), 100);
  };

  const adherenceRate = calculateAdherence();

  if (loading) {
    return (
      <div className="medication-manager">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải thông tin thuốc điều trị...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medication-manager">
      {/* Header Section */}
      <section className="medication-header">
        <div className="container">
          <div className="medication-header-content">
            <h1>Quản Lý Thuốc Điều Trị</h1>
            <p>Quản lý hiệu quả thuốc ARV và theo dõi việc tuân thủ điều trị</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="medication-content">
        <div className="container">
          <div className="content-container">
            {/* Top Action Bar */}
            <div className="medication-actions">
              <div className="view-selector">
                <button 
                  className={`view-btn ${activeView === 'current' ? 'active' : ''}`}
                  onClick={() => setActiveView('current')}
                >
                  <i className="fas fa-pills"></i>
                  <span>Thuốc hiện tại</span>
                </button>
                <button 
                  className={`view-btn ${activeView === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveView('history')}
                >
                  <i className="fas fa-history"></i>
                  <span>Lịch sử uống thuốc</span>
                </button>
                <button 
                  className={`view-btn ${activeView === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveView('settings')}
                >
                  <i className="fas fa-cog"></i>
                  <span>Cài đặt</span>
                </button>
              </div>
              <div className="action-buttons">
                <button 
                  className="action-btn reminder-btn"
                  onClick={handleOpenReminderSettings}
                >
                  <i className="fas fa-bell"></i> Nhắc nhở uống thuốc
                </button>
                <Link to="/treatment-plan" className="action-btn plan-btn">
                  <i className="fas fa-clipboard-list"></i> Kế hoạch điều trị
                </Link>
              </div>
            </div>

            {/* Adherence Summary */}
            <div className="adherence-summary">
              <div className="adherence-card">
                <div className="adherence-title">Tỷ lệ tuân thủ điều trị</div>
                <div className="adherence-chart">
                  <div className="progress-circle">
                    <div 
                      className="progress-circle-fill" 
                      style={{ 
                        background: `conic-gradient(
                          ${adherenceRate >= 90 ? '#27ae60' : adherenceRate >= 70 ? '#f39c12' : '#e74c3c'} 
                          ${adherenceRate * 3.6}deg, 
                          #f3f3f3 0deg
                        )` 
                      }}
                    ></div>
                    <div className="progress-circle-value">
                      <span className="adherence-value">{adherenceRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="adherence-status">
                  {adherenceRate >= 90 ? (
                    <span className="status-badge success">Rất tốt</span>
                  ) : adherenceRate >= 70 ? (
                    <span className="status-badge warning">Khá tốt</span>
                  ) : (
                    <span className="status-badge danger">Cần cải thiện</span>
                  )}
                </div>
                <div className="adherence-message">
                  {adherenceRate >= 90 ? (
                    <p>Tuyệt vời! Bạn đang tuân thủ điều trị rất tốt. Hãy tiếp tục duy trì nhé!</p>
                  ) : adherenceRate >= 70 ? (
                    <p>Bạn đang tuân thủ điều trị khá tốt. Cố gắng không bỏ lỡ liều nào nhé!</p>
                  ) : (
                    <p>Bạn cần cải thiện việc tuân thủ điều trị. Việc uống thuốc đều đặn rất quan trọng!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Current Medications View */}
            {activeView === 'current' && (
              <>
                <div className="section-header">
                  <h2>Lịch uống thuốc hàng ngày</h2>
                  <p>Danh sách tất cả các thuốc ARV hiện tại của bạn, sắp xếp theo thời gian trong ngày</p>
                </div>

                {medications.length > 0 ? (
                  <div className="daily-schedule">
                    {timeOfDayOrder.map(timeOfDay => 
                      groupedMedications[timeOfDay] && groupedMedications[timeOfDay].length > 0 ? (
                        <div className="time-group" key={timeOfDay}>
                          <div className="time-header">
                            <div className={`time-icon ${timeOfDay}-icon`}>
                              <i className={`fas fa-${
                                timeOfDay === 'morning' ? 'sun' : 
                                timeOfDay === 'afternoon' ? 'cloud-sun' : 
                                timeOfDay === 'evening' ? 'cloud-moon' : 'moon'
                              }`}></i>
                            </div>
                            <h3>
                              {timeOfDay === 'morning' ? 'Buổi sáng' : 
                              timeOfDay === 'afternoon' ? 'Buổi trưa' : 
                              timeOfDay === 'evening' ? 'Buổi chiều' : 'Buổi tối'}
                            </h3>
                          </div>
                          
                          <div className="medications-list">
                            {groupedMedications[timeOfDay].map((medication, index) => (
                              <div className="medication-item" key={`${medication.id}-${index}`}>
                                <div className="medication-info">
                                  <div className="medication-name-wrapper">
                                    <h4 className="medication-name">{medication.name}</h4>
                                    <span className="medication-time">{medication.specificTime}</span>
                                  </div>
                                  <div className="medication-details">
                                    <span className="medication-dosage">{medication.dosage} {medication.unit}</span>
                                    {medication.instructions && (
                                      <span className="medication-instructions">({medication.instructions})</span>
                                    )}
                                  </div>
                                </div>
                                <button 
                                  className="take-btn"
                                  onClick={() => handleOpenIntakeModal(medication)}
                                >
                                  <i className="fas fa-check"></i>
                                  <span>Đã uống</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>Không có thông tin về thuốc điều trị. Vui lòng liên hệ với bác sĩ để được tư vấn.</p>
                  </div>
                )}

                <div className="medications-section">
                  <div className="section-header">
                    <h2>Chi tiết thuốc điều trị</h2>
                    <p>Thông tin chi tiết về tất cả các thuốc ARV trong phác đồ điều trị của bạn</p>
                  </div>
                  
                  {medications.length > 0 ? (
                    <div className="medications-grid">
                      {medications.map(medication => (
                        <div 
                          key={medication.id} 
                          className={`medication-card ${!medication.active ? 'inactive' : ''}`}
                        >
                          <div className="medication-header">
                            <h3>{medication.name}</h3>
                            <span className={`status-badge ${medication.active ? 'active' : 'inactive'}`}>
                              {medication.active ? 'Đang dùng' : 'Đã ngưng'}
                            </span>
                          </div>
                          
                          <div className="medication-body">
                            <div className="detail-row">
                              <i className="fas fa-prescription-bottle-alt"></i>
                              <div>
                                <span className="detail-label">Liều lượng:</span>
                                <span className="detail-value">{medication.dosage} {medication.unit}</span>
                              </div>
                            </div>
                            
                            <div className="detail-row">
                              <i className="fas fa-clock"></i>
                              <div>
                                <span className="detail-label">Thời gian uống:</span>
                                <span className="detail-value">{formatSchedule(medication.schedule)}</span>
                              </div>
                            </div>
                            
                            <div className="detail-row">
                              <i className="fas fa-calendar-day"></i>
                              <div>
                                <span className="detail-label">Tần suất:</span>
                                <span className="detail-value">{medication.frequency}</span>
                              </div>
                            </div>
                            
                            <div className="detail-row">
                              <i className="fas fa-utensils"></i>
                              <div>
                                <span className="detail-label">Hướng dẫn:</span>
                                <span className="detail-value">{medication.instructions || 'Không có hướng dẫn đặc biệt'}</span>
                              </div>
                            </div>
                            
                            {medication.notes && (
                              <div className="detail-row">
                                <i className="fas fa-sticky-note"></i>
                                <div>
                                  <span className="detail-label">Ghi chú:</span>
                                  <span className="detail-value">{medication.notes}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="medication-footer">
                            <div className="dates">
                              <div className="date-item">
                                <span className="date-label">Bắt đầu:</span>
                                <span className="date-value">{formatDate(medication.startDate)}</span>
                              </div>
                              
                              {medication.endDate && (
                                <div className="date-item">
                                  <span className="date-label">Kết thúc:</span>
                                  <span className="date-value">{formatDate(medication.endDate)}</span>
                                </div>
                              )}
                            </div>
                            
                            <button 
                              className="more-info-btn"
                              onClick={() => window.open(`/medications/${medication.id}`, '_blank')}
                            >
                              Thông tin chi tiết
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data-message">
                      <p>Không có thông tin về thuốc điều trị. Vui lòng liên hệ với bác sĩ để được tư vấn.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Medication History View */}
            {activeView === 'history' && (
              <>
                <div className="section-header">
                  <h2>Lịch sử uống thuốc</h2>
                  <p>Theo dõi việc uống thuốc của bạn trong 30 ngày qua</p>
                </div>
                
                {history.length > 0 ? (
                  <div className="history-container">
                    <div className="history-filters">
                      <div className="filter-group">
                        <label>Lọc theo thuốc:</label>
                        <select className="filter-select">
                          <option value="all">Tất cả thuốc</option>
                          {medications.map(med => (
                            <option key={med.id} value={med.id}>{med.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="filter-group">
                        <label>Lọc theo thời gian:</label>
                        <select className="filter-select">
                          <option value="last30">30 ngày qua</option>
                          <option value="last90">90 ngày qua</option>
                          <option value="lastYear">1 năm qua</option>
                          <option value="all">Tất cả</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="history-table-container">
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>Ngày</th>
                            <th>Thời gian</th>
                            <th>Thuốc</th>
                            <th>Liều lượng</th>
                            <th>Ghi chú</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history
                            .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
                            .map((record, index) => {
                              const medication = medications.find(med => med.id === record.medicationId);
                              return (
                                <tr key={index}>
                                  <td>{formatDate(record.date)}</td>
                                  <td>{record.time}</td>
                                  <td>{medication ? medication.name : 'N/A'}</td>
                                  <td>{medication ? `${medication.dosage} ${medication.unit}` : 'N/A'}</td>
                                  <td>{record.notes || 'Không có ghi chú'}</td>
                                  <td>
                                    <span className="status-badge success">Đã uống</span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="calendar-view">
                      <h3>Xem theo lịch</h3>
                      <div className="calendar-placeholder">
                        <p>Tính năng xem theo lịch sẽ được cập nhật trong thời gian tới</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>Chưa có dữ liệu về lịch sử uống thuốc. Hãy bắt đầu ghi nhận việc uống thuốc của bạn!</p>
                  </div>
                )}
              </>
            )}

            {/* Settings View */}
            {activeView === 'settings' && (
              <>
                <div className="section-header">
                  <h2>Cài đặt quản lý thuốc</h2>
                  <p>Tùy chỉnh các thiết lập cho việc quản lý thuốc của bạn</p>
                </div>
                
                <div className="settings-container">
                  <div className="settings-card">
                    <h3><i className="fas fa-bell"></i> Nhắc nhở uống thuốc</h3>
                    
                    <div className="setting-group">
                      <div className="setting-row">
                        <label className="toggle-label">
                          <span>Bật nhắc nhở uống thuốc</span>
                          <div className="toggle-switch">
                            <input 
                              type="checkbox" 
                              checked={reminderSettings.enabled} 
                              onChange={() => setReminderSettings({
                                ...reminderSettings, 
                                enabled: !reminderSettings.enabled
                              })}
                            />
                            <span className="toggle-slider"></span>
                          </div>
                        </label>
                      </div>
                      
                      {reminderSettings.enabled && (
                        <>
                          <div className="setting-row">
                            <label>Số lần nhắc trong ngày:</label>
                            <select 
                              value={reminderSettings.timesPerDay}
                              onChange={(e) => handleTimesPerDayChange(e.target.value)}
                            >
                              {[1, 2, 3, 4].map(num => (
                                <option key={num} value={num}>{num} lần/ngày</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="setting-row times-container">
                            <label>Thời gian nhắc nhở:</label>
                            <div className="times-inputs">
                              {reminderSettings.times.map((time, index) => (
                                <input 
                                  key={index}
                                  type="time" 
                                  value={time}
                                  onChange={(e) => handleReminderTimeChange(index, e.target.value)}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="setting-row">
                            <label>Hình thức nhắc nhở:</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input 
                                  type="radio" 
                                  value="push" 
                                  checked={reminderSettings.notificationType === 'push'}
                                  onChange={() => setReminderSettings({
                                    ...reminderSettings,
                                    notificationType: 'push'
                                  })} 
                                />
                                <span>Thông báo đẩy</span>
                              </label>
                              <label className="radio-label">
                                <input 
                                  type="radio" 
                                  value="email" 
                                  checked={reminderSettings.notificationType === 'email'}
                                  onChange={() => setReminderSettings({
                                    ...reminderSettings,
                                    notificationType: 'email'
                                  })}
                                />
                                <span>Email</span>
                              </label>
                              <label className="radio-label">
                                <input 
                                  type="radio" 
                                  value="sms" 
                                  checked={reminderSettings.notificationType === 'sms'}
                                  onChange={() => setReminderSettings({
                                    ...reminderSettings,
                                    notificationType: 'sms'
                                  })}
                                />
                                <span>SMS</span>
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="setting-actions">
                        <button 
                          className="save-settings-btn"
                          onClick={handleSaveReminderSettings}
                        >
                          Lưu cài đặt
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="settings-card">
                    <h3><i className="fas fa-download"></i> Xuất dữ liệu</h3>
                    
                    <div className="setting-group">
                      <p className="settings-description">
                        Tải xuống dữ liệu về thuốc và lịch sử uống thuốc của bạn để chia sẻ với bác sĩ hoặc lưu trữ.
                      </p>
                      
                      <div className="export-buttons">
                        <button className="export-btn">
                          <i className="fas fa-file-pdf"></i> Xuất PDF
                        </button>
                        <button className="export-btn">
                          <i className="fas fa-file-excel"></i> Xuất Excel
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="settings-card">
                    <h3><i className="fas fa-user-md"></i> Chia sẻ với bác sĩ</h3>
                    
                    <div className="setting-group">
                      <p className="settings-description">
                        Chia sẻ dữ liệu về việc tuân thủ điều trị của bạn với bác sĩ điều trị.
                      </p>
                      
                      <div className="setting-row">
                        <label className="toggle-label">
                          <span>Tự động chia sẻ dữ liệu tuân thủ điều trị</span>
                          <div className="toggle-switch">
                            <input type="checkbox" />
                            <span className="toggle-slider"></span>
                          </div>
                        </label>
                      </div>
                      
                      <button className="share-btn">
                        <i className="fas fa-share-alt"></i> Chia sẻ ngay
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="modal-overlay">
          <div className="modal-container reminder-modal">
            <div className="modal-header">
              <h3>Cài đặt nhắc nhở uống thuốc</h3>
              <button 
                className="close-btn"
                onClick={() => setShowReminderModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="setting-group">
                <div className="setting-row">
                  <label className="toggle-label">
                    <span>Bật nhắc nhở uống thuốc</span>
                    <div className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={reminderSettings.enabled} 
                        onChange={() => setReminderSettings({
                          ...reminderSettings, 
                          enabled: !reminderSettings.enabled
                        })}
                      />
                      <span className="toggle-slider"></span>
                    </div>
                  </label>
                </div>
                
                {reminderSettings.enabled && (
                  <>
                    <div className="setting-row">
                      <label>Số lần nhắc trong ngày:</label>
                      <select 
                        value={reminderSettings.timesPerDay}
                        onChange={(e) => handleTimesPerDayChange(e.target.value)}
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num} lần/ngày</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="setting-row times-container">
                      <label>Thời gian nhắc nhở:</label>
                      <div className="times-inputs">
                        {reminderSettings.times.map((time, index) => (
                          <input 
                            key={index}
                            type="time" 
                            value={time}
                            onChange={(e) => handleReminderTimeChange(index, e.target.value)}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="setting-row">
                      <label>Hình thức nhắc nhở:</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            value="push" 
                            checked={reminderSettings.notificationType === 'push'}
                            onChange={() => setReminderSettings({
                              ...reminderSettings,
                              notificationType: 'push'
                            })} 
                          />
                          <span>Thông báo đẩy</span>
                        </label>
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            value="email" 
                            checked={reminderSettings.notificationType === 'email'}
                            onChange={() => setReminderSettings({
                              ...reminderSettings,
                              notificationType: 'email'
                            })}
                          />
                          <span>Email</span>
                        </label>
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            value="sms" 
                            checked={reminderSettings.notificationType === 'sms'}
                            onChange={() => setReminderSettings({
                              ...reminderSettings,
                              notificationType: 'sms'
                            })}
                          />
                          <span>SMS</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowReminderModal(false)}
              >
                Hủy
              </button>
              <button 
                className="save-btn"
                onClick={handleSaveReminderSettings}
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intake Modal */}
      {showIntakeModal && selectedMedication && (
        <div className="modal-overlay">
          <div className="modal-container intake-modal">
            <div className="modal-header">
              <h3>Ghi nhận uống thuốc</h3>
              <button 
                className="close-btn"
                onClick={() => setShowIntakeModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="intake-medication-info">
                <h4>{selectedMedication.name}</h4>
                <p>{selectedMedication.dosage} {selectedMedication.unit}</p>
              </div>
              
              <div className="intake-form-group">
                <label>Thời gian uống:</label>
                <input 
                  type="time" 
                  value={intakeTime}
                  onChange={(e) => setIntakeTime(e.target.value)}
                />
              </div>
              
              <div className="intake-form-group">
                <label>Ghi chú (không bắt buộc):</label>
                <textarea 
                  value={intakeNote}
                  onChange={(e) => setIntakeNote(e.target.value)}
                  placeholder="Thêm ghi chú về việc uống thuốc (nếu có)..."
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowIntakeModal(false)}
              >
                Hủy
              </button>
              <button 
                className="record-btn"
                onClick={handleRecordIntake}
              >
                Xác nhận đã uống
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed-action-bar">
        <div className="container">
          <div className="action-bar-content">
            <div className="action-info">
              <i className="fas fa-info-circle"></i>
              <span>Cần trợ giúp? Liên hệ đường dây nóng: <strong>1800 1234</strong></span>
            </div>
            <div className="action-buttons">
              <Link to="/treatment-plan" className="action-btn">
                <i className="fas fa-clipboard-list"></i> Kế hoạch điều trị
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

export default MedicationManager;
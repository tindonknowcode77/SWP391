import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  getTreatmentPlanById,
  AllARVProtocol,
  addPrescription,
  UpdateTreatmentPlan,
  getAllDoctors,
  AddTreatmentPlan
} from '../api/auth';
import {updateARVProtocol} from '../api/auth';
import '../styles/TreatmentPlanDetail.css';
import { useAuth } from '../context/AuthContext';
import {bacsilaydanhsachbenhnhan} from '../api/auth';


const TreatmentPlanDetail = () => {
  const { currentUser} = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arvProtocols, setArvProtocols] = useState([]);
  const [selectedARV, setSelectedARV] = useState('');
  const [selectedARVObj, setSelectedARVObj] = useState(null);
  const [arvEditSuccess, setArvEditSuccess] = useState('');
  const [arvEditError, setArvEditError] = useState('');
  const [prescription, setPrescription] = useState({
    TreatmentPlanID: id,
    Medication: '',
    Dosage: '',
    Frequency: '',
    Note: ''
  });
  const [prescSuccess, setPrescSuccess] = useState('');
  const [prescError, setPrescError] = useState('');
  const [editDiagnosis, setEditDiagnosis] = useState(false);
  const [editResult, setEditResult] = useState(false);
  const [diagnosisValue, setDiagnosisValue] = useState('');
  const [resultValue, setResultValue] = useState('');
  const [pendingDiagnosis, setPendingDiagnosis] = useState('');
  const [pendingResult, setPendingResult] = useState('');
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    setLoading(true);
    getTreatmentPlanById(id)
      .then(res => {
        setPlan(res?.data || res);
        setSelectedARV(res?.data?.ARVProtocol || res?.ARVProtocol || '');
        setDiagnosisValue(res?.data?.Diagnosis || res?.Diagnosis || '');
        setResultValue(res?.data?.TreatmentResult || res?.TreatmentResult || '');
        setPendingDiagnosis(res?.data?.Diagnosis || res?.Diagnosis || '');
        setPendingResult(res?.data?.TreatmentResult || res?.TreatmentResult || '');
        setLoading(false);
        // Sau khi lấy được plan, lấy danh sách bệnh nhân và tìm bệnh nhân tương ứng
        bacsilaydanhsachbenhnhan().then(list => {
          const arr = list?.data || list;
          console.log('Danh sách arr:', arr);
          if (arr && Array.isArray(arr)) {
            const planPatientID = String(res?.data?.PatientID || res?.PatientID);
            const found = arr.find(p =>
              String(p.PatientID) === planPatientID ||
              (p.Patient && String(p.Patient.PatientID) === planPatientID)
            );
            if (found) {
              console.log('Tìm thấy patientInfo:', found);
            }
            setPatientInfo(found || null);
          }
        });
      })
      .catch(() => {
        setError('Không thể tải hồ sơ điều trị');
        setLoading(false);
      });
    AllARVProtocol()
      .then(res => {
        console.log('ARV Protocols:', res);
        setArvProtocols(res?.data || res)
      })
      .catch(() => setArvProtocols([]));
  }, [id]);

  const handleARVChange = (e) => {
    const arvid = e.target.value;
    setSelectedARV(arvid);
    const found = arvProtocols.find(arv => arv.ARVID === arvid);
    setSelectedARVObj(found || null);
  };

  const handleARVUpdate = () => {
    if (!selectedARVObj) {
      setArvEditError('Vui lòng chọn phác đồ ARV!');
      setArvEditSuccess('');
      return;
    }
    if (!plan) {
      setArvEditError('Không tìm thấy hồ sơ điều trị!');
      setArvEditSuccess('');
      return;
    }
    const payload = {
      TreatmentPlanID: plan.TreatmentPlanID,
      PatientID: plan.PatientID,
      DoctorID: plan.DoctorID,
      ARVProtocol: selectedARVObj.ARVID,
      TreatmentLine: plan.TreatmentLine,
      Diagnosis: plan.Diagnosis,
      TreatmentResult: plan.TreatmentResult
    };
    UpdateTreatmentPlan(payload)
      .then(() => {
        setArvEditSuccess('Cập nhật phác đồ ARV thành công!');
        setArvEditError('');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        setArvEditError('Cập nhật phác đồ ARV thất bại!');
        setArvEditSuccess('');
        console.log('API error:', error.response?.data || error);
      });
  };

  const handlePrescChange = (e) => {
    setPrescription({ ...prescription, [e.target.name]: e.target.value });
  };

  const handlePrescSubmit = (e) => {
    e.preventDefault();
    addPrescription(prescription)
      .then(() => {
        setPrescSuccess('Thêm đơn thuốc thành công!');
        setPrescError('');
        setPrescription({ ...prescription, Medication: '', Dosage: '', Frequency: '', Note: '' });
      })
      .catch(() => {
        setPrescError('Thêm đơn thuốc thất bại!');
        setPrescSuccess('');
      });
  };

  if (loading) return (
    <div className="tpd-loading">
      <div className="loading-spinner"></div>
      <p>Đang tải hồ sơ điều trị...</p>
    </div>
  );
  
  if (error) return (
    <div className="tpd-error">
      <i className="fas fa-exclamation-triangle"></i>
      <p>{error}</p>
    </div>
  );
  
  if (!plan) return (
    <div className="tpd-error">
      <i className="fas fa-file-medical"></i>
      <p>Không tìm thấy hồ sơ điều trị.</p>
    </div>
  );

  console.log('plan:', plan);

  return (
    <div className="tpd-page">
      {/* Header Section */}
      <div className="tpd-header-section">
        <div className="tpd-header-content">
          <button className="tpd-back-btn" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
            <span>Quay lại</span>
          </button>
          <div className="tpd-header-title">
            <i className="fas fa-notes-medical"></i>
            <h1>Hồ Sơ Điều Trị</h1>
          </div>
        </div>
      </div>

      <div className="tpd-container">
        {/* Patient Information Section */}
        {patientInfo && (
          <div className="tpd-patient-section">
            <div className="tpd-section-header">
              <i className="fas fa-user-injured"></i>
              <h3>Thông tin bệnh nhân</h3>
            </div>
            <div className="tpd-patient-grid">
              <div className="tpd-patient-card">
                <div className="tpd-patient-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="tpd-patient-info">
                  <h4>{patientInfo.PatientFullname || patientInfo.Patient?.Fullname}</h4>
                  <p className="tpd-patient-id">Mã BN: {patientInfo.Patient?.PatientID}</p>
                </div>
              </div>
              <div className="tpd-patient-details">
                <div className="tpd-detail-row">
                  <div className="tpd-detail-item">
                    <span className="tpd-label">Giới tính:</span>
                    <span className="tpd-value">{patientInfo.Patient?.Gender}</span>
                  </div>
                  <div className="tpd-detail-item">
                    <span className="tpd-label">Ngày sinh:</span>
                    <span className="tpd-value">
                      {patientInfo.Patient?.DateOfBirth?.split('T')[0] || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="tpd-detail-row">
                  <div className="tpd-detail-item">
                    <span className="tpd-label">Nhóm máu:</span>
                    <span className="tpd-value blood-type">{patientInfo.Patient?.BloodType}</span>
                  </div>
                  <div className="tpd-detail-item">
                    <span className="tpd-label">Dị ứng:</span>
                    <span className="tpd-value allergy">
                      {patientInfo.Patient?.Allergy || 'Không có'}
                    </span>
                  </div>
                </div>
                <div className="tpd-detail-row">
                  <div className="tpd-detail-item">
                    <span className="tpd-label">Số điện thoại:</span>
                    <span className="tpd-value">{patientInfo.Patient?.Phone}</span>
                  </div>
                  <div className="tpd-detail-item">
                    <span className="tpd-label">Email:</span>
                    <span className="tpd-value">{patientInfo.Patient?.User?.Email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Plan Information */}
        <div className="tpd-treatment-section">
          <div className="tpd-section-header">
            <i className="fas fa-clipboard-list"></i>
            <h3>Thông tin hồ sơ điều trị</h3>
          </div>
          <div className="tpd-treatment-grid">
            <div className="tpd-treatment-card">
              <div className="tpd-treatment-item">
                <span className="tpd-label">Mã hồ sơ:</span>
                <span className="tpd-value plan-id">{plan.TreatmentPlanID}</span>
              </div>
              <div className="tpd-treatment-item">
                <span className="tpd-label">Bác sĩ điều trị:</span>
                <span className="tpd-value doctor-name">{currentUser?.name}</span>
              </div>
              <div className="tpd-treatment-item">
                <span className="tpd-label">Phác đồ ARV:</span>
                <span className="tpd-value arv-protocol">{plan.ARVProtocol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis and Treatment Result Section */}
        <div className="tpd-edit-section">
          <div className="tpd-section-header">
            <i className="fas fa-edit"></i>
            <h3>Cập nhật thông tin điều trị</h3>
          </div>
          
          <div className="tpd-edit-form">
            <div className="tpd-form-group">
              <label className="tpd-form-label">
                <i className="fas fa-stethoscope"></i>
                <span>Chẩn đoán</span>
              </label>
              <div className="tpd-input-group">
                {editDiagnosis ? (
                  <>
                    <textarea
                      className="tpd-textarea"
                      value={diagnosisValue}
                      onChange={e => setDiagnosisValue(e.target.value)}
                      placeholder="Nhập chẩn đoán..."
                      autoFocus
                    />
                    <div className="tpd-input-actions">
                      <button 
                        className="tpd-save-btn" 
                        onClick={() => { 
                          setEditDiagnosis(false); 
                          setPendingDiagnosis(diagnosisValue); 
                        }}
                      >
                        <i className="fas fa-check"></i>
                        <span>Lưu</span>
                      </button>
                      <button 
                        className="tpd-cancel-btn" 
                        onClick={() => { 
                          setEditDiagnosis(false); 
                          setDiagnosisValue(pendingDiagnosis); 
                        }}
                      >
                        <i className="fas fa-times"></i>
                        <span>Hủy</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tpd-display-value">
                      {pendingDiagnosis || 'Chưa có chẩn đoán'}
                    </div>
                    <button 
                      className="tpd-edit-btn" 
                      onClick={() => setEditDiagnosis(true)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                      <span>Chỉnh sửa</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="tpd-form-group">
              <label className="tpd-form-label">
                <i className="fas fa-clipboard-check"></i>
                <span>Kết quả điều trị</span>
              </label>
              <div className="tpd-input-group">
                {editResult ? (
                  <>
                    <textarea
                      className="tpd-textarea"
                      value={resultValue}
                      onChange={e => setResultValue(e.target.value)}
                      placeholder="Nhập kết quả điều trị..."
                      autoFocus
                    />
                    <div className="tpd-input-actions">
                      <button 
                        className="tpd-save-btn" 
                        onClick={() => { 
                          setEditResult(false); 
                          setPendingResult(resultValue); 
                        }}
                      >
                        <i className="fas fa-check"></i>
                        <span>Lưu</span>
                      </button>
                      <button 
                        className="tpd-cancel-btn" 
                        onClick={() => { 
                          setEditResult(false); 
                          setResultValue(pendingResult); 
                        }}
                      >
                        <i className="fas fa-times"></i>
                        <span>Hủy</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tpd-display-value">
                      {pendingResult || 'Chưa có kết quả'}
                    </div>
                    <button 
                      className="tpd-edit-btn" 
                      onClick={() => setEditResult(true)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                      <span>Chỉnh sửa</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="tpd-form-actions">
              <button 
                className="tpd-update-all-btn" 
                onClick={async () => {
                  if (!plan) return;
                  const payload = {
                    ...plan,
                    Diagnosis: pendingDiagnosis,
                    TreatmentResult: pendingResult
                  };
                  try {
                    await UpdateTreatmentPlan(payload);
                    setPlan(prev => ({ ...prev, Diagnosis: pendingDiagnosis, TreatmentResult: pendingResult }));
                    alert('Cập nhật thành công!');
                  } catch (e) {
                    alert('Cập nhật thất bại!');
                  }
                }}
              >
                <i className="fas fa-save"></i>
                <span>Cập nhật thông tin</span>
              </button>
            </div>
          </div>
        </div>

        {/* ARV Protocol Section */}
        <div className="tpd-arv-section">
          <div className="tpd-section-header">
            <i className="fas fa-pills"></i>
            <h3>Phác đồ ARV</h3>
          </div>
          
          <div className="tpd-arv-content">
            <div className="tpd-arv-selector">
              <div className="tpd-select-group">
                <label className="tpd-select-label">
                  <i className="fas fa-list"></i>
                  <span>Chọn phác đồ ARV</span>
                </label>
                <select 
                  value={selectedARV} 
                  onChange={handleARVChange} 
                  className="tpd-select"
                >
                  <option value="">-- Chọn phác đồ ARV --</option>
                  {arvProtocols.map((arv) => (
                    <option key={arv.ARVID} value={arv.ARVID}>
                      {arv.ARVName} ({arv.ARVCode})
                    </option>
                  ))}
                </select>
              </div>
              <button className="tpd-update-arv-btn" onClick={handleARVUpdate}>
                <i className="fas fa-sync-alt"></i>
                <span>Cập nhật phác đồ</span>
              </button>
            </div>

            {arvEditSuccess && (
              <div className="tpd-message success">
                <i className="fas fa-check-circle"></i>
                <span>{arvEditSuccess}</span>
              </div>
            )}
            {arvEditError && (
              <div className="tpd-message error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{arvEditError}</span>
              </div>
            )}

            {selectedARVObj && (
              <div className="tpd-arv-details">
                <div className="tpd-arv-header">
                  <i className="fas fa-info-circle"></i>
                  <h4>Chi tiết phác đồ</h4>
                </div>
                <div className="tpd-arv-grid">
                  <div className="tpd-arv-item">
                    <span className="tpd-label">Mã phác đồ:</span>
                    <span className="tpd-value">{selectedARVObj.ARVID}</span>
                  </div>
                  <div className="tpd-arv-item">
                    <span className="tpd-label">Tên phác đồ:</span>
                    <span className="tpd-value">{selectedARVObj.ARVName}</span>
                  </div>
                  <div className="tpd-arv-item">
                    <span className="tpd-label">Mã code:</span>
                    <span className="tpd-value">{selectedARVObj.ARVCode}</span>
                  </div>
                  <div className="tpd-arv-item">
                    <span className="tpd-label">Độ tuổi:</span>
                    <span className="tpd-value">{selectedARVObj.AgeRange}</span>
                  </div>
                  <div className="tpd-arv-item">
                    <span className="tpd-label">Nhóm:</span>
                    <span className="tpd-value">{selectedARVObj.ForGroup}</span>
                  </div>
                  <div className="tpd-arv-item full-width">
                    <span className="tpd-label">Mô tả:</span>
                    <span className="tpd-value">{selectedARVObj.Description}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prescription Section */}
        <div className="tpd-prescription-section">
          <div className="tpd-section-header">
            <i className="fas fa-prescription-bottle-medical"></i>
            <h3>Đơn thuốc</h3>
          </div>
          
          <div className="tpd-prescription-content">
            <button
              className="tpd-add-prescription-btn"
              onClick={() => {
                const navigationState = {
                  fromDoctor: location.state?.fromDoctor || false,
                  patientInfo: patientInfo,
                  treatmentPlan: plan,
                  BookID: location.state?.BookID
                };
                
                if (location.state && location.state.fromDoctor && location.state.BookID) {
                  navigate(`/prescription/${plan.TreatmentPlanID}`, { state: navigationState });
                } else if (location.state && location.state.fromDoctor) {
                  navigate(`/prescription/${plan.TreatmentPlanID}`, { state: navigationState });
                } else {
                  navigate(`/prescription/${plan.TreatmentPlanID}`, { state: navigationState });
                }
              }}
            >
              <i className="fas fa-plus-circle"></i>
              <span>Thêm đơn thuốc mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanDetail; 
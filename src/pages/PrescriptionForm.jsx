import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { addPrescription } from '../api/auth';
import { doctorcheckout } from '../api/auth';
import '../styles/PrescriptionForm.css';
import { getAllMedications } from '../api/auth';
import { getTreatmentPlanById } from '../api/auth';

const PrescriptionForm = () => {
  const { treatmentPlanId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [prescription, setPrescription] = useState({
    MedicalRecordID: treatmentPlanId,
    MedicationId: '',
    DoctorID: '',
    StartDate: '',
    EndDate: '',
    Dosage: '',
    LineOfTreatment: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [medications, setMedications] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  
  // Lấy thông tin bệnh nhân từ state navigation
  const patientInfo = location.state?.patientInfo;
  const treatmentPlanFromState = location.state?.treatmentPlan;

  useEffect(() => {
    getAllMedications()
      .then(res => {
        setMedications(res?.data || res);
      })
      .catch(() => setMedications([]));
  }, []);

  useEffect(() => {
    getTreatmentPlanById(treatmentPlanId)
      .then(res => {
        const plan = res?.data || res;
        setTreatmentPlan(plan);
        if (plan?.DoctorID) {
          setPrescription(prev => ({ ...prev, DoctorID: plan.DoctorID }));
        }
      })
      .catch(() => setTreatmentPlan(null));
  }, [treatmentPlanId]);

  const handleChange = (e) => {
    setPrescription({ ...prescription, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPrescription(prescription)
      .then(async () => {
        setSuccess('Thêm đơn thuốc thành công!');
        setError('');
        setPrescription({ ...prescription, MedicationId: '', DoctorID: '', StartDate: '', EndDate: '', Dosage: '', LineOfTreatment: '' });
        // Nếu đến từ trang bác sĩ thì gọi doctorcheckout và quay về tab lịch hẹn
        if (location.state && location.state.fromDoctor) {
          try {
            await doctorcheckout(treatmentPlanId); // Gọi API cập nhật trạng thái
          } catch (err) {
            // Có thể log lỗi nếu cần
          }
          setTimeout(() => {
            navigate('/doctor', { state: { tab: 'appointments' } });
          }, 800); // Cho phép hiển thị thông báo thành công ngắn
        }
      })
      .catch(() => {
        setError('Thêm đơn thuốc thất bại!');
        setSuccess('');
      });
  };

  return (
    <div className="prescription-page">
      <div className="prescription-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
            <span>Quay lại</span>
          </button>
          <div className="header-title">
            <i className="fas fa-prescription-bottle-medical"></i>
            <h1>Đơn Thuốc</h1>
          </div>
        </div>
      </div>

      <div className="prescription-container">
        {/* Thông tin bệnh nhân */}
        {(patientInfo || treatmentPlan) && (
          <div className="patient-info-section">
            <div className="section-header">
              <i className="fas fa-user-injured"></i>
              <h3>Thông tin bệnh nhân</h3>
            </div>
            <div className="patient-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Mã bệnh nhân:</span>
                  <span className="value">
                    {patientInfo?.Patient?.PatientID || treatmentPlan?.Patient?.PatientID || 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Họ tên:</span>
                  <span className="value">
                    {patientInfo?.PatientFullname || 
                     patientInfo?.Patient?.Fullname || 
                     treatmentPlan?.Patient?.User?.Fullname || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Ngày sinh:</span>
                  <span className="value">
                    {patientInfo?.Patient?.DateOfBirth ? 
                      new Date(patientInfo.Patient.DateOfBirth).toLocaleDateString('vi-VN') :
                      treatmentPlan?.Patient?.DateOfBirth ? 
                      new Date(treatmentPlan.Patient.DateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Giới tính:</span>
                  <span className="value">
                    {patientInfo?.Patient?.Gender || treatmentPlan?.Patient?.Gender || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Nhóm máu:</span>
                  <span className="value">
                    {patientInfo?.Patient?.BloodType || 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Dị ứng:</span>
                  <span className="value">
                    {patientInfo?.Patient?.Allergy || 'Không có'}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">
                    {patientInfo?.Patient?.Phone || 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">
                    {patientInfo?.Patient?.User?.Email || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Chẩn đoán:</span>
                  <span className="value diagnosis">
                    {treatmentPlanFromState?.Diagnosis || treatmentPlan?.Diagnosis || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form đơn thuốc */}
        <div className="prescription-form-section">
          <div className="section-header">
            <i className="fas fa-pills"></i>
            <h3>Thông tin đơn thuốc</h3>
          </div>
          
          <form className="prescription-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="MedicationId">
                  <i className="fas fa-medication"></i>
                  <span>Loại thuốc</span>
                </label>
                <select
                  id="MedicationId"
                  name="MedicationId"
                  value={prescription.MedicationId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn loại thuốc --</option>
                  {medications.map(med => (
                    <option key={med.MedicationId} value={med.MedicationId}>
                      {med.MedicationName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="Dosage">
                  <i className="fas fa-weight"></i>
                  <span>Liều lượng</span>
                </label>
                <input 
                  id="Dosage" 
                  name="Dosage" 
                  value={prescription.Dosage} 
                  onChange={handleChange} 
                  placeholder="Ví dụ: 1 viên x 2 lần/ngày" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="StartDate">
                  <i className="fas fa-calendar-plus"></i>
                  <span>Ngày bắt đầu</span>
                </label>
                <input 
                  type="date" 
                  id="StartDate" 
                  name="StartDate" 
                  value={prescription.StartDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="EndDate">
                  <i className="fas fa-calendar-minus"></i>
                  <span>Ngày kết thúc</span>
                </label>
                <input 
                  type="date" 
                  id="EndDate" 
                  name="EndDate" 
                  value={prescription.EndDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="LineOfTreatment">
                  <i className="fas fa-stethoscope"></i>
                  <span>Số lần điều trị</span>
                </label>
                <input 
                  id="LineOfTreatment" 
                  name="LineOfTreatment" 
                  value={prescription.LineOfTreatment} 
                  onChange={handleChange} 
                  placeholder="Ví dụ: Lần 1, Lần 2..." 
                  required 
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                <i className="fas fa-times"></i>
                <span>Hủy bỏ</span>
              </button>
              <button type="submit" className="submit-btn">
                <i className="fas fa-save"></i>
                <span>Lưu đơn thuốc</span>
              </button>
            </div>
          </form>
        </div>

        {/* Thông báo */}
        {success && (
          <div className="success-msg">
            <i className="fas fa-check-circle"></i>
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="error-msg">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionForm; 
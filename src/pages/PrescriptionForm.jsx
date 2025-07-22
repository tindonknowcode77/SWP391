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
    <div className="prescription-container">
      <button className="back-btn" onClick={() => navigate(-1)}>Quay lại</button>
      <h2>Thêm đơn thuốc</h2>
      <form className="prescription-form" onSubmit={handleSubmit}>
        <label htmlFor="MedicationId"><strong>Chọn loại thuốc</strong></label>
        <select
          id="MedicationId"
          name="MedicationId"
          value={prescription.MedicationId}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn thuốc --</option>
          {medications.map(med => (
            <option key={med.MedicationId} value={med.MedicationId}>
              {med.MedicationName}
            </option>
          ))}
        </select>
        <label htmlFor="StartDate"><strong>Ngày bắt đầu</strong></label>
        <input type="date" id="StartDate" name="StartDate" value={prescription.StartDate} onChange={handleChange} required />
        <label htmlFor="EndDate"><strong>Ngày kết thúc</strong></label>
        <input type="date" id="EndDate" name="EndDate" value={prescription.EndDate} onChange={handleChange} required />
        <label htmlFor="Dosage"><strong>Liều lượng thuốc</strong></label>
        <input id="Dosage" name="Dosage" value={prescription.Dosage} onChange={handleChange} placeholder="Liều lượng" required />
        <label htmlFor="LineOfTreatment"><strong>Số lần khám</strong></label>
        <input id="LineOfTreatment" name="LineOfTreatment" value={prescription.LineOfTreatment} onChange={handleChange} placeholder="Số lần điều trị" required />
        <button type="submit">Thêm đơn thuốc</button>
      </form>
      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

export default PrescriptionForm; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addPrescription } from '../api/auth';
import '../styles/PrescriptionForm.css';
import { getAllMedications } from '../api/auth';
import { getTreatmentPlanById } from '../api/auth';

const PrescriptionForm = () => {
  const { treatmentPlanId } = useParams();
  const navigate = useNavigate();
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
      .then(() => {
        setSuccess('Thêm đơn thuốc thành công!');
        setError('');
        setPrescription({ ...prescription, MedicationID: '', DoctorID: '', StartDate: '', EndDate: '', Dosage: '', LineOfTreatment: '' });
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
        <select
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
        <input type="date" name="StartDate" value={prescription.StartDate} onChange={handleChange} required />
        <input type="date" name="EndDate" value={prescription.EndDate} onChange={handleChange} required />
        <input name="Dosage" value={prescription.Dosage} onChange={handleChange} placeholder="Liều lượng" required />
        <input name="LineOfTreatment" value={prescription.LineOfTreatment} onChange={handleChange} placeholder="Phác đồ điều trị" required />
        <button type="submit">Thêm đơn thuốc</button>
      </form>
      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

export default PrescriptionForm; 
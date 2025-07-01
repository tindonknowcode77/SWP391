import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addPrescription } from '../api/auth';
import '../styles/PrescriptionForm.css';

const PrescriptionForm = () => {
  const { treatmentPlanId } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState({
    MedicalRecordID: treatmentPlanId,
    MedicationID: '',
    DoctorID: '',
    StartDate: '',
    EndDate: '',
    Dosage: '',
    LineOfTreatment: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
        <input name="MedicationID" value={prescription.MedicationID} onChange={handleChange} placeholder="Mã thuốc" required />
        <input name="DoctorID" value={prescription.DoctorID} onChange={handleChange} placeholder="Mã bác sĩ" required />
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
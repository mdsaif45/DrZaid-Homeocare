import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';
import { CreatePatientData } from '../../services/patientService';

export default function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentPatient, isLoading, error, createPatient, updatePatient, fetchPatientById, clearCurrentPatient, clearError } = usePatientStore();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<CreatePatientData>({
    full_name: '', age: undefined, gender: '', contact_phone: '',
    contact_email: '', occupation: '', address: '', lifestyle_habits: '',
    emergency_contact: '', emergency_phone: '',
  });

  useEffect(() => {
    if (isEditMode && id) fetchPatientById(parseInt(id));
    return () => clearCurrentPatient();
  }, [id, isEditMode]);

  useEffect(() => {
    if (currentPatient && isEditMode) {
      setFormData({
        full_name: currentPatient.full_name,
        age: currentPatient.age,
        gender: currentPatient.gender || '',
        contact_phone: currentPatient.contact_phone,
        contact_email: currentPatient.contact_email || '',
        occupation: currentPatient.occupation || '',
        address: currentPatient.address || '',
        lifestyle_habits: currentPatient.lifestyle_habits || '',
        emergency_contact: currentPatient.emergency_contact || '',
        emergency_phone: currentPatient.emergency_phone || '',
      });
    }
  }, [currentPatient, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? (value ? parseInt(value) : undefined) : value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) await updatePatient(parseInt(id), formData);
      else await createPatient(formData);
      navigate('/dashboard/patients');
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => navigate('/dashboard/patients')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 transition mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Patients
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {isEditMode ? 'Edit Patient' : 'Register New Patient'}
        </h1>
        {isEditMode && currentPatient && (
          <p className="text-sm text-slate-400 mt-1 font-medium">Case ID: {currentPatient.case_id}</p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Information */}
        <FormSection title="Basic Information" icon="👤">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Full Name" required>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required
                  placeholder="Patient's full name" className={inputCls} />
              </Field>
            </div>
            <Field label="Age (years)">
              <input type="number" name="age" value={formData.age || ''} onChange={handleChange} min="0" max="150"
                placeholder="e.g. 35" className={inputCls} />
            </Field>
            <Field label="Gender">
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputCls}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
        </FormSection>

        {/* Contact Information */}
        <FormSection title="Contact Information" icon="📞">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Phone Number" required>
              <input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required
                placeholder="+91 XXXXX XXXXX" className={inputCls} />
            </Field>
            <Field label="Email Address">
              <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange}
                placeholder="patient@example.com" className={inputCls} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Address">
                <textarea name="address" value={formData.address} onChange={handleChange} rows={2}
                  placeholder="Full residential address" className={inputCls + ' resize-none'} />
              </Field>
            </div>
          </div>
        </FormSection>

        {/* Additional Information */}
        <FormSection title="Clinical & Lifestyle" icon="🧬">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Occupation">
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange}
                placeholder="e.g. Teacher, Engineer, Student" className={inputCls} />
            </Field>
            <Field label="Lifestyle Habits">
              <textarea name="lifestyle_habits" value={formData.lifestyle_habits} onChange={handleChange} rows={3}
                placeholder="Diet, exercise routines, addictions, sleep patterns, stress levels, etc."
                className={inputCls + ' resize-none'} />
            </Field>
          </div>
        </FormSection>

        {/* Emergency Contact */}
        <FormSection title="Emergency Contact" icon="🚨">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Contact Person">
              <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange}
                placeholder="Full name" className={inputCls} />
            </Field>
            <Field label="Emergency Phone">
              <input type="tel" name="emergency_phone" value={formData.emergency_phone} onChange={handleChange}
                placeholder="+91 XXXXX XXXXX" className={inputCls} />
            </Field>
          </div>
        </FormSection>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/dashboard/patients')}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition shadow-md shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
            {isLoading ? 'Saving...' : isEditMode ? 'Update Patient' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition';

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-extrabold text-slate-800">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

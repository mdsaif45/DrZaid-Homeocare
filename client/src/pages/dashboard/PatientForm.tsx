import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';
import { CreatePatientData } from '../../services/patientService';
import { User, Phone, Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { PageHeader, Button, Input, Select, Textarea, Card, Alert } from '../../components/ui';

export default function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentPatient, isLoading, error, createPatient, updatePatient, fetchPatientById, clearCurrentPatient, clearError } = usePatientStore();

  const isEditMode = Boolean(id);
  const [loadedPatientId, setLoadedPatientId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreatePatientData>({
    full_name: '',
    age: undefined,
    gender: '',
    contact_phone: '',
    contact_email: '',
    occupation: '',
    address: '',
    lifestyle_habits: '',
    emergency_contact: '',
    emergency_phone: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchPatientById(parseInt(id));
    }
    return () => clearCurrentPatient();
  }, [id, isEditMode, fetchPatientById, clearCurrentPatient]);

  if (currentPatient && isEditMode && loadedPatientId !== currentPatient.id) {
    setLoadedPatientId(currentPatient.id);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'age' ? (value ? parseInt(value) : undefined) : value }));
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
      <PageHeader
        title={isEditMode ? 'Edit Patient' : 'Register New Patient'}
        subtitle={isEditMode && currentPatient ? `Case ID: ${currentPatient.case_id}` : 'Fill in patient registration details'}
        backButton={
          <button
            onClick={() => navigate('/dashboard/patients')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        }
      />

      {error && (
        <Alert variant="danger" onDismiss={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Information */}
        <FormSection title="Basic Information" icon={<User className="w-4 h-4 text-primary" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Patient's full name"
              />
            </div>
            <Input
              label="Age (years)"
              type="number"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
              min="0"
              max="150"
              placeholder="e.g. 35"
            />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>
        </FormSection>

        {/* Contact Information */}
        <FormSection title="Contact Information" icon={<Phone className="w-4 h-4 text-primary" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              required
              placeholder="+91 XXXXX XXXXX"
            />
            <Input
              label="Email Address"
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="patient@example.com"
            />
            <div className="md:col-span-2">
              <Textarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="Full residential address"
              />
            </div>
          </div>
        </FormSection>

        {/* Additional Information */}
        <FormSection title="Clinical & Lifestyle" icon={<Shield className="w-4 h-4 text-primary" />}>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="e.g. Teacher, Engineer, Student"
            />
            <Textarea
              label="Lifestyle Habits"
              name="lifestyle_habits"
              value={formData.lifestyle_habits}
              onChange={handleChange}
              rows={3}
              placeholder="Diet, exercise routines, addictions, sleep patterns, stress levels, etc."
            />
          </div>
        </FormSection>

        {/* Emergency Contact */}
        <FormSection title="Emergency Contact" icon={<AlertTriangle className="w-4 h-4 text-warning" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Person"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              placeholder="Full name"
            />
            <Input
              label="Emergency Phone"
              type="tel"
              name="emergency_phone"
              value={formData.emergency_phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </FormSection>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/patients')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEditMode ? 'Update Patient' : 'Create Patient'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card padding="none">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-surface-sunken">
        {icon}
        <h2 className="text-sm font-extrabold text-text">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}

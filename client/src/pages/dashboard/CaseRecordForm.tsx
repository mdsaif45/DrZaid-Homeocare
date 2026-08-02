import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useCaseRecordStore } from '../../store/caseRecordStore';
import { usePatientStore } from '../../store/patientStore';
import { CreateCaseRecordData, CreateVitalsData } from '../../services/caseRecordService';
import { Button, PageHeader, Alert } from '../../components/ui';
import { ChiefComplaintsSection } from '../../components/forms/ChiefComplaintsSection';
import { PatientVitalsSection } from '../../components/forms/PatientVitalsSection';
import { ClinicalAnalysisSection } from '../../components/forms/ClinicalAnalysisSection';
import { ArrowLeft, Save } from 'lucide-react';

export default function CaseRecordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const patientIdFromQuery = searchParams.get('patientId');

  const { currentCaseRecord, fetchCaseRecordById, createCaseRecord, updateCaseRecord } = useCaseRecordStore();
  const { currentPatient, fetchPatientById } = usePatientStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [loadedRecordId, setLoadedRecordId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateCaseRecordData & CreateVitalsData>({
    patient_id: parseInt(patientIdFromQuery || '0'),
    consultation_date: new Date().toISOString().split('T')[0],
    chief_complaints: '',
    complaint_tags: [],
    complaint_duration: '',
    past_history: '',
    family_history: '',
    surgical_history: '',
    general_examination: '',
    mental_state_examination: '',
    clinical_notes: '',
    diagnosis: '',
    treatment_plan: '',
    follow_up_notes: '',
    next_follow_up_date: '',
    blood_pressure_systolic: undefined,
    blood_pressure_diastolic: undefined,
    pulse_rate: undefined,
    respiratory_rate: undefined,
    temperature: undefined,
    temperature_unit: 'C',
    oxygen_saturation: undefined,
    height: undefined,
    weight: undefined,
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (patientIdFromQuery) {
      fetchPatientById(parseInt(patientIdFromQuery));
    }
    if (id) {
      fetchCaseRecordById(parseInt(id));
    }
  }, [id, patientIdFromQuery, fetchPatientById, fetchCaseRecordById]);

  if (currentCaseRecord && isEditMode && loadedRecordId !== currentCaseRecord.id) {
    setLoadedRecordId(currentCaseRecord.id);
    setFormData({
      patient_id: currentCaseRecord.patient_id,
      consultation_date: currentCaseRecord.consultation_date.split('T')[0],
      chief_complaints: currentCaseRecord.chief_complaints || '',
      complaint_tags: currentCaseRecord.complaint_tags || [],
      complaint_duration: currentCaseRecord.complaint_duration || '',
      past_history: currentCaseRecord.past_history || '',
      family_history: currentCaseRecord.family_history || '',
      surgical_history: currentCaseRecord.surgical_history || '',
      general_examination: currentCaseRecord.general_examination || '',
      mental_state_examination: currentCaseRecord.mental_state_examination || '',
      clinical_notes: currentCaseRecord.clinical_notes || '',
      diagnosis: currentCaseRecord.diagnosis || '',
      treatment_plan: currentCaseRecord.treatment_plan || '',
      follow_up_notes: currentCaseRecord.follow_up_notes || '',
      next_follow_up_date: currentCaseRecord.next_follow_up_date?.split('T')[0] || '',
      blood_pressure_systolic: currentCaseRecord.vitals?.blood_pressure_systolic,
      blood_pressure_diastolic: currentCaseRecord.vitals?.blood_pressure_diastolic,
      pulse_rate: currentCaseRecord.vitals?.pulse_rate,
      respiratory_rate: currentCaseRecord.vitals?.respiratory_rate,
      temperature: currentCaseRecord.vitals?.temperature,
      temperature_unit: currentCaseRecord.vitals?.temperature_unit || 'C',
      oxygen_saturation: currentCaseRecord.vitals?.oxygen_saturation,
      height: currentCaseRecord.vitals?.height,
      weight: currentCaseRecord.vitals?.weight,
    });
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : Number(value),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.complaint_tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        complaint_tags: [...(prev.complaint_tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      complaint_tags: prev.complaint_tags?.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateCaseRecord(parseInt(id!), formData);
      } else {
        await createCaseRecord(formData);
      }
      navigate(`/dashboard/patients/${formData.patient_id}`);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseError = err as { response?: { data?: { message?: string } } };
        setError(responseError.response?.data?.message || 'Failed to save case record');
      } else {
        setError('Failed to save case record');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      <PageHeader
        title={isEditMode ? 'Edit Case Record' : 'New EMR Case Record'}
        subtitle={currentPatient ? `Patient: ${currentPatient.full_name} (${currentPatient.case_id})` : 'Record patient consultation and symptoms'}
        backButton={
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-primary transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        }
      />

      {error && (
        <Alert variant="danger" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ChiefComplaintsSection
          formData={formData}
          handleChange={handleChange}
          tagInput={tagInput}
          setTagInput={setTagInput}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
        />

        <PatientVitalsSection
          formData={formData}
          handleNumberChange={handleNumberChange}
        />

        <ClinicalAnalysisSection
          formData={formData}
          handleChange={handleChange}
        />

        <div className="flex items-center justify-end space-x-4 border-t border-border pt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Update Case Record' : 'Save Case Record'}
          </Button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useCaseRecordStore } from '../../store/caseRecordStore';
import { usePatientStore } from '../../store/patientStore';
import { CreateCaseRecordData, CreateVitalsData } from '../../services/caseRecordService';

export default function CaseRecordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const patientIdFromQuery = searchParams.get('patientId');

  const { currentCaseRecord, fetchCaseRecordById, createCaseRecord, updateCaseRecord, createVitals } =
    useCaseRecordStore();
  const { currentPatient, fetchPatientById } = usePatientStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Form state
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
    // Vitals
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

  // Fetch patient and case record data
  useEffect(() => {
    if (patientIdFromQuery) {
      fetchPatientById(parseInt(patientIdFromQuery));
    }
    if (id) {
      fetchCaseRecordById(parseInt(id)).then(() => {
        if (currentCaseRecord) {
          // Populate form with existing data
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
            // Vitals
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
      });
    }
  }, [id, patientIdFromQuery]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
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
      complaint_tags: prev.complaint_tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Separate case record data and vitals data
      const caseRecordData: CreateCaseRecordData = {
        patient_id: formData.patient_id,
        consultation_date: formData.consultation_date,
        chief_complaints: formData.chief_complaints,
        complaint_tags: formData.complaint_tags,
        complaint_duration: formData.complaint_duration,
        past_history: formData.past_history,
        family_history: formData.family_history,
        surgical_history: formData.surgical_history,
        general_examination: formData.general_examination,
        mental_state_examination: formData.mental_state_examination,
        clinical_notes: formData.clinical_notes,
        diagnosis: formData.diagnosis,
        treatment_plan: formData.treatment_plan,
        follow_up_notes: formData.follow_up_notes,
        next_follow_up_date: formData.next_follow_up_date,
      };

      const vitalsData: CreateVitalsData = {
        blood_pressure_systolic: formData.blood_pressure_systolic,
        blood_pressure_diastolic: formData.blood_pressure_diastolic,
        pulse_rate: formData.pulse_rate,
        respiratory_rate: formData.respiratory_rate,
        temperature: formData.temperature,
        temperature_unit: formData.temperature_unit,
        oxygen_saturation: formData.oxygen_saturation,
        height: formData.height,
        weight: formData.weight,
      };

      let caseRecord;
      if (isEditMode) {
        caseRecord = await updateCaseRecord(parseInt(id!), caseRecordData);
      } else {
        caseRecord = await createCaseRecord(caseRecordData);
      }

      // Create or update vitals if any vitals data is provided
      const hasVitalsData = Object.values(vitalsData).some((value) => value !== undefined);
      if (hasVitalsData && caseRecord) {
        await createVitals(caseRecord.id, vitalsData);
      }

      navigate(`/dashboard/patients/${formData.patient_id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save case record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-teal-600 hover:text-teal-700 mb-4 flex items-center"
        >
          <span className="material-icons text-sm mr-1">arrow_back</span>
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Consultation' : 'New Consultation'}
        </h1>
        {currentPatient && (
          <p className="text-gray-600 mt-1">
            Patient: {currentPatient.full_name} ({currentPatient.case_id})
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="consultation_date"
                value={formData.consultation_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Chief Complaints */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chief Complaints</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complaints</label>
              <textarea
                name="chief_complaints"
                value={formData.chief_complaints}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Describe the main complaints..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="complaint_duration"
                value={formData.complaint_duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., 3 days, 2 weeks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Add tags (e.g., fever, headache)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.complaint_tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-teal-900"
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">History</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Past History</label>
              <textarea
                name="past_history"
                value={formData.past_history}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Previous medical conditions, treatments..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Family History</label>
              <textarea
                name="family_history"
                value={formData.family_history}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Family medical history..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surgical History</label>
              <textarea
                name="surgical_history"
                value={formData.surgical_history}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Previous surgeries..."
              />
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vital Signs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BP Systolic</label>
              <input
                type="number"
                name="blood_pressure_systolic"
                value={formData.blood_pressure_systolic || ''}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="mmHg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BP Diastolic</label>
              <input
                type="number"
                name="blood_pressure_diastolic"
                value={formData.blood_pressure_diastolic || ''}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="mmHg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pulse Rate</label>
              <input
                type="number"
                name="pulse_rate"
                value={formData.pulse_rate || ''}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="bpm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
              <input
                type="number"
                name="respiratory_rate"
                value={formData.respiratory_rate || ''}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="breaths/min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature || ''}
                  onChange={handleNumberChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Temp"
                />
                <select
                  name="temperature_unit"
                  value={formData.temperature_unit}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="C">°C</option>
                  <option value="F">°F</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SpO2</label>
              <input
                type="number"
                name="oxygen_saturation"
                value={formData.oxygen_saturation || ''}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                name="height"
                value={formData.height || ''}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight || ''}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="kg"
              />
            </div>
          </div>
        </div>

        {/* Examination */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Examination</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General Examination</label>
              <textarea
                name="general_examination"
                value={formData.general_examination}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Physical examination findings..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mental State Examination</label>
              <textarea
                name="mental_state_examination"
                value={formData.mental_state_examination}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Mental state observations..."
              />
            </div>
          </div>
        </div>

        {/* Analysis & Diagnosis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis & Diagnosis</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
              <textarea
                name="clinical_notes"
                value={formData.clinical_notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Clinical observations and notes..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Diagnosis..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
              <textarea
                name="treatment_plan"
                value={formData.treatment_plan}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Treatment plan and recommendations..."
              />
            </div>
          </div>
        </div>

        {/* Follow-up */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Follow-up</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Notes</label>
              <textarea
                name="follow_up_notes"
                value={formData.follow_up_notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Follow-up instructions..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
              <input
                type="date"
                name="next_follow_up_date"
                value={formData.next_follow_up_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Consultation' : 'Create Consultation'}
          </button>
        </div>
      </form>
    </div>
  );
}

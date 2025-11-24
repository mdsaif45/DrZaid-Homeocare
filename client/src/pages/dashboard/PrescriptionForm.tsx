import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { usePrescriptionStore } from '../../store/prescriptionStore';
import { usePatientStore } from '../../store/patientStore';
import { CreatePrescriptionData } from '../../services/prescriptionService';

export default function PrescriptionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const patientIdFromQuery = searchParams.get('patientId');
  const caseRecordIdFromQuery = searchParams.get('caseRecordId');

  const { currentPrescription, fetchPrescriptionById, createPrescription, updatePrescription } =
    usePrescriptionStore();
  const { currentPatient, fetchPatientById } = usePatientStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreatePrescriptionData>({
    patient_id: parseInt(patientIdFromQuery || '0'),
    case_record_id: caseRecordIdFromQuery ? parseInt(caseRecordIdFromQuery) : undefined,
    remedy_name: '',
    potency: '',
    dosage: '',
    repetition: '',
    instructions: '',
    prescription_date: new Date().toISOString().split('T')[0],
    follow_up_date: '',
  });

  const isEditMode = !!id;

  // Fetch patient and prescription data
  useEffect(() => {
    if (patientIdFromQuery) {
      fetchPatientById(parseInt(patientIdFromQuery));
    }
    if (id) {
      fetchPrescriptionById(parseInt(id)).then(() => {
        if (currentPrescription) {
          // Populate form with existing data
          setFormData({
            patient_id: currentPrescription.patient_id,
            case_record_id: currentPrescription.case_record_id,
            remedy_name: currentPrescription.remedy_name,
            potency: currentPrescription.potency || '',
            dosage: currentPrescription.dosage || '',
            repetition: currentPrescription.repetition || '',
            instructions: currentPrescription.instructions || '',
            prescription_date: currentPrescription.prescription_date.split('T')[0],
            follow_up_date: currentPrescription.follow_up_date?.split('T')[0] || '',
          });
        }
      });
    }
  }, [id, patientIdFromQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updatePrescription(parseInt(id!), formData);
      } else {
        await createPrescription(formData);
      }

      // Navigate back to patient detail or case record
      if (caseRecordIdFromQuery) {
        navigate(`/dashboard/case-records/${caseRecordIdFromQuery}`);
      } else {
        navigate(`/dashboard/patients/${formData.patient_id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save prescription');
    } finally {
      setIsLoading(false);
    }
  };

  // Common homeopathic potencies
  const commonPotencies = ['6C', '12C', '30C', '200C', '1M', '10M', '50M', 'CM'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-teal-600 hover:text-teal-700 mb-4 flex items-center"
        >
          <span className="material-icons text-sm mr-1">arrow_back</span>
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Prescription' : 'New Prescription'}
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
        {/* Prescription Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Prescription Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remedy Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="remedy_name"
                value={formData.remedy_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., Arsenicum Album, Nux Vomica"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Potency</label>
              <div className="flex gap-2">
                <select
                  name="potency"
                  value={formData.potency}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select potency</option>
                  {commonPotencies.map((pot) => (
                    <option key={pot} value={pot}>
                      {pot}
                    </option>
                  ))}
                  <option value="custom">Other...</option>
                </select>
                {formData.potency === 'custom' && (
                  <input
                    type="text"
                    placeholder="Enter potency"
                    onChange={(e) => setFormData((prev) => ({ ...prev, potency: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., 3 drops, 2 pills"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repetition</label>
              <input
                type="text"
                name="repetition"
                value={formData.repetition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., TDS, BD, Once daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescription Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="prescription_date"
                value={formData.prescription_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Additional instructions for the patient..."
              />
            </div>
          </div>
        </div>

        {/* Common Homeopathic Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="material-icons text-sm">info</span>
            Common Homeopathic Dosage Guidelines
          </h3>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• <strong>OD</strong> - Once daily</p>
            <p>• <strong>BD</strong> - Twice daily</p>
            <p>• <strong>TDS</strong> - Three times daily (Ter Die Sumendum)</p>
            <p>• <strong>QDS</strong> - Four times daily</p>
            <p>• <strong>SOS</strong> - As needed (when required)</p>
            <p>• <strong>HS</strong> - At bedtime (Hora Somni)</p>
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
            {isLoading ? 'Saving...' : isEditMode ? 'Update Prescription' : 'Create Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
}

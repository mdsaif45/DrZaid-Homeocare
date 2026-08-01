import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { usePrescriptionStore } from '../../store/prescriptionStore';
import { usePatientStore } from '../../store/patientStore';
import { CreatePrescriptionData } from '../../services/prescriptionService';
import { generatePrescriptionPdf } from '../../utils/pdfGenerator';
import { Button } from '../../components/ui/Button';
import { FileText, ArrowLeft, Save } from 'lucide-react';

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

  useEffect(() => {
    if (patientIdFromQuery) {
      fetchPatientById(parseInt(patientIdFromQuery));
    }
    if (id) {
      fetchPrescriptionById(parseInt(id)).then(() => {
        if (currentPrescription) {
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

  const handleDownloadPdf = () => {
    generatePrescriptionPdf({
      patientName: currentPatient?.full_name || 'Patient',
      patientCaseId: currentPatient?.case_id || 'HC-PATIENT',
      patientAge: currentPatient?.age,
      patientGender: currentPatient?.gender,
      prescriptionDate: formData.prescription_date,
      followUpDate: formData.follow_up_date,
      remedies: [
        {
          remedy_name: formData.remedy_name || 'Homeopathic Remedy',
          potency: formData.potency,
          dosage: formData.dosage,
          repetition: formData.repetition,
          instructions: formData.instructions,
        },
      ],
    });
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

  const commonPotencies = ['6C', '12C', '30C', '200C', '1M', '10M', '50M', 'CM'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-emerald-600 hover:text-emerald-700 mb-2 flex items-center text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditMode ? 'Edit Prescription' : 'New Prescription'}
          </h1>
          {currentPatient && (
            <p className="text-slate-600 mt-1">
              Patient: <span className="font-semibold text-slate-800">{currentPatient.full_name}</span> ({currentPatient.case_id})
            </p>
          )}
        </div>

        <Button type="button" variant="outline" onClick={handleDownloadPdf}>
          <FileText className="mr-2 h-4 w-4 text-emerald-600" />
          Download PDF
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Prescription Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Remedy Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="remedy_name"
                value={formData.remedy_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="e.g., Arsenicum Album, Nux Vomica, Pulsatilla"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Potency</label>
              <div className="flex gap-2">
                <select
                  name="potency"
                  value={formData.potency}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
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
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="e.g., 4 pills, 3 drops"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Repetition</label>
              <input
                type="text"
                name="repetition"
                value={formData.repetition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="e.g., TDS, BD, Once daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prescription Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="prescription_date"
                value={formData.prescription_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="Additional instructions for the patient..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Update Prescription' : 'Save Prescription'}
          </Button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { usePrescriptionStore } from '../../store/prescriptionStore';
import { usePatientStore } from '../../store/patientStore';
import { CreatePrescriptionData } from '../../services/prescriptionService';
import { generatePrescriptionPdf } from '../../utils/pdfGenerator';
import { PageHeader, Button, Input, Select, Textarea, Card, CardHeader, CardTitle, CardContent, Alert } from '../../components/ui';
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
  const [loadedPrescriptionId, setLoadedPrescriptionId] = useState<number | null>(null);

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
      fetchPrescriptionById(parseInt(id));
    }
  }, [id, patientIdFromQuery, fetchPatientById, fetchPrescriptionById]);

  if (currentPrescription && isEditMode && loadedPrescriptionId !== currentPrescription.id) {
    setLoadedPrescriptionId(currentPrescription.id);
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
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseError = err as { response?: { data?: { error?: string } } };
        setError(responseError.response?.data?.error || 'Failed to save prescription');
      } else {
        setError('Failed to save prescription');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const commonPotencies = ['6C', '12C', '30C', '200C', '1M', '10M', '50M', 'CM'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={isEditMode ? 'Edit Prescription' : 'New Prescription'}
        subtitle={currentPatient ? `Patient: ${currentPatient.full_name} (${currentPatient.case_id})` : 'Fill in remedy details'}
        backButton={
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-primary transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        }
        actions={
          <Button type="button" variant="outline" onClick={handleDownloadPdf}>
            <FileText className="mr-2 h-4 w-4 text-primary" />
            Download PDF
          </Button>
        }
      />

      {error && (
        <Alert variant="danger" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Remedy Name"
                  name="remedy_name"
                  value={formData.remedy_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Arsenicum Album, Nux Vomica, Pulsatilla"
                />
              </div>

              <div>
                <div className="flex gap-2 items-end">
                  <Select
                    label="Potency"
                    name="potency"
                    value={formData.potency}
                    onChange={handleChange}
                    className="flex-1"
                  >
                    <option value="">Select potency</option>
                    {commonPotencies.map((pot) => (
                      <option key={pot} value={pot}>
                        {pot}
                      </option>
                    ))}
                    <option value="custom">Other...</option>
                  </Select>
                  {formData.potency === 'custom' && (
                    <Input
                      placeholder="Enter potency"
                      onChange={(e) => setFormData((prev) => ({ ...prev, potency: e.target.value }))}
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <Input
                label="Dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 4 pills, 3 drops"
              />

              <Input
                label="Repetition"
                name="repetition"
                value={formData.repetition}
                onChange={handleChange}
                placeholder="e.g., TDS, BD, Once daily"
              />

              <Input
                label="Prescription Date"
                type="date"
                name="prescription_date"
                value={formData.prescription_date}
                onChange={handleChange}
                required
              />

              <Input
                label="Follow-up Date"
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional instructions for the patient..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

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

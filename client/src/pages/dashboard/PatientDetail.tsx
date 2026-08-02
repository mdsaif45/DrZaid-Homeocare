import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';
import { useCaseRecordStore } from '../../store/caseRecordStore';
import { usePrescriptionStore } from '../../store/prescriptionStore';
import PrescriptionCard from '../../components/prescriptions/PrescriptionCard';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Plus, User, Phone, Shield, FileText, Pill, AlertTriangle } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, Modal, Spinner, EmptyState } from '../../components/ui';
import { cn } from '../../lib/cn';

type Tab = 'overview' | 'timeline' | 'prescriptions';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPatient, fetchPatientById, isLoading: patientLoading } = usePatientStore();
  const { caseRecords, fetchCaseRecordsByPatient, isLoading: caseLoading } = useCaseRecordStore();
  const { prescriptions, fetchPrescriptionsByPatient, deletePrescription, isLoading: prescriptionLoading } = usePrescriptionStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchPatientById(parseInt(id));
      fetchCaseRecordsByPatient(parseInt(id));
      fetchPrescriptionsByPatient(parseInt(id));
    }
  }, [id, fetchPatientById, fetchCaseRecordsByPatient, fetchPrescriptionsByPatient]);

  const handleDeletePrescription = async (prescriptionId: number) => {
    try {
      await deletePrescription(prescriptionId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete prescription:', err);
    }
  };

  if (patientLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner size="lg" className="mb-4" />
        <p className="text-sm text-text-muted">Loading patient details...</p>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-text-muted font-semibold">Patient not found</p>
        <Button variant="ghost" onClick={() => navigate('/dashboard/patients')} className="mt-3">
          ← Back to Patients
        </Button>
      </div>
    );
  }

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Case Timeline', count: caseRecords.length },
    { key: 'prescriptions', label: 'Prescriptions', count: prescriptions.length },
  ];

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/dashboard/patients')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary transition mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-subtle border border-primary-border flex items-center justify-center text-primary-subtle-text font-extrabold text-xl">
              {currentPatient.full_name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-text">{currentPatient.full_name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="primary">{currentPatient.case_id}</Badge>
                {currentPatient.age && (
                  <span className="text-sm text-text-muted font-medium">
                    {currentPatient.age}y • <span className="capitalize">{currentPatient.gender || 'N/A'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              leftIcon={<Edit className="w-4 h-4" />}
              onClick={() => navigate(`/dashboard/patients/${id}/edit`)}
            >
              Edit Patient
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)}
            >
              New Consultation
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate(`/dashboard/prescriptions/new?patientId=${id}`)}
            >
              New Prescription
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-subtle p-1 rounded-xl w-fit border border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer',
              activeTab === tab.key
                ? 'bg-surface text-text shadow-sm'
                : 'text-text-muted hover:text-text'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-md font-extrabold',
                  activeTab === tab.key ? 'bg-primary-subtle text-primary-subtle-text' : 'bg-surface-sunken text-text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <InfoCard title="Basic Information" icon={<User className="w-4 h-4 text-primary" />}>
              <InfoGrid
                items={[
                  { label: 'Age', value: currentPatient.age ? `${currentPatient.age} years` : 'N/A' },
                  { label: 'Gender', value: currentPatient.gender || 'N/A', capitalize: true },
                  { label: 'Occupation', value: currentPatient.occupation || 'N/A' },
                  { label: 'Registered', value: format(new Date(currentPatient.created_at), 'dd MMM yyyy') },
                ]}
              />
            </InfoCard>

            <InfoCard title="Contact Information" icon={<Phone className="w-4 h-4 text-primary" />}>
              <InfoGrid
                items={[
                  { label: 'Phone', value: currentPatient.contact_phone },
                  { label: 'Email', value: currentPatient.contact_email || 'N/A' },
                  { label: 'Address', value: currentPatient.address || 'N/A', full: true },
                ]}
              />
            </InfoCard>

            {(currentPatient.lifestyle_habits || currentPatient.emergency_contact) && (
              <InfoCard title="Additional Information" icon={<Shield className="w-4 h-4 text-primary" />}>
                <InfoGrid
                  items={[
                    ...(currentPatient.lifestyle_habits
                      ? [{ label: 'Lifestyle Habits', value: currentPatient.lifestyle_habits, full: true }]
                      : []),
                    ...(currentPatient.emergency_contact
                      ? [
                          {
                            label: 'Emergency Contact',
                            value: `${currentPatient.emergency_contact}${
                              currentPatient.emergency_phone ? ` — ${currentPatient.emergency_phone}` : ''
                            }`,
                            full: true,
                          },
                        ]
                      : []),
                  ]}
                />
              </InfoCard>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-primary text-text-on-brand rounded-2xl p-5 shadow-md">
              <h3 className="text-sm font-extrabold mb-4 opacity-90">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Total Consultations</span>
                  <span className="text-2xl font-extrabold">{caseRecords.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Last Visit</span>
                  <span className="text-sm font-bold">
                    {caseRecords.length > 0
                      ? format(new Date(caseRecords[0].consultation_date), 'dd MMM yyyy')
                      : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Prescriptions</span>
                  <span className="text-2xl font-extrabold">{prescriptions.length}</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-extrabold text-text">Recent Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                {caseLoading ? (
                  <p className="text-xs text-text-muted">Loading...</p>
                ) : caseRecords.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-text-muted mb-3">No consultations yet</p>
                    <button
                      onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      + Add First →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {caseRecords.slice(0, 3).map((record) => (
                      <button
                        key={record.id}
                        onClick={() => navigate(`/dashboard/case-records/${record.id}`)}
                        className="w-full text-left p-3 rounded-xl bg-bg-subtle hover:bg-surface-hover border border-border transition-all cursor-pointer"
                      >
                        <p className="text-xs font-bold text-text">
                          {format(new Date(record.consultation_date), 'dd MMM yyyy')}
                        </p>
                        {record.diagnosis && (
                          <p className="text-xs text-text-muted mt-0.5 truncate">{record.diagnosis}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Timeline */}
      {activeTab === 'timeline' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-extrabold text-text">Consultation Timeline</CardTitle>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)}
            >
              + New Consultation
            </Button>
          </CardHeader>
          <CardContent>
            {caseLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : caseRecords.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-6 h-6" />}
                title="No consultations recorded yet."
                action={
                  <Button variant="primary" onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)}>
                    Add First Consultation
                  </Button>
                }
              />
            ) : (
              <div className="space-y-0">
                {caseRecords.map((record, idx) => (
                  <div key={record.id} className="flex gap-5 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-surface shadow ring-2 ring-primary-border mt-1 z-10" />
                      {idx < caseRecords.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className={cn('pb-6 flex-1', idx === caseRecords.length - 1 && 'pb-0')}>
                      <div className="bg-bg-subtle border border-border rounded-xl p-4 hover:border-border-strong transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-bold text-text">
                              {format(new Date(record.consultation_date), 'MMMM dd, yyyy')}
                            </p>
                            <p className="text-xs text-text-muted">
                              {format(new Date(record.consultation_date), 'hh:mm a')}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/dashboard/case-records/${record.id}`)}
                          >
                            Details →
                          </Button>
                        </div>
                        {record.chief_complaints && (
                          <div className="mb-2">
                            <p className="text-xs font-bold text-text-subtle uppercase tracking-wide mb-0.5">
                              Chief Complaint
                            </p>
                            <p className="text-sm text-text">{record.chief_complaints}</p>
                          </div>
                        )}
                        {record.diagnosis && (
                          <div className="mb-2">
                            <p className="text-xs font-bold text-text-subtle uppercase tracking-wide mb-0.5">Diagnosis</p>
                            <p className="text-sm text-text">{record.diagnosis}</p>
                          </div>
                        )}
                        {record.complaint_tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {record.complaint_tags.map((tag: string, i: number) => (
                              <Badge key={i} variant="primary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Prescriptions */}
      {activeTab === 'prescriptions' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-extrabold text-text">Prescriptions</CardTitle>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate(`/dashboard/prescriptions/new?patientId=${id}`)}
            >
              + New Prescription
            </Button>
          </CardHeader>
          <CardContent>
            {prescriptionLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : prescriptions.length === 0 ? (
              <EmptyState
                icon={<Pill className="w-6 h-6" />}
                title="No prescriptions issued yet."
                action={
                  <Button variant="primary" onClick={() => navigate(`/dashboard/prescriptions/new?patientId=${id}`)}>
                    Add First Prescription
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                    onEdit={(pid) => navigate(`/dashboard/prescriptions/${pid}/edit`)}
                    onDelete={(pid) => setDeleteConfirmId(pid)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete prescription modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        size="sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-danger-subtle rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <h3 className="text-base font-extrabold text-text mb-2">Delete Prescription</h3>
          <p className="text-sm text-text-muted leading-relaxed mb-6">
            This action cannot be undone. All prescription data will be permanently removed.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" fullWidth onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => deleteConfirmId && handleDeletePrescription(deleteConfirmId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card padding="none">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-surface-sunken">
        {icon}
        <h3 className="text-sm font-extrabold text-text">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string; capitalize?: boolean; full?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(({ label, value, capitalize, full }) => (
        <div key={label} className={full ? 'col-span-2' : ''}>
          <p className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-1">{label}</p>
          <p className={cn('text-sm font-semibold text-text', capitalize && 'capitalize')}>{value}</p>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';
import { useCaseRecordStore } from '../../store/caseRecordStore';
import { usePrescriptionStore } from '../../store/prescriptionStore';
import PrescriptionCard from '../../components/prescriptions/PrescriptionCard';
import { format } from 'date-fns';

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
    try { await deletePrescription(prescriptionId); setDeleteConfirmId(null); }
    catch (err) { console.error('Failed to delete prescription:', err); }
  };

  if (patientLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!currentPatient) return (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-slate-500 font-semibold">Patient not found</p>
      <button onClick={() => navigate('/dashboard/patients')} className="mt-3 text-sm text-teal-600 font-bold">← Back to Patients</button>
    </div>
  );

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Case Timeline', count: caseRecords.length },
    { key: 'prescriptions', label: 'Prescriptions', count: prescriptions.length },
  ];

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <button onClick={() => navigate('/dashboard/patients')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-teal-600 transition mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Patients
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-extrabold text-xl">
              {currentPatient.full_name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{currentPatient.full_name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-lg">
                  {currentPatient.case_id}
                </span>
                {currentPatient.age && <span className="text-sm text-slate-400 font-medium">{currentPatient.age}y • <span className="capitalize">{currentPatient.gender || 'N/A'}</span></span>}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <OutlineBtn onClick={() => navigate(`/dashboard/patients/${id}/edit`)} icon="✏️" label="Edit Patient" />
            <PrimaryBtn onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)} icon="+" label="New Consultation" color="teal" />
            <PrimaryBtn onClick={() => navigate(`/dashboard/prescriptions/new?patientId=${id}`)} icon="+" label="New Prescription" color="violet" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-extrabold ${
                activeTab === tab.key ? 'bg-teal-50 text-teal-600' : 'bg-slate-200 text-slate-500'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <InfoCard title="Basic Information" icon="👤">
              <InfoGrid items={[
                { label: 'Age', value: currentPatient.age ? `${currentPatient.age} years` : 'N/A' },
                { label: 'Gender', value: currentPatient.gender || 'N/A', capitalize: true },
                { label: 'Occupation', value: currentPatient.occupation || 'N/A' },
                { label: 'Registered', value: format(new Date(currentPatient.created_at), 'dd MMM yyyy') },
              ]} />
            </InfoCard>

            <InfoCard title="Contact Information" icon="📞">
              <InfoGrid items={[
                { label: 'Phone', value: currentPatient.contact_phone },
                { label: 'Email', value: currentPatient.contact_email || 'N/A' },
                { label: 'Address', value: currentPatient.address || 'N/A', full: true },
              ]} />
            </InfoCard>

            {(currentPatient.lifestyle_habits || currentPatient.emergency_contact) && (
              <InfoCard title="Additional Information" icon="🧬">
                <InfoGrid items={[
                  ...(currentPatient.lifestyle_habits ? [{ label: 'Lifestyle Habits', value: currentPatient.lifestyle_habits, full: true }] : []),
                  ...(currentPatient.emergency_contact ? [{ label: 'Emergency Contact', value: `${currentPatient.emergency_contact}${currentPatient.emergency_phone ? ` — ${currentPatient.emergency_phone}` : ''}`, full: true }] : []),
                ]} />
              </InfoCard>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-teal-600 rounded-2xl p-5 text-white">
              <h3 className="text-sm font-extrabold mb-4 text-teal-100">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-teal-200">Total Consultations</span>
                  <span className="text-2xl font-extrabold">{caseRecords.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-teal-200">Last Visit</span>
                  <span className="text-sm font-bold">
                    {caseRecords.length > 0 ? format(new Date(caseRecords[0].consultation_date), 'dd MMM yyyy') : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-teal-200">Prescriptions</span>
                  <span className="text-2xl font-extrabold">{prescriptions.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">Recent Consultations</h3>
              {caseLoading ? <p className="text-xs text-slate-400">Loading...</p>
                : caseRecords.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-400 mb-3">No consultations yet</p>
                    <button onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700">+ Add First →</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {caseRecords.slice(0, 3).map(record => (
                      <button key={record.id} onClick={() => navigate(`/dashboard/case-records/${record.id}`)}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all">
                        <p className="text-xs font-bold text-slate-700">{format(new Date(record.consultation_date), 'dd MMM yyyy')}</p>
                        {record.diagnosis && <p className="text-xs text-slate-400 mt-0.5 truncate">{record.diagnosis}</p>}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-extrabold text-slate-900">Consultation Timeline</h2>
            <button onClick={() => navigate(`/dashboard/case-records/new?patientId=${id}`)}
              className="text-xs font-bold bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 transition active:scale-95">
              + New Consultation
            </button>
          </div>
          {caseLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : caseRecords.length === 0 ? (
            <EmptyState icon="📋" message="No consultations recorded yet." actionLabel="Add First Consultation"
              onAction={() => navigate(`/dashboard/case-records/new?patientId=${id}`)} />
          ) : (
            <div className="space-y-0">
              {caseRecords.map((record, idx) => (
                <div key={record.id} className="flex gap-5 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-teal-500 border-2 border-white shadow ring-2 ring-teal-100 mt-1 z-10" />
                    {idx < caseRecords.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                  </div>
                  <div className={`pb-6 flex-1 ${idx === caseRecords.length - 1 ? 'pb-0' : ''}`}>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-teal-200 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{format(new Date(record.consultation_date), 'MMMM dd, yyyy')}</p>
                          <p className="text-xs text-slate-400">{format(new Date(record.consultation_date), 'hh:mm a')}</p>
                        </div>
                        <button onClick={() => navigate(`/dashboard/case-records/${record.id}`)}
                          className="text-xs font-bold text-teal-600 hover:text-teal-700">
                          Details →
                        </button>
                      </div>
                      {record.chief_complaints && (
                        <div className="mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Chief Complaint</p>
                          <p className="text-sm text-slate-700">{record.chief_complaints}</p>
                        </div>
                      )}
                      {record.diagnosis && (
                        <div className="mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Diagnosis</p>
                          <p className="text-sm text-slate-700">{record.diagnosis}</p>
                        </div>
                      )}
                      {record.complaint_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {record.complaint_tags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-extrabold text-slate-900">Prescriptions</h2>
            <button onClick={() => navigate(`/dashboard/prescriptions/new?patientId=${id}`)}
              className="text-xs font-bold bg-violet-600 text-white px-3 py-2 rounded-lg hover:bg-violet-700 transition active:scale-95">
              + New Prescription
            </button>
          </div>
          {prescriptionLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : prescriptions.length === 0 ? (
            <EmptyState icon="💊" message="No prescriptions issued yet." actionLabel="Add First Prescription"
              onAction={() => navigate(`/dashboard/prescriptions/new?patientId=${id}`)} actionColor="violet" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prescriptions.map(prescription => (
                <PrescriptionCard key={prescription.id} prescription={prescription}
                  onEdit={(pid) => navigate(`/dashboard/prescriptions/${pid}/edit`)}
                  onDelete={(pid) => setDeleteConfirmId(pid)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete prescription modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Delete Prescription</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">This action cannot be undone. All prescription data will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => handleDeletePrescription(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 bg-slate-50/50">
        <span>{icon}</span>
        <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string; capitalize?: boolean; full?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(({ label, value, capitalize, full }) => (
        <div key={label} className={full ? 'col-span-2' : ''}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <p className={`text-sm font-semibold text-slate-800 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, message, actionLabel, onAction, actionColor = 'teal' }: {
  icon: string; message: string; actionLabel: string; onAction: () => void; actionColor?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-sm text-slate-500 mb-4">{message}</p>
      <button onClick={onAction}
        className={`text-sm font-bold text-white px-4 py-2 rounded-xl transition active:scale-95 ${
          actionColor === 'violet' ? 'bg-violet-600 hover:bg-violet-700' : 'bg-teal-600 hover:bg-teal-700'
        }`}>
        {actionLabel}
      </button>
    </div>
  );
}

function OutlineBtn({ onClick, icon, label }: { onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95">
      <span>{icon}</span>{label}
    </button>
  );
}

function PrimaryBtn({ onClick, icon, label, color }: { onClick: () => void; icon: string; label: string; color: 'teal' | 'violet' }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-white transition active:scale-95 ${
        color === 'violet' ? 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-600/20' : 'bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20'
      }`}>
      <span>{icon}</span>{label}
    </button>
  );
}

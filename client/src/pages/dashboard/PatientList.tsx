import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';

export default function PatientList() {
  const navigate = useNavigate();
  const { patients, pagination, isLoading, error, fetchPatients, deletePatient, clearError } = usePatientStore();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchPatients(currentPage, 20, search);
  }, [currentPage, fetchPatients]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPatients(1, 20, search);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePatient(id);
      setDeleteConfirm(null);
      fetchPatients(currentPage, 20, search);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination ? `${pagination.total} total records` : 'Manage patient records'}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/patients/new')}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Patient
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or case ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
          />
        </div>
        <button type="submit"
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition active:scale-95">
          Search
        </button>
        {search && (
          <button type="button"
            onClick={() => { setSearch(''); setCurrentPage(1); fetchPatients(1, 20, ''); }}
            className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition">
            Clear
          </button>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 font-medium">{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-500 font-medium">Loading patients...</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && patients.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['Case ID', 'Patient', 'Age / Gender', 'Phone', 'Registered', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-lg">
                      {patient.case_id}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-slate-900">{patient.full_name}</p>
                    {patient.occupation && (
                      <p className="text-xs text-slate-400 mt-0.5">{patient.occupation}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-medium">
                      {patient.age ? `${patient.age}y` : '—'} / <span className="capitalize">{patient.gender || '—'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                    {patient.contact_phone}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                    {new Date(patient.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionBtn onClick={() => navigate(`/dashboard/patients/${patient.id}`)} label="View" color="teal" />
                      <ActionBtn onClick={() => navigate(`/dashboard/patients/${patient.id}/edit`)} label="Edit" color="slate" />
                      <ActionBtn onClick={() => setDeleteConfirm(patient.id)} label="Delete" color="red" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/40">
              <p className="text-xs text-slate-500 font-medium">
                Showing {(currentPage - 1) * pagination.limit + 1}–{Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition">
                  ← Prev
                </button>
                <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-600 text-white">
                  {currentPage} / {pagination.totalPages}
                </span>
                <button onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))} disabled={currentPage === pagination.totalPages}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && patients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-base font-bold text-slate-700 mb-1">No patients found</p>
          <p className="text-sm text-slate-400 mb-5">Register your first patient to get started.</p>
          <button onClick={() => navigate('/dashboard/patients/new')}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-700 transition active:scale-95">
            Add First Patient
          </button>
        </div>
      )}

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Delete Patient Record</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              This will permanently remove the patient and all associated case records and prescriptions. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition active:scale-95">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, label, color }: { onClick: () => void; label: string; color: 'teal' | 'slate' | 'red' }) {
  const cls = {
    teal: 'text-teal-600 hover:bg-teal-50 border-teal-100',
    slate: 'text-slate-600 hover:bg-slate-100 border-slate-100',
    red: 'text-red-500 hover:bg-red-50 border-red-100',
  }[color];
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${cls}`}>
      {label}
    </button>
  );
}

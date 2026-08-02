import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '../../store/patientStore';
import { Plus, Trash2, Search, UserX, AlertTriangle } from 'lucide-react';
import { PageHeader, Button, Input, Table, TableHead, TableHeader, TableBody, TableRow, TableCell, Modal, Alert, Spinner, EmptyState, Badge } from '../../components/ui';

export default function PatientList() {
  const navigate = useNavigate();
  const { patients, pagination, isLoading, error, fetchPatients, deletePatient, clearError } = usePatientStore();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchPatients(currentPage, 20, search);
  }, [currentPage, search, fetchPatients]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSelectedIds([]);
    fetchPatients(1, 20, search);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === patients.length && patients.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(patients.map((p) => p.id));
    }
  };

  const handleToggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deletePatient(id);
      }
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
      fetchPatients(currentPage, 20, search);
    } catch (err) {
      console.error('Bulk delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const isAllSelected = patients.length > 0 && selectedIds.length === patients.length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Patients"
        subtitle={pagination ? `${pagination.total} total records` : 'Manage patient records'}
        actions={
          <>
            {selectedIds.length > 0 && (
              <Button
                variant="danger"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setShowBulkDeleteConfirm(true)}
              >
                Delete Selected ({selectedIds.length})
              </Button>
            )}
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/dashboard/patients/new')}
            >
              Add New Patient
            </Button>
          </>
        }
      />

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or case ID..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
        {search && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSearch('');
              setCurrentPage(1);
              setSelectedIds([]);
              fetchPatients(1, 20, '');
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Error */}
      {error && (
        <Alert variant="danger" onDismiss={clearError}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" className="mb-4" />
          <p className="text-sm text-text-muted font-medium">Loading patients...</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && patients.length > 0 && (
        <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-focus-ring cursor-pointer"
                  />
                </TableHeader>
                <TableHeader>Case ID</TableHeader>
                <TableHeader>Patient</TableHeader>
                <TableHeader>Age / Gender</TableHeader>
                <TableHeader>Phone</TableHeader>
                <TableHeader>Registered</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => {
                const isSelected = selectedIds.includes(patient.id);
                return (
                  <TableRow
                    key={patient.id}
                    className={isSelected ? 'bg-primary-subtle' : undefined}
                  >
                    <TableCell className="text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(patient.id)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-focus-ring cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/dashboard/patients/${patient.id}`)}
                        className="cursor-pointer"
                      >
                        <Badge variant="primary">{patient.case_id}</Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/dashboard/patients/${patient.id}`)}
                        className="text-left font-bold text-text hover:text-primary text-sm transition-colors block cursor-pointer"
                      >
                        {patient.full_name}
                      </button>
                      {patient.occupation && (
                        <p className="text-xs text-text-muted mt-0.5">{patient.occupation}</p>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="text-sm text-text font-medium">
                        {patient.age ? `${patient.age}y` : '—'} / <span className="capitalize">{patient.gender || '—'}</span>
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-text font-medium">
                      {patient.contact_phone}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-text-muted font-medium">
                      {new Date(patient.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-surface-sunken">
              <p className="text-xs text-text-muted font-medium">
                Showing {(currentPage - 1) * pagination.limit + 1}–{Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    setSelectedIds([]);
                  }}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </Button>
                <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-text-on-brand">
                  {currentPage} / {pagination.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1));
                    setSelectedIds([]);
                  }}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && patients.length === 0 && (
        <EmptyState
          icon={<UserX className="w-6 h-6" />}
          title="No patients found"
          description="Register your first patient to get started."
          action={
            <Button variant="primary" onClick={() => navigate('/dashboard/patients/new')}>
              Add First Patient
            </Button>
          }
        />
      )}

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        size="sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-danger-subtle rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <h3 className="text-base font-extrabold text-text mb-2">
            Delete {selectedIds.length} Patient Record(s)
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-6">
            This will permanently remove the selected patient(s) and all associated case records and prescriptions. This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              fullWidth
              disabled={isDeleting}
              onClick={() => setShowBulkDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              isLoading={isDeleting}
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

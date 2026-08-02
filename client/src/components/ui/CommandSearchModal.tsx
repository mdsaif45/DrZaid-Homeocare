import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, FileText, X } from 'lucide-react';
import patientService, { Patient } from '../../services/patientService';
import { IconButton } from './IconButton';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearchModal({ isOpen, onClose }: CommandSearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await patientService.getPatients(1, 10, query);
        setResults(res.patients);
      } catch (err) {
        console.error('Command search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const activeResults = query.trim() ? results : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-overlay backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-surface-raised rounded-2xl shadow-2xl border border-border max-w-xl w-full overflow-hidden text-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, case files, or phone numbers..."
            className="w-full text-sm text-text placeholder:text-text-disabled bg-transparent focus:outline-none"
          />
          <IconButton
            icon={<X className="w-4 h-4" />}
            aria-label="Close search"
            variant="ghost"
            size="sm"
            onClick={onClose}
          />
        </div>

        {/* Results / List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {isLoading && (
            <div className="py-8 text-center text-xs text-text-muted">Searching EMR records...</div>
          )}

          {!isLoading && query && activeResults.length === 0 && (
            <div className="py-8 text-center text-xs text-text-muted">
              No matching patient records found for "<span className="font-semibold">{query}</span>"
            </div>
          )}

          {!isLoading && activeResults.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-subtle px-3 py-1">
                Patients ({activeResults.length})
              </p>
              {activeResults.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    navigate(`/dashboard/patients/${patient.id}`);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover text-left transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary border border-primary-border flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                        {patient.full_name}
                      </p>
                      <p className="text-xs text-text-muted">{patient.contact_phone} • {patient.gender || 'Patient'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary-subtle-text bg-primary-subtle px-2 py-0.5 rounded-md border border-primary-border">
                    {patient.case_id}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-4 space-y-2">
              <p className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Quick Navigation</p>
              <button
                onClick={() => {
                  navigate('/dashboard/patients/new');
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-hover text-left transition text-xs font-bold text-text cursor-pointer"
              >
                <User className="w-4 h-4 text-primary" />
                Register New Patient
              </button>
              <button
                onClick={() => {
                  navigate('/dashboard/patients');
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-hover text-left transition text-xs font-bold text-text cursor-pointer"
              >
                <FileText className="w-4 h-4 text-primary" />
                View Patient Registry
              </button>
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-surface-sunken border-t border-border flex justify-between text-[11px] text-text-subtle">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono shadow-xs">ESC</kbd> to close</span>
          <span>Dr. ZAID's Homeo Care EMR</span>
        </div>
      </div>
    </div>
  );
}

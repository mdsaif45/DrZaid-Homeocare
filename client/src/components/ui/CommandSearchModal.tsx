import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, FileText, X } from 'lucide-react';
import patientService, { Patient } from '../../services/patientService';

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
      setResults([]);
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, case files, or phone numbers..."
            className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {isLoading && (
            <div className="py-8 text-center text-xs text-slate-400">Searching EMR records...</div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching patient records found for "<span className="font-semibold">{query}</span>"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Patients ({results.length})
              </p>
              {results.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    navigate(`/dashboard/patients/${patient.id}`);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                        {patient.full_name}
                      </p>
                      <p className="text-xs text-slate-400">{patient.contact_phone} • {patient.gender || 'Patient'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    {patient.case_id}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-4 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Navigation</p>
              <button
                onClick={() => {
                  navigate('/dashboard/patients/new');
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition text-xs font-bold text-slate-700"
              >
                <User className="w-4 h-4 text-teal-600" />
                Register New Patient
              </button>
              <button
                onClick={() => {
                  navigate('/dashboard/patients');
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition text-xs font-bold text-slate-700"
              >
                <FileText className="w-4 h-4 text-teal-600" />
                View Patient Registry
              </button>
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono shadow-xs">ESC</kbd> to close</span>
          <span>Dr. ZAID's Homeo Care EMR</span>
        </div>
      </div>
    </div>
  );
}

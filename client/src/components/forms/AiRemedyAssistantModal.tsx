import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, Check, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AiRemedyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  chiefComplaints: string;
  tags?: string[];
  onSelectRemedy?: (remedy: { name: string; potency: string; dosage: string }) => void;
}

export const AiRemedyAssistantModal: React.FC<AiRemedyAssistantModalProps> = ({
  isOpen,
  onClose,
  chiefComplaints,
  tags,
  onSelectRemedy,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ summary?: string; suggestions?: any[] } | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai/repertory-match', {
        chief_complaints: chiefComplaints,
        tags,
      });
      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch AI remedy recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Homeopathic Repertory Assistant" className="max-w-2xl">
      <div className="space-y-4">
        <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
          <div className="flex items-center gap-2 font-semibold text-emerald-900 text-sm mb-1">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Gemini Clinical Repertory Analyzer
          </div>
          <p className="text-xs text-emerald-700">
            Analyzes physical generals, symptom modalities, and temperament against Boenninghausen & Kent repertory rubrics.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Active Symptoms Input</label>
          <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-800 border border-slate-200">
            {chiefComplaints || tags?.length ? (
              <>
                <p className="font-medium">{chiefComplaints || 'No text complaints specified'}</p>
                {tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags.map((t) => (
                      <Badge key={t} variant="info">{t}</Badge>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <span className="text-slate-400 italic">Enter chief complaints or tags in the form first...</span>
            )}
          </div>
        </div>

        {!result && (
          <Button
            onClick={handleAnalyze}
            isLoading={isLoading}
            variant="primary"
            className="w-full shadow-md"
            disabled={!chiefComplaints && !tags?.length}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Run Gemini Repertory Analysis
          </Button>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            {result.summary && (
              <p className="text-xs font-medium text-slate-600 italic bg-slate-100 p-2.5 rounded-md border border-slate-200">
                "{result.summary}"
              </p>
            )}

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {result.suggestions?.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{item.remedy_name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Suggested Potency: <span className="font-semibold text-emerald-700">{item.potency}</span> • Dosage: {item.dosage}
                      </p>
                    </div>
                    <Badge variant="success">{item.confidence_score}% Match</Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.matching_rubrics?.map((r: string) => (
                      <span key={r} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {r}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.rationale}</p>

                  {onSelectRemedy && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 text-xs"
                      onClick={() => {
                        onSelectRemedy({
                          name: item.remedy_name,
                          potency: item.potency,
                          dosage: item.dosage,
                        });
                        onClose();
                      }}
                    >
                      <Check className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                      Apply Remedy to Prescription
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

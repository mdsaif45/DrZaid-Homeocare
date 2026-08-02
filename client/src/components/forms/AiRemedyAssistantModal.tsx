import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';

interface RemedySuggestion {
  remedy_name: string;
  potency: string;
  dosage: string;
  confidence_score: number;
  matching_rubrics?: string[];
  rationale?: string;
}

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
  const [result, setResult] = useState<{ summary?: string; suggestions?: RemedySuggestion[] } | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai/repertory-match', {
        chief_complaints: chiefComplaints,
        tags,
      });
      setResult(response.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch AI remedy recommendations');
      } else {
        setError('Failed to fetch AI remedy recommendations');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Homeopathic Repertory Assistant" size="lg">
      <div className="space-y-4">
        <div className="rounded-lg bg-primary-subtle p-4 border border-primary-border">
          <div className="flex items-center gap-2 font-semibold text-primary-subtle-text text-sm mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            Gemini Clinical Repertory Analyzer
          </div>
          <p className="text-xs text-text-muted">
            Analyzes physical generals, symptom modalities, and temperament against Boenninghausen & Kent repertory rubrics.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-subtle uppercase mb-1">Active Symptoms Input</label>
          <div className="rounded-md bg-bg-subtle p-3 text-sm text-text border border-border">
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
              <span className="text-text-disabled italic">Enter chief complaints or tags in the form first...</span>
            )}
          </div>
        </div>

        {!result && (
          <Button
            onClick={handleAnalyze}
            isLoading={isLoading}
            variant="primary"
            fullWidth
            className="shadow-md"
            disabled={!chiefComplaints && !tags?.length}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Run Gemini Repertory Analysis
          </Button>
        )}

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {result && (
          <div className="space-y-3">
            {result.summary && (
              <p className="text-xs font-medium text-text-muted italic bg-bg-subtle p-2.5 rounded-md border border-border">
                "{result.summary}"
              </p>
            )}

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {result.suggestions?.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-surface p-4 shadow-sm hover:border-primary-border transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-text text-base">{item.remedy_name}</h4>
                      <p className="text-xs text-text-muted font-medium">
                        Suggested Potency: <span className="font-semibold text-primary">{item.potency}</span> • Dosage: {item.dosage}
                      </p>
                    </div>
                    <Badge variant="success">{item.confidence_score}% Match</Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.matching_rubrics?.map((r: string) => (
                      <span key={r} className="rounded bg-bg-subtle px-2 py-0.5 text-[11px] font-medium text-text-muted">
                        {r}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-text-muted leading-relaxed">{item.rationale}</p>

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
                      <Check className="mr-1 h-3.5 w-3.5 text-success" />
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

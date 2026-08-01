import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';
import { AiRemedyAssistantModal } from './AiRemedyAssistantModal';

interface ClinicalAnalysisSectionProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ClinicalAnalysisSection: React.FC<ClinicalAnalysisSectionProps> = ({
  formData,
  handleChange,
}) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Clinical Analysis & Treatment Plan</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAiModalOpen(true)}
            className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          >
            <Sparkles className="mr-1.5 h-4 w-4 text-emerald-600" />
            AI Remedy Assistant
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">General Physical Examination</label>
              <textarea
                name="general_examination"
                rows={3}
                value={formData.general_examination}
                onChange={handleChange}
                placeholder="Tongue, nails, skin, posture..."
                className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Mind & Mentals Examination</label>
              <textarea
                name="mental_state_examination"
                rows={3}
                value={formData.mental_state_examination}
                onChange={handleChange}
                placeholder="Disposition, anxieties, fears, emotional state..."
                className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Input
                label="Provisional / Final Diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Diagnosis details"
              />
            </div>
            <div>
              <Input
                label="Next Follow-up Date"
                type="date"
                name="next_follow_up_date"
                value={formData.next_follow_up_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Treatment Plan & Prescription Notes</label>
            <textarea
              name="treatment_plan"
              rows={3}
              value={formData.treatment_plan}
              onChange={handleChange}
              placeholder="Homeopathic remedy selection, potency, diet recommendations..."
              className="w-full rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      <AiRemedyAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        chiefComplaints={formData.chief_complaints}
        tags={formData.complaint_tags}
        onSelectRemedy={(remedy) => {
          const appended = `${formData.treatment_plan ? `${formData.treatment_plan}\n` : ''}Rx: ${remedy.name} ${remedy.potency} - ${remedy.dosage}`;
          handleChange({
            target: { name: 'treatment_plan', value: appended },
          } as any);
        }}
      />
    </>
  );
};

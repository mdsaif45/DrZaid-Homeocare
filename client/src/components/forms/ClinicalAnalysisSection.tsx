import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';
import { AiRemedyAssistantModal } from './AiRemedyAssistantModal';

interface ClinicalAnalysisSectionProps {
  formData: {
    general_examination?: string;
    mental_state_examination?: string;
    diagnosis?: string;
    next_follow_up_date?: string;
    treatment_plan?: string;
    chief_complaints?: string;
    complaint_tags?: string[];
  };
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
          >
            <Sparkles className="mr-1.5 h-4 w-4 text-primary" />
            AI Remedy Assistant
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Textarea
              label="General Physical Examination"
              name="general_examination"
              rows={3}
              value={formData.general_examination || ''}
              onChange={handleChange}
              placeholder="Tongue, nails, skin, posture..."
            />
            <Textarea
              label="Mind & Mentals Examination"
              name="mental_state_examination"
              rows={3}
              value={formData.mental_state_examination || ''}
              onChange={handleChange}
              placeholder="Disposition, anxieties, fears, emotional state..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Provisional / Final Diagnosis"
              name="diagnosis"
              value={formData.diagnosis || ''}
              onChange={handleChange}
              placeholder="Diagnosis details"
            />
            <Input
              label="Next Follow-up Date"
              type="date"
              name="next_follow_up_date"
              value={formData.next_follow_up_date || ''}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="Treatment Plan & Prescription Notes"
            name="treatment_plan"
            rows={3}
            value={formData.treatment_plan || ''}
            onChange={handleChange}
            placeholder="Homeopathic remedy selection, potency, diet recommendations..."
          />
        </CardContent>
      </Card>

      <AiRemedyAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        chiefComplaints={formData.chief_complaints || ''}
        tags={formData.complaint_tags}
        onSelectRemedy={(remedy) => {
          const appended = `${formData.treatment_plan ? `${formData.treatment_plan}\n` : ''}Rx: ${remedy.name} ${remedy.potency} - ${remedy.dosage}`;
          const customEvent = {
            target: { name: 'treatment_plan', value: appended },
          } as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
          handleChange(customEvent);
        }}
      />
    </>
  );
};

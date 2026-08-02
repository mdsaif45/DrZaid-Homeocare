import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Plus, X } from 'lucide-react';

interface ChiefComplaintsSectionProps {
  formData: {
    chief_complaints?: string;
    complaint_duration?: string;
    complaint_tags?: string[];
    past_history?: string;
    family_history?: string;
    surgical_history?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  tagInput: string;
  setTagInput: (val: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
}

export const ChiefComplaintsSection: React.FC<ChiefComplaintsSectionProps> = ({
  formData,
  handleChange,
  tagInput,
  setTagInput,
  handleAddTag,
  handleRemoveTag,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Chief Complaints & Medical History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          label="Chief Complaints"
          name="chief_complaints"
          rows={4}
          value={formData.chief_complaints || ''}
          onChange={handleChange}
          placeholder="Describe primary symptoms, onset, modalities, character of pain..."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Duration"
            name="complaint_duration"
            value={formData.complaint_duration || ''}
            onChange={handleChange}
            placeholder="e.g., 3 weeks, 6 months"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Symptom Tags</label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag (e.g. fever, thirstless)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="primary"
                onClick={handleAddTag}
                aria-label="Add symptom tag"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.complaint_tags?.map((tag: string) => (
                <Badge key={tag} variant="primary" className="gap-1.5">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Textarea
            label="Past History"
            name="past_history"
            rows={3}
            value={formData.past_history || ''}
            onChange={handleChange}
            placeholder="Past illnesses, surgeries..."
          />
          <Textarea
            label="Family History"
            name="family_history"
            rows={3}
            value={formData.family_history || ''}
            onChange={handleChange}
            placeholder="Hereditary conditions..."
          />
          <Textarea
            label="Surgical History"
            name="surgical_history"
            rows={3}
            value={formData.surgical_history || ''}
            onChange={handleChange}
            placeholder="Previous operations..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

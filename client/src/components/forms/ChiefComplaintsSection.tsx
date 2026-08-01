import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Plus, X } from 'lucide-react';

interface ChiefComplaintsSectionProps {
  formData: any;
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
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Chief Complaints</label>
          <textarea
            name="chief_complaints"
            rows={4}
            value={formData.chief_complaints}
            onChange={handleChange}
            placeholder="Describe primary symptoms, onset, modalities, character of pain..."
            className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Duration"
              name="complaint_duration"
              value={formData.complaint_duration}
              onChange={handleChange}
              placeholder="e.g., 3 weeks, 6 months"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Symptom Tags</label>
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
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex items-center rounded-md bg-slate-800 px-3 text-white hover:bg-slate-900"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.complaint_tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-emerald-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Past History</label>
            <textarea
              name="past_history"
              rows={3}
              value={formData.past_history}
              onChange={handleChange}
              placeholder="Past illnesses, surgeries..."
              className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Family History</label>
            <textarea
              name="family_history"
              rows={3}
              value={formData.family_history}
              onChange={handleChange}
              placeholder="Hereditary conditions..."
              className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Surgical History</label>
            <textarea
              name="surgical_history"
              rows={3}
              value={formData.surgical_history}
              onChange={handleChange}
              placeholder="Previous operations..."
              className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

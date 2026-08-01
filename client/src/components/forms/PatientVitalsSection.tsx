import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

interface PatientVitalsSectionProps {
  formData: any;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const PatientVitalsSection: React.FC<PatientVitalsSectionProps> = ({
  formData,
  handleNumberChange,
  handleChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Physical Examination & Vitals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <Input
            label="BP Systolic (mmHg)"
            type="number"
            name="blood_pressure_systolic"
            value={formData.blood_pressure_systolic ?? ''}
            onChange={handleNumberChange}
            placeholder="120"
          />
          <Input
            label="BP Diastolic (mmHg)"
            type="number"
            name="blood_pressure_diastolic"
            value={formData.blood_pressure_diastolic ?? ''}
            onChange={handleNumberChange}
            placeholder="80"
          />
          <Input
            label="Pulse Rate (bpm)"
            type="number"
            name="pulse_rate"
            value={formData.pulse_rate ?? ''}
            onChange={handleNumberChange}
            placeholder="72"
          />
          <Input
            label="Respiratory Rate"
            type="number"
            name="respiratory_rate"
            value={formData.respiratory_rate ?? ''}
            onChange={handleNumberChange}
            placeholder="16"
          />
          <Input
            label="Temp (°C/°F)"
            type="number"
            step="0.1"
            name="temperature"
            value={formData.temperature ?? ''}
            onChange={handleNumberChange}
            placeholder="98.6"
          />
          <Input
            label="SpO2 (%)"
            type="number"
            name="oxygen_saturation"
            value={formData.oxygen_saturation ?? ''}
            onChange={handleNumberChange}
            placeholder="98"
          />
          <Input
            label="Height (cm)"
            type="number"
            name="height"
            value={formData.height ?? ''}
            onChange={handleNumberChange}
            placeholder="170"
          />
          <Input
            label="Weight (kg)"
            type="number"
            name="weight"
            value={formData.weight ?? ''}
            onChange={handleNumberChange}
            placeholder="68"
          />
        </div>
      </CardContent>
    </Card>
  );
};

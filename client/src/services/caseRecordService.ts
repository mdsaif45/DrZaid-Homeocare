import api from './api';

export interface CaseRecord {
  id: number;
  patient_id: number;
  consultation_date: string;
  chief_complaints?: string;
  complaint_tags?: string[];
  complaint_duration?: string;
  past_history?: string;
  family_history?: string;
  surgical_history?: string;
  general_examination?: string;
  mental_state_examination?: string;
  clinical_notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up_notes?: string;
  next_follow_up_date?: string;
  vitals?: Vitals;
  investigations?: Investigation[];
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface Vitals {
  id: number;
  case_record_id: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  pulse_rate?: number;
  respiratory_rate?: number;
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  oxygen_saturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

export interface Investigation {
  id: number;
  case_record_id: number;
  investigation_type?: string;
  investigation_name?: string;
  notes?: string;
  findings?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  investigation_date?: string;
  uploaded_at: string;
  created_at: string;
}

export interface CreateCaseRecordData {
  patient_id: number;
  consultation_date?: string;
  chief_complaints?: string;
  complaint_tags?: string[];
  complaint_duration?: string;
  past_history?: string;
  family_history?: string;
  surgical_history?: string;
  general_examination?: string;
  mental_state_examination?: string;
  clinical_notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up_notes?: string;
  next_follow_up_date?: string;
}

export interface CreateVitalsData {
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  pulse_rate?: number;
  respiratory_rate?: number;
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  oxygen_saturation?: number;
  height?: number;
  weight?: number;
  notes?: string;
}

export interface CreateInvestigationData {
  investigation_type?: string;
  investigation_name?: string;
  notes?: string;
  findings?: string;
  investigation_date?: string;
}

class CaseRecordService {
  // ============= CASE RECORDS =============

  async getCaseRecordsByPatient(patientId: number): Promise<{ caseRecords: CaseRecord[]; count: number }> {
    const response = await api.get(`/case-records/patient/${patientId}`);
    return response.data.data;
  }

  async getCaseRecordById(id: number): Promise<CaseRecord> {
    const response = await api.get(`/case-records/${id}`);
    return response.data.data.caseRecord;
  }

  async createCaseRecord(data: CreateCaseRecordData): Promise<CaseRecord> {
    const response = await api.post('/case-records', data);
    return response.data.data.caseRecord;
  }

  async updateCaseRecord(id: number, data: Partial<CreateCaseRecordData>): Promise<CaseRecord> {
    const response = await api.put(`/case-records/${id}`, data);
    return response.data.data.caseRecord;
  }

  async deleteCaseRecord(id: number): Promise<void> {
    await api.delete(`/case-records/${id}`);
  }

  async searchByTags(tags: string[]): Promise<CaseRecord[]> {
    const response = await api.post('/case-records/search', { tags });
    return response.data.data.caseRecords;
  }

  async getRecentCaseRecords(limit: number = 10): Promise<CaseRecord[]> {
    const response = await api.get(`/case-records/recent?limit=${limit}`);
    return response.data.data.caseRecords;
  }

  // ============= VITALS =============

  async getVitalsByCaseRecord(caseRecordId: number): Promise<Vitals[]> {
    const response = await api.get(`/case-records/${caseRecordId}/vitals`);
    return response.data.data.vitals;
  }

  async createVitals(caseRecordId: number, data: CreateVitalsData): Promise<Vitals> {
    const response = await api.post(`/case-records/${caseRecordId}/vitals`, data);
    return response.data.data.vitals;
  }

  async updateVitals(id: number, data: Partial<CreateVitalsData>): Promise<Vitals> {
    const response = await api.put(`/vitals/${id}`, data);
    return response.data.data.vitals;
  }

  async deleteVitals(id: number): Promise<void> {
    await api.delete(`/vitals/${id}`);
  }

  // ============= INVESTIGATIONS =============

  async getInvestigationsByCaseRecord(caseRecordId: number): Promise<Investigation[]> {
    const response = await api.get(`/case-records/${caseRecordId}/investigations`);
    return response.data.data.investigations;
  }

  async createInvestigation(caseRecordId: number, data: CreateInvestigationData): Promise<Investigation> {
    const response = await api.post(`/case-records/${caseRecordId}/investigations`, data);
    return response.data.data.investigation;
  }

  async updateInvestigation(id: number, data: Partial<CreateInvestigationData>): Promise<Investigation> {
    const response = await api.put(`/investigations/${id}`, data);
    return response.data.data.investigation;
  }

  async deleteInvestigation(id: number): Promise<void> {
    await api.delete(`/investigations/${id}`);
  }
}

export default new CaseRecordService();

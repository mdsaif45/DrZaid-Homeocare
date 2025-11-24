import api from './api';

export interface Prescription {
  id: number;
  case_record_id?: number;
  patient_id: number;
  prescribed_by: number;
  remedy_name: string;
  potency?: string;
  dosage?: string;
  repetition?: string;
  instructions?: string;
  prescription_date: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  // Populated fields
  patient_name?: string;
  patient_case_id?: string;
  prescribed_by_name?: string;
  case_consultation_date?: string;
}

export interface CreatePrescriptionData {
  case_record_id?: number;
  patient_id: number;
  remedy_name: string;
  potency?: string;
  dosage?: string;
  repetition?: string;
  instructions?: string;
  prescription_date?: string;
  follow_up_date?: string;
}

export interface PrescriptionStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  upcomingFollowUps: number;
}

class PrescriptionService {
  // ============= PRESCRIPTIONS =============

  async getPrescriptionsByPatient(patientId: number): Promise<{ prescriptions: Prescription[]; count: number }> {
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return response.data.data;
  }

  async getPrescriptionsByCaseRecord(caseRecordId: number): Promise<{ prescriptions: Prescription[]; count: number }> {
    const response = await api.get(`/prescriptions/case-record/${caseRecordId}`);
    return response.data.data;
  }

  async getPrescriptionById(id: number): Promise<Prescription> {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data.data.prescription;
  }

  async createPrescription(data: CreatePrescriptionData): Promise<Prescription> {
    const response = await api.post('/prescriptions', data);
    return response.data.data.prescription;
  }

  async updatePrescription(id: number, data: Partial<CreatePrescriptionData>): Promise<Prescription> {
    const response = await api.put(`/prescriptions/${id}`, data);
    return response.data.data.prescription;
  }

  async deletePrescription(id: number): Promise<void> {
    await api.delete(`/prescriptions/${id}`);
  }

  async searchByRemedy(remedy: string): Promise<Prescription[]> {
    const response = await api.get(`/prescriptions/search?remedy=${encodeURIComponent(remedy)}`);
    return response.data.data.prescriptions;
  }

  async getRecentPrescriptions(limit: number = 10): Promise<Prescription[]> {
    const response = await api.get(`/prescriptions/recent?limit=${limit}`);
    return response.data.data.prescriptions;
  }

  async getUpcomingFollowUps(days: number = 7): Promise<Prescription[]> {
    const response = await api.get(`/prescriptions/follow-ups?days=${days}`);
    return response.data.data.followUps;
  }

  async getStats(): Promise<PrescriptionStats> {
    const response = await api.get('/prescriptions/stats');
    return response.data.data;
  }
}

export default new PrescriptionService();

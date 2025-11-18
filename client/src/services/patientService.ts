import api from './api';

export interface Patient {
  id: number;
  case_id: string;
  full_name: string;
  age?: number;
  gender?: string;
  contact_phone: string;
  contact_email?: string;
  occupation?: string;
  address?: string;
  lifestyle_habits?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientData {
  full_name: string;
  age?: number;
  gender?: string;
  contact_phone: string;
  contact_email?: string;
  occupation?: string;
  address?: string;
  lifestyle_habits?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

export interface PatientsResponse {
  patients: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PatientStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

class PatientService {
  /**
   * Get all patients with pagination and search
   */
  async getPatients(page: number = 1, limit: number = 20, search?: string): Promise<PatientsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/patients?${params}`);
    return response.data.data;
  }

  /**
   * Get patient by ID
   */
  async getPatientById(id: number): Promise<Patient> {
    const response = await api.get(`/patients/${id}`);
    return response.data.data.patient;
  }

  /**
   * Get patient by case ID
   */
  async getPatientByCaseId(caseId: string): Promise<Patient> {
    const response = await api.get(`/patients/case/${caseId}`);
    return response.data.data.patient;
  }

  /**
   * Create new patient
   */
  async createPatient(data: CreatePatientData): Promise<Patient> {
    const response = await api.post('/patients', data);
    return response.data.data.patient;
  }

  /**
   * Update patient
   */
  async updatePatient(id: number, data: Partial<CreatePatientData>): Promise<Patient> {
    const response = await api.put(`/patients/${id}`, data);
    return response.data.data.patient;
  }

  /**
   * Delete patient
   */
  async deletePatient(id: number): Promise<void> {
    await api.delete(`/patients/${id}`);
  }

  /**
   * Get patient statistics
   */
  async getStats(): Promise<PatientStats> {
    const response = await api.get('/patients/stats');
    return response.data.data.stats;
  }

  /**
   * Get recent patients
   */
  async getRecentPatients(limit: number = 10): Promise<Patient[]> {
    const response = await api.get(`/patients/recent?limit=${limit}`);
    return response.data.data.patients;
  }

  /**
   * Search patients
   */
  async searchPatients(criteria: {
    name?: string;
    phone?: string;
    caseId?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
  }): Promise<Patient[]> {
    const response = await api.post('/patients/search', criteria);
    return response.data.data.patients;
  }
}

export default new PatientService();

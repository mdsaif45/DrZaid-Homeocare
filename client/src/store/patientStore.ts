import { create } from 'zustand';
import patientService, { Patient, CreatePatientData, PatientsResponse, PatientStats } from '../services/patientService';

interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  stats: PatientStats | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPatients: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchPatientById: (id: number) => Promise<void>;
  createPatient: (data: CreatePatientData) => Promise<Patient>;
  updatePatient: (id: number, data: Partial<CreatePatientData>) => Promise<Patient>;
  deletePatient: (id: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  clearCurrentPatient: () => void;
  clearError: () => void;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  currentPatient: null,
  stats: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchPatients: async (page = 1, limit = 20, search) => {
    set({ isLoading: true, error: null });
    try {
      const response: PatientsResponse = await patientService.getPatients(page, limit, search);
      set({
        patients: response.patients,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch patients';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPatientById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const patient = await patientService.getPatientById(id);
      set({ currentPatient: patient, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch patient';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createPatient: async (data: CreatePatientData) => {
    set({ isLoading: true, error: null });
    try {
      const patient = await patientService.createPatient(data);
      set((state) => ({
        patients: [patient, ...state.patients],
        isLoading: false,
      }));
      return patient;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to create patient';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updatePatient: async (id: number, data: Partial<CreatePatientData>) => {
    set({ isLoading: true, error: null });
    try {
      const patient = await patientService.updatePatient(id, data);
      set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? patient : p)),
        currentPatient: state.currentPatient?.id === id ? patient : state.currentPatient,
        isLoading: false,
      }));
      return patient;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to update patient';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deletePatient: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await patientService.deletePatient(id);
      set((state) => ({
        patients: state.patients.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to delete patient';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchStats: async () => {
    try {
      const stats = await patientService.getStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  clearCurrentPatient: () => {
    set({ currentPatient: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

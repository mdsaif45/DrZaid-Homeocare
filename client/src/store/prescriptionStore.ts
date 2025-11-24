import { create } from 'zustand';
import prescriptionService, {
  Prescription,
  CreatePrescriptionData,
  PrescriptionStats,
} from '../services/prescriptionService';

interface PrescriptionState {
  prescriptions: Prescription[];
  currentPrescription: Prescription | null;
  stats: PrescriptionStats | null;
  followUps: Prescription[];
  isLoading: boolean;
  error: string | null;

  // Prescription Actions
  fetchPrescriptionsByPatient: (patientId: number) => Promise<void>;
  fetchPrescriptionsByCaseRecord: (caseRecordId: number) => Promise<void>;
  fetchPrescriptionById: (id: number) => Promise<void>;
  createPrescription: (data: CreatePrescriptionData) => Promise<Prescription>;
  updatePrescription: (id: number, data: Partial<CreatePrescriptionData>) => Promise<Prescription>;
  deletePrescription: (id: number) => Promise<void>;
  searchByRemedy: (remedy: string) => Promise<void>;
  fetchRecentPrescriptions: (limit?: number) => Promise<void>;
  fetchUpcomingFollowUps: (days?: number) => Promise<void>;
  fetchStats: () => Promise<void>;

  // Utility Actions
  clearCurrentPrescription: () => void;
  clearError: () => void;
}

export const usePrescriptionStore = create<PrescriptionState>((set, get) => ({
  prescriptions: [],
  currentPrescription: null,
  stats: null,
  followUps: [],
  isLoading: false,
  error: null,

  // ============= PRESCRIPTIONS =============

  fetchPrescriptionsByPatient: async (patientId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { prescriptions } = await prescriptionService.getPrescriptionsByPatient(patientId);
      set({ prescriptions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch prescriptions',
        isLoading: false,
      });
    }
  },

  fetchPrescriptionsByCaseRecord: async (caseRecordId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { prescriptions } = await prescriptionService.getPrescriptionsByCaseRecord(caseRecordId);
      set({ prescriptions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch prescriptions',
        isLoading: false,
      });
    }
  },

  fetchPrescriptionById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const prescription = await prescriptionService.getPrescriptionById(id);
      set({ currentPrescription: prescription, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch prescription',
        isLoading: false,
      });
    }
  },

  createPrescription: async (data: CreatePrescriptionData) => {
    set({ isLoading: true, error: null });
    try {
      const prescription = await prescriptionService.createPrescription(data);
      set((state) => ({
        prescriptions: [prescription, ...state.prescriptions],
        isLoading: false,
      }));
      return prescription;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create prescription',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePrescription: async (id: number, data: Partial<CreatePrescriptionData>) => {
    set({ isLoading: true, error: null });
    try {
      const prescription = await prescriptionService.updatePrescription(id, data);
      set((state) => ({
        prescriptions: state.prescriptions.map((p) => (p.id === id ? prescription : p)),
        currentPrescription: state.currentPrescription?.id === id ? prescription : state.currentPrescription,
        isLoading: false,
      }));
      return prescription;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update prescription',
        isLoading: false,
      });
      throw error;
    }
  },

  deletePrescription: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await prescriptionService.deletePrescription(id);
      set((state) => ({
        prescriptions: state.prescriptions.filter((p) => p.id !== id),
        currentPrescription: state.currentPrescription?.id === id ? null : state.currentPrescription,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete prescription',
        isLoading: false,
      });
      throw error;
    }
  },

  searchByRemedy: async (remedy: string) => {
    set({ isLoading: true, error: null });
    try {
      const prescriptions = await prescriptionService.searchByRemedy(remedy);
      set({ prescriptions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to search prescriptions',
        isLoading: false,
      });
    }
  },

  fetchRecentPrescriptions: async (limit: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      const prescriptions = await prescriptionService.getRecentPrescriptions(limit);
      set({ prescriptions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch recent prescriptions',
        isLoading: false,
      });
    }
  },

  fetchUpcomingFollowUps: async (days: number = 7) => {
    set({ isLoading: true, error: null });
    try {
      const followUps = await prescriptionService.getUpcomingFollowUps(days);
      set({ followUps, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch follow-ups',
        isLoading: false,
      });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await prescriptionService.getStats();
      set({ stats });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch stats' });
    }
  },

  // ============= UTILITY =============

  clearCurrentPrescription: () => set({ currentPrescription: null }),
  clearError: () => set({ error: null }),
}));

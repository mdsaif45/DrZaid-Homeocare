import { create } from 'zustand';
import caseRecordService, {
  CaseRecord,
  Vitals,
  Investigation,
  CreateCaseRecordData,
  CreateVitalsData,
  CreateInvestigationData,
} from '../services/caseRecordService';

interface CaseRecordState {
  caseRecords: CaseRecord[];
  currentCaseRecord: CaseRecord | null;
  isLoading: boolean;
  error: string | null;

  // Case Record Actions
  fetchCaseRecordsByPatient: (patientId: number) => Promise<void>;
  fetchCaseRecordById: (id: number) => Promise<void>;
  createCaseRecord: (data: CreateCaseRecordData) => Promise<CaseRecord>;
  updateCaseRecord: (id: number, data: Partial<CreateCaseRecordData>) => Promise<CaseRecord>;
  deleteCaseRecord: (id: number) => Promise<void>;
  searchByTags: (tags: string[]) => Promise<void>;

  // Vitals Actions
  createVitals: (caseRecordId: number, data: CreateVitalsData) => Promise<Vitals>;
  updateVitals: (id: number, data: Partial<CreateVitalsData>) => Promise<Vitals>;
  deleteVitals: (id: number) => Promise<void>;

  // Investigation Actions
  createInvestigation: (caseRecordId: number, data: CreateInvestigationData) => Promise<Investigation>;
  updateInvestigation: (id: number, data: Partial<CreateInvestigationData>) => Promise<Investigation>;
  deleteInvestigation: (id: number) => Promise<void>;

  // Utility Actions
  clearCurrentCaseRecord: () => void;
  clearError: () => void;
}

export const useCaseRecordStore = create<CaseRecordState>((set, get) => ({
  caseRecords: [],
  currentCaseRecord: null,
  isLoading: false,
  error: null,

  // ============= CASE RECORDS =============

  fetchCaseRecordsByPatient: async (patientId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { caseRecords } = await caseRecordService.getCaseRecordsByPatient(patientId);
      set({ caseRecords, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch case records',
        isLoading: false,
      });
    }
  },

  fetchCaseRecordById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const caseRecord = await caseRecordService.getCaseRecordById(id);
      set({ currentCaseRecord: caseRecord, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch case record',
        isLoading: false,
      });
    }
  },

  createCaseRecord: async (data: CreateCaseRecordData) => {
    set({ isLoading: true, error: null });
    try {
      const caseRecord = await caseRecordService.createCaseRecord(data);
      set((state) => ({
        caseRecords: [caseRecord, ...state.caseRecords],
        isLoading: false,
      }));
      return caseRecord;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create case record',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCaseRecord: async (id: number, data: Partial<CreateCaseRecordData>) => {
    set({ isLoading: true, error: null });
    try {
      const caseRecord = await caseRecordService.updateCaseRecord(id, data);
      set((state) => ({
        caseRecords: state.caseRecords.map((cr) => (cr.id === id ? caseRecord : cr)),
        currentCaseRecord: state.currentCaseRecord?.id === id ? caseRecord : state.currentCaseRecord,
        isLoading: false,
      }));
      return caseRecord;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update case record',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCaseRecord: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await caseRecordService.deleteCaseRecord(id);
      set((state) => ({
        caseRecords: state.caseRecords.filter((cr) => cr.id !== id),
        currentCaseRecord: state.currentCaseRecord?.id === id ? null : state.currentCaseRecord,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete case record',
        isLoading: false,
      });
      throw error;
    }
  },

  searchByTags: async (tags: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const caseRecords = await caseRecordService.searchByTags(tags);
      set({ caseRecords, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to search case records',
        isLoading: false,
      });
    }
  },

  // ============= VITALS =============

  createVitals: async (caseRecordId: number, data: CreateVitalsData) => {
    try {
      const vitals = await caseRecordService.createVitals(caseRecordId, data);
      // Update current case record with new vitals
      set((state) => {
        if (state.currentCaseRecord?.id === caseRecordId) {
          return {
            currentCaseRecord: {
              ...state.currentCaseRecord,
              vitals,
            },
          };
        }
        return state;
      });
      return vitals;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create vitals' });
      throw error;
    }
  },

  updateVitals: async (id: number, data: Partial<CreateVitalsData>) => {
    try {
      const vitals = await caseRecordService.updateVitals(id, data);
      // Update current case record with updated vitals
      set((state) => {
        if (state.currentCaseRecord?.vitals?.id === id) {
          return {
            currentCaseRecord: {
              ...state.currentCaseRecord,
              vitals,
            },
          };
        }
        return state;
      });
      return vitals;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to update vitals' });
      throw error;
    }
  },

  deleteVitals: async (id: number) => {
    try {
      await caseRecordService.deleteVitals(id);
      // Remove vitals from current case record
      set((state) => {
        if (state.currentCaseRecord?.vitals?.id === id) {
          return {
            currentCaseRecord: {
              ...state.currentCaseRecord,
              vitals: undefined,
            },
          };
        }
        return state;
      });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to delete vitals' });
      throw error;
    }
  },

  // ============= INVESTIGATIONS =============

  createInvestigation: async (caseRecordId: number, data: CreateInvestigationData) => {
    try {
      const investigation = await caseRecordService.createInvestigation(caseRecordId, data);
      // Add investigation to current case record
      set((state) => {
        if (state.currentCaseRecord?.id === caseRecordId) {
          return {
            currentCaseRecord: {
              ...state.currentCaseRecord,
              investigations: [investigation, ...(state.currentCaseRecord.investigations || [])],
            },
          };
        }
        return state;
      });
      return investigation;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create investigation' });
      throw error;
    }
  },

  updateInvestigation: async (id: number, data: Partial<CreateInvestigationData>) => {
    try {
      const investigation = await caseRecordService.updateInvestigation(id, data);
      // Update investigation in current case record
      set((state) => {
        if (state.currentCaseRecord?.investigations) {
          return {
            currentCaseRecord: {
              ...state.currentCaseRecord,
              investigations: state.currentCaseRecord.investigations.map((inv) =>
                inv.id === id ? investigation : inv
              ),
            },
          };
        }
        return state;
      });
      return investigation;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to update investigation' });
      throw error;
    }
  },

  deleteInvestigation: async (id: number) => {
    try {
      await caseRecordService.deleteInvestigation(id);
      // Remove investigation from current case record
      set((state) => {
        if (state.currentCaseRecord?.investigations) {
          return {
            currentCaseRecord: {
              ...state.currentCaseRecord,
              investigations: state.currentCaseRecord.investigations.filter((inv) => inv.id !== id),
            },
          };
        }
        return state;
      });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to delete investigation' });
      throw error;
    }
  },

  // ============= UTILITY =============

  clearCurrentCaseRecord: () => set({ currentCaseRecord: null }),
  clearError: () => set({ error: null }),
}));

import { create } from 'zustand';
import { OrchestratorResult } from '../types/agent';
import { runOrchestrator } from '../agents/AgentOrchestrator';

interface AgentStore {
  result: OrchestratorResult | null;
  isLoading: boolean;
  error: string | null;
  selectedProviderId: string | null;
  run: (query: string, budget?: number, location?: string) => Promise<void>;
  selectProvider: (id: string) => void;
  reset: () => void;
  addTrace: (trace: any) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  result: null,
  isLoading: false,
  error: null,
  selectedProviderId: null,

  run: async (query, budget, location) => {
    set({ isLoading: true, error: null });
    try {
      const result = await runOrchestrator(query, budget, location);
      set({ result, isLoading: false, selectedProviderId: result.selectedProvider?.provider.id ?? null });
    } catch (e: any) {
      set({ error: e.message ?? 'Pipeline error', isLoading: false });
    }
  },

  selectProvider: (id) => set({ selectedProviderId: id }),

  reset: () => set({ result: null, isLoading: false, error: null, selectedProviderId: null }),

  addTrace: (trace) => set((state) => {
    if (!state.result) return state;
    return {
      result: {
        ...state.result,
        traces: [...state.result.traces, trace],
      }
    };
  }),
}));

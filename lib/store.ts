import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LogItemType = 'transport' | 'diet' | 'energy' | 'scan' | 'other';

export interface LogItem {
  id: string;
  type: LogItemType;
  title: string;
  carbonValue: number; // in kg CO2e. Positive means footprint added, negative means saved.
  timestamp: number;
}

export interface Challenge {
  id: string;
  title: string;
  completed: boolean;
  impact: number; // negative value representing CO2e saved
}

export interface EcoStoreState {
  apiKey: string | null;
  hasCompletedOnboarding: boolean;
  baselineCarbon: number; // Daily baseline budget
  logs: LogItem[];
  challenges: Challenge[];
  
  // Actions
  setApiKey: (key: string | null) => void;
  completeOnboarding: (baseline: number) => void;
  resetOnboarding: () => void;
  addLog: (log: Omit<LogItem, 'id' | 'timestamp'>) => void;
  toggleChallenge: (id: string) => void;
  resetDailyLogs: () => void; // call this when a new day starts
}

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Unplug standby electronics', completed: false, impact: -0.5 },
  { id: 'c2', title: 'Meatless meal', completed: false, impact: -2.0 },
  { id: 'c3', title: 'Walk or bike instead of drive', completed: false, impact: -1.5 },
];

export const useEcoStore = create<EcoStoreState>()(
  persist(
    (set, get) => ({
      apiKey: null,
      hasCompletedOnboarding: false,
      baselineCarbon: 0,
      logs: [],
      challenges: DEFAULT_CHALLENGES,
      
      setApiKey: (key) => set({ apiKey: key }),
      
      completeOnboarding: (baseline) => set({ 
        hasCompletedOnboarding: true, 
        baselineCarbon: baseline,
        logs: [],
        challenges: DEFAULT_CHALLENGES,
      }),
      
      resetOnboarding: () => set({
        hasCompletedOnboarding: false,
        baselineCarbon: 0,
        logs: [],
      }),
      
      addLog: (log) => set((state) => ({
        logs: [
          ...state.logs,
          {
            ...log,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          }
        ]
      })),
      
      toggleChallenge: (id) => set((state) => ({
        challenges: state.challenges.map((c) =>
          c.id === id ? { ...c, completed: !c.completed } : c
        )
      })),
      
      resetDailyLogs: () => set((state) => ({
        logs: [],
        challenges: state.challenges.map(c => ({ ...c, completed: false }))
      }))
    }),
    {
      name: 'eco-track-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    }
  )
);

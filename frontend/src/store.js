import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // ── Participant ────────────────────────────────────────────────────────────
  // Stored after POST /api/Participant
  // { ParticipantId, Name, Email, avatar (client-only) }
  participant: null,
  setParticipant: (p) => set({ participant: p }),

  // ── Questions ─────────────────────────────────────────────────────────────
  // Each question from API: { QnId, QnInWords, ImageName, Options: string[] }
  questions: [],
  setQuestions: (q) => set({ questions: q }),

  // ── Quiz runtime state ────────────────────────────────────────────────────
  currentIndex: 0,
  // answers: [{ qnId: int, selectedIndex: int (0-based) }]
  answers: [],
  startTime: null,
  endTime: null,

  startQuiz: () =>
    set({ currentIndex: 0, answers: [], startTime: Date.now(), endTime: null }),

  // selectedIndex is 0-based (what the user clicked)
  recordAnswer: (qnId, selectedIndex) => {
    const answers = [...get().answers, { qnId, selectedIndex }];
    set({ answers });
  },

  nextQuestion: () => set((s) => ({ currentIndex: s.currentIndex + 1 })),

  finishQuiz: () => set({ endTime: Date.now() }),

  getTimeTaken: () => {
    const { startTime, endTime } = get();
    if (!startTime) return 0;
    return Math.round(((endTime || Date.now()) - startTime) / 1000);
  },

  // ── Results ───────────────────────────────────────────────────────────────
  // { score, total, timeTaken, breakdown: [{ qnId, correct, selectedIndex, correctIndex }] }
  results: null,
  setResults: (r) => set({ results: r }),

  // ── Reset ─────────────────────────────────────────────────────────────────
  resetGame: () =>
    set({
      currentIndex: 0,
      answers: [],
      startTime: null,
      endTime: null,
      results: null,
      questions: [],
    }),
}));

export default useGameStore;

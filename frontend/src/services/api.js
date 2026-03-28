import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL;
const API = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.title ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── POST /api/Participant ────────────────────────────────────────────────────
// Body  : { Name: string, Email: string }          (PascalCase matches C# model)
// Return: Participant { ParticipantId, Name, Email, Score, TimeTaken }
export const createParticipant = ({ name, email }) =>
  api.post('/Participant', { Name: name, Email: email }).then((r) => r.data);

// ── GET /api/Question ────────────────────────────────────────────────────────
// Returns 5 random questions:
//   [{ QnId, QnInWords, ImageName, Options: [opt1,opt2,opt3,opt4] }]
// NOTE: Answer is intentionally excluded from this response.
export const getQuestions = () =>
  api.get('/Question').then((r) => r.data);

// ── POST /api/Question/GetAnswers ────────────────────────────────────────────
// Body  : int[]  e.g. [1, 3, 7, 12, 20]
// Returns: [{ QnId, QnInWords, ImageName, Options, Answer }]
//   Answer is an int 1-4 representing the index of the correct option (1-based)
export const getAnswers = (qnIds) =>
  api.post('/Question/GetAnswers', qnIds).then((r) => r.data);

// ── PUT /api/Participant/{id} ────────────────────────────────────────────────
// Body: { ParticipantId: int, Score: int, TimeTaken: int }
// Returns 204 No Content on success
export const submitResult = (participantId, score, timeTaken) =>
  api
    .put(`/Participant/${participantId}`, {
      ParticipantId: participantId,
      Score: score,
      TimeTaken: timeTaken,
    })
    .then((r) => r.data);

// ── GET /api/Participant  (for leaderboard) ──────────────────────────────────
// Returns: [{ ParticipantId, Name, Email, Score, TimeTaken }]
export const getLeaderboard = () =>
  api.get('/Participant').then((r) => r.data);

export default api;

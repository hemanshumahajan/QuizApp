# ⚡ Ultimate Quiz Battle

A visually stunning, gamified quiz application — React frontend wired to ASP.NET Core + PostgreSQL backend.

---

## 🚀 Quick Start

### 1. Backend (ASP.NET Core)

```bash
# Make sure PostgreSQL is running with:
#   Host=localhost  Port=5432  Database=QuizDB  User=postgres  Password=Hemanshu@123
# (edit appsettings.json to change credentials)

dotnet ef migrations add Init   # first time only
dotnet ef database update        # creates tables
dotnet run                        # starts on http://localhost:5000
```

> ⚠️ **IMPORTANT** — Replace `Program.cs` in your backend project with the updated
> `Program.cs` included in this zip. It fixes CORS to allow the Vite dev server on
> port **5173** (the original only allowed port 3000).

### 2. Frontend (React + Vite)

```bash
npm install
npm run dev      # → http://localhost:5173
```

---

## 🔌 API Contract (exactly as implemented in backend)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/Participant` | `{ Name, Email }` | `{ ParticipantId, Name, Email, Score, TimeTaken }` |
| GET | `/api/Question` | — | `[{ QnId, QnInWords, ImageName, Options[] }]` (5 random) |
| POST | `/api/Question/GetAnswers` | `int[]` (array of QnIds) | `[{ QnId, QnInWords, ImageName, Options[], Answer }]` |
| PUT | `/api/Participant/{id}` | `{ ParticipantId, Score, TimeTaken }` | 204 No Content |
| GET | `/api/Participant` | — | `[{ ParticipantId, Name, Email, Score, TimeTaken }]` |

### Key data shapes to know

- **`Answer` is a 1-based integer** (1 = Options[0], 2 = Options[1], 3 = Options[2], 4 = Options[3])
- **`Options`** is a `string[]` of length 4, built from `Option1..Option4` columns
- **Question images** are served from `/Images/<ImageName>` on the backend (e.g. `http://localhost:5000/Images/q1.png`)
- **`POST /api/Question/GetAnswers`** body is a raw JSON array: `[1, 3, 7]` — NOT an object wrapper

---

## 📁 Frontend Structure

```
src/
├── components/
│   ├── ParticlesBackground.jsx  – animated floating shapes
│   ├── QuestionCard.jsx         – displays QnInWords + ImageName
│   ├── OptionButton.jsx         – color-coded answers with ripple
│   ├── Timer.jsx                – SVG ring countdown (red shake ≤5s)
│   ├── ProgressBar.jsx          – shimmer progress bar
│   └── SkeletonLoader.jsx       – loading skeleton
├── pages/
│   ├── Home.jsx                 – landing / intro
│   ├── Register.jsx             – POST /api/Participant
│   ├── Quiz.jsx                 – main game loop
│   ├── Result.jsx               – score + confetti
│   └── Leaderboard.jsx          – GET /api/Participant ranked
├── services/api.js              – all Axios calls
├── store.js                     – Zustand state (participant, questions, answers)
└── App.jsx                      – router + AnimatePresence
```

---

## 🎮 Game Flow

```
Home → Register (POST Participant) → Quiz (GET Questions → POST GetAnswers per Q)
     → Result (PUT Participant score) → Leaderboard (GET Participants)
```

### Scoring logic

The backend's `Answer` field stores a **1-based index**:
```
Answer = 1  →  Options[0] is correct
Answer = 2  →  Options[1] is correct
Answer = 3  →  Options[2] is correct
Answer = 4  →  Options[3] is correct
```

The frontend converts this with `correctIndex = Answer - 1` when comparing against the user's 0-based `selectedIndex`.

---

## ⚙️ Config

| Setting | File | Value |
|---------|------|-------|
| API base URL | `src/services/api.js` | `http://localhost:5000` |
| Timer per question | `src/pages/Quiz.jsx` | `const QUESTION_TIME = 30` |
| DB connection | `appsettings.json` | `ConnectionStrings.DevConnection` |

# NoteHub Backend System ⚙️

Complete production-ready backend for the NoteHub mobile app. Built with Node.js, Express, MongoDB, and Firebase Firestore.

## 🚀 Tech Stack
- **Authentication:** Firebase Auth (ID Token Verification)
- **Framework:** Node.js + Express
- **Database (Global):** MongoDB (Mongoose)
- **Database (Profile):** Firebase Firestore
- **Deployment:** Vercel (Serverless)

## 📁 Project Structure
- `/api`: Vercel entry point
- `/auth`, `/profile`, `/schedule`, ...: Modular feature folders containing routes and controllers
- `/models`: MongoDB schemas
- `/middleware`: Auth and Error handling layers
- `/utils`: Database connections and helpers
- `/firebase`: Admin SDK configuration

## 🔐 Auth Flow
- Login handled via Firebase on the frontend.
- Backend receives `POST /auth/firebase` with `idToken`.
- Verification via Firebase Admin SDK.
- First-time login automatically creates a profile in Firestore using `class` and `stream` metadata.

## 📡 API Endpoints
- **Profile:** `GET /profile`, `PUT /profile/update`
- **Modules:**
  - Schedule: `GET /schedule?studentClass={class}`
  - Subjects: `GET /subjects?studentClass={class}`
  - Notes: `GET /notes`, `GET /notes/view/:id` (Secure PDF)
  - Assignments: `GET /assignments`, `POST /assignments/submit`
  - Exam: `GET /exam-timetable?studentClass={class}`
  - Notifications: `GET /notifications`
  - Feedback: `POST /feedback`

## 🛠️ Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Start locally: `npm start`
5. Deploy to Vercel: `vercel deploy`

## 🔐 Security
- Helmet for HTTP head protection.
- CORS configured for secure origins.
- All protected routes verified via `FirebaseBearerToken`.
- Local logging with Winston.

## 📦 Response Format
```json
{
  "success": true,
  "message": "Dynamic Message",
  "data": {}
}
```

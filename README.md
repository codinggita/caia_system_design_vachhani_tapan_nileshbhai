# 🚀 CAIA System Design Knowledge Base

## 🔗 Important Links
- 🖥️ **Live Frontend App (Vercel)**: [https://caiasystemdesign.vercel.app/](https://caiasystemdesign.vercel.app/)
- ⚙️ **Live Backend API (Render)**: [https://caia-system-design-backend.onrender.com/](https://caia-system-design-backend.onrender.com/)
- 💻 **GitHub Repository**: [https://github.com/Vachhani-Tapan/caia_system_design](https://github.com/Vachhani-Tapan/caia_system_design)
- 📂 **Dataset (Google Drive)**: [https://drive.google.com/file/d/1um-ZWp-i2SnDgYC1kOV2BOPcYhzInejV/view?usp=sharing](https://drive.google.com/file/d/1um-ZWp-i2SnDgYC1kOV2BOPcYhzInejV/view?usp=sharing)

---

**Caia** is a premium, high-performance System Design Knowledge Base platform designed to provide a comprehensive repository of architectural concepts, patterns, and analytics. Built with a robust MERN stack, it features a dual-dashboard system for both Administrators and Users, enabling seamless exploration and management of complex system design topics. 

---

## 🚀 Tech Stack

### Backend (The Core)
- **Runtime**: Node.js (Event-driven architecture)
- **Framework**: Express.js (RESTful API Design)
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (JSON Web Tokens) with Bcrypt hashing
- **Performance**: MongoDB Indexing
- **Validation**: Custom Middleware

### Frontend (The Interface)
- **Build Tool**: Vite
- **Library**: React.js
- **Styling**: Tailwind CSS & Material UI (MUI)
- **State Management**: Redux Toolkit
- **API Client**: Axios with Interceptors
- **Charts**: Recharts
- **SEO**: React Helmet & Dynamic Meta Tags

---

## 🗄️ Database Schema (MongoDB/Mongoose)

### 1. Concept Model (Knowledge Base)
```javascript
{
  title: { type: String, required: true, index: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true }, // Markdown Content
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  questionType: { type: String, enum: ['design', 'theory', 'practical'] },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], index: true },
  tags: [{ type: String, index: true }],
  views: { type: Number, default: 0 },
  bookmarksCount: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false },
  versionHistory: [{
    version: Number,
    content: String,
    updatedAt: Date
  }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}
```

### 2. User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Concept' }]
}
```

### 3. Analytics & Interaction Models
- **Notes**: `{ userId, conceptId, content, createdAt }`
- **Votes**: `{ userId, conceptId, type: ['upvote', 'downvote'] }`
- **Audit Logs**: `{ action, userId, details, timestamp }`

---

## 🛠️ API Documentation (v1)

### Knowledge Base CRUD
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/concepts` | Fetch all system design concepts |
| `GET` | `/api/v1/concepts/:id` | Fetch single concept details |
| `POST` | `/api/v1/concepts` | Create new architecture concept |
| `PUT` | `/api/v1/concepts/:id` | Replace complete concept |
| `PATCH` | `/api/v1/concepts/:id` | Update specific concept fields |
| `DELETE` | `/api/v1/concepts/:id` | Delete concept record |

### Search & Discovery
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/search?q=scaling` | Global keyword search |
| `GET` | `/api/v1/search/fuzzy?q=kafaka` | Fuzzy search (Regex based) |
| `GET` | `/api/v1/discovery/trending` | Fetch trending architecture topics |
| `GET` | `/api/v1/discovery/roadmap/backend` | Backend learning roadmap |

---

## 📅 Project Timeline & Checklists

### 🏗️ Phase 1: Backend
- [ ] **Setup**: Express, MongoDB Connection, MVC Structure.
- [ ] **Schema**: Concept, User, Category, Tag, Pattern modeling.
- [ ] **Auth**: JWT Register/Login/Logout & Profile.
- [ ] **CRUD**: Full Concept management with validation.
- [ ] **Advanced**: Fuzzy Search, Pagination, Filtering.
- [ ] **Analytics**: Aggregation pipelines for dashboard stats.
- [ ] **Performance**: Field indexing and optimized queries.

### 🎨 Phase 2: Frontend
- [ ] **Setup**: Vite, Tailwind, MUI, Redux Toolkit.
- [ ] **Dashboards**: Responsive layouts for Admin and User.
- [ ] **Integration**: Axios interceptors and centralized API services.
- [ ] **Features**: Real-time CRUD UI, Search Filters, Pagination.
- [ ] **Analytics**: Data visualization using charts.
- [ ] **SEO**: Dynamic titles and meta tags for all routes.

---

## 📁 Folder Structure

```text
caia_system_design/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Dashboard Screens
│   │   ├── store/          # Redux Slices
│   │   ├── services/       # API Layer
│   │   └── theme/          # MUI/Tailwind config
├── server/                 # Backend (Node + Express)
│   ├── config/             # DB & Env configs
│   ├── controllers/        # Request Handlers
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Endpoints
│   ├── middlewares/        # Auth & Logger
│   └── services/           # Business Logic
└── README.md               # You are here
```

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vachhani-Tapan/caia_system_design.git
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Create .env file with MONGO_URI and JWT_SECRET
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 🛠️ Summary of Recent Platform Optimizations & Fixes

During the recent iteration, the following improvements and fixes were successfully implemented across the codebase:

### 1. Database & Schema Cleanups
* **Removed 'Easy' Option**: Deprecated and deleted the `"easy"` difficulty tier across backend validators (`validationController.js`), models (`Concept.js`), seed scripts, and frontend dropdown filters.
* **Auto-Migration**: Integrated automatic startup database migrations in `db.js` that normalize any legacy `"easy"` concepts to `"beginner"`.
* **Seed Profiles**: Configured auto-seeding of standard user (`user@caia.com` / `user1234`) and admin (`admin@caia.com` / `admin1234`) testing profiles.

### 2. UI Robustness & Field Normalization
* **Metadata Fallbacks**: Solved the "empty yellow boxes" layout issue by adding fallbacks to normalize concepts that store fields inside the `metadata` object rather than root level (`category`, `subcategory`, `difficulty`, `questionType`).
* **Pagination Resolution**: Patched a bug causing multiple pages to not load by aligning the frontend total pages calculation with the backend paginator output (`res.data.pages` fallback).
* **React child error #31 fix**: Added a `getErrorMessage` utility in `LoginPage.jsx` and `Dashboard.jsx` to parse object-based gateway errors (such as 502 Bad Gateway payloads) into string formats, avoiding fatal client crashes.

### 3. Server Route Adjustments
* **Welcome Endpoint**: Created a descriptive JSON welcome page at the backend's root `/` route.
* **Router Order Priority**: Moved the root endpoint declaration before mounted router modules to prevent interception issues and false `"unauthorized"` errors on load.

### 4. Cross-Origin Deployment Integration
* **Dynamic CORS**: Updated backend CORS configuration to dynamically authorize the `FRONTEND_URL` origin with full credentials support, stripping trailing slashes automatically to prevent browser preflight blocks.
* **Dynamic API Routing**: Configured the frontend client Axios instance to dynamically resolve to `import.meta.env.VITE_API_URL`, fallback to the live Render backend URL in production, or route to Vite's dev server proxy in development.
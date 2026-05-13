# 🚀 CAIA System Design Knowledge Base

## 🔗 Important Links
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
   git clone https://github.com/your-username/caia-system-design.git
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
# SkillSync - AI-Powered Career Development Platform

<div align="center">

![SkillSync](https://img.shields.io/badge/SkillSync-Career%20Development-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-brightgreen?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge)

**An intelligent platform that analyzes student profiles and provides personalized career guidance, skill pathways, portfolio recommendations, and industry demand insights using AI.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Configuration](#-configuration) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Python Scripts](#-python-scripts)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

SkillSync is a comprehensive career development platform that leverages AI to help students and professionals:
- Analyze their profile (resume, transcripts, certificates, GitHub, personality)
- Get personalized career recommendations
- Understand industry demand and job market trends
- Receive skill pathway recommendations
- Build portfolios with AI-guided project suggestions
- Discover career roles aligned with their profile

---

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure signup, login, email verification
- 👤 **Profile Analysis** - AI-powered analysis of resume, transcripts, certificates, and GitHub
- 🎭 **Personality Assessment** - RIASEC-based personality profiling
- 📊 **Industry Demand** - Real-time job market analysis by location
- 🎯 **Career Role Suggestions** - AI-recommended career paths based on profile and market data
- 📚 **Skill Pathways** - Personalized learning roadmaps for target careers
- 💼 **Portfolio Builder** - 3-step project roadmap for portfolio development
- 📖 **Course Recommendations** - Tailored course suggestions based on profile

### Dashboard Features
- 📈 **Dashboard Home** - Overview of profile and recommendations
- 🔍 **Explore** - Access all AI tools and features
- 📢 **Industry Demand** - Interactive job market insights with location-based analysis
- ⚙️ **Settings** - Account management and preferences

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Three.js** - 3D graphics
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **Firebase Admin** - Firebase integration
- **Multer** - File uploads
- **Helmet** - Security headers
- **Nodemailer** - Email service

### AI/ML
- **Google Gemini 2.5 Flash** - LLM for analysis
- **LangChain** - AI framework
- **LangGraph** - Workflow orchestration
- **Python 3.8+** - Script execution

### Services & APIs
- **Serper API** - Web search for industry data
- **Firebase** - Authentication & storage
- **MongoDB Atlas** - Cloud database (optional)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** (local or Atlas cluster) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Python Packages
```bash
pip install langchain langchain-google-genai langgraph pydantic python-dotenv requests
```

### API Keys Required
- Google Gemini API Key
- Serper API Key (for industry demand analysis)
- MongoDB connection string
- Firebase credentials (for authentication)
- Email service credentials (for nodemailer)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Devfund
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Python Dependencies

```bash
# In the root directory
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, install packages manually:

```bash
pip install langchain langchain-google-genai langgraph pydantic python-dotenv requests
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
CLIENT_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/skillsync
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsync

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Google Gemini API
GOOGLE_API_KEY=your-google-gemini-api-key

# Serper API (for industry demand)
SERPER_API_KEY=your-serper-api-key

# Email Configuration (for nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Firebase Configuration (optional, if using Firebase auth)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### Python Environment Variables

Create a `.env` file in the root directory (for Python scripts):

```env
GOOGLE_API_KEY=your-google-gemini-api-key
SERPER_API_KEY=your-serper-api-key
```

---

## 🏃 Running the Application

### 1. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# OR
mongod --dbpath /path/to/data
```

**MongoDB Atlas:** No local setup needed, just use your connection string.

### 2. Start Backend Server

```bash
cd backend
npm run dev  # Development mode with nodemon
# OR
npm start    # Production mode
```

Backend will run on `http://localhost:3000`

### 3. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
Devfund/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   ├── analysisController.js
│   │   │   ├── industryDemandController.js
│   │   │   └── careerRoleController.js
│   │   ├── models/            # Mongoose models
│   │   │   ├── userModel.js
│   │   │   ├── studentResultModel.js
│   │   │   ├── analysisModel.js
│   │   │   └── industryDemandModel.js
│   │   ├── routes/            # Express routes
│   │   │   ├── authRoutes.js
│   │   │   ├── studentRoutes.js
│   │   │   ├── analysisRoutes.js
│   │   │   ├── industryDemandRoutes.js
│   │   │   └── careerRoleRoutes.js
│   │   ├── middlewares/      # Custom middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── sanitize.js
│   │   │   └── rateLimit.js
│   │   └── lib/              # Utilities
│   │       ├── db.js
│   │       ├── firebase.js
│   │       └── utils.js
│   ├── uploads/              # User uploads (resume, transcripts, etc.)
│   ├── tmp/                  # Temporary files
│   ├── index.js              # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardHome.jsx
│   │   │   │   ├── Explore.jsx
│   │   │   │   ├── Notification.jsx (Industry Demand)
│   │   │   │   └── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ...
│   │   ├── Store/            # State management
│   │   │   └── AuthStore.js
│   │   ├── lib/              # Utilities
│   │   │   ├── Axios.js
│   │   │   └── firebase.js
│   │   └── App.jsx           # Main app component
│   ├── public/               # Static assets
│   ├── vite.config.js
│   └── package.json
│
├── Python Scripts/          # AI analysis scripts
│   ├── jobDemand.py         # Industry demand analysis
│   ├── CareerRole.py        # Career role suggestions
│   ├── portfolioBuilder.py  # Portfolio recommendations
│   ├── skillpath.py         # Skill pathways
│   ├── course.py            # Course recommendations
│   ├── resume.py             # Resume analysis
│   ├── transcript.py        # Transcript analysis
│   ├── certificate.py       # Certificate analysis
│   ├── github.py            # GitHub analysis
│   └── personality.py       # Personality assessment
│
└── README.md
```

---

## 📡 API Documentation

### Authentication Routes

**Base URL:** `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | User registration | No |
| POST | `/login` | User login | No |
| POST | `/logout` | User logout | No |
| POST | `/google` | Google OAuth login | No |
| POST | `/verifyemail` | Verify email address | Yes |
| POST | `/forgotpassword` | Request password reset | No |
| POST | `/resetpassword/:token` | Reset password | No |
| GET | `/check` | Check authentication status | Yes |

### Student Routes

**Base URL:** `/api/students`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/analyse-five` | Generate student profile | Yes |
| GET | `/latest` | Get latest student result | Yes |
| POST | `/skill-pathway` | Generate skill pathway | Yes |
| POST | `/course-recommendations` | Get course recommendations | Yes |
| POST | `/portfolio-builder` | Generate portfolio roadmap | Yes |

### Analysis Routes

**Base URL:** `/api/analysis`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload resume/transcript/certificate | Yes |
| POST | `/process` | Process existing uploads | Yes |
| GET | `/latest` | Get latest analysis | Yes |
| POST | `/personality` | Run personality assessment | Yes |
| GET | `/personality/instructions` | Get personality test instructions | Yes |

### Industry Demand Routes

**Base URL:** `/api/industry-demand`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/latest?location=India` | Get latest industry demand data | Yes |
| POST | `/run` | Generate industry demand analysis | Yes |

### Career Role Routes

**Base URL:** `/api/career-role`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/suggest` | Get career role suggestions | Yes |

---

## 🐍 Python Scripts

All Python scripts accept command-line arguments and output JSON:

### jobDemand.py
Analyzes industry demand for a given location.

```bash
python jobDemand.py "India"
# OR
python jobDemand.py "United States"
```

### CareerRole.py
Suggests career roles based on profile and industry data.

```bash
python CareerRole.py '<job_analysis_json>' '<user_profile_json>'
```

### portfolioBuilder.py
Generates a 3-step portfolio roadmap.

```bash
python portfolioBuilder.py <profile_text_file_path>
```

### Other Scripts
- `resume.py <resume_image_path>` - Analyze resume
- `transcript.py <transcript_image_path>` - Analyze transcript
- `certificate.py <certificate_image_path>` - Analyze certificate
- `github.py <github_url>` - Analyze GitHub profile
- `personality.py <riasec_code>` - Personality assessment
- `skillpath.py <target_career>` - Skill pathway generation
- `course.py` - Course recommendations

---

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: MongoDB connection error
```
**Solution:** 
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env` is correct
- Ensure MongoDB is accessible from your network

**2. Python Module Not Found**
```
ModuleNotFoundError: No module named 'langchain'
```
**Solution:**
```bash
pip install langchain langchain-google-genai langgraph pydantic python-dotenv requests
```

**3. Google Gemini API Error**
```
Error: GOOGLE_API_KEY not set
```
**Solution:**
- Add `GOOGLE_API_KEY` to backend `.env` and root `.env`
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

**4. CORS Error**
```
Access to fetch blocked by CORS policy
```
**Solution:**
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `backend/index.js`

**5. JWT Token Expired**
```
Error: jwt expired
```
**Solution:**
- Log out and log back in
- Check `JWT_EXPIRE` in backend `.env`

**6. File Upload Issues**
```
Error: Multer error
```
**Solution:**
- Ensure `uploads/` directory exists
- Check file size limits
- Verify file formats are supported (PNG, JPG, JPEG, WEBP)

---

## 📝 Usage Examples

### 1. Complete Profile Analysis Flow

1. **Sign Up / Login**
   - Register a new account or login
   - Verify your email address

2. **Upload Documents**
   - Go to Explore → Upload resume, transcript, and certificate
   - Add your GitHub URL

3. **Generate Profile**
   - Click "Analyse five" in Explore
   - Wait for AI analysis to complete

4. **Get Recommendations**
   - **Skill Pathways:** Enter target career → Click "Skill Pathways"
   - **Course Recommendations:** Click "Course recommendation"
   - **Portfolio Builder:** Click "Portfolio builder"

### 2. Industry Demand Analysis

1. **Navigate to Industry Demand**
   - Go to dashboard → "Industry Demand" (bell icon)

2. **Select Location**
   - Choose location from dropdown (default: India)
   - Click "Analyze"

3. **View Results**
   - Job demand statistics
   - Salary insights
   - Skills trends
   - Market summary

### 3. Career Role Suggestions

1. **Generate Industry Demand Data**
   - First, analyze industry demand for your location

2. **Get Career Roles**
   - Go to Explore → Click "Career Role"
   - Enter location when prompted
   - View suggested career roles with:
     - Role name
     - Market trend
     - Salary range
     - Skills to learn

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Write tests when possible
- Ensure all environment variables are documented

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Raaj Hackathon Build** - Initial work

---

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- LangChain for AI framework
- MongoDB for database
- React community for excellent tools
- All contributors and users

---

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

## 🗺 Roadmap

- [ ] Enhanced UI/UX improvements
- [ ] Additional AI models support
- [ ] Real-time collaboration features
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with job boards
- [ ] Resume builder tool
- [ ] Interview preparation features

---

<div align="center">

**Made with ❤️ for students and professionals**

⭐ Star this repo if you find it helpful!

</div>


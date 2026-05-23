# 🧠 HR Attrition AI — Employee Attrition Prediction System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1.2-000000?style=for-the-badge&logo=flask&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.8.0-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**An AI-powered HR Analytics platform that predicts employee attrition using Machine Learning.**
Built with Flask + Random Forest Classifier + Modern Dark/Light Glassmorphism UI.

[🚀 Live Demo](#-deploy-on-render) • [📖 Docs](#-how-to-use) • [⚙️ Setup](#-local-setup)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [4 Role System](#-4-role-system)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Login Credentials](#-login-credentials)
- [How to Use](#-how-to-use)
- [Excel Format](#-excel-file-format)
- [Deploy on Render](#-deploy-on-render)
- [Theme System](#-theme-system)

---

## 🌟 Overview

HR Attrition AI is a full-stack machine learning web application that helps HR teams predict which employees are at risk of leaving the company. It uses a **Random Forest Classifier** trained on employee data to provide real-time predictions with confidence scores and actionable recommendations.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Role-based Login** | 4 distinct roles — Admin, Manager, HR Lead, User |
| 📊 **Admin Dashboard** | 8 stat cards, upload dataset, train ML model, manage all users |
| 👔 **Manager Dashboard** | View team risk levels, team attrition chart, run predictions |
| 📋 **HR Lead Dashboard** | Full prediction history, outcome charts, confidence analysis |
| 🔮 **Prediction Tool** | Real-time AI prediction with probability ring & recommendations |
| 📈 **Analytics Reports** | Bar, Line, Pie, Doughnut charts with dynamic column selection |
| 🌙 **Dark / Light Theme** | Toggle on ALL pages, saved in localStorage |
| 📁 **Excel Upload** | Drag & drop .xlsx upload with auto model training |
| 🎨 **Modern UI** | Glassmorphism, particles, gradient cards, smooth animations |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 👥 4 Role System

### 🔴 Admin
- Full system access
- Upload Excel dataset & train ML model
- View all 8 dashboard stats (model status, accuracy, features, users, predictions, roles, algorithm, system)
- Manage all 4 users with role badges
- Access Analytics Reports
- Navigate to all other dashboards

### 🟠 Manager (`manager / manager123`)
- View own team members with risk levels (High / Medium / Low)
- Team risk distribution doughnut chart
- See own prediction history
- Run predictions for team members
- Manager action guide for each risk level

### 🟢 HR Lead (`hr_lead / hr123`)
- View **ALL** predictions across the entire organization
- Prediction outcome chart (Leave vs Stay)
- Confidence level bar chart
- Full prediction history table with timestamps
- HR insights — attrition rate, retention rate, high confidence count

### 🔵 User (`user / user123`)
- Employee attrition prediction form
- Dynamic form fields based on trained model
- AI result with probability ring, progress bar
- Actionable recommendations (5 points for leave, 5 for stay)
- Print prediction result

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.12, Flask 3.1.2 |
| **ML Model** | Scikit-Learn — Random Forest Classifier |
| **Data Processing** | Pandas 3.0, NumPy 2.4 |
| **Frontend** | HTML5, CSS3, Bootstrap 5.3 |
| **Charts** | Chart.js 4.4 |
| **Animations** | Particles.js, CSS Keyframes |
| **Icons** | Font Awesome 6.4 |
| **Fonts** | Google Fonts — Poppins |
| **Deployment** | Render (Gunicorn) |

---

## 📁 Project Structure

```
HR_Attrition_Full_Project_Login/
│
├── backend/
│   ├── static/
│   │   ├── style.css              # Global dark/light theme CSS
│   │   ├── admin.js               # Admin JS (upload, drag-drop, retrain)
│   │   └── user.js                # Prediction form JS (validate, result)
│   │
│   ├── templates/
│   │   ├── login.html             # Login — particles + dark/light toggle
│   │   ├── admin_dashboard.html   # Admin — 8 stats, upload, model, users
│   │   ├── manager_dashboard.html # Manager — team risk, chart, predictions
│   │   ├── hr_dashboard.html      # HR Lead — full history, charts, insights
│   │   ├── user_dashboard.html    # User — prediction form + AI result
│   │   └── admin_reports.html     # Analytics — dynamic charts
│   │
│   ├── uploads/                   # Uploaded Excel files (auto-created)
│   ├── app.py                     # Flask app — all routes + ML logic
│   ├── model.pkl                  # Trained ML model (auto-generated)
│   └── Procfile                   # Gunicorn start command
│
├── requirements.txt               # Python dependencies
├── render.yaml                    # Render deployment config
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/hr-attrition-ai.git
cd hr-attrition-ai
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the app
```bash
cd backend
py -3.12 app.py
```

### 4. Open in browser
```
http://localhost:5000
```

---

## 🔑 Login Credentials

| Username | Password | Role | Access |
|---|---|---|---|
| `admin` | `admin123` | 🔴 Admin | Full system access |
| `manager` | `manager123` | 🟠 Manager | Team reports & predictions |
| `hr_lead` | `hr123` | 🟢 HR Lead | All prediction history |
| `user` | `user123` | 🔵 User | Prediction tool only |

---

## 📖 How to Use

### 🔴 Admin Flow
```
1. Login → admin / admin123
2. Dashboard → View 8 stat cards
3. Upload Dataset → Drag & drop .xlsx file → Auto trains model
4. Model Info → View accuracy & features
5. Manage Users → View all 4 users with roles
6. Analytics Reports → Generate interactive charts
7. Navigate to Manager / HR Lead / User dashboards
```

### 🟠 Manager Flow
```
1. Login → manager / manager123
2. View team members with risk levels (High/Medium/Low)
3. See team risk distribution chart
4. Click Predict on any team member
5. View own prediction history
```

### 🟢 HR Lead Flow
```
1. Login → hr_lead / hr123
2. View all predictions across organization
3. See outcome chart (Leave vs Stay)
4. See confidence level chart
5. Full prediction history table with timestamps
6. View HR insights — attrition rate, retention rate
```

### 🔵 User Flow
```
1. Login → user / user123
2. Fill employee details in the form
3. Click "Predict Attrition Risk"
4. View AI result — probability ring + confidence badge
5. Read recommendations (5 action points)
6. Print result or make new prediction
```

---

## 📊 Excel File Format

Your `.xlsx` file must contain:

| Column | Type | Required |
|---|---|---|
| `Attrition` | Yes / No | ✅ Required |
| `Department` | Sales / Research & Development / Human Resources | ✅ Required |
| `JobRole` | Sales Executive / Research Scientist / etc. | ✅ Required |
| `Age` | Number (18–70) | Optional |
| `MonthlyIncome` | Number | Optional |
| `YearsAtCompany` | Number | Optional |
| `JobSatisfaction` | 1–5 | Optional |
| `OverTime` | Yes / No | Optional |
| `Gender` | Male / Female | Optional |
| `MaritalStatus` | Single / Married / Divorced | Optional |

> Any additional numeric or categorical columns are automatically processed by the ML pipeline.

---

## 🌐 Deploy on Render

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — HR Attrition AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hr-attrition-ai.git
git push -u origin main
```

### Step 2 — Deploy on Render
1. Go to **[render.com](https://render.com)** → Login with GitHub
2. Click **New → Web Service**
3. Select your repository
4. Configure:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r ../requirements.txt` |
| Start Command | `gunicorn app:app` |

5. Click **Create Web Service**
6. Live in 2-3 minutes at `https://hr-attrition-ai.onrender.com`

> ⚠️ After deploy, login as **admin** and re-upload the Excel file to retrain the model. `.pkl` files don't persist on Render free tier restarts.

---

## 🎨 Theme System

| Mode | Description |
|---|---|
| 🌙 **Dark Mode** | Default — dark purple glassmorphism with particles |
| ☀️ **Light Mode** | Clean white / light purple theme |

- Toggle button in **navbar on ALL 6 pages**
- Theme saved in **localStorage** — persists on page reload
- Smooth CSS transition between modes
- All components fully styled for both modes

---

## 📦 Dependencies

```
Flask==3.1.2
scikit-learn==1.8.0
pandas==3.0.0
numpy==2.4.2
openpyxl==3.1.2
Werkzeug==3.1.3
gunicorn==21.2.0
```

---

## 🔒 Security Notes

- Session-based authentication
- Role-based route protection
- File upload validation (`.xlsx` only, 16MB max)
- Input validation on all prediction fields

---

## 📄 License

This project is built for **educational purposes**.

---

<div align="center">

### 🌟 Project Pages

| Page | Role | URL |
|---|---|---|
| Login | All | `/login` |
| Admin Dashboard | Admin | `/admin/dashboard` |
| Manager Dashboard | Manager | `/manager/dashboard` |
| HR Lead Dashboard | HR Lead | `/hr/dashboard` |
| Prediction Tool | User/All | `/user/dashboard` |
| Analytics Reports | Admin | `/admin/reports` |

---

Made with ❤️ using **Flask** + **Scikit-Learn** + **Bootstrap 5**

⭐ **Star this repo if you found it helpful!**

</div>

# 🧠 HR Attrition AI — Employee Attrition Prediction System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1.2-000000?style=for-the-badge&logo=flask&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.8.0-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

**An AI-powered HR Analytics platform that predicts employee attrition using Machine Learning.**  
Built with Flask + Random Forest Classifier + Modern Dark/Light UI.

</div>

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Local Setup](#-local-setup)
- [Login Credentials](#-login-credentials)
- [How to Use](#-how-to-use)
- [Excel Format](#-excel-file-format)
- [Deploy on Render](#-deploy-on-render)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Role-based Login | Admin & User roles with session management |
| 📊 Admin Dashboard | Upload dataset, train ML model, manage users |
| 🤖 ML Model | Random Forest Classifier with live accuracy display |
| 🔮 Prediction Tool | Real-time employee attrition risk prediction |
| 📈 Analytics Reports | Interactive Bar, Line, Pie, Doughnut charts |
| 🌙 Dark / Light Theme | Toggle on all pages, saved in localStorage |
| 📁 Excel Upload | Drag & drop .xlsx dataset upload with auto-training |
| 🎨 Modern UI | Glassmorphism, particles, gradient cards, animations |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.12, Flask 3.1.2 |
| **ML Model** | Scikit-Learn — Random Forest Classifier |
| **Data Processing** | Pandas, NumPy |
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
│   │   ├── style.css            # Global dark/light theme CSS
│   │   ├── admin.js             # Admin dashboard JS (upload, drag-drop)
│   │   └── user.js              # Prediction form JS (validate, result)
│   │
│   ├── templates/
│   │   ├── login.html           # Login page with particles + theme toggle
│   │   ├── admin_dashboard.html # Admin panel (stats, upload, model, users)
│   │   ├── user_dashboard.html  # Prediction tool with AI result
│   │   └── admin_reports.html   # Analytics charts page
│   │
│   ├── uploads/                 # Uploaded Excel files (auto-created)
│   ├── app.py                   # Flask application (routes + ML logic)
│   ├── model.pkl                # Trained ML model (auto-generated)
│   └── Procfile                 # Gunicorn start command for Render
│
├── requirements.txt             # Python dependencies
├── render.yaml                  # Render deployment config
├── .gitignore
└── README.md
```

---

## 🖼️ Screenshots

### 🔐 Login Page
- Dark glassmorphism card with animated particles
- 🌙 Dark / ☀️ Light theme toggle
- Password show/hide toggle
- Shake animation on wrong credentials

### 📊 Admin Dashboard
- 4 animated stat cards (Model Status, Accuracy, Features, Users)
- Sidebar navigation with active state
- Drag & drop Excel upload with live training progress
- User management table with role badges

### 🔮 Prediction Tool
- Dynamic form based on trained model features
- AI prediction result with probability ring
- Color-coded result (🔴 Leave / 🟢 Stay)
- Actionable recommendations

### 📈 Analytics Reports
- Bar, Line, Pie, Doughnut chart types
- Dynamic column selection from dataset
- Multiple charts on same page
- Dark-themed Chart.js with custom colors

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

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin |
| `user` | `user123` | User |
| `manager` | `manager123` | User |
| `hr_lead` | `hr123` | User |

---

## 📖 How to Use

### 👨‍💼 Admin Flow
```
1. Login → admin / admin123
2. Upload Dataset → drag & drop .xlsx file
3. Model trains automatically → view accuracy
4. Analytics Reports → generate charts
5. Manage Users → view all system users
```

### 👤 User Flow
```
1. Login → user / user123
2. Fill employee details in the form
3. Click "Predict Attrition Risk"
4. View AI prediction + probability + recommendations
```

---

## 📊 Excel File Format

Your `.xlsx` file must contain these columns:

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

> Any additional numeric or categorical columns are automatically processed.

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
4. Configure settings:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r ../requirements.txt` |
| Start Command | `gunicorn app:app` |

5. Click **Create Web Service**
6. Live URL: `https://hr-attrition-ai.onrender.com`

> ⚠️ **Note:** After deploy, login as admin and re-upload the Excel file to retrain the model. `.pkl` files don't persist on Render free tier restarts.

---

## 🎨 Theme System

| Mode | Description |
|---|---|
| 🌙 Dark Mode | Default — dark purple glassmorphism |
| ☀️ Light Mode | Clean white / light purple |

- Toggle button available in **navbar on all pages**
- Theme preference saved in **localStorage** (persists on reload)
- Smooth CSS transition between modes

---

## 📦 Dependencies

```txt
Flask==3.1.2
scikit-learn==1.8.0
pandas==3.0.0
numpy==2.4.2
openpyxl==3.1.2
Werkzeug==3.1.3
gunicorn==21.2.0
```

---

## 📄 License

This project is built for **educational purposes**.

---

<div align="center">

Made with ❤️ using **Flask** + **Scikit-Learn** + **Bootstrap 5**

⭐ Star this repo if you found it helpful!

</div>

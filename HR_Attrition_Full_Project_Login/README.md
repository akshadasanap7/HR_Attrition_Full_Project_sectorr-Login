# 🧠 HR Attrition AI — Employee Attrition Prediction System

![Python](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.1.2-black?style=for-the-badge&logo=flask)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.8.0-orange?style=for-the-badge&logo=scikit-learn)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=for-the-badge&logo=bootstrap)

> An AI-powered HR Analytics platform that predicts employee attrition using Machine Learning (Random Forest Classifier). Built with Flask, featuring a modern dark/light theme UI with glassmorphism design.

---

## 🚀 Live Demo

> Deploy on Render → [See Deployment Guide](#-deployment-on-render)

---

## ✨ Features

- 🔐 **Role-based Login** — Admin & User roles
- 📊 **Admin Dashboard** — Upload dataset, train ML model, manage users
- 🤖 **ML Model** — Random Forest Classifier with accuracy display
- 🔮 **Prediction Tool** — Predict employee attrition risk in real-time
- 📈 **Analytics Reports** — Interactive Bar, Line, Pie, Doughnut charts
- 🌙 **Dark / Light Theme** — Toggle across all pages, saved in localStorage
- 📁 **Excel Upload** — Drag & drop .xlsx dataset upload
- 🎨 **Modern UI** — Glassmorphism, animations, gradient cards

---

## 🖼️ Screenshots

| Login Page | Admin Dashboard |
|---|---|
| Dark glassmorphism login with particles | Stat cards, quick actions, sidebar |

| Prediction Tool | Analytics Reports |
|---|---|
| Dynamic form with AI result | Interactive charts with dark theme |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| ML Model | Scikit-Learn (Random Forest) |
| Data Processing | Pandas, NumPy |
| Frontend | HTML5, CSS3, Bootstrap 5.3 |
| Charts | Chart.js 4.4 |
| Icons | Font Awesome 6.4 |
| Fonts | Google Fonts (Poppins) |
| Animations | Particles.js, CSS Keyframes |
| Deployment | Render (Gunicorn) |

---

## 📁 Project Structure

```
HR_Attrition_Full_Project_Login/
├── backend/
│   ├── static/
│   │   ├── style.css        # Global dark/light theme CSS
│   │   ├── admin.js         # Admin dashboard JS
│   │   └── user.js          # Prediction form JS
│   ├── templates/
│   │   ├── login.html       # Login page with particles
│   │   ├── admin_dashboard.html  # Admin panel
│   │   ├── user_dashboard.html   # Prediction tool
│   │   └── admin_reports.html    # Analytics charts
│   ├── uploads/             # Uploaded Excel files
│   ├── app.py               # Flask application
│   ├── model.pkl            # Trained ML model
│   └── Procfile             # Gunicorn start command
├── requirements.txt
├── render.yaml
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

| Username | Password | Role |
|---|---|---|
| admin | admin123 | Admin |
| user | user123 | User |
| manager | manager123 | User |
| hr_lead | hr123 | User |

---

## 📊 How to Use

### Admin Flow
1. Login as **admin / admin123**
2. Go to **Upload Dataset** → Upload `.xlsx` file
3. Model trains automatically
4. View accuracy in **Model Info**
5. Check **Analytics Reports** for charts

### User Flow
1. Login as **user / user123**
2. Fill in employee details in the form
3. Click **Predict Attrition Risk**
4. View AI prediction with recommendations

### Excel File Format
Your `.xlsx` file must contain:
- `Attrition` — Yes/No *(required)*
- `Department` — Sales, Research & Development, Human Resources *(required)*
- `JobRole` — Role name *(required)*
- `Age`, `MonthlyIncome`, `YearsAtCompany` etc. *(optional)*

---

## 🌐 Deployment on Render

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hr-attrition-ai.git
git push -u origin main
```

### Step 2 — Deploy on Render
1. Go to [render.com](https://render.com) → Login with GitHub
2. Click **New → Web Service**
3. Select your repository
4. Set these settings:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r ../requirements.txt` |
| Start Command | `gunicorn app:app` |

5. Click **Create Web Service**
6. Your app will be live at `https://hr-attrition-ai.onrender.com`

> ⚠️ After deploy, login as admin and re-upload the Excel file to retrain the model (`.pkl` files don't persist on Render free tier).

---

## 🎨 Theme

- **Dark Mode** — Default dark purple glassmorphism
- **Light Mode** — Clean white/light purple
- Toggle button available in navbar on all pages
- Theme preference saved in `localStorage`

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

Made with ❤️ using Flask + Scikit-Learn + Bootstrap 5

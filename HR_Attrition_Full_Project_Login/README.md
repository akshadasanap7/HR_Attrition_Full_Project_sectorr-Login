# HR Employee Attrition Prediction Web Application

A complete end-to-end web application for predicting employee attrition using machine learning with advanced visual analytics and dropdown-based user interface.

## 🚀 Key Features

### Admin Dashboard
- **Excel Upload & Training**: Upload .xlsx files and automatically train ML models
- **Advanced Analytics**: Interactive charts with Chart.js (Bar, Line, Pie charts)
- **Model Management**: View accuracy, retrain models, manage training data
- **User Management**: View all system users and their roles
- **Sidebar Navigation**: Intuitive navigation between different admin functions

### User Dashboard
- **Dropdown-Based Prediction**: Clean interface with predefined dropdown options
- **Department Selection**: Sales, Research & Development, Human Resources
- **Job Role Selection**: 9 predefined job roles including Sales Executive, Research Scientist, etc.
- **Smart Form Validation**: Real-time validation with helpful error messages
- **Detailed Results**: Probability scores, confidence levels, and actionable recommendations

### Advanced Visualizations
- **Dynamic Chart Generation**: Create multiple charts on the same page
- **Chart Type Selection**: Bar, Line, and Pie charts
- **Column Analysis**: Analyze any data column against Attrition
- **Interactive Controls**: Real-time chart updates based on user selections

## 📁 Project Structure

```
HR_Attrition_Full_Project_Login/
├── backend/
│   ├── app.py                    # Main Flask application with all routes
│   ├── uploads/                  # Excel file storage directory
│   ├── model.pkl                # Trained ML model (generated after upload)
│   ├── templates/
│   │   ├── login.html           # Login page with demo credentials
│   │   ├── admin_dashboard.html # Admin dashboard with sidebar navigation
│   │   ├── user_dashboard.html  # User prediction interface with dropdowns
│   │   └── admin_reports.html   # Advanced analytics dashboard
│   └── static/
│       ├── style.css            # Modern CSS with animations
│       ├── admin.js             # Admin dashboard functionality
│       └── user.js              # User prediction functionality
├── HR_Employee_Attrition.xlsx   # Sample dataset (generated)
├── requirements.txt             # Python dependencies
└── README.md                   # This file
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Navigate to Backend Directory

```bash
cd backend
```

### 3. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

## 👥 Demo Credentials

### Admin Account (Full Access)
- **Username**: `admin`
- **Password**: `admin123`
- **Capabilities**: 
  - Upload Excel files and train models
  - Access advanced analytics dashboard
  - View all users and manage system
  - Make predictions

### User Accounts (Prediction Only)
- **Username**: `user` | **Password**: `user123`
- **Username**: `manager` | **Password**: `manager123`
- **Username**: `hr_lead` | **Password**: `hr123`
- **Capabilities**: 
  - Make attrition predictions only
  - No access to training or analytics

## 📊 Usage Guide

### For Administrators

#### 1. Login & Dashboard
- Login with admin credentials
- Access sidebar navigation with 6 main sections

#### 2. Upload Excel & Train Model
- Click "Upload Excel" in sidebar
- Select .xlsx file (must contain "Attrition" column)
- System automatically:
  - Cleans data and handles missing values
  - Encodes categorical columns (Department, JobRole)
  - Trains RandomForest classifier
  - Displays accuracy and feature count

#### 3. View Advanced Reports
- Click "View Reports" in sidebar
- Select chart type (Bar, Line, Pie)
- Choose X-axis and Y-axis columns
- Generate multiple charts on same page
- Analyze attrition patterns by department, job role, etc.

#### 4. Manage Users
- View all system users and their roles
- Monitor user activity and access levels

### For Users

#### 1. Login & Prediction
- Login with user credentials
- Access prediction form with dropdown fields

#### 2. Make Predictions
- **Department**: Select from dropdown (Sales, R&D, HR)
- **Job Role**: Select from 9 predefined roles
- **Other Fields**: Enter numeric values (Age, Salary, Years, etc.)
- Click "Predict Attrition Risk"

#### 3. View Results
- **Prediction**: "Employee likely to stay" or "Employee may leave"
- **Probability**: Percentage likelihood with visual progress bar
- **Confidence**: High/Medium/Low confidence level
- **Recommendations**: Actionable suggestions based on prediction

## 📋 Excel File Requirements

### Required Structure
```
Department | JobRole | Age | MonthlyIncome | YearsAtCompany | Attrition
Sales | Sales Executive | 25 | 45000 | 2 | Yes
Research & Development | Research Scientist | 35 | 75000 | 8 | No
Human Resources | Human Resources | 28 | 55000 | 3 | No
```

### Required Columns
- **Attrition**: Target column (Yes/No, 1/0, TRUE/FALSE)
- **Department**: Sales, Research & Development, Human Resources
- **JobRole**: Sales Executive, Research Scientist, Laboratory Technician, Manufacturing Director, Healthcare Representative, Manager, Sales Representative, Research Director, Human Resources

### Optional Columns
- Age, MonthlyIncome, YearsAtCompany, YearsInCurrentRole
- JobSatisfaction, EnvironmentSatisfaction, WorkLifeBalance
- DistanceFromHome, BusinessTravel, OverTime
- Education, Gender, MaritalStatus, NumCompaniesWorked

## 🔧 Technical Implementation

### Backend Architecture
- **Flask Framework**: Main web application
- **scikit-learn**: RandomForest classifier for predictions
- **pandas**: Excel file processing and data manipulation
- **Session Management**: Role-based access control
- **File Upload**: Secure Excel file handling with validation

### Frontend Features
- **Bootstrap 5**: Modern, responsive UI framework
- **Chart.js**: Interactive data visualizations
- **Font Awesome**: Professional icons throughout
- **Custom CSS**: Animations, gradients, and modern styling
- **JavaScript**: Real-time form validation and AJAX calls

### Machine Learning Pipeline
1. **Data Loading**: pandas reads Excel files automatically
2. **Data Cleaning**: Handle missing values (median for numeric, mode for categorical)
3. **Feature Encoding**: Consistent LabelEncoder for dropdown fields
4. **Model Training**: RandomForest with 80/20 train/test split
5. **Prediction**: Real-time predictions with probability scores

## 🎨 UI/UX Features

### Admin Interface
- **Sidebar Navigation**: Easy access to all admin functions
- **Stats Dashboard**: Model status, accuracy, feature count, user count
- **File Upload**: Drag-and-drop Excel upload with progress indicators
- **Analytics Dashboard**: Multiple chart types with interactive controls

### User Interface
- **Dropdown Forms**: Predefined options for consistent data entry
- **Smart Validation**: Real-time field validation with helpful messages
- **Result Visualization**: Progress bars, badges, and recommendation cards
- **Responsive Design**: Works perfectly on desktop and mobile

### Visual Analytics
- **Chart Types**: Bar charts for comparisons, Line charts for trends, Pie charts for distributions
- **Interactive Controls**: Dynamic chart generation based on user selections
- **Multiple Charts**: Add multiple visualizations to the same page
- **Export Options**: Print functionality for results

## 🔍 API Endpoints

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/` | GET | All | Redirect to appropriate dashboard |
| `/login` | GET/POST | All | User authentication |
| `/admin/dashboard` | GET | Admin | Admin control panel with sidebar |
| `/admin/reports` | GET | Admin | Advanced analytics dashboard |
| `/user/dashboard` | GET | User | Dropdown-based prediction interface |
| `/upload` | POST | Admin | Excel file upload and model training |
| `/predict` | POST | All | Prediction API (JSON) |
| `/api/chart-data` | POST | Admin | Chart data generation for analytics |
| `/model/info` | GET | Admin | Model information and statistics |
| `/logout` | GET | All | Session termination |

## 🔒 Security Features

- **Session-Based Authentication**: Secure login system
- **Role-Based Access Control**: Admin vs User permissions
- **File Upload Validation**: Only .xlsx files accepted
- **Input Sanitization**: All user inputs validated
- **CSRF Protection**: Flask session-based protection
- **Secure File Storage**: Timestamped file naming

## 🚀 Production Deployment

### Environment Setup
```bash
export FLASK_ENV=production
export SECRET_KEY=your-secure-secret-key
```

### Security Considerations
- Change default passwords in production
- Use environment variables for sensitive data
- Enable HTTPS for secure communication
- Set up proper file permissions
- Configure database for user management

## 📈 Analytics Capabilities

### Chart Types Available
- **Bar Charts**: Compare attrition rates across departments/roles
- **Line Charts**: Trend analysis over time periods
- **Pie Charts**: Distribution analysis of categorical data

### Analysis Options
- **Department Analysis**: Attrition patterns by department
- **Job Role Analysis**: Risk levels by specific roles
- **Demographic Analysis**: Age, gender, education impact
- **Tenure Analysis**: Years at company vs attrition risk
- **Satisfaction Analysis**: Job satisfaction correlation

## 🔧 Troubleshooting

### Common Issues

**Model Training Fails**
```
Error: Target column 'Attrition' not found
Solution: Ensure Excel file has 'Attrition' column with Yes/No values
```

**Dropdown Options Not Working**
```
Error: Department/JobRole encoding issues
Solution: Use exact dropdown values from the predefined lists
```

**Charts Not Loading**
```
Error: No training data available
Solution: Upload and train model first before accessing reports
```

**Template Not Found**
```
TemplateNotFound: admin_dashboard.html
Solution: Ensure you're running from backend/ directory
```

### Installation Issues

**Missing Dependencies**
```bash
pip install -r requirements.txt
```

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in app.py if needed
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is for educational and demonstration purposes.

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review browser console for JavaScript errors
3. Ensure all requirements are installed correctly
4. Verify file permissions and directory structure

---

**Built with ❤️ using Flask, scikit-learn, Bootstrap 5, and Chart.js**
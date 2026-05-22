from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pickle
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'hr_attrition_advanced_2024'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Global model variables
model_data = None
model = None
feature_names = []
label_encoders = {}
model_accuracy = None
training_data = None

# Prediction history — stored in memory (list of dicts)
prediction_history = []

# Users with 4 roles
USERS = {
    'admin':    {'password': 'admin123',   'role': 'Admin',   'name': 'Admin User',      'dept': 'IT'},
    'manager':  {'password': 'manager123', 'role': 'Manager', 'name': 'Rahul Sharma',    'dept': 'Sales'},
    'hr_lead':  {'password': 'hr123',      'role': 'HR Lead', 'name': 'Priya Desai',     'dept': 'Human Resources'},
    'user':     {'password': 'user123',    'role': 'User',    'name': 'Akash Patil',     'dept': 'Research & Development'},
}

# Team data for Manager dashboard
TEAM_DATA = {
    'manager': [
        {'name': 'Amit Kumar',    'role': 'Sales Executive',      'dept': 'Sales', 'years': 3,  'risk': 'High'},
        {'name': 'Sneha Joshi',   'role': 'Sales Representative', 'dept': 'Sales', 'years': 1,  'risk': 'Medium'},
        {'name': 'Ravi Patil',    'role': 'Sales Executive',      'dept': 'Sales', 'years': 5,  'risk': 'Low'},
        {'name': 'Pooja Mehta',   'role': 'Manager',              'dept': 'Sales', 'years': 7,  'risk': 'Low'},
        {'name': 'Kiran Rao',     'role': 'Sales Representative', 'dept': 'Sales', 'years': 2,  'risk': 'High'},
    ]
}

DROPDOWN_OPTIONS = {
    'Department': ['Sales', 'Research & Development', 'Human Resources'],
    'JobRole': [
        'Sales Executive', 'Research Scientist', 'Laboratory Technician',
        'Manufacturing Director', 'Healthcare Representative', 'Manager',
        'Sales Representative', 'Research Director', 'Human Resources'
    ]
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'xlsx'

def load_model():
    global model_data, model, feature_names, label_encoders, model_accuracy, training_data
    try:
        with open('model.pkl', 'rb') as f:
            model_data = pickle.load(f)
            model = model_data['model']
            feature_names = model_data['feature_names']
            label_encoders = model_data['label_encoders']
            model_accuracy = model_data.get('accuracy', None)
            training_data = model_data.get('training_data', None)
        print("Model loaded successfully")
        return True
    except FileNotFoundError:
        print("No trained model found")
        return False

def process_excel_and_train(file_path):
    global model_data, model, feature_names, label_encoders, model_accuracy, training_data
    try:
        df = pd.read_excel(file_path)
        original_df = df.copy()

        numeric_columns = df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            df[col] = df[col].fillna(df[col].median())

        categorical_columns = df.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown')

        target_col = None
        for col in ['Attrition', 'attrition', 'ATTRITION', 'Attrition_Flag', 'Left']:
            if col in df.columns:
                target_col = col
                break

        if target_col is None:
            return False, "Target column 'Attrition' not found"

        if df[target_col].dtype == 'object':
            df[target_col] = df[target_col].map({'Yes': 1, 'No': 0, 'yes': 1, 'no': 0, 'YES': 1, 'NO': 0})

        y = df[target_col]
        X = df.drop(columns=[target_col])

        id_cols = [c for c in X.columns if 'id' in c.lower() or 'name' in c.lower() or 'employee' in c.lower()]
        X = X.drop(columns=id_cols, errors='ignore')

        new_label_encoders = {}
        for col in X.select_dtypes(include=['object']).columns:
            le = LabelEncoder()
            if col in DROPDOWN_OPTIONS:
                le.fit(DROPDOWN_OPTIONS[col])
                X[col] = X[col].apply(lambda x: x if x in DROPDOWN_OPTIONS[col] else DROPDOWN_OPTIONS[col][0])
                X[col] = le.transform(X[col])
            else:
                X[col] = le.fit_transform(X[col].astype(str))
            new_label_encoders[col] = le

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        new_model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
        new_model.fit(X_train, y_train)

        accuracy = accuracy_score(y_test, new_model.predict(X_test))

        model = new_model
        feature_names = list(X.columns)
        label_encoders = new_label_encoders
        model_accuracy = accuracy
        training_data = original_df

        model_data = {
            'model': model, 'feature_names': feature_names,
            'label_encoders': label_encoders, 'accuracy': accuracy,
            'training_data': training_data
        }

        with open('model.pkl', 'wb') as f:
            pickle.dump(model_data, f)

        return True, f"Model trained successfully! Accuracy: {accuracy:.3f}"

    except Exception as e:
        return False, f"Error: {str(e)}"

# ─── ROUTES ───────────────────────────────────────────────

@app.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('login'))
    role = session['role']
    if role == 'Admin':
        return redirect(url_for('admin_dashboard'))
    elif role == 'Manager':
        return redirect(url_for('manager_dashboard'))
    elif role == 'HR Lead':
        return redirect(url_for('hr_dashboard'))
    else:
        return redirect(url_for('user_dashboard'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in USERS and USERS[username]['password'] == password:
            session['username'] = username
            session['role'] = USERS[username]['role']
            session['name'] = USERS[username]['name']
            session['dept'] = USERS[username]['dept']
            flash(f'Welcome, {USERS[username]["name"]}!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password.', 'error')
    return render_template('login.html')

@app.route('/admin/dashboard')
def admin_dashboard():
    if 'username' not in session or session['role'] != 'Admin':
        flash('Access denied.', 'error')
        return redirect(url_for('login'))
    users_list = [{'username': k, 'role': v['role'], 'name': v['name'], 'dept': v['dept']} for k, v in USERS.items()]
    return render_template('admin_dashboard.html',
        username=session['username'], name=session['name'],
        users=users_list, model_accuracy=model_accuracy,
        model_exists=model is not None,
        feature_count=len(feature_names) if feature_names else 0,
        total_predictions=len(prediction_history))

@app.route('/user/dashboard')
def user_dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    if session['role'] == 'Admin':
        return redirect(url_for('admin_dashboard'))
    if session['role'] == 'Manager':
        return redirect(url_for('manager_dashboard'))
    if session['role'] == 'HR Lead':
        return redirect(url_for('hr_dashboard'))
    return render_template('user_dashboard.html',
        username=session['username'], name=session['name'],
        features=feature_names, model_exists=model is not None,
        dropdown_options=DROPDOWN_OPTIONS)

@app.route('/manager/dashboard')
def manager_dashboard():
    if 'username' not in session or session['role'] != 'Manager':
        flash('Access denied.', 'error')
        return redirect(url_for('login'))
    team = TEAM_DATA.get(session['username'], [])
    high_risk   = sum(1 for m in team if m['risk'] == 'High')
    medium_risk = sum(1 for m in team if m['risk'] == 'Medium')
    low_risk    = sum(1 for m in team if m['risk'] == 'Low')
    # Manager sees only their team's predictions
    my_predictions = [p for p in prediction_history if p.get('predicted_by') == session['username']]
    return render_template('manager_dashboard.html',
        username=session['username'], name=session['name'], dept=session['dept'],
        team=team, total_team=len(team),
        high_risk=high_risk, medium_risk=medium_risk, low_risk=low_risk,
        features=feature_names, model_exists=model is not None,
        dropdown_options=DROPDOWN_OPTIONS,
        my_predictions=my_predictions)

@app.route('/hr/dashboard')
def hr_dashboard():
    if 'username' not in session or session['role'] != 'HR Lead':
        flash('Access denied.', 'error')
        return redirect(url_for('login'))
    total = len(prediction_history)
    leave_count = sum(1 for p in prediction_history if p.get('result') == 'leave')
    stay_count  = sum(1 for p in prediction_history if p.get('result') == 'stay')
    high_conf   = sum(1 for p in prediction_history if p.get('confidence') == 'High')
    return render_template('hr_dashboard.html',
        username=session['username'], name=session['name'], dept=session['dept'],
        prediction_history=prediction_history,
        total=total, leave_count=leave_count,
        stay_count=stay_count, high_conf=high_conf,
        model_exists=model is not None,
        model_accuracy=model_accuracy)

@app.route('/admin/reports')
def admin_reports():
    if 'username' not in session or session['role'] != 'Admin':
        flash('Access denied.', 'error')
        return redirect(url_for('login'))
    if training_data is None:
        flash('No training data. Upload a dataset first.', 'warning')
        return redirect(url_for('admin_dashboard'))
    return render_template('admin_reports.html',
        username=session['username'], name=session['name'],
        available_columns=list(training_data.columns))

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'username' not in session or session['role'] != 'Admin':
        return jsonify({'success': False, 'message': 'Access denied'}), 403
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file selected'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        success, message = process_excel_and_train(file_path)
        if success:
            return jsonify({'success': True, 'message': message, 'accuracy': model_accuracy})
        return jsonify({'success': False, 'message': message}), 400
    return jsonify({'success': False, 'message': 'Only .xlsx files allowed'}), 400

@app.route('/predict', methods=['POST'])
def predict():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if model is None:
        return jsonify({'error': 'No trained model available'}), 500
    try:
        data = request.get_json()
        feature_vector = []
        for feature in feature_names:
            value = data.get(feature, 0)
            if feature in label_encoders:
                try:
                    feature_vector.append(int(label_encoders[feature].transform([str(value)])[0]))
                except ValueError:
                    feature_vector.append(0)
            else:
                feature_vector.append(float(value))

        features = np.array([feature_vector])
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        result_label = 'leave' if prediction == 1 else 'stay'
        confidence = 'High' if max(probability) > 0.7 else 'Medium' if max(probability) > 0.6 else 'Low'

        # Save to prediction history
        record = {
            'id': len(prediction_history) + 1,
            'predicted_by': session['username'],
            'role': session['role'],
            'name': session.get('name', session['username']),
            'dept': data.get('Department', 'N/A'),
            'job_role': data.get('JobRole', 'N/A'),
            'result': result_label,
            'probability': round(float(probability[1]) * 100, 1),
            'confidence': confidence,
            'timestamp': datetime.now().strftime('%d %b %Y, %I:%M %p')
        }
        prediction_history.append(record)

        return jsonify({
            'prediction': 'Employee may leave' if prediction == 1 else 'Employee likely to stay',
            'probability': float(probability[1]),
            'confidence': confidence
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/chart-data', methods=['POST'])
def get_chart_data():
    if 'username' not in session or session['role'] != 'Admin':
        return jsonify({'error': 'Access denied'}), 403
    if training_data is None:
        return jsonify({'error': 'No training data available'}), 404
    try:
        req = request.get_json()
        chart_type = req.get('chart_type', 'bar')
        x_column   = req.get('x_column')
        y_column   = req.get('y_column', 'Attrition')
        df = training_data.copy()

        if x_column not in df.columns:
            return jsonify({'error': f'Column {x_column} not found'}), 400

        if chart_type == 'pie':
            data = df[x_column].value_counts().to_dict()
            chart_data = {
                'labels': list(data.keys()),
                'datasets': [{'data': list(data.values()),
                    'backgroundColor': ['#667eea','#764ba2','#11998e','#38ef7d','#4facfe','#f7971e','#eb3349','#ffd200']}]
            }
        elif chart_type in ['bar', 'line']:
            if y_column == 'Attrition':
                if df[y_column].dtype == 'object':
                    df[y_column] = df[y_column].map({'Yes':1,'No':0,'yes':1,'no':0})
                grouped = df.groupby(x_column)[y_column].agg(['count','sum']).reset_index()
                grouped['attrition_rate'] = (grouped['sum'] / grouped['count'] * 100).round(2)
                chart_data = {
                    'labels': grouped[x_column].tolist(),
                    'datasets': [
                        {'label': 'Attrition Rate (%)', 'data': grouped['attrition_rate'].tolist(),
                         'backgroundColor': '#667eea', 'borderColor': '#667eea', 'borderWidth': 2, 'fill': False},
                        {'label': 'Employee Count', 'data': grouped['count'].tolist(),
                         'backgroundColor': '#eb3349', 'borderColor': '#eb3349', 'borderWidth': 2, 'fill': False, 'yAxisID': 'y1'}
                    ]
                }
            else:
                grouped = df.groupby(x_column)[y_column].mean().reset_index()
                chart_data = {
                    'labels': grouped[x_column].tolist(),
                    'datasets': [{'label': f'Avg {y_column}', 'data': grouped[y_column].round(2).tolist(),
                        'backgroundColor': '#667eea', 'borderColor': '#667eea', 'borderWidth': 2, 'fill': False}]
                }
        return jsonify({'success': True, 'chart_data': chart_data, 'chart_type': chart_type})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/model/info')
def model_info():
    if 'username' not in session or session['role'] != 'Admin':
        return jsonify({'error': 'Access denied'}), 403
    if model is None:
        return jsonify({'error': 'No model available'}), 404
    return jsonify({'accuracy': model_accuracy, 'features': feature_names, 'feature_count': len(feature_names)})

@app.route('/logout')
def logout():
    name = session.get('name', 'User')
    session.clear()
    flash(f'Goodbye, {name}!', 'info')
    return redirect(url_for('login'))

load_model()

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)

from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, confusion_matrix
import pickle
from werkzeug.utils import secure_filename
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'hr_attrition_advanced_2024'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Global variables for model data
model_data = None
model = None
feature_names = []
label_encoders = {}
model_accuracy = None
training_data = None

# Demo users with roles
USERS = {
    'admin': {'password': 'admin123', 'role': 'Admin'},
    'user': {'password': 'user123', 'role': 'User'},
    'manager': {'password': 'manager123', 'role': 'User'},
    'hr_lead': {'password': 'hr123', 'role': 'User'}
}

# Predefined dropdown options
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
    """Load the trained model if it exists"""
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
    """Process Excel file and train the model"""
    global model_data, model, feature_names, label_encoders, model_accuracy, training_data
    
    try:
        # Load Excel file
        df = pd.read_excel(file_path)
        print(f"Data loaded: {df.shape}")
        
        # Store original data for analytics
        original_df = df.copy()
        
        # Handle missing values
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            df[col] = df[col].fillna(df[col].median())
        
        categorical_columns = df.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown')
        
        # Find target column
        target_col = None
        possible_targets = ['Attrition', 'attrition', 'ATTRITION', 'Attrition_Flag', 'Left']
        
        for col in possible_targets:
            if col in df.columns:
                target_col = col
                break
        
        if target_col is None:
            return False, "Target column 'Attrition' not found in the dataset"
        
        # Convert target to binary
        if df[target_col].dtype == 'object':
            df[target_col] = df[target_col].map({'Yes': 1, 'No': 0, 'yes': 1, 'no': 0, 'YES': 1, 'NO': 0})
        
        # Separate features and target
        y = df[target_col]
        X = df.drop(columns=[target_col])
        
        # Remove ID columns
        id_columns = [col for col in X.columns if 'id' in col.lower() or 'name' in col.lower() or 'employee' in col.lower()]
        X = X.drop(columns=id_columns, errors='ignore')
        
        # Encode categorical variables with consistent mapping
        new_label_encoders = {}
        categorical_columns = X.select_dtypes(include=['object']).columns
        
        for col in categorical_columns:
            le = LabelEncoder()
            
            # Use predefined options if available
            if col in DROPDOWN_OPTIONS:
                # Fit on predefined options to ensure consistency
                le.fit(DROPDOWN_OPTIONS[col])
                # Transform actual data, handling unseen values
                X[col] = X[col].apply(lambda x: x if x in DROPDOWN_OPTIONS[col] else DROPDOWN_OPTIONS[col][0])
                X[col] = le.transform(X[col])
            else:
                X[col] = le.fit_transform(X[col].astype(str))
            
            new_label_encoders[col] = le
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Train model
        new_model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
        new_model.fit(X_train, y_train)
        
        # Calculate accuracy
        y_pred = new_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Update global variables
        model = new_model
        feature_names = list(X.columns)
        label_encoders = new_label_encoders
        model_accuracy = accuracy
        training_data = original_df  # Store for analytics
        
        # Save model with training data
        model_data = {
            'model': model,
            'feature_names': feature_names,
            'label_encoders': label_encoders,
            'accuracy': accuracy,
            'training_data': training_data
        }
        
        with open('model.pkl', 'wb') as f:
            pickle.dump(model_data, f)
        
        return True, f"Model trained successfully! Accuracy: {accuracy:.3f}"
        
    except Exception as e:
        return False, f"Error training model: {str(e)}"

@app.route('/')
def index():
    if 'username' in session:
        if session['role'] == 'Admin':
            return redirect(url_for('admin_dashboard'))
        else:
            return redirect(url_for('user_dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username in USERS and USERS[username]['password'] == password:
            session['username'] = username
            session['role'] = USERS[username]['role']
            flash(f'Welcome {username}!', 'success')
            
            if session['role'] == 'Admin':
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('user_dashboard'))
        else:
            flash('Invalid credentials', 'error')
    
    return render_template('login.html')

@app.route('/admin/dashboard')
def admin_dashboard():
    if 'username' not in session or session['role'] != 'Admin':
        flash('Access denied. Admin privileges required.', 'error')
        return redirect(url_for('login'))
    
    # Get list of users
    users_list = [{'username': k, 'role': v['role']} for k, v in USERS.items()]
    
    return render_template('admin_dashboard.html', 
                         username=session['username'],
                         users=users_list,
                         model_accuracy=model_accuracy,
                         model_exists=model is not None,
                         feature_count=len(feature_names) if feature_names else 0)

@app.route('/user/dashboard')
def user_dashboard():
    if 'username' not in session:
        flash('Please login to access the dashboard.', 'error')
        return redirect(url_for('login'))
    
    if session['role'] == 'Admin':
        return redirect(url_for('admin_dashboard'))
    
    if not model:
        flash('No trained model available. Please contact admin.', 'warning')
    
    return render_template('user_dashboard.html', 
                         username=session['username'],
                         features=feature_names,
                         model_exists=model is not None,
                         dropdown_options=DROPDOWN_OPTIONS)

@app.route('/admin/reports')
def admin_reports():
    if 'username' not in session or session['role'] != 'Admin':
        flash('Access denied. Admin privileges required.', 'error')
        return redirect(url_for('login'))
    
    if training_data is None:
        flash('No training data available. Please upload and train a model first.', 'warning')
        return redirect(url_for('admin_dashboard'))
    
    # Get available columns for analysis
    available_columns = list(training_data.columns)
    
    return render_template('admin_reports.html',
                         username=session['username'],
                         available_columns=available_columns)

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
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Train model with uploaded file
        success, message = process_excel_and_train(file_path)
        
        if success:
            return jsonify({'success': True, 'message': message, 'accuracy': model_accuracy})
        else:
            return jsonify({'success': False, 'message': message}), 400
    
    return jsonify({'success': False, 'message': 'Invalid file format. Please upload .xlsx files only'}), 400

@app.route('/predict', methods=['POST'])
def predict():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if model is None:
        return jsonify({'error': 'No trained model available'}), 500
    
    try:
        data = request.get_json()
        
        # Create feature vector
        feature_vector = []
        for feature in feature_names:
            if feature in data:
                value = data[feature]
                
                # Handle categorical encoding
                if feature in label_encoders:
                    try:
                        encoded_value = label_encoders[feature].transform([str(value)])[0]
                        feature_vector.append(encoded_value)
                    except ValueError:
                        # If value not seen during training, use first class
                        encoded_value = 0
                        feature_vector.append(encoded_value)
                else:
                    # Numeric feature
                    feature_vector.append(float(value))
            else:
                # Missing feature, use default value
                feature_vector.append(0)
        
        # Make prediction
        features = np.array([feature_vector])
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        result = {
            'prediction': 'Employee may leave' if prediction == 1 else 'Employee likely to stay',
            'probability': float(probability[1]),
            'confidence': 'High' if max(probability) > 0.7 else 'Medium' if max(probability) > 0.6 else 'Low'
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/chart-data', methods=['POST'])
def get_chart_data():
    if 'username' not in session or session['role'] != 'Admin':
        return jsonify({'error': 'Access denied'}), 403
    
    if training_data is None:
        return jsonify({'error': 'No training data available'}), 404
    
    try:
        request_data = request.get_json()
        chart_type = request_data.get('chart_type', 'bar')
        x_column = request_data.get('x_column')
        y_column = request_data.get('y_column', 'Attrition')
        
        df = training_data.copy()
        
        if x_column not in df.columns:
            return jsonify({'error': f'Column {x_column} not found'}), 400
        
        # Prepare data based on chart type
        if chart_type == 'pie':
            # For pie charts, show distribution of x_column
            data = df[x_column].value_counts().to_dict()
            labels = list(data.keys())
            values = list(data.values())
            
            chart_data = {
                'labels': labels,
                'datasets': [{
                    'data': values,
                    'backgroundColor': [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ]
                }]
            }
        
        elif chart_type in ['bar', 'line']:
            # Group by x_column and calculate attrition rate
            if y_column == 'Attrition':
                # Convert Attrition to numeric if it's not
                if df[y_column].dtype == 'object':
                    df[y_column] = df[y_column].map({'Yes': 1, 'No': 0, 'yes': 1, 'no': 0, 'YES': 1, 'NO': 0})
                
                grouped = df.groupby(x_column)[y_column].agg(['count', 'sum']).reset_index()
                grouped['attrition_rate'] = (grouped['sum'] / grouped['count'] * 100).round(2)
                
                labels = grouped[x_column].tolist()
                values = grouped['attrition_rate'].tolist()
                counts = grouped['count'].tolist()
                
                chart_data = {
                    'labels': labels,
                    'datasets': [{
                        'label': 'Attrition Rate (%)',
                        'data': values,
                        'backgroundColor': '#36A2EB' if chart_type == 'bar' else 'transparent',
                        'borderColor': '#36A2EB',
                        'borderWidth': 2,
                        'fill': False
                    }, {
                        'label': 'Employee Count',
                        'data': counts,
                        'backgroundColor': '#FF6384' if chart_type == 'bar' else 'transparent',
                        'borderColor': '#FF6384',
                        'borderWidth': 2,
                        'fill': False,
                        'yAxisID': 'y1'
                    }]
                }
            else:
                # For other numeric columns
                if df[y_column].dtype in ['object']:
                    # Categorical y-column
                    crosstab = pd.crosstab(df[x_column], df[y_column])
                    labels = crosstab.index.tolist()
                    datasets = []
                    colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                    
                    for i, col in enumerate(crosstab.columns):
                        datasets.append({
                            'label': str(col),
                            'data': crosstab[col].tolist(),
                            'backgroundColor': colors[i % len(colors)] if chart_type == 'bar' else 'transparent',
                            'borderColor': colors[i % len(colors)],
                            'borderWidth': 2,
                            'fill': False
                        })
                    
                    chart_data = {
                        'labels': labels,
                        'datasets': datasets
                    }
                else:
                    # Numeric y-column
                    grouped = df.groupby(x_column)[y_column].mean().reset_index()
                    labels = grouped[x_column].tolist()
                    values = grouped[y_column].round(2).tolist()
                    
                    chart_data = {
                        'labels': labels,
                        'datasets': [{
                            'label': f'Average {y_column}',
                            'data': values,
                            'backgroundColor': '#36A2EB' if chart_type == 'bar' else 'transparent',
                            'borderColor': '#36A2EB',
                            'borderWidth': 2,
                            'fill': False
                        }]
                    }
        
        return jsonify({
            'success': True,
            'chart_data': chart_data,
            'chart_type': chart_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/model/info')
def model_info():
    if 'username' not in session or session['role'] != 'Admin':
        return jsonify({'error': 'Access denied'}), 403
    
    if model is None:
        return jsonify({'error': 'No model available'}), 404
    
    return jsonify({
        'accuracy': model_accuracy,
        'features': feature_names,
        'feature_count': len(feature_names)
    })

@app.route('/logout')
def logout():
    username = session.get('username', 'User')
    session.clear()
    flash(f'Goodbye {username}!', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    load_model()  # Try to load existing model
    app.run(debug=True, host='0.0.0.0', port=5000)
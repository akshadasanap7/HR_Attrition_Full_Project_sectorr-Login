// User Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const predictionText = document.getElementById('prediction-text');
    const predictionDetails = document.getElementById('prediction-details');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get all form data
            const formData = new FormData(form);
            const data = {};
            let hasEmptyFields = false;
            
            // Convert form data to object and validate
            for (let [key, value] of formData.entries()) {
                if (value === '' || value === null) {
                    showFieldError(key, 'This field is required');
                    hasEmptyFields = true;
                    continue;
                }
                
                // Clear any previous errors
                clearFieldError(key);
                
                // Convert to appropriate type
                const input = document.getElementById(key);
                if (input && input.type === 'number') {
                    data[key] = parseFloat(value);
                } else {
                    data[key] = value;
                }
            }
            
            if (hasEmptyFields) {
                showAlert('Please fill in all required fields', 'danger');
                scrollToFirstError();
                return;
            }
            
            // Validate numeric ranges
            if (!validateNumericFields(data)) {
                return;
            }
            
            // Show loading with animation
            loading.style.display = 'block';
            result.style.display = 'none';
            
            // Scroll to loading indicator
            loading.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            try {
                // Make API call
                const response = await fetch('/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const responseData = await response.json();
                
                if (response.ok) {
                    // Display result with animation
                    displayPredictionResult(responseData);
                    
                } else {
                    showAlert('Error: ' + responseData.error, 'danger');
                }
            } catch (error) {
                showAlert('Network error: ' + error.message, 'danger');
            } finally {
                loading.style.display = 'none';
            }
        });
    }
    
    // Add input validation for numeric fields
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
            clearFieldError(this.id);
            validateNumericField(this);
        });
        
        // Add blur validation
        input.addEventListener('blur', function() {
            validateNumericField(this);
        });
        
        // Add focus animation
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
    
    // Add change validation for select fields
    const selectInputs = document.querySelectorAll('select');
    selectInputs.forEach(select => {
        select.addEventListener('change', function() {
            clearFieldError(this.id);
            this.classList.add('selected');
        });
        
        // Add focus animation
        select.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        select.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
    
    // Add helpful tooltips and placeholders
    addFieldTooltips();
    
    // Initialize form animations
    initializeFormAnimations();
});

function displayPredictionResult(responseData) {
    const predictionText = document.getElementById('prediction-text');
    const predictionDetails = document.getElementById('prediction-details');
    const result = document.getElementById('result');
    
    // Set prediction text
    predictionText.textContent = responseData.prediction;
    
    // Create detailed result HTML
    const probabilityPercent = (responseData.probability * 100).toFixed(1);
    const isLeaving = responseData.prediction.includes('may leave');
    
    // Style the prediction text
    if (isLeaving) {
        predictionText.className = 'h3 mb-4 text-center text-danger';
        result.querySelector('.card-header').className = 'card-header bg-danger text-white';
    } else {
        predictionText.className = 'h3 mb-4 text-center text-success';
        result.querySelector('.card-header').className = 'card-header bg-success text-white';
    }
    
    predictionDetails.innerHTML = `
        <div class="row g-4">
            <div class="col-md-6">
                <div class="card border-0 ${isLeaving ? 'bg-danger' : 'bg-success'} bg-opacity-10">
                    <div class="card-body text-center">
                        <i class="fas fa-percentage ${isLeaving ? 'text-danger' : 'text-success'} mb-2" style="font-size: 2rem;"></i>
                        <h5 class="card-title">Attrition Probability</h5>
                        <div class="progress mb-3" style="height: 25px;">
                            <div class="progress-bar ${isLeaving ? 'bg-danger' : 'bg-success'}" 
                                 role="progressbar" 
                                 style="width: ${probabilityPercent}%"
                                 data-bs-toggle="tooltip"
                                 title="${probabilityPercent}% probability">
                                <strong>${probabilityPercent}%</strong>
                            </div>
                        </div>
                        <small class="text-muted">Likelihood of leaving the company</small>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card border-0 bg-info bg-opacity-10">
                    <div class="card-body text-center">
                        <i class="fas fa-shield-alt text-info mb-2" style="font-size: 2rem;"></i>
                        <h5 class="card-title">Confidence Level</h5>
                        <span class="badge ${getConfidenceBadgeClass(responseData.confidence)} fs-4 px-4 py-2">
                            ${responseData.confidence}
                        </span>
                        <div class="mt-3">
                            <small class="text-muted">Model prediction confidence</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-4">
            <div class="card border-0 ${isLeaving ? 'border-start border-danger border-4' : 'border-start border-success border-4'}">
                <div class="card-body">
                    <h6 class="card-title">
                        <i class="fas ${isLeaving ? 'fa-exclamation-triangle text-danger' : 'fa-lightbulb text-success'} me-2"></i>
                        Recommendations
                    </h6>
                    <div class="card-text">
                        ${getRecommendations(responseData, isLeaving)}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-4 text-center">
            <button class="btn btn-primary btn-lg me-2" onclick="resetForm()">
                <i class="fas fa-redo me-2"></i>Make Another Prediction
            </button>
            <button class="btn btn-outline-secondary btn-lg" onclick="printResult()">
                <i class="fas fa-print me-2"></i>Print Result
            </button>
        </div>
    `;
    
    // Show result with animation
    result.style.display = 'block';
    result.classList.add('fade-in-up');
    
    // Scroll to result
    setTimeout(() => {
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
    
    // Initialize tooltips
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(result.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

function getRecommendations(responseData, isLeaving) {
    if (isLeaving) {
        return `
            <ul class="list-unstyled mb-0">
                <li class="mb-2"><i class="fas fa-arrow-right text-danger me-2"></i><strong>Immediate Action:</strong> Schedule a one-on-one meeting to discuss concerns</li>
                <li class="mb-2"><i class="fas fa-arrow-right text-danger me-2"></i><strong>Career Development:</strong> Explore growth opportunities and career path discussions</li>
                <li class="mb-2"><i class="fas fa-arrow-right text-danger me-2"></i><strong>Compensation Review:</strong> Consider salary adjustment or additional benefits</li>
                <li class="mb-2"><i class="fas fa-arrow-right text-danger me-2"></i><strong>Work-Life Balance:</strong> Assess workload and consider flexible work arrangements</li>
                <li class="mb-0"><i class="fas fa-arrow-right text-danger me-2"></i><strong>Recognition:</strong> Implement recognition programs and acknowledge contributions</li>
            </ul>
        `;
    } else {
        return `
            <ul class="list-unstyled mb-0">
                <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Maintain Engagement:</strong> Continue current positive practices</li>
                <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Regular Check-ins:</strong> Schedule periodic feedback sessions</li>
                <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Growth Opportunities:</strong> Provide challenging projects and learning opportunities</li>
                <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Team Integration:</strong> Foster team collaboration and social connections</li>
                <li class="mb-0"><i class="fas fa-check text-success me-2"></i><strong>Performance Recognition:</strong> Continue acknowledging good performance</li>
            </ul>
        `;
    }
}

function validateNumericFields(data) {
    let isValid = true;
    
    // Define validation rules
    const validationRules = {
        'Age': { min: 18, max: 70, name: 'Age' },
        'MonthlyIncome': { min: 1000, max: 500000, name: 'Monthly Income' },
        'TotalWorkingYears': { min: 0, max: 45, name: 'Total Working Years' },
        'PercentSalaryHike': { min: 0, max: 50, name: 'Percent Salary Hike' },
        'YearsAtCompany': { min: 0, max: 50, name: 'Years at Company' },
        'YearsInCurrentRole': { min: 0, max: 50, name: 'Years in Current Role' },
        'YearsSinceLastPromotion': { min: 0, max: 50, name: 'Years Since Last Promotion' },
        'YearsWithCurrManager': { min: 0, max: 50, name: 'Years with Current Manager' },
        'DistanceFromHome': { min: 0, max: 100, name: 'Distance from Home' }
    };
    
    Object.keys(data).forEach(key => {
        if (validationRules[key] && typeof data[key] === 'number') {
            const rule = validationRules[key];
            const value = data[key];
            
            if (value < rule.min || value > rule.max) {
                showFieldError(key, `${rule.name} must be between ${rule.min} and ${rule.max}`);
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Utility functions
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fade-in-up`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'danger' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle me-1"></i>${message}`;
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

function validateNumericField(field) {
    const value = parseFloat(field.value);
    const min = parseFloat(field.min);
    const max = parseFloat(field.max);
    
    if (field.value && isNaN(value)) {
        showFieldError(field.id, 'Please enter a valid number');
        return false;
    }
    
    if (field.value && min !== undefined && value < min) {
        showFieldError(field.id, `Value must be at least ${min}`);
        return false;
    }
    
    if (field.value && max !== undefined && value > max) {
        showFieldError(field.id, `Value must be at most ${max}`);
        return false;
    }
    
    return true;
}

function getConfidenceBadgeClass(confidence) {
    switch (confidence.toLowerCase()) {
        case 'high':
            return 'bg-success';
        case 'medium':
            return 'bg-warning text-dark';
        case 'low':
            return 'bg-secondary';
        default:
            return 'bg-secondary';
    }
}

function scrollToFirstError() {
    const firstError = document.querySelector('.is-invalid');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
}

function addFieldTooltips() {
    const tooltips = {
        'Age': 'Employee age (18-70 years)',
        'MonthlyIncome': 'Monthly salary in rupees',
        'TotalWorkingYears': 'Total work experience in years (0-45)',
        'PercentSalaryHike': 'Salary hike percentage (0-50%)',
        'YearsAtCompany': 'Total years worked at the current company',
        'YearsInCurrentRole': 'Years in the current job position',
        'YearsSinceLastPromotion': 'Years since the last promotion',
        'YearsWithCurrManager': 'Years working under current manager',
        'JobSatisfaction': 'Job satisfaction rating (1=Very Low, 5=Very High)',
        'EnvironmentSatisfaction': 'Work environment satisfaction rating',
        'WorkLifeBalance': 'Work-life balance rating (1=Poor, 5=Excellent)',
        'JobInvolvement': 'Level of job involvement and engagement',
        'PerformanceRating': 'Performance rating (3=Good, 4=Excellent)',
        'DistanceFromHome': 'Distance from home to office in kilometers',
        'NumCompaniesWorked': 'Number of companies worked for previously',
        'TrainingTimesLastYear': 'Number of training sessions attended last year',
        'StockOptionLevel': 'Stock option level (0-3)',
        'Department': 'Employee department',
        'JobRole': 'Current job role/position'
    };
    
    Object.keys(tooltips).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.setAttribute('data-bs-toggle', 'tooltip');
            field.setAttribute('data-bs-placement', 'top');
            field.setAttribute('title', tooltips[fieldName]);
        }
    });
}

function initializeFormAnimations() {
    // Add stagger animation to form fields
    const formGroups = document.querySelectorAll('.col-md-6');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('fade-in-up');
    });
}

function resetForm() {
    const form = document.getElementById('predictionForm');
    const result = document.getElementById('result');
    
    if (form) {
        form.reset();
        
        // Clear all validation states
        const invalidFields = form.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => {
            field.classList.remove('is-invalid');
        });
        
        // Remove error messages
        const errorMessages = form.querySelectorAll('.invalid-feedback');
        errorMessages.forEach(error => error.remove());
        
        // Hide result
        result.style.display = 'none';
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Focus first field
        const firstField = form.querySelector('select, input');
        if (firstField) {
            setTimeout(() => firstField.focus(), 500);
        }
    }
}

function printResult() {
    const resultContent = document.getElementById('result').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
            <head>
                <title>HR Attrition Prediction Result</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 20px; }
                    .fade-in-up { animation: none; }
                    @media print {
                        .btn { display: none; }
                    }
                </style>
            </head>
            <body>
                <h2 class="text-center mb-4">HR Attrition Prediction Result</h2>
                <div class="container">
                    ${resultContent}
                </div>
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}
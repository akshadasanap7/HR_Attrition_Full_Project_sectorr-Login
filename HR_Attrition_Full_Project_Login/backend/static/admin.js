// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar navigation
    initializeSidebar();
    
    // Initialize upload form
    initializeUploadForm();
    
    // Show dashboard section by default
    showSection('dashboard');
});

function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link[data-section]');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in-up');
    }
}

function initializeUploadForm() {
    const uploadForm = document.getElementById('uploadForm');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadResult = document.getElementById('uploadResult');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('excelFile');
            const file = fileInput.files[0];
            
            if (!file) {
                showAlert('Please select an Excel file', 'danger');
                return;
            }
            
            if (!file.name.toLowerCase().endsWith('.xlsx')) {
                showAlert('Please select a valid .xlsx file', 'danger');
                return;
            }
            
            // Show progress
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Uploading & Training...';
            uploadProgress.style.display = 'block';
            uploadResult.style.display = 'none';
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Success
                    uploadResult.innerHTML = `
                        <div class="alert alert-success fade-in-up">
                            <i class="fas fa-check-circle me-2"></i>
                            <strong>Success!</strong> ${result.message}
                            <br><strong>Model Accuracy:</strong> ${(result.accuracy * 100).toFixed(1)}%
                            <div class="progress mt-2">
                                <div class="progress-bar bg-success" role="progressbar" style="width: ${(result.accuracy * 100).toFixed(1)}%">
                                    ${(result.accuracy * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Refresh page after 3 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                    
                } else {
                    // Error
                    uploadResult.innerHTML = `
                        <div class="alert alert-danger fade-in-up">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Error:</strong> ${result.message || 'Training failed'}
                        </div>
                    `;
                }
                
            } catch (error) {
                uploadResult.innerHTML = `
                    <div class="alert alert-danger fade-in-up">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Network Error:</strong> ${error.message}
                    </div>
                `;
            } finally {
                // Reset UI
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = '<i class="fas fa-upload me-2"></i>Upload File';
                uploadProgress.style.display = 'none';
                uploadResult.style.display = 'block';
            }
        });
    }
    
    // File input change handler
    const fileInput = document.getElementById('excelFile');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
                console.log(`Selected file: ${file.name} (${fileSize} MB)`);
                
                // Show file info
                const fileInfo = document.createElement('div');
                fileInfo.className = 'alert alert-info mt-2 fade-in-up';
                fileInfo.innerHTML = `
                    <i class="fas fa-file-excel me-2"></i>
                    <strong>Selected:</strong> ${file.name} (${fileSize} MB)
                `;
                
                // Remove existing file info
                const existingInfo = document.querySelector('.alert-info');
                if (existingInfo && existingInfo.innerHTML.includes('Selected:')) {
                    existingInfo.remove();
                }
                
                // Add new file info
                fileInput.parentNode.appendChild(fileInfo);
            }
        });
    }
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
    
    // Insert at top of main content
    const mainContent = document.querySelector('main .pt-3');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function refreshModelInfo() {
    fetch('/model/info')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showAlert(data.error, 'warning');
            } else {
                showAlert(`Model Info - Accuracy: ${(data.accuracy * 100).toFixed(1)}%, Features: ${data.feature_count}`, 'info');
            }
        })
        .catch(error => {
            showAlert('Failed to fetch model info', 'danger');
        });
}

function retrainModel() {
    if (confirm('Are you sure you want to retrain the model? This will replace the current model.')) {
        showAlert('Please upload a new Excel file to retrain the model.', 'info');
        showSection('upload');
        
        // Highlight upload section
        const uploadSection = document.querySelector('.sidebar .nav-link[data-section="upload"]');
        if (uploadSection) {
            uploadSection.classList.add('active');
            document.querySelector('.sidebar .nav-link[data-section="model"]').classList.remove('active');
        }
    }
}

function viewUserDetails(username) {
    showAlert(`User Details: ${username} - This feature can be extended to show detailed user information.`, 'info');
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.disabled && !this.classList.contains('btn-close')) {
            this.classList.add('loading-pulse');
            setTimeout(() => {
                this.classList.remove('loading-pulse');
            }, 1000);
        }
    });
});

// Initialize tooltips if Bootstrap is available
if (typeof bootstrap !== 'undefined') {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}
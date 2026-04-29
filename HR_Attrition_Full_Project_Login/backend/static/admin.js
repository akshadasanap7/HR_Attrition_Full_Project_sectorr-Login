document.addEventListener('DOMContentLoaded', function () {
    initUploadForm();
    initDragDrop();
});

// ===== UPLOAD FORM =====
function initUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const file = document.getElementById('excelFile').files[0];
        if (!file) { showToast('Please select an Excel file', 'danger'); return; }
        if (!file.name.toLowerCase().endsWith('.xlsx')) { showToast('Only .xlsx files allowed', 'danger'); return; }

        const btn = document.getElementById('uploadBtn');
        const progress = document.getElementById('uploadProgress');
        const result = document.getElementById('uploadResult');

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading & Training...';
        progress.style.display = 'block';
        result.style.display = 'none';

        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/upload', { method: 'POST', body: fd });
            const data = await res.json();

            if (res.ok && data.success) {
                result.innerHTML = `
                    <div class="alert alert-success fade-in-up">
                        <i class="fas fa-check-circle me-2"></i>
                        <strong>Success!</strong> ${data.message}
                        <div class="progress mt-2" style="height:8px;">
                            <div class="progress-bar bg-success" style="width:${(data.accuracy * 100).toFixed(1)}%"></div>
                        </div>
                        <small class="text-muted">Accuracy: ${(data.accuracy * 100).toFixed(1)}%</small>
                    </div>`;
                setTimeout(() => window.location.reload(), 2500);
            } else {
                result.innerHTML = `<div class="alert alert-danger fade-in-up"><i class="fas fa-times-circle me-2"></i>${data.message || 'Upload failed'}</div>`;
            }
        } catch (err) {
            result.innerHTML = `<div class="alert alert-danger fade-in-up"><i class="fas fa-times-circle me-2"></i>Network error: ${err.message}</div>`;
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-upload me-2"></i>Upload & Train Model';
            progress.style.display = 'none';
            result.style.display = 'block';
        }
    });

    // File input change
    const fileInput = document.getElementById('excelFile');
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const display = document.getElementById('fileNameDisplay');
                if (display) {
                    display.textContent = `📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                    display.style.display = 'block';
                }
            }
        });
    }
}

// ===== DRAG & DROP =====
function initDragDrop() {
    const zone = document.getElementById('uploadZone');
    const input = document.getElementById('excelFile');
    if (!zone || !input) return;

    ['dragenter', 'dragover'].forEach(e => {
        zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('dragover'); });
    });

    ['dragleave', 'drop'].forEach(e => {
        zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.remove('dragover'); });
    });

    zone.addEventListener('drop', function (e) {
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.xlsx')) {
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            const display = document.getElementById('fileNameDisplay');
            if (display) {
                display.textContent = `📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                display.style.display = 'block';
            }
        } else {
            showToast('Only .xlsx files allowed', 'danger');
        }
    });
}

// ===== UTILITIES =====
function showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `alert alert-${type} fade-in-up`;
    t.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;min-width:280px;box-shadow:0 8px 25px rgba(0,0,0,0.15);';
    t.innerHTML = `<i class="fas fa-${type === 'danger' ? 'times-circle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>${msg}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

function refreshModelInfo() {
    fetch('/model/info')
        .then(r => r.json())
        .then(data => {
            if (data.error) { showToast(data.error, 'warning'); }
            else { showToast(`Accuracy: ${(data.accuracy * 100).toFixed(1)}% | Features: ${data.feature_count}`, 'success'); }
        })
        .catch(() => showToast('Failed to fetch model info', 'danger'));
}

function retrainModel() {
    if (confirm('Retrain model with new data? This will replace the current model.')) {
        showSection('upload');
        showToast('Upload a new Excel file to retrain the model', 'info');
    }
}

function viewUserDetails(username, role) {
    // handled inline in template
}

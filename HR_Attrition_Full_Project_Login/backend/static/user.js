document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('predictionForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        const data = collectFormData();
        showLoading(true);

        try {
            const res = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (res.ok) {
                displayResult(result);
            } else {
                showAlert('Error: ' + (result.error || 'Prediction failed'), 'danger');
            }
        } catch (err) {
            showAlert('Network error: ' + err.message, 'danger');
        } finally {
            showLoading(false);
        }
    });

    // Real-time validation
    form.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => clearError(input));
        input.addEventListener('blur', () => validateField(input));
    });

    form.querySelectorAll('select').forEach(sel => {
        sel.addEventListener('change', () => clearError(sel));
    });
});

// ===== COLLECT DATA =====
function collectFormData() {
    const form = document.getElementById('predictionForm');
    const fd = new FormData(form);
    const data = {};
    for (let [key, val] of fd.entries()) {
        const el = document.getElementById(key);
        data[key] = (el && el.type === 'number') ? parseFloat(val) : val;
    }
    return data;
}

// ===== VALIDATE =====
function validateForm() {
    const form = document.getElementById('predictionForm');
    let valid = true;

    form.querySelectorAll('[required]').forEach(el => {
        if (!el.value || el.value === '') {
            setError(el, 'This field is required');
            valid = false;
        } else {
            clearError(el);
        }
    });

    if (!valid) {
        const first = form.querySelector('.is-invalid');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showAlert('Please fill in all required fields', 'danger');
    }
    return valid;
}

function validateField(input) {
    const val = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    if (input.value && !isNaN(min) && val < min) { setError(input, `Min value is ${min}`); return false; }
    if (input.value && !isNaN(max) && val > max) { setError(input, `Max value is ${max}`); return false; }
    clearError(input);
    return true;
}

function setError(el, msg) {
    el.classList.add('is-invalid');
    let fb = el.parentNode.querySelector('.invalid-feedback');
    if (!fb) { fb = document.createElement('div'); fb.className = 'invalid-feedback'; el.parentNode.appendChild(fb); }
    fb.innerHTML = `<i class="fas fa-exclamation-circle me-1"></i>${msg}`;
}

function clearError(el) {
    el.classList.remove('is-invalid');
    const fb = el.parentNode.querySelector('.invalid-feedback');
    if (fb) fb.remove();
}

// ===== LOADING =====
function showLoading(show) {
    const loading = document.getElementById('loading');
    const btn = document.getElementById('predictBtn');
    if (loading) loading.style.display = show ? 'block' : 'none';
    if (btn) {
        btn.disabled = show;
        btn.innerHTML = show
            ? '<span class="spinner-border spinner-border-sm me-2"></span>Analyzing...'
            : '<i class="fas fa-brain me-2"></i>Predict Attrition Risk';
    }
}

// ===== DISPLAY RESULT =====
function displayResult(data) {
    const isLeaving = data.prediction.includes('may leave');
    const prob = (data.probability * 100).toFixed(1);

    // Show result panel, hide tips
    document.getElementById('tipsCard').style.display = 'none';
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';

    // Card style
    const card = document.getElementById('resultCard');
    card.className = `card result-wrapper ${isLeaving ? 'result-leave' : 'result-stay'}`;

    // Header
    const header = document.getElementById('resultHeader');
    header.style.background = isLeaving
        ? 'linear-gradient(135deg,#eb3349,#f45c43)'
        : 'linear-gradient(135deg,#11998e,#38ef7d)';

    // Probability ring
    const ring = document.getElementById('probRing');
    ring.className = `prob-ring ${isLeaving ? 'prob-ring-leave' : 'prob-ring-stay'}`;
    document.getElementById('probPercent').textContent = prob + '%';

    // Text
    document.getElementById('predictionText').textContent = data.prediction;
    document.getElementById('predictionText').style.color = isLeaving ? '#eb3349' : '#11998e';

    // Confidence badge
    const badge = document.getElementById('confidenceBadge');
    badge.textContent = data.confidence + ' Confidence';
    badge.className = `badge ${data.confidence === 'High' ? 'bg-success' : data.confidence === 'Medium' ? 'bg-warning text-dark' : 'bg-secondary'}`;

    // Progress bar
    const bar = document.getElementById('probBar');
    bar.className = `progress-bar ${isLeaving ? 'bg-danger' : 'bg-success'}`;
    setTimeout(() => { bar.style.width = prob + '%'; }, 100);

    // Recommendations
    document.getElementById('recommendations').innerHTML = getRecommendations(isLeaving);

    // Scroll to result
    setTimeout(() => resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
}

function getRecommendations(isLeaving) {
    const items = isLeaving ? [
        ['fa-calendar-check', '#eb3349', 'Schedule 1-on-1 meeting to discuss concerns'],
        ['fa-chart-line', '#f45c43', 'Explore career growth & promotion opportunities'],
        ['fa-dollar-sign', '#eb3349', 'Review compensation & benefits package'],
        ['fa-balance-scale', '#f45c43', 'Assess workload & work-life balance'],
        ['fa-award', '#eb3349', 'Implement recognition & reward programs']
    ] : [
        ['fa-thumbs-up', '#11998e', 'Maintain current positive work environment'],
        ['fa-comments', '#38ef7d', 'Schedule regular feedback & check-in sessions'],
        ['fa-rocket', '#11998e', 'Provide challenging projects & learning opportunities'],
        ['fa-users', '#38ef7d', 'Foster team collaboration & social connections'],
        ['fa-star', '#11998e', 'Continue acknowledging strong performance']
    ];

    return `
        <div style="font-size:0.82rem;">
            <div class="fw-semibold mb-2" style="font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;color:#718096;">
                <i class="fas fa-lightbulb me-1"></i>Recommendations
            </div>
            ${items.map(([icon, color, text]) => `
                <div class="rec-item">
                    <div class="rec-icon" style="background:${color}22;color:${color};">
                        <i class="fas ${icon}"></i>
                    </div>
                    <span>${text}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// ===== RESET =====
function resetForm() {
    const form = document.getElementById('predictionForm');
    if (form) {
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    }
    document.getElementById('result').style.display = 'none';
    document.getElementById('tipsCard').style.display = 'block';
    document.getElementById('probBar').style.width = '0%';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== PRINT =====
function printResult() {
    const content = document.getElementById('result').innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`
        <html><head>
            <title>HR Attrition Prediction Result</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>body{padding:30px;font-family:Poppins,sans-serif;} .btn{display:none;}</style>
        </head><body>
            <h3 class="mb-4">HR Attrition Prediction Result</h3>
            ${content}
        </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
}

// ===== ALERT =====
function showAlert(msg, type) {
    const a = document.createElement('div');
    a.className = `alert alert-${type} alert-dismissible fade show fade-in-up`;
    a.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;min-width:300px;box-shadow:0 8px 25px rgba(0,0,0,0.15);';
    a.innerHTML = `<i class="fas fa-${type === 'danger' ? 'times-circle' : 'info-circle'} me-2"></i>${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(a);
    setTimeout(() => a.remove(), 5000);
}

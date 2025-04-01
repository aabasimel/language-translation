document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('translationForm').addEventListener('submit', handleTranslationSubmit);
    
    document.getElementById('searchByIdBtn').addEventListener('click', searchById);
    document.getElementById('searchByLanguageBtn').addEventListener('click', searchByLanguage);
    
    fetchPreviousTranslations();
});

async function handleTranslationSubmit(e) {
    e.preventDefault();
    
    const text = document.getElementById('textToTranslate').value.trim();
    const languages = document.getElementById('targetLanguages').value.trim();
    
    if (!text || !languages) {
        alert('Please enter both text and target languages');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const spinner = document.getElementById('loadingSpinner');
    
    submitBtn.disabled = true;
    spinner.style.display = 'inline-block';
    
    try {
        const response = await axios.post('/translate', {
            text: text,
            target_languages: languages
        });
        
        displayTranslationResult(response.data);
        fetchPreviousTranslations();
    } catch (error) {
        console.error('Translation error:', error);
        alert('Translation failed: ' + (error.response?.data?.detail || error.message));
    } finally {
        submitBtn.disabled = false;
        spinner.style.display = 'none';
    }
}

function displayTranslationResult(data) {
    const resultsDiv = document.getElementById('translationResults');
    resultsDiv.innerHTML = '';
    
    if (!data || !data.translations) {
        resultsDiv.innerHTML = '<div class="alert alert-warning">No translations available</div>';
        return;
    }
    
    let html = `
        <div class="alert alert-success">
            <strong>Original Text:</strong> ${data.original_text || document.getElementById('textToTranslate').value}
        </div>
        <h6>Translations:</h6>
        <div class="d-flex flex-wrap mb-3">
    `;
    
    for (const [lang, translation] of Object.entries(data.translations)) {
        html += `<span class="badge bg-primary language-badge">${lang}</span>`;
    }
    
    html += `</div><div class="translations-container">`;
    
    for (const [lang, translation] of Object.entries(data.translations)) {
        html += `
            <div class="mb-2">
                <strong>${lang}:</strong>
                <div class="translation-text p-2 bg-light rounded">${translation}</div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    if (data.id) {
        html += `<div class="mt-2 text-muted">Translation ID: ${data.id}</div>`;
    }
    
    resultsDiv.innerHTML = html;
}

async function fetchPreviousTranslations() {
    try {
        const response = await axios.get('/translations');
        displayPreviousTranslations(response.data);
    } catch (error) {
        console.error('Error fetching previous translations:', error);
        document.getElementById('previousTranslations').innerHTML = `
            <div class="alert alert-danger">Failed to load previous translations</div>
        `;
    }
}

function displayPreviousTranslations(data) {
    const container = document.getElementById('previousTranslations');
    
    if (!data || !Array.isArray(data)) {
        container.innerHTML = '<div class="alert alert-info">No previous translations found</div>';
        return;
    }
    
    let html = '<div class="list-group">';
    
    data.forEach(translation => {
        const translations = typeof translation.translations === 'string' 
            ? JSON.parse(translation.translations.replace(/'/g, '"')) 
            : translation.translations;
        
        const languages = translations ? Object.keys(translations).join(', ') : 'None';
        
        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">ID: ${translation.id}</h6>
                    <small>${languages}</small>
                </div>
                <p class="mb-1">${translation.original_text}</p>
                <small class="text-muted">Click to view details</small>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add click event to each item to show details
    document.querySelectorAll('.list-group-item').forEach((item, index) => {
        item.addEventListener('click', () => showTranslationDetails(data[index]));
    });
}

async function searchById() {
    const id = document.getElementById('searchId').value.trim();
    
    if (!id) {
        alert('Please enter an ID to search');
        return;
    }
    
    try {
        const response = await axios.get(`/translations?id=${id}`);
        showTranslationDetails(response.data);
    } catch (error) {
        console.error('Search error:', error);
        alert('Error searching: ' + (error.response?.data?.detail || error.message));
    }
}

async function searchByLanguage() {
    const language = document.getElementById('searchLanguage').value.trim();
    
    if (!language) {
        alert('Please enter a language code to search');
        return;
    }
    
    try {
        const response = await axios.get(`/translations?target_language=${language}`);
        showTranslationDetails(response.data);
    } catch (error) {
        console.error('Search error:', error);
        alert('Error searching: ' + (error.response?.data?.detail || error.message));
    }
}

function showTranslationDetails(data) {
    const resultsDiv = document.getElementById('translationResults');
    
    if (!data) {
        resultsDiv.innerHTML = '<div class="alert alert-warning">No translation details found</div>';
        return;
    }
    
    let translations;
    if (typeof data.translations === 'string') {
        try {
            translations = JSON.parse(data.translations.replace(/'/g, '"'));
        } catch (e) {
            translations = {};
        }
    } else {
        translations = data.translations || {};
    }
    
    const displayData = {
        id: data.id,
        original_text: data.original_text,
        translations: translations
    };
    
    displayTranslationResult(displayData);
}
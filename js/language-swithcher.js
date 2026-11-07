// Función para cargar las traducciones
function loadTranslations(language) {
    fetch(`/jsons/${language}.json?v=${Date.now()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            console.log('Translations loaded:', translations, 'Keys:', Object.keys(translations).length);
            window.currentTranslations = translations;
            applyTranslations(translations, document);
            document.dispatchEvent(new CustomEvent('languagechange', { detail: language }));
        })
        .catch(err => console.error('Error loading translations:', err));
}

// Aplica las traducciones a un contenedor (por defecto, todo el documento)
function applyTranslations(translations, root) {
    // Traducir el contenido de los elementos
    root.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.innerText = translations[key];
        } else {
            console.warn(`Translation key "${key}" not found in translations.`);
            element.innerText = key; // Default to key if translation not found
        }
    });

    root.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[key]) {
            element.setAttribute('placeholder', translations[key]);
        } else {
            console.warn(`Translation key "${key}" not found in translations.`);
        }
    });

    // Traducir los placeholders de los campos de entrada
    const inputName = root.querySelector('.input-name');
    if (inputName) {
        if (translations.name_placeholder) {
            inputName.setAttribute('placeholder', translations.name_placeholder);
        } else {
            console.warn('Translation key "name_placeholder" not found in translations.');
        }
    }

    const inputEmail = root.querySelector('.input-email');
    if (inputEmail) {
        if (translations.email_placeholder) {
            inputEmail.setAttribute('placeholder', translations.email_placeholder);
        } else {
            console.warn('Translation key "email_placeholder" not found in translations.');
        }
    }
}

// Función para inicializar la traducción
function initializeTranslation() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    console.log('Initializing translation with language:', savedLanguage);
    loadTranslations(savedLanguage);
}

// funció per obtenir el idioma seleccionat
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
}
window.getCurrentLanguage = getCurrentLanguage; // opcional, per accedir des d'altres scripts


// Manejar el cambio de idioma
document.addEventListener('click', (event) => {
    const langLink = event.target.closest('[data-lang]');
    //console.log('click: ', langLink);
    if (langLink) {
        event.preventDefault();
        const selectedLang = langLink.getAttribute('data-lang');
        localStorage.setItem('language', selectedLang);
        loadTranslations(selectedLang);
    }
});

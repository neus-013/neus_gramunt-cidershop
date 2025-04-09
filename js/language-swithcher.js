// Función para cargar las traducciones
function loadTranslations(language) {
    fetch(`/jsons/${language}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            console.log('Translations loaded:', translations); // Verifica el contenido de las traducciones

            // Traducir el contenido de los elementos
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[key]) {
                    element.innerText = translations[key];
                } else {
                    console.warn(`Translation key "${key}" not found in translations.`);
                    element.innerText = key; // Default to key if translation not found
                }
            });

            // Traducir los placeholders de los campos de entrada
            const inputName = document.querySelector('.input-name');
            if (inputName) {
                if (translations.name_placeholder) {
                    inputName.setAttribute('placeholder', translations.name_placeholder);
                } else {
                    console.warn('Translation key "name_placeholder" not found in translations.');
                }
            } else {
                console.warn('Element with class "input-name" not found.');
            }

            const inputEmail = document.querySelector('.input-email');
            if (inputEmail) {
                if (translations.email_placeholder) {
                    inputEmail.setAttribute('placeholder', translations.email_placeholder);
                } else {
                    console.warn('Translation key "email_placeholder" not found in translations.');
                }
            } else {
                console.warn('Element with class "input-email" not found.');
            }
        })
        .catch(err => console.error('Error loading translations:', err));
}

// Función para inicializar la traducción
function initializeTranslation() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    console.log('Initializing translation with language:', savedLanguage);
    loadTranslations(savedLanguage);
}

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

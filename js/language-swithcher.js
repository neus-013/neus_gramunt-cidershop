// Función para cargar las traducciones
function loadTranslations(language) {
    fetch(`/jsons/${language}.json`) // Cambiado a /jsons/
        .then(response => response.json())
        .then(translations => {
            // Traducir el contenido de los elementos
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                element.innerText = translations[key] || key;
            });

            // Traducir los placeholders de los campos de entrada
            if (translations.name_placeholder) {
                document.querySelector('.input-name').setAttribute('placeholder', translations.name_placeholder);
            }
            if (translations.email_placeholder) {
                document.querySelector('.input-email').setAttribute('placeholder', translations.email_placeholder);
            }
        })
        .catch(err => console.error('Error loading translations:', err));
}

// Función para inicializar la traducción
function initializeTranslation() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    loadTranslations(savedLanguage);
}

// Manejar el cambio de idioma
document.addEventListener('click', (event) => {
    const langLink = event.target.closest('[data-lang]');
    if (langLink) {
        event.preventDefault();
        const selectedLang = langLink.getAttribute('data-lang');
        localStorage.setItem('language', selectedLang);
        loadTranslations(selectedLang);
    }
});

// Inicializar traducción al cargar la página
initializeTranslation();

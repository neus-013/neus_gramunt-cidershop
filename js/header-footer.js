// header-footer.js


// Llamar a la función para cargar el header y footer
function loadHeaderAndFooter() {
    // Cargar el header
    return fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        
        })
        .then(() => {
            // Cargar el footer
            return fetch('/footer.html');
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;

            // Inicializar la traducción después de cargar el footer
            initializeTranslation();
        })
        .catch(err => console.error('Error loading header or footer:', err));
}


// Llamar a la función para cargar el header y footer
loadHeaderAndFooter();

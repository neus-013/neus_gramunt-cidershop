// header-footer.js

// Función para cargar el contenido de header y footer
function loadHeaderAndFooter() {
    // Cargar el header
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeTranslation(); // Inicializa la traducción después de cargar el header
        });

    // Cargar el footer
    fetch('/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
}

// Llamar a la función para cargar el header y footer
loadHeaderAndFooter();

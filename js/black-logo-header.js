// Cargar el header dinámicamente y luego ejecutar el cambio de color del logo
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        const logo = document.querySelector('.header-logo .logo');

        // Función para cambiar el color del logo y el botón según el slide actual
        function updateLogoColor(color) {
            logo.style.setProperty('color', color, 'important');
        }

        updateLogoColor('#23282b');
    });


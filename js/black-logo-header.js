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


        
        const header = document.querySelector('.header');

        if (header) {
            console.log('Header found! Adding scroll event listener.');

            window.addEventListener('scroll', function () {
                console.log('Scroll position:', window.scrollY); // Para verificar la posición del scroll

                if (window.scrollY > 50) { // Si la posición del scroll es mayor a 50px
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // Fondo blanco con 90% opacidad
                    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'; // Añadir sombra
                } else {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Fondo transparente
                    header.style.boxShadow = 'none'; // Eliminar sombra
                }
            });
        } else {
            console.error('Header not found!');
        }

    });


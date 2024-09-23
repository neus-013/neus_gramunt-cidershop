// Cargar el header dinámicamente y luego ejecutar el cambio de color del logo
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        const logo = document.querySelector('.header-logo .logo');
        const shopButton = document.querySelector('.shop-taste');
        const slides = document.querySelector('.slides');
        const slideCount = document.querySelectorAll('.slide').length;
        const labels = document.querySelector('.labels');
        const fruits = document.querySelector('.fruits');
        let currentIndex = 0;
        let isButtonHovered = false;

        // Función para cambiar el color del logo y el botón según el slide actual
        function updateLogoColor(slideIndex) {
            let color;

            switch (slideIndex) {
                case 0:
                    color = '#298F52'; // Verde para el primer slide
                    break;
                case 1:
                    color = '#B83224'; // Rojo para el segundo slide
                    break;
                case 2:
                    color = '#433EB2'; // Azul para el tercer slide
                    break;
                default:
                    color = '#23282b'; // Negro por defecto
                    break;
            }

            if (logo) {
                logo.style.setProperty('color', color, 'important'); // Cambia con prioridad
            }

            if (shopButton) {
                shopButton.style.color = color;
                
                if (isButtonHovered) {
                    shopButton.style.backgroundColor = color;
                    shopButton.style.color = 'antiquewhite';
                }
                shopButton.addEventListener('mouseover', function () {
                    isButtonHovered = true;
                    shopButton.style.backgroundColor = color;
                    shopButton.style.color = 'antiquewhite';
                });
                shopButton.addEventListener('mouseout', function () {
                    isButtonHovered = false;
                    shopButton.style.backgroundColor = 'antiquewhite';
                    shopButton.style.color = color;
                });
            }
        }

        function showSlide(index) {
            if (index >= slideCount) currentIndex = 0;
            else if (index < 0) currentIndex = slideCount - 1;
            else currentIndex = index;

            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            labels.style.transform = `translateX(-${currentIndex * 100 / slideCount}%)`;
            fruits.style.transform = `translateY(${currentIndex * 100 / slideCount}%)`;

            updateLogoColor(currentIndex);
        }

        // Configuración inicial
        showSlide(currentIndex);

        document.querySelector('.next').addEventListener('click', () => showSlide(currentIndex + 1));
        document.querySelector('.prev').addEventListener('click', () => showSlide(currentIndex - 1));

        setInterval(() => showSlide(currentIndex + 1), 5000); // Cambiar slide cada 5 segundos
    });

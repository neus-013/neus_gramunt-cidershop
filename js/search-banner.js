document.addEventListener('DOMContentLoaded', () => {
    // Espera a que el DOM esté completamente cargado
    const searchBanner = document.getElementById('search-banner');
    const searchIcon = document.querySelector('.header-conf .options img[alt="Search icon"]');
    const closeSearch = document.getElementById('close-search');

    console.log('Search Banner:', searchBanner); // Depuración
    console.log('Search Icon:', searchIcon); // Depuración
    console.log('Close Search:', closeSearch); // Depuración

    // Verificamos que los elementos existen
    if (!searchBanner || !searchIcon || !closeSearch) {
        console.error('One or more elements not found in the DOM.');
        return;
    }

    // Muestra el banner al hacer clic en la lupa
    searchIcon.addEventListener('click', () => {
        searchBanner.style.display = 'flex'; // Muestra el banner
    });

    // Oculta el banner al hacer clic en el botón de cerrar
    closeSearch.addEventListener('click', () => {
        searchBanner.style.display = 'none'; // Oculta el banner
    });
});

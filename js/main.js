

fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;

    // Listener menú hamburguesa
    const hamburger = document.getElementById("hamburger-menu");
    const mobileMenu = document.getElementById("mobile-menu");
    console.log("hamburger:", hamburger, "mobileMenu:", mobileMenu); // DEBUG
    if (hamburger && mobileMenu) {
      hamburger.onclick = function () {
        mobileMenu.classList.toggle("open");
      };
      mobileMenu.addEventListener("click", function (event) {
        const title = event.target.closest(".mobile-menu .menu > span");
        if (title) {
          title.parentElement.parentElement.classList.toggle("expanded");
        }
      });
    }

    const closeBtn = document.querySelector(".close-mobile-menu");
    if (closeBtn && mobileMenu) {
      closeBtn.onclick = function () {
        mobileMenu.classList.remove("open");
      };
    }

    // Listener scroll per canviar el color del header
    const header = document.querySelector(".header");
    if (header) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
          header.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
          header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        } else {
          header.style.backgroundColor = "rgba(255, 255, 255, 0)";
          header.style.boxShadow = "none";
        }
      });
    }

    // Canvi de color del logo
    const logo = document.querySelector(".header-logo .logo");
    if (logo) {
      logo.style.setProperty("color", "#23282b", "important");
    }

    // Inicialitza el slider si existeix la funció global
    if (typeof window.initSlider === "function") {
      window.initSlider();
    }

    // LÒGICA DEL SLIDER (només si existeixen els elements)
    const slides = document.querySelector(".slides");
    const labels = document.querySelector(".labels");
    const fruits = document.querySelectorAll(".fruits");
    const shopButton = document.querySelector(".shop-taste");
    const logoSlider = document.querySelector(".header-logo .logo");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const slideCount = document.querySelectorAll(".slide").length;
    let currentIndex = 0;
    let isButtonHovered = false;

    if (
      slides &&
      labels &&
      fruits.length &&
      shopButton &&
      logoSlider &&
      nextBtn &&
      prevBtn
    ) {
      // ID del producte que vols mostrar
      const productId = "68e535d21a44a3f109781d29"; // substitueix amb el teu _id de Mongo

      if (shopButton) {
        shopButton.addEventListener("click", () => {
          window.location.href = `/product-detail.html?id=${productId}`;
        });
      }

      function updateLogoColor(slideIndex) {
        let color;
        switch (slideIndex) {
          case 0:
            color = "#298F52";
            break;
          case 1:
            color = "#B83224";
            break;
          case 2:
            color = "#433EB2";
            break;
          default:
            color = "#23282b";
            break;
        }
        logoSlider.style.setProperty("color", color, "important");
        shopButton.style.color = color;
        shopButton.onmouseover = function () {
          isButtonHovered = true;
          shopButton.style.backgroundColor = color;
          shopButton.style.color = "antiquewhite";
        };
        shopButton.onmouseout = function () {
          isButtonHovered = false;
          shopButton.style.backgroundColor = "antiquewhite";
          shopButton.style.color = color;
        };
      }

      function showSlide(index) {
        if (index >= slideCount) currentIndex = 0;
        else if (index < 0) currentIndex = slideCount - 1;
        else currentIndex = index;
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        labels.style.transform = `translateX(-${
          (currentIndex * 100) / slideCount
        }%)`;
        const fruitsOffset = `translateY(-${
          ((slideCount - 1 - currentIndex) * 100) / slideCount
        }%)`;
        fruits.forEach((img) => {
          img.style.transform = fruitsOffset;
        });
        if (fruitWindow) fruitWindow.dataset.slide = currentIndex;
        updateLogoColor(currentIndex);
      }

      // La lata (520px de alto) escala con la ventana de fruta para mantener la proporción
      const canContainer = document.querySelector(".can-container");
      const fruitWindow = document.querySelector(".fruits-container");

      function updateCanScale() {
        if (!canContainer || !fruitWindow) return;
        const scale = Math.min(1, (fruitWindow.clientHeight * 0.65) / 520);
        canContainer.style.transform = `scale(${scale})`;
      }

      updateCanScale();
      if (fruitWindow) new ResizeObserver(updateCanScale).observe(fruitWindow);

      showSlide(currentIndex);
      nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));
      prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
      setInterval(() => showSlide(currentIndex + 1), 5000);
    }
  })
  .then(() => {
    // Cargar el footer
    return fetch("footer.html");
  })
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
    // Inicialitzar traducció si cal
    if (typeof initializeTranslation === "function") {
      initializeTranslation();
    }
  })
  .catch((err) => console.error("Error loading header or footer:", err));

import { viewProduct, createCart, addToCart } from "./api.js";

let cartId = localStorage.getItem("cartId");

async function initCart() {
  if (!cartId) {
    const cart = await createCart();
    cartId = cart._id;
    localStorage.setItem("cartId", cartId);
  }
}

function getCurrentLanguage() {
  return localStorage.getItem("language") || "en";
}

let currentProduct = null;

async function loadProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  currentProduct = await viewProduct(productId);
  if (!currentProduct) {
     console.error("No se encontró el producto");
     return;
  };

  renderProduct(currentProduct);
}

function renderProduct(product) {
  const lang = getCurrentLanguage();

  // Nom i preu
  document.querySelector(".product-name").textContent = product.name[lang];
  document.querySelector(".product-price").textContent = `${product.price}€`;

  // Descripció
  document.querySelector(".prd-desc").textContent = product.description[lang];

  // Imatges
  const imgsContainer = document.querySelector(".product-imgs");
  imgsContainer.innerHTML = "";
  imgsContainer.classList.toggle(
    "product-imgs--totes",
    product.category === "Tote Bags"
  );
  if (product.media && product.media.length) {
    product.media.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = product.name[lang];
      img.classList.add("product-img");
      imgsContainer.appendChild(img);
    });
  }
}

document.addEventListener("languagechange", () => {
  if (currentProduct) renderProduct(currentProduct);
});

function setupAddToCart() {
  const button = document.querySelector("#btn-add-cart");
  const quantitySelect = document.querySelector(".quantity-select");

  button.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    if (!productId) return;

    await initCart();
    const quantity = parseInt(quantitySelect.value);
    await addToCart(cartId, productId, quantity);
    alert(window.currentTranslations?.product_added_to_cart?.replace("{name}", currentProduct?.name?.[getCurrentLanguage()] || "") || "Added to cart!");
  });
}

document.addEventListener("DOMContentLoaded", () => {
    initCart();
    loadProductFromURL();
    setupAddToCart();
});
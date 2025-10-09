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

async function loadProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  const product = await viewProduct(productId);
  if (!product) {
     console.error("No se encontró el producto");
     return;
  };

  const lang = getCurrentLanguage();

  console.log("Product loaded:", product.name[lang]);
  console.log("Current language:", lang);

  // Nom i preu
  document.querySelector(".product-name").textContent = product.name[lang];
  document.querySelector(".product-price").textContent = `${product.price}€`;

  // Descripció
  document.querySelector(".prd-desc").textContent = product.description[lang];
 

  // Imatges
  const imgsContainer = document.querySelector(".product-imgs");
  imgsContainer.innerHTML = "";
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
    alert("Producte afegit al carret!");
  });
}

document.addEventListener("DOMContentLoaded", () => {
    initCart();
    loadProductFromURL();
    setupAddToCart();
});
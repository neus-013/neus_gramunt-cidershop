import { viewCart, addToCart, viewProduct } from "./api.js";


let cartId = localStorage.getItem("cartId");

console.log("Cart ID:", cartId);

function getCurrentLanguage() {
  return localStorage.getItem("language") || "en";
}

const cartItemsContainer = document.querySelector(".cart-items");
const templateItem = cartItemsContainer.querySelector(".cart-item.template");
const totalPriceEl = document.querySelector(".total-price");

// Función para cargar y renderizar el carrito
async function loadCart() {
  if (!cartId) return;

  const cart = await viewCart(cartId);
  if (!cart || !cart.items) return;

  const lang = getCurrentLanguage();

  console.log("Cart loaded:", cart);

  // Limpiamos los elementos anteriores (excepto el template)
  cartItemsContainer
    .querySelectorAll(".cart-item:not(.template)")
    .forEach((el) => el.remove());


  cart.items.forEach(async (item) => {
    const itemEl = templateItem.cloneNode(true);
    itemEl.style.display = "flex";
    itemEl.classList.remove("template");
    itemEl.dataset.productId = item.productId;

    

    const nameEl = itemEl.querySelector(".cart-item-name");
    const priceEl = itemEl.querySelector(".cart-item-price");
    const quantityEl = itemEl.querySelector(".cart-item-quantity");
    const imgEl = itemEl.querySelector(".cart-item-img");

    console.log("lang", lang);
    console.log("product name", item.name);

    nameEl.textContent = item.name[lang] || item.name.en;
    priceEl.textContent = `Price: ${item.price}€`;
    quantityEl.textContent = item.quantity;

    const product = await viewProduct(item.productId);
    console.log("Product for cart item:", product);
    imgEl.src = product.media?.[0] || "";
    imgEl.alt = product.name[lang] || item.name.en;

    quantityEl.textContent = item.quantity;
    priceEl.textContent = `Price: ${item.subtotal}€`;

    // Botones
    const plusBtn = itemEl.querySelector(".plus-item-btn");
    const minusBtn = itemEl.querySelector(".minus-item-btn");
    const removeBtn = itemEl.querySelector(".remove-item-btn");

    plusBtn.addEventListener("click", async () => {
      await addToCart(cartId, item.productId, 1);
      loadCart();
    });

    minusBtn.addEventListener("click", async () => {
      if (item.quantity > 1) {
        await fetch(`http://localhost:4000/api/carts/${cartId}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity - 1,
          }),
        });
        loadCart();
      }
    });

    removeBtn.addEventListener("click", async () => {
      await fetch(
        `http://localhost:4000/api/carts/${cartId}/remove/${item.productId}`,
        {
          method: "DELETE",
        }
      );
      loadCart();
    });

    cartItemsContainer.appendChild(itemEl);
  });

  totalPriceEl.textContent = `Total: ${cart.total}€`;


  // Order now!

  const orderBtn = document.querySelector(".place-order-btn");

  orderBtn.addEventListener("click", () => {
    if (!cart || cart.items.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    const existingModal = document.querySelector(".ticket-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.classList.add("ticket-modal");

    modal.innerHTML = `
      <div class="ticket-content">
        <span class="ticket-close">&times;</span>
        <h2>🧾 Order Ticket</h2>
        <p>Date: ${new Date().toLocaleString()}</p>
        <hr>
        ${cart.items
          .map(
            (item) => `
          <div class="ticket-item">
            <p><strong>${item.name[lang] || item.name.en}</strong></p>
            <p>Qty: ${item.quantity} × ${item.price}€ = ${item.subtotal}€</p>
          </div>
        `
          )
          .join("")}
        <hr>
        <p><strong>Subtotal:</strong> ${cart.subtotal}€</p>
        <p><strong>Discount:</strong> ${cart.discount}€</p>
        <p><strong>Total:</strong> ${cart.total}€</p>
        <hr>
        <p>Espero que te haya gustado mi proyecto 👋</p>
        <p>Contact: +34 600 123 456 | mail@example.com | <a href="https://linkedin.com/in/mi-perfil" target="_blank">LinkedIn</a></p>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add("show"));

    modal.querySelector(".ticket-close").addEventListener("click", () => {
      modal.classList.remove("show");
      setTimeout(() => modal.remove(), 500);
    });
  });
  
}

// Iniciamos la carga
document.addEventListener("DOMContentLoaded", loadCart);

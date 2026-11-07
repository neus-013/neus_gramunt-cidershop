/**
 * Shopping Cart Module
 * Maneja toda la lógica del carrito de compras
 */

export class ShoppingCart {
  constructor() {
    this.cartId = this.loadCartId();
    this.items = [];
    this.total = 0;
    this.discount = 0;
    this.apiBase = "http://localhost:4000/api";
  }

  /**
   * Carga o crea un ID de carrito desde localStorage
   * @returns {string} ID del carrito
   */
  loadCartId() {
    const cartId = localStorage.getItem("cartId");
    if (cartId) return cartId;
    return null;
  }

  /**
   * Crea un nuevo carrito
   * @returns {Promise<string>} ID del nuevo carrito
   */
  async createCart() {
    try {
      const response = await fetch(`${this.apiBase}/carts`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create cart");
      }

      const data = await response.json();
      const newCartId = data._id;
      localStorage.setItem("cartId", newCartId);
      this.cartId = newCartId;
      return newCartId;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  /**
   * Obtiene la información actual del carrito
   * @returns {Promise<Object>} Datos del carrito
   */
  async getCart() {
    if (!this.cartId) {
      return null;
    }

    try {
      const response = await fetch(`${this.apiBase}/carts/${this.cartId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      this.items = data.items || [];
      this.total = data.total || 0;
      this.discount = data.discount || 0;
      return data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }

  /**
   * Añade un producto al carrito
   * @param {string} productId - ID del producto MongoDB
   * @param {number} quantity - Cantidad a añadir (default: 1)
   * @returns {Promise<Object>} Carrito actualizado
   */
  async addToCart(productId, quantity = 1) {
    if (!this.cartId) {
      await this.createCart();
    }

    // Validar parámetros
    if (!productId || typeof productId !== "string") {
      throw new Error("Invalid product ID");
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new Error("Quantity must be an integer between 1 and 100");
    }

    try {
      const response = await fetch(`${this.apiBase}/carts/${this.cartId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      await this.getCart(); // Actualizar estado local
      return data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   * @param {string} productId - ID del producto
   * @param {number} quantity - Nueva cantidad
   * @returns {Promise<Object>} Carrito actualizado
   */
  async updateQuantity(productId, quantity) {
    if (!this.cartId) {
      throw new Error("No active cart");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Invalid quantity");
    }

    try {
      const response = await fetch(
        `${this.apiBase}/carts/${this.cartId}/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();
      await this.getCart();
      return data;
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  }

  /**
   * Elimina un producto del carrito
   * @param {string} productId - ID del producto a eliminar
   * @returns {Promise<Object>} Carrito actualizado
   */
  async removeItem(productId) {
    if (!this.cartId) {
      throw new Error("No active cart");
    }

    try {
      const response = await fetch(
        `${this.apiBase}/carts/${this.cartId}/remove/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      const data = await response.json();
      await this.getCart();
      return data;
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  }

  /**
   * Aplica un descuento al carrito
   * @param {number} discountAmount - Cantidad de descuento en €
   * @returns {Promise<Object>} Carrito actualizado
   */
  async applyDiscount(discountAmount) {
    if (!this.cartId) {
      throw new Error("No active cart");
    }

    if (typeof discountAmount !== "number" || discountAmount < 0) {
      throw new Error("Invalid discount amount");
    }

    try {
      const response = await fetch(
        `${this.apiBase}/carts/${this.cartId}/discount`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ discount: discountAmount }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to apply discount");
      }

      const data = await response.json();
      await this.getCart();
      return data;
    } catch (error) {
      console.error("Error applying discount:", error);
      throw error;
    }
  }

  /**
   * Vacía el carrito
   * @returns {Promise<Object>} Carrito vacío
   */
  async clearCart() {
    if (!this.cartId) {
      throw new Error("No active cart");
    }

    try {
      const response = await fetch(
        `${this.apiBase}/carts/${this.cartId}/clear`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      const data = await response.json();
      await this.getCart();
      return data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  /**
   * Realiza el checkout
   * @returns {Promise<Object>} Ticket de compra
   */
  async checkout() {
    if (!this.cartId) {
      throw new Error("No active cart");
    }

    try {
      const response = await fetch(
        `${this.apiBase}/carts/${this.cartId}/checkout`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();
      // Limpiar carrito tras checkout exitoso
      localStorage.removeItem("cartId");
      this.cartId = null;
      return data;
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    }
  }

  /**
   * Obtiene el número de items en el carrito
   * @returns {number} Cantidad de items
   */
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Obtiene el total del carrito
   * @returns {number} Total en €
   */
  getTotal() {
    return this.total;
  }
}

// Crear instancia global para uso en otros scripts
window.shoppingCart = new ShoppingCart();

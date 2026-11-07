/**
 * Shop Page Logic
 * Gestiona la visualización y filtrado de productos
 */

import { ProductService } from "../modules/Product.js";
import { ShoppingCart } from "../modules/Cart.js";
import { UIFeedback } from "../modules/UIFeedback.js";
import {
  debounce,
  getCurrentLanguage,
  formatCurrency,
} from "../modules/utils.js";

class ShopPage {
  constructor() {
    this.productService = window.productService || new ProductService();
    this.shoppingCart = window.shoppingCart || new ShoppingCart();
    this.uiFeedback = window.uiFeedback || new UIFeedback();
    
    this.currentFilters = {
      search: "",
      category: "",
      minPrice: null,
      maxPrice: null,
      sortBy: "newest",
    };

    this.filteredProducts = [];
    this.allProducts = [];

    this.init();
  }

  async init() {
    await this.loadProducts();
    this.setupEventListeners();
    this.applyFilters();
  }

  /**
   * Carga todos los productos
   */
  async loadProducts() {
    try {
      this.showLoading(true);
      const products = await this.productService.getAllProducts();
      this.allProducts = products;
      this.filteredProducts = products;
      this.populateCategories();
      this.renderProducts();
    } catch (error) {
      console.error("Error loading products:", error);
      this.uiFeedback.showError("Failed to load products");
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Configura los listeners de eventos
   */
  setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-select");
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");
    const sortSelect = document.getElementById("sort-select");
    const clearFiltersBtn = document.getElementById("clear-filters-btn");

    // Búsqueda con debounce
    const debouncedSearch = debounce((value) => {
      this.currentFilters.search = value;
      this.applyFilters();
    }, 300);

    searchInput?.addEventListener("input", (e) => {
      debouncedSearch(e.target.value);
    });

    // Categoría
    categorySelect?.addEventListener("change", (e) => {
      this.currentFilters.category = e.target.value;
      this.applyFilters();
    });

    // Precio mínimo
    priceMin?.addEventListener("input", (e) => {
      this.currentFilters.minPrice = e.target.value
        ? parseFloat(e.target.value)
        : null;
      this.applyFilters();
    });

    // Precio máximo
    priceMax?.addEventListener("input", (e) => {
      this.currentFilters.maxPrice = e.target.value
        ? parseFloat(e.target.value)
        : null;
      this.applyFilters();
    });

    // Ordenamiento
    sortSelect?.addEventListener("change", (e) => {
      this.currentFilters.sortBy = e.target.value;
      this.applyFilters();
    });

    // Limpiar filtros
    clearFiltersBtn?.addEventListener("click", () => {
      this.clearAllFilters();
    });
  }

  /**
   * Aplica los filtros actuales
   */
  applyFilters() {
    let filtered = this.productService.filterProducts({
      category: this.currentFilters.category,
      minPrice: this.currentFilters.minPrice,
      maxPrice: this.currentFilters.maxPrice,
      search: this.currentFilters.search,
    });

    // Ordenar
    filtered = this.productService.sortProducts(
      filtered,
      this.currentFilters.sortBy
    );

    this.filteredProducts = filtered;
    this.renderProducts();
  }

  /**
   * Renderiza los productos en el grid
   */
  renderProducts() {
    const grid = document.getElementById("products-grid");
    const template = document.getElementById("product-card-template");
    const loadingState = document.getElementById("loading-state");
    const emptyState = document.getElementById("empty-state");
    const productsCount = document.getElementById("products-count");

    grid.innerHTML = "";

    if (this.filteredProducts.length === 0) {
      grid.style.display = "none";
      emptyState.style.display = "flex";
      loadingState.style.display = "none";
      productsCount.textContent = "0";
      return;
    }

    grid.style.display = "grid";
    emptyState.style.display = "none";
    loadingState.style.display = "none";
    productsCount.textContent = this.filteredProducts.length;

    const language = getCurrentLanguage();

    this.filteredProducts.forEach((product) => {
      const clone = template.content.cloneNode(true);

      // Imagen
      const img = clone.querySelector(".product-image");
      img.src = product.media?.[0] || "/img/placeholder.png";
      img.alt = this.productService.getProductName(product, language);

      // Nombre
      const name = clone.querySelector(".product-name");
      name.textContent = this.productService.getProductName(product, language);

      // Descripción
      const description = clone.querySelector(".product-description");
      const desc = this.productService.getProductDescription(product, language);
      description.textContent = desc.substring(0, 80) + "...";

      // Precio
      const price = clone.querySelector(".product-price");
      price.textContent = formatCurrency(product.price);

      // Botón add to cart
      const addBtn = clone.querySelector(".btn-add-cart");
      addBtn.addEventListener("click", () => {
        this.handleAddToCart(product);
      });

      grid.appendChild(clone);
    });
  }

  /**
   * Maneja el click en añadir al carrito
   */
  async handleAddToCart(product) {
    try {
      await this.shoppingCart.addToCart(product._id, 1);
      this.uiFeedback.showSuccess(
        `${this.productService.getProductName(
          product,
          getCurrentLanguage()
        )} added to cart!`
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      this.uiFeedback.showError("Failed to add to cart");
    }
  }

  /**
   * Puebla el selector de categorías
   */
  populateCategories() {
    const categorySelect = document.getElementById("category-select");
    const categories = this.productService.getCategories();

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  /**
   * Limpia todos los filtros
   */
  clearAllFilters() {
    this.currentFilters = {
      search: "",
      category: "",
      minPrice: null,
      maxPrice: null,
      sortBy: "newest",
    };

    document.getElementById("search-input").value = "";
    document.getElementById("category-select").value = "";
    document.getElementById("price-min").value = "";
    document.getElementById("price-max").value = "";
    document.getElementById("sort-select").value = "newest";

    this.applyFilters();
  }

  /**
   * Muestra/oculta el estado de carga
   */
  showLoading(show) {
    const loadingState = document.getElementById("loading-state");
    const grid = document.getElementById("products-grid");

    if (show) {
      loadingState.style.display = "flex";
      grid.style.display = "none";
    } else {
      loadingState.style.display = "none";
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new ShopPage();
});

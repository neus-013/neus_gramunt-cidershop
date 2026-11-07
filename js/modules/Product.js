/**
 * Product Module
 * Maneja toda la lógica relacionada con productos
 */

export class ProductService {
  constructor() {
    this.apiBase = "http://localhost:4000/api";
    this.products = [];
    this.cache = new Map();
  }

  /**
   * Obtiene todos los productos
   * @returns {Promise<Array>} Lista de productos
   */
  async getAllProducts() {
    try {
      const response = await fetch(`${this.apiBase}/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      this.products = data;
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  /**
   * Obtiene un producto por ID
   * @param {string} productId - ID del producto MongoDB
   * @returns {Promise<Object>} Datos del producto
   */
  async getProduct(productId) {
    // Buscar en caché primero
    if (this.cache.has(productId)) {
      return this.cache.get(productId);
    }

    if (!productId || typeof productId !== "string") {
      throw new Error("Invalid product ID");
    }

    try {
      const response = await fetch(`${this.apiBase}/products/${productId}`);

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();
      this.cache.set(productId, data);
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  /**
   * Crea un nuevo producto (solo para admin)
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async createProduct(productData) {
    if (!productData || typeof productData !== "object") {
      throw new Error("Invalid product data");
    }

    try {
      const response = await fetch(`${this.apiBase}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  /**
   * Filtra productos por criterios
   * @param {Object} filters - Objeto con filtros { category, minPrice, maxPrice, search }
   * @returns {Array} Productos filtrados
   */
  filterProducts(filters = {}) {
    let results = [...this.products];

    if (filters.category) {
      results = results.filter(
        (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.minPrice) {
      results = results.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      results = results.filter((p) => p.price <= filters.maxPrice);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name?.en?.toLowerCase().includes(searchTerm) ||
          p.name?.es?.toLowerCase().includes(searchTerm) ||
          p.name?.ca?.toLowerCase().includes(searchTerm) ||
          p.description?.en?.toLowerCase().includes(searchTerm) ||
          p.description?.es?.toLowerCase().includes(searchTerm) ||
          p.description?.ca?.toLowerCase().includes(searchTerm)
      );
    }

    return results;
  }

  /**
   * Ordena productos por criterio
   * @param {Array} products - Productos a ordenar
   * @param {string} sortBy - Criterio: 'price-asc', 'price-desc', 'newest', 'popular'
   * @returns {Array} Productos ordenados
   */
  sortProducts(products, sortBy = "newest") {
    const sorted = [...products];

    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.reverse(); // Asumir que los últimos agregados están al final
        break;
      case "popular":
        // Implementar después con datos de popularidad
        break;
      default:
        break;
    }

    return sorted;
  }

  /**
   * Obtiene productos destacados
   * @param {number} limit - Número máximo de productos
   * @returns {Array} Productos destacados
   */
  getFeaturedProducts(limit = 5) {
    return this.products.slice(0, limit);
  }

  /**
   * Obtiene productos por categoría
   * @param {string} category - Nombre de la categoría
   * @returns {Array} Productos de esa categoría
   */
  getProductsByCategory(category) {
    return this.products.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Busca productos (con debounce en frontend)
   * @param {string} query - Término de búsqueda
   * @returns {Array} Resultados de búsqueda
   */
  searchProducts(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return this.filterProducts({ search: query.trim() });
  }

  /**
   * Limpia la caché
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Obtiene el nombre del producto en el idioma actual
   * @param {Object} product - Producto
   * @param {string} language - Código de idioma (en, es, ca)
   * @returns {string} Nombre del producto
   */
  getProductName(product, language = "en") {
    return product?.name?.[language] || product?.name?.en || "Unknown";
  }

  /**
   * Obtiene la descripción del producto en el idioma actual
   * @param {Object} product - Producto
   * @param {string} language - Código de idioma
   * @returns {string} Descripción del producto
   */
  getProductDescription(product, language = "en") {
    return (
      product?.description?.[language] ||
      product?.description?.en ||
      "No description"
    );
  }

  /**
   * Obtiene las categorías únicas de todos los productos
   * @returns {Array} Array de categorías
   */
  getCategories() {
    return [...new Set(this.products.map((p) => p.category).filter(Boolean))];
  }

  /**
   * Obtiene el rango de precios de productos
   * @returns {Object} { min, max }
   */
  getPriceRange() {
    if (this.products.length === 0) return { min: 0, max: 0 };

    const prices = this.products.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}

// Crear instancia global
window.productService = new ProductService();

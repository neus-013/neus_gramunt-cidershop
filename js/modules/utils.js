/**
 * Utilities Module
 * Funciones auxiliares comunes
 */

/**
 * Debounce: ejecuta una función después de que transcurra un tiempo sin ser llamada
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle: limita la ejecución de una función a máximo una vez cada X ms
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Intervalo mínimo en ms
 * @returns {Function} Función throttled
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
export function isNotEmpty(value) {
  return value && value.trim().length > 0;
}

/**
 * Valida un número positivo
 * @param {number} value - Número a validar
 * @returns {boolean} True si es válido
 */
export function isPositiveNumber(value) {
  return Number.isFinite(value) && value > 0;
}

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad
 * @param {string} currency - Código de moneda (default: EUR)
 * @returns {string} Cantidad formateada
 */
export function formatCurrency(amount, currency = "EUR") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formatea una fecha
 * @param {Date|string} date - Fecha
 * @param {string} locale - Locale (default: es-ES)
 * @returns {string} Fecha formateada
 */
export function formatDate(date, locale = "es-ES") {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale);
}

/**
 * Formatea una fecha y hora
 * @param {Date|string} date - Fecha
   * @param {string} locale - Locale
   * @returns {string} Fecha y hora formateadas
   */
export function formatDateTime(date, locale = "es-ES") {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale);
}

/**
 * Obtiene el idioma actual del localStorage
 * @returns {string} Código de idioma (en, es, ca)
 */
export function getCurrentLanguage() {
  return localStorage.getItem("language") || "en";
}

/**
 * Guarda el idioma en localStorage
 * @param {string} language - Código de idioma
 */
export function setLanguage(language) {
  localStorage.setItem("language", language);
}

/**
 * Valida un formulario
 * @param {HTMLElement} form - Elemento del formulario
 * @returns {Object} { isValid: boolean, errors: Array }
 */
export function validateForm(form) {
  const errors = [];
  const inputs = form.querySelectorAll("input, textarea, select");

  inputs.forEach((input) => {
    const value = input.value.trim();

    // Validación requerida
    if (input.hasAttribute("required") && !value) {
      errors.push(`${input.name || input.id} is required`);
    }

    // Validación de email
    if (input.type === "email" && value && !isValidEmail(value)) {
      errors.push(`${input.name} must be a valid email`);
    }

    // Validación de número
    if (input.type === "number" && value && isNaN(value)) {
      errors.push(`${input.name} must be a number`);
    }

    // Validación de longitud mínima
    const minLength = input.getAttribute("minlength");
    if (minLength && value && value.length < parseInt(minLength)) {
      errors.push(`${input.name} must be at least ${minLength} characters`);
    }

    // Validación de longitud máxima
    const maxLength = input.getAttribute("maxlength");
    if (maxLength && value && value.length > parseInt(maxLength)) {
      errors.push(`${input.name} must be no more than ${maxLength} characters`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Clona un objeto profundamente
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} Clon del objeto
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Comprueba si un objeto está vacío
 * @param {Object} obj - Objeto a comprobar
 * @returns {boolean} True si está vacío
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Obtiene un parámetro de la URL
 * @param {string} param - Nombre del parámetro
 * @returns {string|null} Valor del parámetro
 */
export function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

/**
 * Establece múltiples parámetros de URL
 * @param {Object} params - Objeto con parámetros
 */
export function setQueryParams(params) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  window.history.replaceState({}, "", url);
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió correctamente
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Espera un cierto tiempo
 * @param {number} ms - Milisegundos
 * @returns {Promise} Promesa que se resuelve después del tiempo
 */
export function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Obtiene el valor de una cookie
 * @param {string} name - Nombre de la cookie
 * @returns {string|null} Valor de la cookie
 */
export function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

/**
 * Establece una cookie
 * @param {string} name - Nombre
 * @param {string} value - Valor
 * @param {number} days - Días de expiración
 */
export function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

/**
 * Elimina una cookie
 * @param {string} name - Nombre de la cookie
 */
export function deleteCookie(name) {
  setCookie(name, "", -1);
}

/**
 * Calcula el tiempo transcurrido en formato legible
 * @param {Date|string} date - Fecha
 * @returns {string} Tiempo transcurrido
 */
export function getTimeAgo(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Detecta si el dispositivo es móvil
 * @returns {boolean} True si es móvil
 */
export function isMobile() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  );
}

/**
 * Obtiene el altura de la pantalla visible
 * @returns {number} Altura en píxeles
 */
export function getViewportHeight() {
  return window.innerHeight;
}

/**
 * Obtiene la anchura de la pantalla visible
 * @returns {number} Anchura en píxeles
 */
export function getViewportWidth() {
  return window.innerWidth;
}

/**
 * Ejecuta una función cuando el DOM está listo
 * @param {Function} callback - Función a ejecutar
 */
export function onDOMReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

/**
 * Observa cambios en un elemento con IntersectionObserver
 * @param {HTMLElement} element - Elemento a observar
 * @param {Function} callback - Función cuando se intersecta
 * @param {Object} options - Opciones del observer
 * @returns {IntersectionObserver} Observer
 */
export function observeElement(
  element,
  callback,
  options = { threshold: 0.5 }
) {
  const observer = new IntersectionObserver(callback, options);
  observer.observe(element);
  return observer;
}

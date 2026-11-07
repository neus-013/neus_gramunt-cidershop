/**
 * UI Feedback Module
 * Maneja notificaciones, toasts y feedback visual
 */

export class UIFeedback {
  constructor() {
    this.toastContainer = this.createToastContainer();
  }

  /**
   * Crea el contenedor para notificaciones
   * @returns {HTMLElement} Contenedor de toasts
   */
  createToastContainer() {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Muestra un toast de éxito
   * @param {string} message - Mensaje a mostrar
   * @param {number} duration - Duración en ms (default: 3000)
   */
  showSuccess(message, duration = 3000) {
    this.showToast(message, "success", duration);
  }

  /**
   * Muestra un toast de error
   * @param {string} message - Mensaje de error
   * @param {number} duration - Duración en ms
   */
  showError(message, duration = 4000) {
    this.showToast(message, "error", duration);
  }

  /**
   * Muestra un toast de advertencia
   * @param {string} message - Mensaje de advertencia
   * @param {number} duration - Duración en ms
   */
  showWarning(message, duration = 3500) {
    this.showToast(message, "warning", duration);
  }

  /**
   * Muestra un toast de información
   * @param {string} message - Mensaje informativo
   * @param {number} duration - Duración en ms
   */
  showInfo(message, duration = 3000) {
    this.showToast(message, "info", duration);
  }

  /**
   * Muestra un toast personalizado
   * @param {string} message - Mensaje
   * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duración en ms
   */
  showToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      padding: 16px 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
      word-wrap: break-word;
    `;

    // Estilos por tipo
    const styles = {
      success: {
        background: "#10b981",
        color: "white",
      },
      error: {
        background: "#ef4444",
        color: "white",
      },
      warning: {
        background: "#f59e0b",
        color: "white",
      },
      info: {
        background: "#3b82f6",
        color: "white",
      },
    };

    const style = styles[type] || styles.info;
    toast.style.backgroundColor = style.background;
    toast.style.color = style.color;
    toast.textContent = message;

    this.toastContainer.appendChild(toast);

    // Auto-remove después de duration
    const timeout = setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => toast.remove(), 300);
    }, duration);

    // Permitir cerrar manualmente
    toast.style.cursor = "pointer";
    toast.addEventListener("click", () => {
      clearTimeout(timeout);
      toast.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => toast.remove(), 300);
    });
  }

  /**
   * Muestra un spinner de carga
   * @param {HTMLElement} element - Elemento donde mostrar el spinner
   * @param {string} message - Mensaje opcional
   */
  showLoading(element, message = "Loading...") {
    if (!element) return;

    const spinner = document.createElement("div");
    spinner.className = "spinner-overlay";
    spinner.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    `;

    spinner.innerHTML = `
      <div class="spinner" style="
        width: 20px;
        height: 20px;
        border: 3px solid rgba(0,0,0,0.1);
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      "></div>
      <span>${message}</span>
    `;

    element.innerHTML = "";
    element.appendChild(spinner);
  }

  /**
   * Oculta el spinner de carga
   * @param {HTMLElement} element - Elemento donde se mostraba el spinner
   */
  hideLoading(element) {
    if (!element) return;
    const spinner = element.querySelector(".spinner-overlay");
    if (spinner) spinner.remove();
  }

  /**
   * Muestra un modal de confirmación
   * @param {string} title - Título del modal
   * @param {string} message - Mensaje
   * @param {string} confirmText - Texto del botón confirmar
   * @param {string} cancelText - Texto del botón cancelar
   * @returns {Promise<boolean>} Resultado de la confirmación
   */
  async showConfirm(
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel"
  ) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      modal.innerHTML = `
        <div style="
          background: white;
          padding: 24px;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
        ">
          <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">
            ${title}
          </h2>
          <p style="margin: 0 0 24px 0; color: #666; font-size: 14px;">
            ${message}
          </p>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="cancel-btn" style="
              padding: 8px 16px;
              border: 1px solid #ddd;
              background: white;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: 0.2s;
            ">
              ${cancelText}
            </button>
            <button id="confirm-btn" style="
              padding: 8px 16px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: 0.2s;
            ">
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const confirmBtn = modal.querySelector("#confirm-btn");
      const cancelBtn = modal.querySelector("#cancel-btn");

      confirmBtn.addEventListener("click", () => {
        modal.remove();
        resolve(true);
      });

      cancelBtn.addEventListener("click", () => {
        modal.remove();
        resolve(false);
      });

      // Cerrar con ESC
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          document.removeEventListener("keydown", handleKeyDown);
          modal.remove();
          resolve(false);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
    });
  }

  /**
   * Agrega animaciones CSS si no existen
   */
  static injectStyles() {
    if (document.getElementById("ui-feedback-styles")) return;

    const style = document.createElement("style");
    style.id = "ui-feedback-styles";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .toast {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .toast::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }
}

// Inyectar estilos
UIFeedback.injectStyles();

// Crear instancia global
window.uiFeedback = new UIFeedback();

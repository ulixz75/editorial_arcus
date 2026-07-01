// js/coachmark.js

(function() {
  const TOUR_KEY = 'arcus-coachmark-done';

  if (localStorage.getItem(TOUR_KEY)) return;

  document.addEventListener('DOMContentLoaded', function() {
    if (!document.body.classList.contains('splash-active')) {
      setTimeout(initCoachMark, 1000);
      return;
    }
    const checkSplash = setInterval(function() {
      if (!document.body.classList.contains('splash-active')) {
        clearInterval(checkSplash);
        setTimeout(initCoachMark, 500);
      }
    }, 500);
  });

  function initCoachMark() {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '[data-step="1"]',
          intro: "¡Bienvenido! Comienza explorando nuestra colección de libros.",
          position: 'bottom'
        },
        {
          element: '[data-step="3"]',
          intro: "Filtra los libros por categoría para encontrar justo lo que buscas.",
          position: 'top'
        },
        {
          element: '.view-btn',
          intro: "Cada libro tiene una descripción completa. Haz clic en 'Ver Detalles' para leer una muestra gratuita.",
          position: 'top'
        },
        {
          element: '[data-step="5"]',
          intro: "Tu carrito de compras. Aquí se acumulan los libros que quieres adquirir.",
          position: 'left'
        },
        {
          element: '[data-step="6"]',
          intro: "Elige tu idioma: español o inglés.",
          position: 'bottom'
        },
        {
          element: '[data-step="7"]',
          intro: "Alterna entre modo oscuro y claro según te sientas más cómodo.",
          position: 'bottom'
        },
        {
          element: '[data-step="8"]',
          intro: "¿Necesitas ayuda? Escríbenos por WhatsApp directamente.",
          position: 'left'
        }
      ],
      showProgress: false,
      showBullets: true,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      disableInteraction: false,
      tooltipClass: 'custom-tooltip',
      highlightClass: 'custom-highlight',
      nextLabel: 'Next',
      prevLabel: 'Prev',
      doneLabel: 'Done'
    });

    intro.onexit(function() {
      localStorage.setItem(TOUR_KEY, 'true');
    });
    intro.oncomplete(function() {
      localStorage.setItem(TOUR_KEY, 'true');
    });

    intro.start();
  }

  // No se requiere script para color, manejado por CSS

  window.replayCoachMark = function() {
    localStorage.removeItem(TOUR_KEY);
    initCoachMark();
  };
})();

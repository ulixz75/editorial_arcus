// js/coachmark.js — On-demand editorial quick tour (never auto-fires on first paint)
(function () {
  'use strict';

  function initCoachMark() {
    if (typeof introJs !== 'function') return;

    const steps = [
      {
        element: '[data-step="1"]',
        intro: 'Explora la colección completa de libros de Editorial Arcus.',
        position: 'bottom',
      },
      {
        element: '[data-step="3"]',
        intro: 'Filtra las obras por temática o utiliza el buscador para encontrar un título.',
        position: 'top',
      },
      {
        element: '[data-step="4"]',
        intro: 'Abre cada libro para leer una muestra gratuita y acceder a Amazon, Google Play Books o Books2Read.',
        position: 'top',
      },
      {
        element: '[data-step="8"]',
        intro: '¿Tienes dudas editoriales? Contáctanos directamente por WhatsApp.',
        position: 'left',
      },
    ].filter((s) => document.querySelector(s.element));

    if (steps.length === 0) return;

    const intro = introJs();
    intro.setOptions({
      steps: steps,
      showProgress: false,
      showBullets: true,
      exitOnOverlayClick: true,
      showStepNumbers: false,
      tooltipClass: 'custom-tooltip',
      nextLabel: 'Siguiente',
      prevLabel: 'Anterior',
      doneLabel: 'Listo',
    });

    intro.start();
  }

  window.replayCoachMark = function () {
    initCoachMark();
  };
})();

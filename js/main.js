import { destinations } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('#main-nav');

  // Helper function to open or close the menu
  function toggleMenu(forceState) {
    const isCurrentlyOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    const nextState = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

    // 1. Keep aria-expanded honest
    menuToggle.setAttribute('aria-expanded', String(nextState));

    // 2. Toggle visual visibility
    mainNav.classList.toggle('main-nav.is-open', nextState);
  }

  // Toggle on click (also fires natively on Enter/Space when button is focused)
  menuToggle.addEventListener('click', () => {
    toggleMenu();
  });

  // Close on Escape and return focus to the toggle button
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        toggleMenu(false);
        menuToggle.focus();
      }
    }
  });
});

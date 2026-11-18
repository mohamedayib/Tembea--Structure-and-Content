import { destinations } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================
  // 1. NAVIGATION: MOBILE MENU TOGGLE (All Pages)
  // ==========================================================
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('#main-nav');

  const toggleMenu = (forceState) => {
    if (!menuToggle || !mainNav) return;

    const isCurrentlyOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    const nextState = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

    menuToggle.setAttribute('aria-expanded', String(nextState));
    mainNav.classList.toggle('is-open', nextState);
  };

  menuToggle?.addEventListener('click', () => {
    toggleMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      menuToggle.focus();
    }
  });

  // ==========================================================
  // 2 & 4. DESTINATION CARD RENDERER (index.html & destinations.html)
  // ==========================================================
  const featuredContainer = document.querySelector('#featured-destinations');
  const gridContainer = document.querySelector('#destinations-grid');
  const resultCountEl = document.querySelector('#result-count');

  const renderDestinations = (destinationList, targetContainer = gridContainer) => {
    if (!targetContainer) return;

    // Update live result count when rendering the full destinations grid
    if (resultCountEl && targetContainer === gridContainer) {
      if (destinationList.length === 0) {
        resultCountEl.textContent = 'No destinations match.';
      } else if (destinationList.length === 1) {
        resultCountEl.textContent = '1 destination found.';
      } else {
        resultCountEl.textContent = `${destinationList.length} destinations found.`;
      }
    }

    // Clear existing cards
    targetContainer.innerHTML = '';

    // Empty state message
    if (destinationList.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'empty-state';
      emptyMsg.textContent = 'No destinations match. Try a different filter.';
      targetContainer.appendChild(emptyMsg);
      return;
    }

    destinationList.forEach((destination) => {
      const totalTripCost = destination.pricePerNight * destination.nights;

      // STEP 1: Static HTML structure via innerHTML (no data interpolated)
      const card = document.createElement('article');
      card.className = 'gallery';
      card.innerHTML = `
        <img class="gallery-image" width="500" height="300" loading="lazy" />
        <div class="card-body">
          <span class="status-badge"></span>
          <h3></h3>
          <p class="card-region"></p>
          <p class="card-price"></p>
          <p class="card-total"></p>
          <p class="card-description"></p>
          <a class="btn book-btn"></a>
        </div>
      `;

      // STEP 2A: Set image & link attributes via direct property assignment
      const img = card.querySelector('.gallery-image');
      img.src = destination.image;
      img.alt = destination.imageAlt;

      const bookBtn = card.querySelector('.book-btn');
      if (destination.isAvailable) {
        bookBtn.textContent = 'Book now';
        bookBtn.href = `./contact.html?destination=${encodeURIComponent(destination.name)}`;
      } else {
        bookBtn.textContent = 'Sold out';
        bookBtn.setAttribute('aria-disabled', 'true');
        bookBtn.classList.add('is-disabled');
        bookBtn.tabIndex = -1;
      }

      // STEP 2B: Populate text content safely via textContent
      const badge = card.querySelector('.status-badge');
      badge.textContent = destination.isAvailable ? 'Available' : 'Sold out';
      badge.classList.add(destination.isAvailable ? 'badge-available' : 'badge-sold-out');

      card.querySelector('h3').textContent = destination.name;
      card.querySelector('.card-region').textContent = `Region: ${destination.region}`;
      card.querySelector('.card-price').textContent = `KSh ${destination.pricePerNight.toLocaleString()} / night (${destination.nights} nights)`;
      card.querySelector('.card-total').textContent = `Total trip cost: KSh ${totalTripCost.toLocaleString()}`;
      card.querySelector('.card-description').textContent = destination.description;

      targetContainer.appendChild(card);
    });
  };

  // Prevent navigation if a disabled "Sold out" button is clicked on any page
  document.addEventListener('click', (event) => {
    const disabledBtn = event.target.closest('.book-btn[aria-disabled="true"]');
    if (disabledBtn) {
      event.preventDefault();
    }
  });

  // Render 3 featured destinations on index.html
  if (featuredContainer) {
    const featuredList = destinations.slice(0, 3);
    renderDestinations(featuredList, featuredContainer);
  }

  // ==========================================================
  // 3. FILTER BY REGION + LIVE SEARCH (destinations.html)
  // ==========================================================
  const filterContainer = document.querySelector('#region-filters');
  const searchInput = document.querySelector('#destination-search');

  let activeRegion = 'all';
  let searchQuery = '';

  const applyFiltersAndSearch = () => {
    const filtered = destinations.filter((dest) => {
      const matchesRegion =
        activeRegion === 'all' || dest.region.toLowerCase() === activeRegion;
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery);
      return matchesRegion && matchesSearch;
    });

    renderDestinations(filtered, gridContainer);
  };

  // Event delegation: single click listener on the filter container
  filterContainer?.addEventListener('click', (event) => {
    const clickedBtn = event.target.closest('.filter-btn');
    if (!clickedBtn) return;

    filterContainer.querySelectorAll('.filter-btn').forEach((btn) => {
      const isSelected = btn === clickedBtn;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });

    activeRegion = clickedBtn.dataset.region.toLowerCase();
    applyFiltersAndSearch();
  });

  // Live search input listener
  searchInput?.addEventListener('input', (event) => {
    searchQuery = event.target.value.trim().toLowerCase();
    applyFiltersAndSearch();
  });

  // Render all 9 destinations on destinations.html
  if (gridContainer) {
    renderDestinations(destinations, gridContainer);
  }

  // ==========================================================
  // 5. CONTACT FORM VALIDATION (contact.html)
  // ==========================================================
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    const fullNameInput = contactForm.querySelector('#full-name');
    const emailInput = contactForm.querySelector('#email');
    const messageInput = contactForm.querySelector('#message');
    const destinationSelect = contactForm.querySelector('#destination');
    const formStatus = contactForm.querySelector('#form-status');

    // Pre-select destination if user arrived via "Book now" link
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedDest = urlParams.get('destination');
    if (preselectedDest && destinationSelect) {
      destinationSelect.value = preselectedDest;
    }

    const fields = [
      {
        input: fullNameInput,
        errorEl: contactForm.querySelector('#full-name-error'),
        validate: (value) => (value.trim() === '' ? 'Full name is required.' : '')
      },
      {
        input: emailInput,
        errorEl: contactForm.querySelector('#email-error'),
        validate: (value) => {
          const trimmed = value.trim();
          if (trimmed === '') return 'Email address is required.';
          if (!trimmed.includes('@')) return 'Please enter a valid email address containing @.';
          return '';
        }
      },
      {
        input: messageInput,
        errorEl: contactForm.querySelector('#message-error'),
        validate: (value) => {
          const trimmed = value.trim();
          if (trimmed === '') return 'Please tell us about your trip.';
          if (trimmed.length < 20) {
            return `Message must be at least 20 characters (currently ${trimmed.length}).`;
          }
          return '';
        }
      }
    ];

    const setFieldError = (field, message) => {
      if (!field.errorEl || !field.input) return;

      if (message) {
        field.errorEl.textContent = message;
        field.input.setAttribute('aria-invalid', 'true');
      } else {
        field.errorEl.textContent = '';
        field.input.removeAttribute('aria-invalid');
      }
    };

    // Clear per-field errors live as the user types
    for (const field of fields) {
      field.input?.addEventListener('input', () => {
        if (field.input.getAttribute('aria-invalid') === 'true') {
          const errorMessage = field.validate(field.input.value);
          setFieldError(field, errorMessage);
        }
      });
    }

    // Validate all fields on submit
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (formStatus) formStatus.textContent = '';

      let firstFailingInput = null;

      for (const field of fields) {
        const errorMessage = field.validate(field.input.value);
        setFieldError(field, errorMessage);

        if (errorMessage && !firstFailingInput) {
          firstFailingInput = field.input;
        }
      }

      if (firstFailingInput) {
        firstFailingInput.focus();
        return;
      }

      // Success: reset form, clear error states, show confirmation
      contactForm.reset();
      for (const field of fields) {
        setFieldError(field, '');
      }
      if (formStatus) {
        formStatus.textContent = 'Thank you! Your trip inquiry has been received. We will contact you shortly.';
      }
    });
  }
});
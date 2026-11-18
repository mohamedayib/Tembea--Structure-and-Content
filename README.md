# Tembea Kenya — Interactive Travel Website (Phase 3)

Tembea Kenya is a multi-page responsive travel and tourism web application showcasing Kenyan wildlife reserves, coastal beaches, and adventure destinations. In Phase 3, the site was upgraded with modular ES6 JavaScript (`js/data.js` and `js/main.js`) to support accessible mobile navigation, dynamic destination card rendering, live search and region filtering, and accessible client-side form validation.

## Live Demo
- **Deployed Site:** [https://mohamedayib.github.io/Tembea--Structure-and-Content/]

---

## Features Implemented
- **Accessible Mobile Navigation:** Toggles the navigation drawer on click, keeps `aria-expanded` synchronized (`"true"` / `"false"`), supports full `Tab` keyboard navigation, and closes on `Escape` while returning focus to the toggle button.
- **Dynamic Destination Grid:** Renders featured destinations on `index.html` and the full 9-destination catalog on `destinations.html` from `js/data.js`, complete with `Available` / `Sold out` status badges, formatted pricing (`toLocaleString`), total trip cost calculations (`pricePerNight × nights`), and disabled booking states for unavailable trips.
- **Region Filter & Live Search:** Uses event delegation on `#region-filters` (`All`, `Coast`, `Rift Valley`, `Central`) with `aria-pressed` states combined with real-time name search (`<input type="search">`), an `aria-live="polite"` result counter, and a friendly empty-state message.
- **Accessible Contact Form Validation:** Validates required fields (`Full Name`, `Email` containing `@`, and `Message` with a 20-character minimum) on submit, links field-level error messages via `aria-describedby` and `aria-invalid="true"`, focuses the first failing field, clears errors live as the user types, and displays an `aria-live="polite"` confirmation message upon success.

---

## Security & DOM Rendering Approach (`textContent` vs. `innerHTML`)
In this project, dynamic destination data and user-facing messages are injected into the DOM using `textContent` (alongside direct property assignment such as `.src`, `.alt`, and `.href`) rather than interpolating variables directly into `innerHTML`. While `innerHTML` parses strings as raw HTML and will execute any embedded `<script>` tags or malicious event handlers—creating a Cross-Site Scripting (XSS) vulnerability if external or user-supplied data contains markup—`textContent` treats all assigned values strictly as plain text and automatically escapes special characters. Using a two-step pattern (creating static structural markup first and populating all dynamic values via `textContent`) keeps the rendering logic clean, predictable, and completely protected against script injection.

---

## Screenshots

### 1. Open Mobile Menu (`aria-expanded="true"`)
![Open Mobile Navigation Menu](./screenshots/mobile-menu-open.png)

### 2. Filtered Destination Grid & Live Search
![Filtered Destination Grid](./screenshots/filtered-destinations.png)

# ,

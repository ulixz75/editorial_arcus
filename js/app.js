/**
 * ARCUS Editorial — Storefront Controller
 * Zero on-site payment/cart/checkout; routes buyers directly to Amazon, Google Play Books, Books2Read, and free edition downloads.
 */
(function () {
  'use strict';

  const Catalog = window.ArcusCatalog;
  const BOOKS = Catalog ? Catalog.BOOKS : [];

  let currentLanguage = 'es';
  let activeCategory = 'all';
  let activeSort = 'featured';
  let searchQuery = '';
  let currentReadingBookId = null;
  let readingFontSize = 100;

  const I18N = {
    es: {
      nav_holiday: 'Holiday -25%',
      nav_catalog: 'Catálogo',
      nav_stores: 'Dónde comprar',
      nav_author: 'Autor',
      nav_testimonials: 'Lectores',
      nav_reader: 'ARCUS Reader',
      nav_cta_stores: 'Ver tiendas oficiales',
      nav_terms: 'Términos',
      nav_privacy: 'Privacidad',
      theme_label: 'Tema',
      theme_dark: 'Modo oscuro',
      theme_light: 'Modo claro',
      holiday_banner_text:
        'Especial Holiday (1–31 dic. 2026) · 25% de descuento exclusivo en Smashwords en nuestras dos obras principales.',
      holiday_banner_cta: 'Ver oferta -25%',
      holiday_kicker: 'Especial Fin de Año · 1 al 31 de diciembre de 2026',
      holiday_title: '25% de descuento exclusivo en Smashwords',
      holiday_subtitle:
        'Campaña oficial End of Year Sale válida únicamente en Smashwords. En Amazon, Google Play Books y Books2Read las obras mantienen su precio habitual.',
      holiday_all_sale_cta: 'Ver campaña en Smashwords',
      holiday_only_badge: 'Exclusivo en Smashwords · 1–31 dic.',
      holiday_regular_price_label: 'Precio habitual:',
      holiday_buy_cta: 'Comprar en Smashwords (-25%)',
      hero_holiday_tag: 'Holiday Sale · -25% en Smashwords',
      hero_holiday_dates: '1–31 dic.',
      hero_kicker: 'Sello editorial independiente · No ficción y pensamiento sistémico',
      hero_headline: 'Ideas que descifran lo que otros prefieren callar.',
      hero_subtitle:
        'Publicaciones de no ficción sobre sistemas de poder, ciencia cognitiva y transformación humana escritas por Ulises R. Cruz García. Disponibles globalmente en las principales librerías digitales.',
      hero_cta_catalog: 'Explorar catálogo',
      hero_cta_stores: 'Dónde comprar',
      hero_cta_video: 'Ver presentación',
      hero_caption_title: 'Lanzamiento destacado · Las tres tentaciones',
      stat_readers: 'Lectores internacionales',
      stat_rating: 'Valoración media',
      stat_stores: 'Tiendas oficiales',
      catalog_kicker: 'Colección completa',
      catalog_title: 'Catálogo de Libros',
      catalog_subtitle:
        'Explora las obras publicadas, lee muestras gratuitas directamente en el navegador y accede a cada libro en Smashwords (-25% Holiday), Amazon, Google Play Books o Books2Read.',
      filter_all: 'Todos',
      filter_systems: 'Sistemas',
      filter_mindfulness: 'Mindfulness',
      filter_performance: 'Rendimiento',
      filter_communication: 'Comunicación',
      search_placeholder: 'Buscar título o tema...',
      sort_featured: 'Destacados',
      sort_newest: 'Más recientes',
      sort_rating: 'Mejor valorados',
      sort_title: 'Orden A–Z',
      showing_prefix: 'Mostrando',
      showing_unit_singular: 'libro',
      showing_unit_plural: 'libros',
      no_results_title: 'No se encontraron títulos',
      no_results_text: 'Prueba con otra categoría o limpia el término de búsqueda.',
      btn_reset_filters: 'Restablecer filtros',
      btn_details_stores: 'Ver tiendas',
      btn_free_download: 'Descargar gratis',
      btn_sample: 'Muestra',
      btn_read_sample: 'Leer muestra gratuita',
      btn_get_free: 'Obtener edición gratuita',
      free_label: 'Gratis',
      pages_unit: 'págs.',
      reviews_unit: 'reseñas',
      stores_kicker: 'Distribución oficial global',
      stores_title: 'Dónde adquirir nuestras obras',
      stores_subtitle:
        'Las compras se gestionan directamente en las plataformas oficiales. Nota: el 25% de descuento Holiday (1–31 dic.) aplica únicamente en Smashwords; las demás tiendas mantienen su precio regular.',
      store_amazon_desc:
        'Ediciones Kindle digitales y versiones impresas en tapa blanda con envío internacional a través de las tiendas regionales de Amazon.',
      store_play_desc:
        'Lectura sincronizada al instante en Android, iOS y navegador web con tu cuenta de Google y descarga para lectura sin conexión.',
      store_b2r_desc:
        'Selector universal de Draft2Digital que conecta con Apple Books, Barnes & Noble, Kobo, Vivlio y librerías digitales locales.',
      store_cta_amazon: 'Explorar en Amazon',
      store_cta_play: 'Abrir Google Play Books',
      store_cta_b2r: 'Ir a Books2Read',
      store_choose_book: 'Elige la obra que deseas adquirir:',
      footer_smashwords: 'Smashwords (-25% Holiday)',
      reader_strip_text:
        '¿Ya tienes acceso a la biblioteca web? Accede directamente a tus lecturas online desde la aplicación ARCUS Reader.',
      reader_strip_cta: 'Abrir ARCUS Reader',
      author_role: 'Autor & Fundador',
      author_origin: 'Puerto Rico · Residente en España',
      author_meta_imprint: 'Sello editorial',
      author_kicker: 'Perfil editorial',
      author_heading: 'Ciencia cognitiva, sistemas humanos y análisis crítico del poder.',
      author_bio:
        'Pensador en la convergencia entre ciencia, sistemas y bienestar integral. Integra ingeniería biomecánica, análisis cognitivo y enfoque consciente para comprender por qué las personas y las instituciones repiten patrones evitables—y cómo rediseñarlos con criterio práctico.',
      author_quote:
        '“La verdadera transformación nace de la integración armoniosa entre claridad mental, criterio sistémico y salud física. No es una teoría abstracta, sino una disciplina cotidiana.”',
      author_edu_title: 'Formación Académica',
      author_cert_title: 'Certificaciones',
      testimonials_kicker: 'Reseñas verificadas',
      testimonials_title: 'Lo que dicen nuestros lectores',
      testimonials_subtitle:
        'Opiniones reales sobre el impacto práctico de las obras publicadas por Editorial Arcus.',
      testimonial_1_quote:
        '“Por primera vez en mi vida entiendo por qué las dietas restrictivas nunca funcionaron para mí. Este libro me dio herramientas claras para escuchar a mi cuerpo sin culpa.”',
      testimonial_2_quote:
        '“Un libro que te confronta más de lo que te consuela. Me hizo replantear decisiones cotidianas que daba por inofensivas. Directo, incómodo y necesario.”',
      testimonial_3_quote:
        '“Me sorprendió lo actual que se siente el diagnóstico histórico. No es moralista, sino profundamente lúcido. Terminé cuestionando hábitos que daba por sentados.”',
      spec_price: 'Precio de referencia',
      spec_rating: 'Valoración',
      spec_pages: 'Extensión',
      spec_date: 'Publicación',
      spec_languages: 'Idiomas',
      spec_languages_val: 'Español / English',
      modal_description: 'Sinopsis',
      modal_what_learn: 'Puntos clave',
      modal_stores_heading: 'Adquirir en plataformas oficiales',
      modal_free_desc:
        'Esta obra es de descarga gratuita. Solicita el archivo digital directamente mediante el formulario editorial.',
      reading_free_sample: 'Muestra de lectura',
      reading_footer_prompt: 'Continúa la lectura en tu plataforma preferida:',
      contact_title: 'Contacto Editorial',
      contact_name: 'Nombre completo',
      contact_email: 'Correo electrónico',
      contact_subject: 'Asunto',
      contact_message: 'Mensaje',
      btn_send: 'Enviar mensaje',
      footer_desc:
        'Publicamos obras de no ficción que analizan los mecanismos del poder, la cognición y el desarrollo humano.',
      footer_links_title: 'Catálogo y Tiendas',
      footer_contact_title: 'Contacto y Legal',
      footer_contact_desc: 'Consultas de prensa, derechos editoriales o soporte al lector.',
      btn_contact: 'Enviar mensaje',
      btn_tour: 'Guía rápida',
    },
    en: {
      nav_holiday: 'Holiday -25%',
      nav_catalog: 'Catalog',
      nav_stores: 'Where to buy',
      nav_author: 'Author',
      nav_testimonials: 'Readers',
      nav_reader: 'ARCUS Reader',
      nav_cta_stores: 'Official stores',
      nav_terms: 'Terms',
      nav_privacy: 'Privacy',
      theme_label: 'Theme',
      theme_dark: 'Dark mode',
      theme_light: 'Light mode',
      holiday_banner_text:
        'Holiday Special (Dec 1–31, 2026) · Exclusive 25% off on Smashwords for our two flagship titles.',
      holiday_banner_cta: 'View -25% offer',
      holiday_kicker: 'End of Year Sale · December 1 – 31, 2026',
      holiday_title: '25% off exclusively on Smashwords',
      holiday_subtitle:
        'Official End of Year Sale valid only on Smashwords. Regular prices remain unchanged on Amazon, Google Play Books, and Books2Read.',
      holiday_all_sale_cta: 'Browse Smashwords sale',
      holiday_only_badge: 'Smashwords exclusive · Dec 1–31',
      holiday_regular_price_label: 'Regular price:',
      holiday_buy_cta: 'Get on Smashwords (-25%)',
      hero_holiday_tag: 'Holiday Sale · 25% off on Smashwords',
      hero_holiday_dates: 'Dec 1–31',
      hero_kicker: 'Independent publishing house · Non-fiction & systems thinking',
      hero_headline: 'Ideas that decode what others prefer left unsaid.',
      hero_subtitle:
        'Non-fiction works on systems of power, cognitive science, and human transformation by Ulises R. Cruz García. Available worldwide across major digital bookstores.',
      hero_cta_catalog: 'Explore catalog',
      hero_cta_stores: 'Where to buy',
      hero_cta_video: 'Watch overview',
      hero_caption_title: 'Featured release · The Three Temptations',
      stat_readers: 'International readers',
      stat_rating: 'Average rating',
      stat_stores: 'Official platforms',
      catalog_kicker: 'Complete collection',
      catalog_title: 'Book Catalog',
      catalog_subtitle:
        'Explore published titles, read free samples directly in your browser, and acquire each book on Smashwords (-25% Holiday), Amazon, Google Play Books, or Books2Read.',
      filter_all: 'All',
      filter_systems: 'Systems',
      filter_mindfulness: 'Mindfulness',
      filter_performance: 'Performance',
      filter_communication: 'Communication',
      search_placeholder: 'Search title or topic...',
      sort_featured: 'Featured',
      sort_newest: 'Newest',
      sort_rating: 'Top Rated',
      sort_title: 'A–Z Order',
      showing_prefix: 'Showing',
      showing_unit_singular: 'book',
      showing_unit_plural: 'books',
      no_results_title: 'No matching titles found',
      no_results_text: 'Try another category or clear your search query.',
      btn_reset_filters: 'Reset filters',
      btn_details_stores: 'View stores',
      btn_free_download: 'Download free',
      btn_sample: 'Sample',
      btn_read_sample: 'Read free sample',
      btn_get_free: 'Get free edition',
      free_label: 'Free',
      pages_unit: 'pp.',
      reviews_unit: 'reviews',
      stores_kicker: 'Global official distribution',
      stores_title: 'Where to acquire our books',
      stores_subtitle:
        'Purchases are fulfilled directly through official storefronts. Note: the 25% Holiday discount (Dec 1–31) applies exclusively on Smashwords; other stores remain at regular price.',
      store_amazon_desc:
        'Digital Kindle editions and paperback print copies with international shipping across regional Amazon storefronts.',
      store_play_desc:
        'Instant synchronized reading on Android, iOS, and web browsers with your Google account and offline download support.',
      store_b2r_desc:
        'Universal Draft2Digital selector connecting you to Apple Books, Barnes & Noble, Kobo, Vivlio, and local digital bookstores.',
      store_cta_amazon: 'Browse on Amazon',
      store_cta_play: 'Open Google Play Books',
      store_cta_b2r: 'Go to Books2Read',
      store_choose_book: 'Select the title to purchase:',
      footer_smashwords: 'Smashwords (-25% Holiday)',
      reader_strip_text:
        'Already have web library access? Open your online reading shelf directly in ARCUS Reader.',
      reader_strip_cta: 'Open ARCUS Reader',
      author_role: 'Author & Founder',
      author_origin: 'Puerto Rico · Based in Spain',
      author_meta_imprint: 'Imprint',
      author_kicker: 'Editorial profile',
      author_heading: 'Cognitive science, human systems, and critical analysis of power.',
      author_bio:
        'A thinker at the intersection of science, systems, and holistic performance. Integrates biomechanical engineering, cognitive science, and mindfulness to examine why individuals and institutions repeat avoidable patterns—and how to redesign them.',
      author_quote:
        '“True transformation emerges from the disciplined integration of mental clarity, systemic judgment, and physical health. It is not an abstract theory, but a daily practice.”',
      author_edu_title: 'Academic Background',
      author_cert_title: 'Certifications',
      testimonials_kicker: 'Verified reader reviews',
      testimonials_title: 'What readers say',
      testimonials_subtitle:
        'Authentic feedback on the practical impact of works published by Editorial Arcus.',
      testimonial_1_quote:
        '“For the first time in my life I understand why restrictive diets never worked for me. This book gave me clear tools to listen to my body without guilt.”',
      testimonial_2_quote:
        '“A book that challenges you rather than comforts you. It made me rethink everyday decisions I once assumed were harmless. Direct, sharp, and necessary.”',
      testimonial_3_quote:
        '“I was struck by how timely the historical diagnosis feels. Never preachy—deeply introspective. I ended up questioning habits I took for granted.”',
      spec_price: 'Reference price',
      spec_rating: 'Rating',
      spec_pages: 'Length',
      spec_date: 'Published',
      spec_languages: 'Languages',
      spec_languages_val: 'Spanish / English',
      modal_description: 'Synopsis',
      modal_what_learn: 'Key takeaways',
      modal_stores_heading: 'Buy on official platforms',
      modal_free_desc:
        'This edition is free to download. Request the digital file directly via the editorial form.',
      reading_free_sample: 'Reading sample',
      reading_footer_prompt: 'Continue reading on your preferred store:',
      contact_title: 'Editorial Contact',
      contact_name: 'Full name',
      contact_email: 'Email address',
      contact_subject: 'Subject',
      contact_message: 'Message',
      btn_send: 'Send message',
      footer_desc:
        'We publish non-fiction works examining the mechanics of power, cognition, and human development.',
      footer_links_title: 'Catalog & Stores',
      footer_contact_title: 'Contact & Legal',
      footer_contact_desc: 'Press inquiries, publishing rights, or reader support.',
      btn_contact: 'Send message',
      btn_tour: 'Quick tour',
    },
  };

  function t(key) {
    return (I18N[currentLanguage] && I18N[currentLanguage][key]) || key;
  }

  function applySavedTheme() {
    const saved = localStorage.getItem('arcus-theme');
    const theme = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = theme;
    updateThemeButton(theme);
  }

  function updateThemeButton(theme) {
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun text-xs' : 'fas fa-moon text-xs';
    }
    if (text) {
      text.textContent = theme === 'dark' ? t('theme_light') : t('theme_dark');
    }
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('arcus-theme', next);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = next;
    updateThemeButton(next);
  };

  function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    const headline = document.getElementById('hero-headline');
    if (headline) headline.textContent = t('hero_headline');
    const subtitle = document.getElementById('hero-subtitle');
    if (subtitle) subtitle.textContent = t('hero_subtitle');

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t('search_placeholder');

    const heroCover = document.getElementById('hero-featured-cover');
    if (heroCover) {
      heroCover.src =
        currentLanguage === 'en' ? 'assets/icons/L3t_portada_en.png' : 'assets/icons/NuevaPortada.png';
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeButton(currentTheme);

    updateLanguageButtons();
  }

  function updateLanguageButtons() {
    const pairs = [
      ['lang-es', 'es'],
      ['lang-en', 'en'],
      ['mobile-lang-es', 'es'],
      ['mobile-lang-en', 'en'],
    ];
    pairs.forEach(([id, code]) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.classList.toggle('is-active', currentLanguage === code);
    });
  }

  window.changeLanguage = function (lang) {
    currentLanguage = lang === 'en' ? 'en' : 'es';
    applyTranslations();
    renderHolidaySection();
    renderBooks();
    renderStoresGrid();
    if (currentReadingBookId !== null) {
      window.openReadingMode(currentReadingBookId);
    }
  };

  function renderHolidaySection() {
    const topBanner = document.getElementById('holiday-top-banner');
    const section = document.getElementById('holiday-smashwords');
    const grid = document.getElementById('holiday-cards-grid');
    const isActive = Catalog && Catalog.HOLIDAY_CAMPAIGN && Catalog.HOLIDAY_CAMPAIGN.active;

    if (topBanner) topBanner.classList.toggle('hidden', !isActive);
    if (section) section.classList.toggle('hidden', !isActive);
    if (!isActive || !grid || typeof Catalog.getHolidayPromotions !== 'function') return;

    const promos = Catalog.getHolidayPromotions(currentLanguage);
    grid.replaceChildren();

    promos.forEach((promo) => {
      const card = document.createElement('article');
      card.className = 'holiday-card p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center';

      card.innerHTML = `
        <div class="sm:col-span-5 rounded-lg p-3 flex items-center justify-center" style="background-color: var(--bg-subtle);">
          <img src="${promo.poster}"
               alt="${promo.title} — Smashwords 2026 End of Year Sale (-${promo.discountPercent}%)"
               loading="lazy"
               decoding="async"
               class="w-full max-h-72 object-contain rounded shadow-md">
        </div>
        <div class="sm:col-span-7 flex flex-col justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] font-semibold" style="color: var(--holiday-crimson);">
              <i class="fas fa-tag text-[10px]" aria-hidden="true"></i>
              <span>${t('holiday_only_badge')}</span>
            </div>
            <h3 class="font-serif-display text-2xl font-semibold leading-snug" style="color: var(--text-main);">
              ${promo.title}
            </h3>
            <p class="text-xs font-medium" style="color: var(--text-subtle);">${promo.series} · ${promo.author}</p>
          </div>

          <div class="py-3 border-y flex flex-wrap items-center justify-between gap-2" style="border-color: var(--border-hairline);">
            <div class="flex items-baseline gap-2.5">
              <span class="font-mono-tabular text-2xl font-bold" style="color: var(--holiday-crimson);">$${promo.holidayPrice.toFixed(2)} USD</span>
              <span class="font-mono-tabular text-xs line-through" style="color: var(--text-subtle);">$${promo.regularPrice.toFixed(2)}</span>
            </div>
            <span class="font-mono-tabular text-xs font-semibold px-2 py-0.5 rounded" style="background-color: var(--holiday-crimson-soft); color: var(--holiday-crimson);">-${promo.discountPercent}%</span>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <a href="${promo.url}"
               target="_blank"
               rel="noopener noreferrer"
               class="btn-holiday-primary py-2.5 px-4 text-xs"
               data-holiday-book-id="${promo.id}">
              <span>${t('holiday_buy_cta')}</span>
              <i class="fas fa-external-link-alt text-[11px]" aria-hidden="true"></i>
            </a>
            <button type="button"
                    class="btn-editorial-secondary py-2.5 px-3.5 text-xs"
                    onclick="openReadingMode(${promo.id})">
              ${t('btn_sample')}
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function renderStoresGrid() {
    const grid = document.getElementById('stores-grid');
    if (!grid || !Catalog || typeof Catalog.getStoreDirectory !== 'function') return;

    const stores = Catalog.getStoreDirectory(currentLanguage);
    grid.replaceChildren();

    stores.forEach((store) => {
      const card = document.createElement('article');
      card.className = 'rounded-xl border p-6 flex flex-col gap-5';
      card.style.backgroundColor = 'var(--bg-canvas)';
      card.style.borderColor = store.isHolidayPromo
        ? 'var(--holiday-crimson-border)'
        : 'var(--border-hairline)';

      const bookChoicesHtml = store.books
        .map(
          (book) => `
          <a href="${book.url}"
             target="_blank"
             rel="noopener noreferrer"
             class="store-link-btn ${store.isHolidayPromo ? 'is-holiday' : ''}"
             data-store-id="${store.id}"
             data-book-id="${book.id}"
             data-book-slug="${book.slug}">
            <div class="min-w-0">
              <div class="font-semibold text-sm leading-snug">${book.title}</div>
              <div class="font-mono-tabular text-xs mt-0.5" style="color: ${
                store.isHolidayPromo ? 'var(--holiday-crimson)' : 'var(--text-muted)'
              };">${book.metaLabel || `$${book.price.toFixed(2)} USD`}</div>
            </div>
            <i class="fas fa-external-link-alt text-xs shrink-0" style="color: ${
              store.isHolidayPromo ? 'var(--holiday-crimson)' : 'var(--accent-brass)'
            };"></i>
          </a>`
        )
        .join('');

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="font-mono-tabular text-[11px] uppercase tracking-wider font-semibold" style="color: ${
              store.isHolidayPromo ? 'var(--holiday-crimson)' : 'var(--text-subtle)'
            };">${store.indexLabel}</span>
            <i class="${store.iconClass} text-lg" style="color: ${
              store.isHolidayPromo ? 'var(--holiday-crimson)' : 'var(--text-main)'
            };"></i>
          </div>
          <h3 class="font-serif-display text-2xl font-semibold mb-2" style="color: var(--text-main);">${store.name}</h3>
          <p class="text-sm leading-relaxed" style="color: var(--text-muted);">${store.description}</p>
        </div>

        <div class="space-y-2.5 pt-4 border-t" style="border-color: var(--border-hairline);">
          <p class="text-[11px] uppercase tracking-[0.12em] font-semibold" style="color: var(--text-subtle);">
            ${t('store_choose_book')}
          </p>
          ${bookChoicesHtml}
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function renderBooks() {
    const grid = document.getElementById('books-grid');
    const noResults = document.getElementById('no-results');
    const counter = document.getElementById('book-counter');
    if (!grid || !Catalog) return;

    const list = Catalog.filterAndSortBooks(BOOKS, {
      category: activeCategory,
      sortBy: activeSort,
      query: searchQuery,
      lang: currentLanguage,
    });

    grid.replaceChildren();

    if (counter) {
      const unit = list.length === 1 ? t('showing_unit_singular') : t('showing_unit_plural');
      counter.textContent = `${t('showing_prefix')} ${list.length} ${unit}`;
    }

    if (list.length === 0) {
      if (noResults) noResults.classList.remove('hidden');
      return;
    }

    if (noResults) noResults.classList.add('hidden');

    list.forEach((book) => {
      grid.appendChild(createBookCard(book));
    });
  }

  function createBookCard(book) {
    const title = currentLanguage === 'en' ? book.title_en : book.title_es;
    const subtitle = currentLanguage === 'en' ? book.subtitle_en : book.subtitle_es;
    const cover = currentLanguage === 'en' ? book.cover_en : book.cover_es;
    const series = currentLanguage === 'en' ? book.series_en : book.series_es;
    const priceLabel = book.price === 0 ? t('free_label') : `$${book.price.toFixed(2)} USD`;

    const card = document.createElement('article');
    card.className = 'editorial-card';

    const storeLinksHtml =
      book.price > 0
        ? Catalog.getBookPurchaseChannels(book, currentLanguage)
            .map(
              (ch) =>
                `<a href="${ch.url}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: var(--text-muted);">${ch.name}</a>`
            )
            .join('<span aria-hidden="true"> · </span>')
        : '';

    const hasHolidayDiscount =
      Catalog &&
      Catalog.HOLIDAY_CAMPAIGN &&
      Catalog.HOLIDAY_CAMPAIGN.active &&
      book.holidayDiscountPercent &&
      book.stores &&
      book.stores.smashwords;

    const holidayLineHtml = hasHolidayDiscount
      ? `<a href="${book.stores.smashwords}" target="_blank" rel="noopener noreferrer" class="block text-xs font-semibold hover:underline" style="color: var(--holiday-crimson);">
           Smashwords -${book.holidayDiscountPercent}%: $${book.holidayPrice.toFixed(2)} USD (${
          currentLanguage === 'en' ? 'Dec 1–31 only' : 'solo 1–31 dic.'
        })
         </a>`
      : '';

    card.innerHTML = `
      <div class="cover-stage cursor-pointer" data-open-book="${book.id}">
        <img src="${cover}" alt="${title}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
      </div>
      <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div class="space-y-2">
          <div class="text-[11px] uppercase tracking-wider font-medium" style="color: var(--text-subtle);">
            <span>${series}</span>
            <span aria-hidden="true"> · </span>
            <span class="font-mono-tabular">${book.pages} ${t('pages_unit')}</span>
          </div>
          <h3 class="font-serif-display text-xl font-semibold leading-snug line-clamp-2 cursor-pointer"
              style="color: var(--text-main);"
              data-open-book="${book.id}">
            ${title}
          </h3>
          <p class="text-xs font-medium" style="color: var(--text-subtle);">${book.author}</p>
          <p class="text-sm line-clamp-2 leading-relaxed" style="color: var(--text-muted);">${subtitle}</p>
        </div>

        <div class="space-y-3 pt-3 border-t" style="border-color: var(--border-hairline);">
          <div class="flex items-center justify-between text-xs">
            <span class="font-mono-tabular font-semibold text-sm" style="color: var(--text-main);">${priceLabel}</span>
            <span class="font-mono-tabular" style="color: var(--text-muted);">★ ${book.rating.toFixed(1)} (${book.review_count})</span>
          </div>
          ${holidayLineHtml}

          <div class="flex items-center gap-2">
            ${
              book.price === 0
                ? `<button type="button" class="btn-editorial-primary flex-1 py-2.5 px-3 text-xs" onclick="abrirModalGratis()">${t('btn_free_download')}</button>`
                : `<button type="button" class="btn-editorial-primary flex-1 py-2.5 px-3 text-xs" onclick="openBookModal(${book.id})">${t('btn_details_stores')}</button>`
            }
            <button type="button" class="btn-editorial-secondary py-2.5 px-3 text-xs" onclick="openReadingMode(${book.id})" aria-label="${t('btn_read_sample')}: ${title}">
              ${t('btn_sample')}
            </button>
          </div>

          ${
            storeLinksHtml
              ? `<div class="text-[11px] pt-1 flex flex-wrap items-center gap-1.5">${storeLinksHtml}</div>`
              : ''
          }
        </div>
      </div>
    `;

    card.querySelectorAll('[data-open-book]').forEach((el) => {
      el.addEventListener('click', () => window.openBookModal(book.id));
    });

    return card;
  }

  window.openBookModal = function (bookId) {
    const book = BOOKS.find((b) => b.id === bookId);
    if (!book) return;

    const title = currentLanguage === 'en' ? book.title_en : book.title_es;
    const subtitle = currentLanguage === 'en' ? book.subtitle_en : book.subtitle_es;
    const description = currentLanguage === 'en' ? book.description_en : book.description_es;
    const cover = currentLanguage === 'en' ? book.cover_en : book.cover_es;
    const series = currentLanguage === 'en' ? book.series_en : book.series_es;
    const benefits = currentLanguage === 'en' ? book.benefits_en : book.benefits_es;

    document.getElementById('modal-series').textContent = `${series} · ${book.author}`;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-subtitle').textContent = subtitle;
    document.getElementById('modal-description').textContent = description;

    const modalCover = document.getElementById('modal-cover');
    modalCover.src = cover;
    modalCover.alt = title;

    document.getElementById('modal-price').textContent =
      book.price === 0 ? t('free_label') : `$${book.price.toFixed(2)} USD`;
    document.getElementById('modal-rating').textContent = `${book.rating.toFixed(1)} (${book.review_count} ${t('reviews_unit')})`;
    document.getElementById('modal-pages').textContent = `${book.pages} ${t('pages_unit')}`;
    document.getElementById('modal-languages').textContent = t('spec_languages_val');
    document.getElementById('modal-date').textContent = new Date(book.publish_date).toLocaleDateString(
      currentLanguage === 'en' ? 'en-US' : 'es-ES',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );

    const benefitsList = document.getElementById('modal-benefits');
    benefitsList.replaceChildren();
    benefits.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2.5';
      li.innerHTML = `<span aria-hidden="true" style="color: var(--accent-brass);">—</span><span>${item}</span>`;
      benefitsList.appendChild(li);
    });

    document.getElementById('modal-sample').onclick = () => {
      window.closeBookModal();
      window.openReadingMode(book.id);
    };

    const storeLinksContainer = document.getElementById('modal-store-links');
    const freeContainer = document.getElementById('modal-free-download');

    if (book.price === 0) {
      storeLinksContainer.classList.add('hidden');
      freeContainer.classList.remove('hidden');
      const freeBtn = document.getElementById('modal-free-btn');
      if (freeBtn) {
        freeBtn.onclick = () => {
          window.closeBookModal();
          window.abrirModalGratis();
        };
      }
    } else {
      freeContainer.classList.add('hidden');
      storeLinksContainer.classList.remove('hidden');
      storeLinksContainer.replaceChildren();

      const channels = Catalog.getBookPurchaseChannels(book, currentLanguage);
      channels.forEach((ch) => {
        const sub = currentLanguage === 'en' ? ch.subtitle_en : ch.subtitle_es;
        const a = document.createElement('a');
        a.href = ch.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = ch.isHolidayPromo ? 'store-link-btn is-holiday' : 'store-link-btn';
        a.innerHTML = `
          <div>
            <div class="font-semibold text-sm" style="color: ${
              ch.isHolidayPromo ? 'var(--holiday-crimson)' : 'var(--text-main)'
            };">${ch.name}</div>
            <div class="text-xs" style="color: var(--text-muted);">${sub}</div>
          </div>
          <i class="fas fa-external-link-alt text-xs" style="color: ${
            ch.isHolidayPromo ? 'var(--holiday-crimson)' : 'var(--accent-brass)'
          };"></i>
        `;
        storeLinksContainer.appendChild(a);
      });

      if (book.stores && book.stores.reader) {
        const readerLink = document.createElement('a');
        readerLink.href = book.stores.reader;
        readerLink.target = '_blank';
        readerLink.rel = 'noopener noreferrer';
        readerLink.className = 'store-link-btn';
        readerLink.innerHTML = `
          <div>
            <div class="font-semibold text-sm">ARCUS Reader</div>
            <div class="text-xs" style="color: var(--text-muted);">${
              currentLanguage === 'en' ? 'Web reading shelf' : 'Lectura online en navegador'
            }</div>
          </div>
          <i class="fas fa-book-reader text-xs" style="color: var(--accent-brass);"></i>
        `;
        storeLinksContainer.appendChild(readerLink);
      }
    }

    document.getElementById('book-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookModal = function () {
    document.getElementById('book-modal').classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.openReadingMode = function (bookId) {
    const book = BOOKS.find((b) => b.id === bookId);
    if (!book) return;

    currentReadingBookId = bookId;
    const title = currentLanguage === 'en' ? book.title_en : book.title_es;
    const content = currentLanguage === 'en' ? book.sample_content_en : book.sample_content_es;

    document.getElementById('reading-title').textContent = title;
    document.getElementById('reading-content').innerHTML = content;

    const actions = document.getElementById('reading-store-actions');
    actions.replaceChildren();

    if (book.price === 0) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-editorial-primary py-2 px-4 text-xs';
      btn.textContent = t('btn_get_free');
      btn.onclick = () => {
        window.closeReadingMode();
        window.abrirModalGratis();
      };
      actions.appendChild(btn);
    } else {
      Catalog.getBookPurchaseChannels(book, currentLanguage).forEach((ch) => {
        const a = document.createElement('a');
        a.href = ch.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'btn-editorial-secondary py-1.5 px-3 text-xs';
        a.textContent = ch.name;
        actions.appendChild(a);
      });
    }

    readingFontSize = 100;
    updateReadingFontSize();

    document.getElementById('reading-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeReadingMode = function () {
    document.getElementById('reading-modal').classList.add('hidden');
    document.body.style.overflow = '';
    currentReadingBookId = null;
  };

  window.changeReadingFontSize = function (delta) {
    readingFontSize = Math.max(80, Math.min(150, readingFontSize + delta * 10));
    updateReadingFontSize();
  };

  function updateReadingFontSize() {
    const el = document.getElementById('reading-content');
    const display = document.getElementById('font-size-display');
    if (el) el.style.fontSize = `${readingFontSize}%`;
    if (display) display.textContent = `${readingFontSize}%`;
  }

  window.resetCatalogFilters = function () {
    activeCategory = 'all';
    searchQuery = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.filter-btn[data-category]').forEach((btn) => {
      const isAll = btn.dataset.category === 'all';
      btn.classList.toggle('is-active', isAll);
      btn.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });
    renderBooks();
  };

  window.openContactModal = function () {
    document.getElementById('contact-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeContactModal = function () {
    document.getElementById('contact-modal').classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.openVideoModal = function () {
    const modal = document.getElementById('video-modal');
    const frame = document.getElementById('video-frame');
    if (modal && frame) {
      frame.src = 'https://www.youtube.com/embed/5fZYxOO-81g?si=0Ty7oFlA9UWBoOdm&autoplay=1';
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeVideoModal = function () {
    const modal = document.getElementById('video-modal');
    const frame = document.getElementById('video-frame');
    if (modal && frame) {
      modal.classList.add('hidden');
      frame.src = '';
      document.body.style.overflow = '';
    }
  };

  window.openLegalModal = function (type) {
    const titleEl = document.getElementById('legal-title');
    const bodyEl = document.getElementById('legal-body');
    if (!titleEl || !bodyEl) return;

    if (type === 'terms') {
      titleEl.textContent = currentLanguage === 'en' ? 'Terms & Conditions' : 'Términos y Condiciones';
      bodyEl.innerHTML =
        currentLanguage === 'en'
          ? '<p>Editorial Arcus serves as an informational showcase and reading preview portal for works by Ulises R. Cruz García and partner authors.</p><p>All paid book purchases, billing, taxes, refunds, and digital file deliveries are processed exclusively by external retail partners (Amazon, Google Play Books, and Books2Read/Draft2Digital) under their respective terms of service.</p>'
          : '<p>Editorial Arcus actúa como escaparate editorial y portal de muestras de lectura para las obras de Ulises R. Cruz García y autores colaboradores.</p><p>Todas las transacciones de compra, facturación, impuestos, devoluciones y entrega de libros de pago se procesan exclusivamente en las plataformas externas oficiales (Amazon, Google Play Books y Books2Read / Draft2Digital) bajo sus respectivos términos de servicio.</p>';
    } else {
      titleEl.textContent = currentLanguage === 'en' ? 'Privacy Policy' : 'Política de Privacidad';
      bodyEl.innerHTML =
        currentLanguage === 'en'
          ? '<p>Editorial Arcus does not process payments or store credit card details on this website. Theme and language preferences are stored locally in your browser.</p><p>Contact inquiries submitted via Formspree and free-book requests via Jotform are used strictly to respond to your message or deliver the requested free edition.</p>'
          : '<p>Editorial Arcus no procesa pagos ni almacena datos bancarios en este sitio web. Tus preferencias de idioma y tema visual se guardan únicamente de forma local en tu navegador.</p><p>Las consultas enviadas mediante el formulario de contacto o las solicitudes de descarga gratuita se utilizan exclusivamente para responderte o enviarte la obra solicitada.</p>';
    }

    document.getElementById('legal-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeLegalModal = function () {
    document.getElementById('legal-modal').classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.abrirModalGratis = function () {
    const trigger = document.getElementById('jotform-trigger');
    if (trigger) trigger.click();
  };

  window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    const icon = document.getElementById('mobile-menu-icon');
    if (!menu) return;
    const willOpen = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (icon) {
      icon.classList.toggle('fa-bars', !willOpen);
      icon.classList.toggle('fa-times', willOpen);
    }
  };

  window.closeMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    const icon = document.getElementById('mobile-menu-icon');
    if (menu) menu.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  };

  function bindEvents() {
    document.querySelectorAll('.filter-btn[data-category]').forEach((btn) => {
      btn.addEventListener('click', function () {
        activeCategory = this.dataset.category || 'all';
        document.querySelectorAll('.filter-btn[data-category]').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('is-active');
        this.setAttribute('aria-pressed', 'true');
        renderBooks();
      });
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        activeSort = this.value;
        renderBooks();
      });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let timer;
      searchInput.addEventListener('input', function () {
        clearTimeout(timer);
        const val = this.value;
        timer = setTimeout(() => {
          searchQuery = val;
          renderBooks();
        }, 160);
      });
    }

    const langEs = document.getElementById('lang-es');
    const langEn = document.getElementById('lang-en');
    if (langEs) langEs.addEventListener('click', () => window.changeLanguage('es'));
    if (langEn) langEn.addEventListener('click', () => window.changeLanguage('en'));

    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleMobileMenu();
      });
    }

    const videoBtn = document.getElementById('video-btn');
    if (videoBtn) {
      videoBtn.addEventListener('click', window.openVideoModal);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('contact-submit');
        const successBox = document.getElementById('contact-success');
        const errorBox = document.getElementById('contact-error');
        if (successBox) successBox.classList.add('hidden');
        if (errorBox) errorBox.classList.add('hidden');
        if (submitBtn) submitBtn.disabled = true;

        try {
          const response = await fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: { Accept: 'application/json' },
          });
          if (response.ok) {
            if (successBox) successBox.classList.remove('hidden');
            this.reset();
          } else {
            if (errorBox) errorBox.classList.remove('hidden');
          }
        } catch (err) {
          if (errorBox) errorBox.classList.remove('hidden');
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeBookModal();
        window.closeReadingMode();
        window.closeContactModal();
        window.closeVideoModal();
        window.closeLegalModal();
        window.closeMobileMenu();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    applyTranslations();
    renderHolidaySection();
    renderBooks();
    renderStoresGrid();
    bindEvents();
  });
})();

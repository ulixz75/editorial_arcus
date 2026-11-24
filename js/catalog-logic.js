/**
 * ARCUS Editorial — Pure Catalog Data, Filtering, Sorting & Store Link Builders
 * Works in both Node.js (CommonJS for unit tests) and Browser (window.ArcusCatalog).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ArcusCatalog = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORE_URLS = {
    amazonAuthor: 'https://www.amazon.com/s?k=Ulises+R.+Cruz+Garcia',
    playBooksAuthor: 'https://play.google.com/store/search?q=Ulises+R.+Cruz+Garcia&c=books',
    books2read: 'https://books2read.com/editorialarcus',
    smashwordsSale: 'https://www.smashwords.com/sale',
    arcusReader: 'https://arcus-reading.vercel.app/',
  };

  const HOLIDAY_CAMPAIGN = {
    active: true,
    discountPercent: 25,
    storeName: 'Smashwords',
    storeHomeUrl: 'https://www.smashwords.com/sale',
    dates_es: '1 al 31 de diciembre de 2026',
    dates_en: 'December 1 – 31, 2026',
  };

  const BOOKS = [
    {
      id: 2,
      slug: 'las-tres-tentaciones',
      title_es: 'Las tres tentaciones',
      title_en: 'The Three Temptations',
      author: 'Ulises R. Cruz García',
      series_es: 'Anatomía del Poder · Vol. I',
      series_en: 'Anatomy of Power · Vol. I',
      subtitle_es: 'El código oculto de la historia y por qué los sistemas colapsan desde dentro.',
      subtitle_en: 'The hidden code of history and why systems collapse from within.',
      description_es:
        'Los sistemas no colapsan por errores evidentes, sino por decisiones que parecen correctas. Una exploración rigurosa de las tres fuerzas —poder, reconocimiento y comodidad— que moldean el liderazgo y el destino de las instituciones.',
      description_en:
        'Systems do not collapse due to obvious errors, but due to decisions that seem right at the time. A rigorous exploration of the three forces—power, recognition, and comfort—that shape leadership and institutions.',
      cover_es: 'assets/icons/NuevaPortada.png',
      cover_en: 'assets/icons/L3t_portada_en.png',
      price: 4.99,
      pages: 112,
      publish_date: '2026-05-10',
      rating: 4.9,
      review_count: 89,
      categories: ['sistemas', 'ciencia cognitiva', 'historia'],
      benefits_es: [
        'Identifica patrones invisibles que preceden al colapso institucional',
        'Comprende cómo decisiones racionales generan resultados destructivos',
        'Reconoce trampas sistémicas antes de que se normalicen',
        'Aplica pensamiento crítico a historia, poder y toma de decisiones',
      ],
      benefits_en: [
        'Identify hidden patterns that precede institutional collapse',
        'Understand how rational decisions produce destructive outcomes',
        'Recognize systemic traps before they normalize',
        'Apply critical thinking to history, power, and decision-making',
      ],
      stores: {
        amazon: 'https://www.amazon.com/s?k=Las+tres+tentaciones+Ulises+R+Cruz+Garcia',
        playBooks:
          'https://play.google.com/store/books/details/Ulises_Ram%C3%B3n_Cruz_Garc%C3%ADa_Las_tres_tentaciones?id=mQLWEQAAQBAJ',
        books2read: 'https://books2read.com/editorialarcus',
        smashwords: 'https://www.smashwords.com/books/view/2024007',
        reader: 'https://arcus-reading.vercel.app/',
      },
      holidayDiscountPercent: 25,
      holidayPrice: 3.74,
      holidayPoster: 'public/assets/aistudio/Smashwords_2026_Holiday_Book_Sale_453195da.png',
      sample_content_es: `
        <h2>Capítulo 1: La Ilusión del Control</h2>
        <p>Ninguna civilización colapsa el día en que cree haber cometido un error. Colapsa mucho antes, cuando empieza a llamar virtud a lo que en realidad es una distorsión de su propio instinto de supervivencia.</p>
        <p>El problema no es la falta de información. Tampoco la ausencia de inteligencia. A lo largo de la historia, los imperios han estado dirigidos por personas capaces, educadas y convencidas de que actuaban de forma racional. Y, sin embargo, los resultados se repiten con una consistencia inquietante.</p>
        <h3>La Arquitectura Invisible</h3>
        <p>Roma no cayó por ignorancia. Durante siglos, supo adaptarse, reorganizarse y resistir. Lo que la hizo insostenible no fue un evento aislado, sino una acumulación de decisiones que, vistas individualmente, parecían correctas.</p>
        <p>Eso es lo que este libro intenta señalar: no los eventos, ni las fechas, ni los nombres, sino la arquitectura invisible que hace que ciertos errores no solo sean probables, sino inevitables.</p>
        <p>A esa arquitectura la llamaremos tentación. No en un sentido moral, sino estructural: soluciones que funcionan a corto plazo, pero que introducen distorsiones profundas en el sistema.</p>
      `,
      sample_content_en: `
        <h2>Chapter 1: The Illusion of Control</h2>
        <p>No civilization collapses on the day it believes it has made a mistake. It collapses much earlier, when it begins to call virtue what is actually a distortion of its own survival instinct.</p>
        <p>The problem is not a lack of information. Nor is it a lack of intelligence. Throughout history, empires have been led by capable, educated individuals who were convinced they were acting rationally. And yet, the outcomes repeat with unsettling consistency.</p>
        <h3>The Invisible Architecture</h3>
        <p>Rome did not fall because of ignorance. For centuries, it adapted, reorganized, and endured. What made it unsustainable was not a single event, but a series of decisions that, when viewed in isolation, seemed reasonable.</p>
        <p>This is what the book aims to reveal: not events, dates, or names, but the invisible architecture that makes certain errors not only possible, but inevitable.</p>
        <p>We will call that architecture temptation. Not in a moral sense, but a structural one: solutions that work in the short term while quietly distorting the system beneath them.</p>
      `,
      featured: true,
      bestseller: true,
    },
    {
      id: 1,
      slug: 'descubre-lo-que-realmente-funciona',
      title_es: 'Descubre lo que realmente funciona',
      title_en: 'Discover What Really Works',
      author: 'Ulises R. Cruz García',
      series_es: 'Bienestar Basado en Evidencia',
      series_en: 'Evidence-Based Wellness',
      subtitle_es: 'El método mindfulness que transforma tu relación con la nutrición y el movimiento.',
      subtitle_en: 'The mindfulness method that transforms your relationship with nutrition and movement.',
      description_es:
        'Aprende a escuchar a tu cuerpo y transforma tu relación con la comida y el ejercicio. Este libro te guía a través de un proceso de mindfulness aplicado para lograr resultados sostenibles sin dietas restrictivas.',
      description_en:
        'Learn to listen to your body and transform your relationship with food and exercise. This book guides you through an applied mindfulness process to achieve sustainable results without restrictive diets.',
      cover_es: 'assets/icons/Descubre lo que realmente funciona cover.png',
      cover_en: 'assets/icons/Discover what really works cover.png',
      price: 3.99,
      pages: 136,
      publish_date: '2024-01-15',
      rating: 4.5,
      review_count: 148,
      categories: ['mindfulness', 'nutrición', 'rendimiento'],
      benefits_es: [
        'Rompe el ciclo de dietas restrictivas y fallidas',
        'Aprende a distinguir el hambre fisiológica del emocional',
        'Integra movimiento intuitivo sin sufrimiento ni desgaste',
        'Construye hábitos sostenibles respaldados por ciencia cognitiva',
      ],
      benefits_en: [
        'Break the cycle of failed restrictive diets',
        'Learn to distinguish physiological vs. emotional hunger',
        'Integrate intuitive movement without burnout',
        'Build sustainable habits backed by cognitive science',
      ],
      stores: {
        amazon: 'https://www.amazon.com/s?k=Descubre+lo+que+realmente+funciona+Ulises+R+Cruz+Garcia',
        playBooks:
          'https://play.google.com/store/books/details/Ulises_R_Cruz_Garc%C3%ADa_Descubre_lo_que_realmente_fun?id=D5CTEQAAQBAJ',
        playBooks_en:
          'https://play.google.com/store/books/details/Ulises_R_Cruz_Garc%C3%ADa_Discover_what_really_works?id=I5CTEQAAQBAJ',
        playAudiobook:
          'https://play.google.com/store/audiobooks/details/Ulises_R_Cruz_Garc%C3%ADa_Descubre_lo_que_realmente_fun?id=AQAAAEBqfQM9eM',
        books2read: 'https://books2read.com/Descubre-lo-que-realmente-funciona',
        smashwords: 'https://www.smashwords.com/books/view/1893283',
        reader: 'https://arcus-reading.vercel.app/',
      },
      holidayDiscountPercent: 25,
      holidayPrice: 2.99,
      holidayPoster: 'public/assets/aistudio/Smashwords_2026_Holiday_Sale_Poster_3b74372e.png',
      sample_content_es: `
        <h2>Capítulo 1: El Comienzo del Camino</h2>
        <p>Durante años, busqué respuestas en dietas milagrosas y rutinas de ejercicio extenuantes. Siempre terminaba en el mismo lugar: frustrado, sin resultados y con una relación cada vez más complicada con mi cuerpo.</p>
        <p>Fue entonces cuando descubrí que el problema no estaba en mi fuerza de voluntad, sino en mi enfoque. Estaba luchando contra mi cuerpo en lugar de trabajar con él.</p>
        <h3>El Punto de Inflexión</h3>
        <p>Recuerdo claramente el día que cambié mi perspectiva. Después de otra dieta fallida, me senté en silencio y por primera vez en mucho tiempo, simplemente escuché. Escuché lo que mi cuerpo realmente necesitaba, no lo que las revistas decían que debía necesitar.</p>
        <p>Ese momento de quietud fue el comienzo de un viaje que transformaría no solo mi cuerpo, sino mi relación completa con la comida y el movimiento.</p>
      `,
      sample_content_en: `
        <h2>Chapter 1: The Beginning of the Journey</h2>
        <p>For years, I searched for answers in miracle diets and strenuous exercise routines. I always ended up in the same place: frustrated, without results, and with an increasingly complicated relationship with my body.</p>
        <p>It was then that I discovered the problem wasn't my willpower, but my approach. I was fighting against my body instead of working with it.</p>
        <h3>The Turning Point</h3>
        <p>I remember clearly the day I changed my perspective. After another failed diet, I sat in silence and for the first time in a long time, I simply listened. I listened to what my body really needed, not what magazines said I should need.</p>
        <p>That moment of stillness was the beginning of a journey that would transform not only my body, but my entire relationship with food and movement.</p>
      `,
      featured: true,
      bestseller: true,
    },
    {
      id: 3,
      slug: 'super-human',
      title_es: 'SUPER HUMAN',
      title_en: 'SUPER HUMAN',
      author: 'Richard Hargreaves & IRONPOWER Publishing',
      series_es: 'Edición Gratuita · Rendimiento',
      series_en: 'Free Edition · Performance',
      subtitle_es: 'El cuerpo como sistema inteligente de alto rendimiento y longevidad.',
      subtitle_en: 'The body as a high-performance intelligent system for longevity.',
      description_es:
        'En SUPER HUMAN, Richard Hargreaves redefine el movimiento como una herramienta biológica de optimización. Aprende a moverte escuchando tu fisiología, mejorando tu energía, longevidad y rendimiento sin depender de rutinas rígidas.',
      description_en:
        'In SUPER HUMAN, Richard Hargreaves redefines movement as a biological optimization tool. Learn to move by listening to your physiology, improving energy, longevity, and performance without relying on rigid routines.',
      cover_es: 'assets/icons/super-human.png',
      cover_en: 'assets/icons/super-human.png',
      price: 0,
      pages: 78,
      publish_date: '2023-08-22',
      rating: 4.3,
      review_count: 67,
      categories: ['rendimiento', 'mindfulness', 'biología humana'],
      benefits_es: [
        'Optimización del movimiento humano natural',
        'Mayor energía diaria y claridad mental',
        'Reducción de lesiones y sobreentrenamiento',
        'Rendimiento físico sostenible a largo plazo',
      ],
      benefits_en: [
        'Optimization of natural human movement',
        'Increased daily energy and mental clarity',
        'Reduced injuries and overtraining',
        'Sustainable long-term physical performance',
      ],
      stores: null,
      sample_content_es: `
        <h2>Capítulo 1: El cuerpo como sistema inteligente</h2>
        <p>El error moderno no es la falta de ejercicio, sino la desconexión del cuerpo. SUPER HUMAN plantea que el movimiento no es una tarea, sino un lenguaje biológico.</p>
        <p>Cuando aprendes a escuchar señales internas —fatiga, energía, tensión— el entrenamiento deja de ser forzado y se convierte en una estrategia de optimización humana.</p>
      `,
      sample_content_en: `
        <h2>Chapter 1: The body as an intelligent system</h2>
        <p>The modern mistake is not lack of exercise, but disconnection from the body. SUPER HUMAN proposes that movement is not a task, but a biological language.</p>
        <p>When you learn to listen to internal signals—fatigue, energy, tension—training stops being forced and becomes a strategy for human optimization.</p>
      `,
      featured: true,
      bestseller: false,
    },
    {
      id: 4,
      slug: 'comunicacion-21-dias',
      title_es: 'Comunicación Efectiva en 21 Días',
      title_en: 'Effective Communication in 21 Days',
      author: 'Ian Tohvsky & Positive Coaching LLC',
      series_es: 'Edición Gratuita · Habilidades',
      series_en: 'Free Edition · Skills',
      subtitle_es: 'Transforma tu forma de comunicarte con psicología aplicada y hábitos diarios.',
      subtitle_en: 'Transform the way you communicate with applied psychology and daily habits.',
      description_es:
        'Un enfoque práctico que combina hábitos diarios, psicología aplicada y ejercicios reales para mejorar tu comunicación, fortalecer tus relaciones y aumentar tu inteligencia social.',
      description_en:
        'A practical approach combining daily habits, applied psychology, and real exercises to improve your communication, strengthen relationships, and boost your social intelligence.',
      cover_es: 'assets/icons/21days.png',
      cover_en: 'assets/icons/21days.png',
      price: 0,
      pages: 94,
      publish_date: '2023-04-05',
      rating: 4.0,
      review_count: 42,
      categories: ['comunicación', 'desarrollo personal'],
      benefits_es: [
        'Comunicación clara, directa y persuasiva',
        'Fortalecimiento de relaciones personales y profesionales',
        'Mayor seguridad al expresar ideas complejas',
        'Resolución constructiva de conflictos',
      ],
      benefits_en: [
        'Clear, direct, and persuasive communication',
        'Stronger personal and professional relationships',
        'Greater confidence when expressing complex ideas',
        'Constructive conflict resolution',
      ],
      stores: null,
      sample_content_es: `
        <h2>Capítulo 1: La Comunicación como Puente, no como Barrera</h2>
        <p>La mayoría de los conflictos en la vida no provienen de lo que decimos, sino de cómo lo decimos y cómo es percibido por los demás. Comunicar no es solo transmitir información, sino crear entendimiento.</p>
        <p>En este viaje de 21 días, aprenderás a transformar tu forma de expresarte para que tus palabras construyan puentes en lugar de muros, generando conexiones más profundas y auténticas.</p>
      `,
      sample_content_en: `
        <h2>Chapter 1: Communication as a Bridge, Not a Barrier</h2>
        <p>Most conflicts in life do not stem from what we say, but from how we say it and how it is perceived by others. Communicating is not just transmitting information, it is creating understanding.</p>
        <p>In this 21-day journey, you will learn to transform the way you express yourself so that your words build bridges instead of walls, creating deeper and more authentic connections.</p>
      `,
      featured: true,
      bestseller: false,
    },
  ];

  function filterAndSortBooks(books, options) {
    const opts = options || {};
    const category = opts.category || 'all';
    const sortBy = opts.sortBy || 'featured';
    const query = (opts.query || '').trim().toLowerCase();
    const lang = opts.lang === 'en' ? 'en' : 'es';

    let list = books.slice();

    if (category && category !== 'all') {
      list = list.filter(function (book) {
        return Array.isArray(book.categories) && book.categories.includes(category);
      });
    }

    if (query.length >= 2) {
      list = list.filter(function (book) {
        const title = (lang === 'en' ? book.title_en : book.title_es) || '';
        const subtitle = (lang === 'en' ? book.subtitle_en : book.subtitle_es) || '';
        const description = (lang === 'en' ? book.description_en : book.description_es) || '';
        const author = book.author || '';
        const cats = Array.isArray(book.categories) ? book.categories.join(' ') : '';
        const haystack = (title + ' ' + subtitle + ' ' + description + ' ' + author + ' ' + cats).toLowerCase();
        return haystack.indexOf(query) !== -1;
      });
    }

    list.sort(function (a, b) {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'title': {
          const titleA = lang === 'en' ? a.title_en : a.title_es;
          const titleB = lang === 'en' ? b.title_en : b.title_es;
          return titleA.localeCompare(titleB);
        }
        case 'featured':
        default:
          if (a.bestseller !== b.bestseller) return a.bestseller ? -1 : 1;
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return b.rating - a.rating;
      }
    });

    return list;
  }

  function getHolidayPromotions(lang) {
    if (!HOLIDAY_CAMPAIGN.active) {
      return [];
    }
    const isEn = lang === 'en';
    return BOOKS.filter(function (book) {
      return book.price > 0 && book.stores && book.stores.smashwords && book.holidayDiscountPercent;
    }).map(function (book) {
      return {
        id: book.id,
        slug: book.slug,
        title: isEn ? book.title_en : book.title_es,
        series: isEn ? book.series_en : book.series_es,
        author: book.author,
        regularPrice: book.price,
        holidayPrice: book.holidayPrice,
        discountPercent: book.holidayDiscountPercent,
        poster: book.holidayPoster,
        url: book.stores.smashwords,
      };
    });
  }

  function getBookPurchaseChannels(book, lang) {
    if (!book || book.price === 0) {
      return [];
    }
    const isEn = lang === 'en';
    const stores = book.stores || {};
    const playBooksUrl =
      isEn && stores.playBooks_en ? stores.playBooks_en : stores.playBooks || STORE_URLS.playBooksAuthor;

    const channels = [];

    if (HOLIDAY_CAMPAIGN.active && stores.smashwords && book.holidayDiscountPercent) {
      channels.push({
        id: 'smashwords',
        name: `Smashwords (-${book.holidayDiscountPercent}% Holiday)`,
        subtitle_es: `~$${book.holidayPrice.toFixed(2)} USD (antes $${book.price.toFixed(2)} · Solo Smashwords 1–31 dic.)`,
        subtitle_en: `~$${book.holidayPrice.toFixed(2)} USD (was $${book.price.toFixed(2)} · Smashwords only Dec 1–31)`,
        url: stores.smashwords,
        isHolidayPromo: true,
      });
    }

    channels.push(
      {
        id: 'amazon',
        name: 'Amazon',
        subtitle_es: 'Kindle y edición impresa · Precio regular',
        subtitle_en: 'Kindle & Paperback · Regular price',
        url: stores.amazon || STORE_URLS.amazonAuthor,
      },
      {
        id: 'playbooks',
        name: 'Google Play Books',
        subtitle_es: isEn ? 'eBook digital en inglés · Precio regular' : 'eBook digital en español · Precio regular',
        subtitle_en: isEn ? 'English digital eBook · Regular price' : 'Spanish digital eBook · Regular price',
        url: playBooksUrl,
      }
    );

    if (stores.playAudiobook) {
      channels.push({
        id: 'playaudiobook',
        name: 'Google Play Audiobooks',
        subtitle_es: 'Audiolibro oficial en Google Play',
        subtitle_en: 'Official Google Play Audiobook',
        url: stores.playAudiobook,
      });
    }

    channels.push({
      id: 'books2read',
      name: 'Books2Read',
      subtitle_es: 'Apple Books, Kobo, B&N y más · Precio regular',
      subtitle_en: 'Apple Books, Kobo, B&N & more · Regular price',
      url: stores.books2read || STORE_URLS.books2read,
    });

    return channels;
  }

  function getStoreDirectory(lang) {
    const isEn = lang === 'en';
    const paidBooks = BOOKS.filter(function (book) {
      return book.price > 0;
    });

    const storeDefinitions = [];

    if (HOLIDAY_CAMPAIGN.active) {
      storeDefinitions.push({
        id: 'smashwords',
        storeKey: 'smashwords',
        indexLabel: '01 · Holiday Sale -25%',
        name: 'Smashwords',
        iconClass: 'fas fa-tags',
        isHolidayPromo: true,
        desc_es:
          'Única tienda con 25% de descuento especial de Fin de Año (1 al 31 de diciembre de 2026).',
        desc_en:
          'Exclusive 25% End-of-Year Holiday discount storefront (December 1 – 31, 2026).',
      });
    }

    const offset = HOLIDAY_CAMPAIGN.active ? 1 : 0;

    storeDefinitions.push(
      {
        id: 'amazon',
        storeKey: 'amazon',
        indexLabel: `0${1 + offset} · Kindle & Print`,
        name: 'Amazon',
        iconClass: 'fab fa-amazon',
        desc_es:
          'Ediciones Kindle digitales y versiones impresas en tapa blanda con envío internacional.',
        desc_en:
          'Digital Kindle editions and paperback print copies with international shipping.',
      },
      {
        id: 'playbooks',
        storeKey: 'playBooks',
        indexLabel: `0${2 + offset} · eBook & Audiobook`,
        name: 'Google Play Books',
        iconClass: 'fab fa-google-play',
        desc_es:
          'Lectura y escucha sincronizada en Android, iOS y navegador web con descarga sin conexión.',
        desc_en:
          'Instant synchronized reading and listening on Android, iOS, and web with offline support.',
      },
      {
        id: 'books2read',
        storeKey: 'books2read',
        indexLabel: `0${3 + offset} · Apple · Kobo · B&N`,
        name: 'Books2Read',
        iconClass: 'fas fa-book-open',
        desc_es:
          'Selector universal de Draft2Digital que conecta con Apple Books, Barnes & Noble, Kobo y Vivlio.',
        desc_en:
          'Universal Draft2Digital selector connecting to Apple Books, Barnes & Noble, Kobo, and Vivlio.',
      }
    );

    return storeDefinitions.map(function (store) {
      if (store.id === 'playbooks') {
        const bookThreeTemptations = paidBooks.find(function (b) {
          return b.id === 2;
        });
        const bookReallyWorks = paidBooks.find(function (b) {
          return b.id === 1;
        });

        const playBooksEntries = [];
        if (bookThreeTemptations) {
          playBooksEntries.push({
            id: bookThreeTemptations.id,
            slug: bookThreeTemptations.slug,
            title: isEn ? bookThreeTemptations.title_en : bookThreeTemptations.title_es,
            price: bookThreeTemptations.price,
            metaLabel: `eBook · $${bookThreeTemptations.price.toFixed(2)} USD`,
            url: bookThreeTemptations.stores.playBooks,
          });
        }
        if (bookReallyWorks) {
          const esEntry = {
            id: bookReallyWorks.id,
            slug: bookReallyWorks.slug,
            title: bookReallyWorks.title_es,
            price: bookReallyWorks.price,
            metaLabel: isEn
              ? `eBook (Spanish) · $${bookReallyWorks.price.toFixed(2)} USD`
              : `eBook (Español) · $${bookReallyWorks.price.toFixed(2)} USD`,
            url: bookReallyWorks.stores.playBooks,
          };
          const enEntry = {
            id: bookReallyWorks.id,
            slug: `${bookReallyWorks.slug}-en`,
            title: bookReallyWorks.title_en,
            price: bookReallyWorks.price,
            metaLabel: isEn
              ? `eBook (English) · $${bookReallyWorks.price.toFixed(2)} USD`
              : `eBook (Inglés) · $${bookReallyWorks.price.toFixed(2)} USD`,
            url: bookReallyWorks.stores.playBooks_en,
          };
          const audioEntry = {
            id: bookReallyWorks.id,
            slug: `${bookReallyWorks.slug}-audiobook`,
            title: isEn ? bookReallyWorks.title_en : bookReallyWorks.title_es,
            price: bookReallyWorks.price,
            metaLabel: isEn ? 'Audiobook · Google Play' : 'Audiolibro · Google Play',
            url: bookReallyWorks.stores.playAudiobook,
          };

          if (isEn) {
            playBooksEntries.push(enEntry, esEntry, audioEntry);
          } else {
            playBooksEntries.push(esEntry, enEntry, audioEntry);
          }
        }

        return {
          id: store.id,
          indexLabel: store.indexLabel,
          name: store.name,
          iconClass: store.iconClass,
          isHolidayPromo: false,
          description: isEn ? store.desc_en : store.desc_es,
          books: playBooksEntries,
        };
      }

      return {
        id: store.id,
        indexLabel: store.indexLabel,
        name: store.name,
        iconClass: store.iconClass,
        isHolidayPromo: Boolean(store.isHolidayPromo),
        description: isEn ? store.desc_en : store.desc_es,
        books: paidBooks.map(function (book) {
          const stores = book.stores || {};
          const fallbackUrl =
            store.id === 'amazon'
              ? STORE_URLS.amazonAuthor
              : store.id === 'smashwords'
              ? STORE_URLS.smashwordsSale
              : STORE_URLS.books2read;
          const isSmashwordsPromo = store.id === 'smashwords' && book.holidayDiscountPercent;
          const metaLabel = isSmashwordsPromo
            ? isEn
              ? `$${book.holidayPrice.toFixed(2)} USD (was $${book.price.toFixed(2)} · -${book.holidayDiscountPercent}%)`
              : `$${book.holidayPrice.toFixed(2)} USD (antes $${book.price.toFixed(2)} · -${book.holidayDiscountPercent}%)`
            : `$${book.price.toFixed(2)} USD`;

          return {
            id: book.id,
            slug: book.slug,
            title: isEn ? book.title_en : book.title_es,
            price: isSmashwordsPromo ? book.holidayPrice : book.price,
            metaLabel: metaLabel,
            url: stores[store.storeKey] || fallbackUrl,
          };
        }),
      };
    });
  }

  return {
    STORE_URLS: STORE_URLS,
    HOLIDAY_CAMPAIGN: HOLIDAY_CAMPAIGN,
    BOOKS: BOOKS,
    filterAndSortBooks: filterAndSortBooks,
    getHolidayPromotions: getHolidayPromotions,
    getBookPurchaseChannels: getBookPurchaseChannels,
    getStoreDirectory: getStoreDirectory,
  };
});

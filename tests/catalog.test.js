const test = require('node:test');
const assert = require('node:assert/strict');
const {
  BOOKS,
  STORE_URLS,
  HOLIDAY_CAMPAIGN,
  filterAndSortBooks,
  getHolidayPromotions,
  getBookPurchaseChannels,
  getStoreDirectory,
} = require('../js/catalog-logic.js');

test('catalog contains all 4 editorial titles without Stripe links', () => {
  assert.equal(BOOKS.length, 4);
  for (const book of BOOKS) {
    if (book.stores) {
      const urls = Object.values(book.stores);
      for (const url of urls) {
        assert.equal(url.includes('stripe.com'), false, 'Must not contain Stripe payment links');
      }
    }
  }
  assert.equal(Object.values(STORE_URLS).some((u) => u.includes('stripe.com')), false);
});

test('filterAndSortBooks filters by category and search query', () => {
  const systemsBooks = filterAndSortBooks(BOOKS, { category: 'sistemas' });
  assert.equal(systemsBooks.length, 1);
  assert.equal(systemsBooks[0].slug, 'las-tres-tentaciones');

  const queryEs = filterAndSortBooks(BOOKS, { query: 'tentaciones', lang: 'es' });
  assert.equal(queryEs.length, 1);
  assert.equal(queryEs[0].id, 2);

  const queryEn = filterAndSortBooks(BOOKS, { query: 'temptations', lang: 'en' });
  assert.equal(queryEn.length, 1);
  assert.equal(queryEn[0].id, 2);
});

test('filterAndSortBooks sorts by newest, rating, and title', () => {
  const newest = filterAndSortBooks(BOOKS, { sortBy: 'newest' });
  assert.equal(newest[0].id, 2); // 2026-05-10

  const byRating = filterAndSortBooks(BOOKS, { sortBy: 'rating' });
  assert.equal(byRating[0].rating, 4.9);

  const byTitleEs = filterAndSortBooks(BOOKS, { sortBy: 'title', lang: 'es' });
  assert.equal(byTitleEs[0].title_es, 'Comunicación Efectiva en 21 Días');
});

test('getHolidayPromotions returns both books with 25% discount exclusive to Smashwords', () => {
  assert.equal(HOLIDAY_CAMPAIGN.active, true);
  assert.equal(HOLIDAY_CAMPAIGN.discountPercent, 25);

  const promos = getHolidayPromotions('es');
  assert.equal(promos.length, 2);
  assert.deepEqual(
    promos.map((p) => ({ id: p.id, url: p.url, discountPercent: p.discountPercent })),
    [
      {
        id: 2,
        url: 'https://www.smashwords.com/books/view/2024007',
        discountPercent: 25,
      },
      {
        id: 1,
        url: 'https://www.smashwords.com/books/view/1893283',
        discountPercent: 25,
      },
    ]
  );
  assert.equal(promos[0].holidayPrice, 3.74);
  assert.equal(promos[1].holidayPrice, 2.99);
});

test('getBookPurchaseChannels returns Smashwords (-25%), Amazon, Google Play, and Books2Read for paid books only', () => {
  const threeTemptations = BOOKS.find((b) => b.id === 2);
  const channels = getBookPurchaseChannels(threeTemptations, 'es');
  assert.equal(channels.length, 4);
  assert.deepEqual(
    channels.map((c) => c.id),
    ['smashwords', 'amazon', 'playbooks', 'books2read']
  );
  assert.equal(channels.find((c) => c.id === 'smashwords').url, 'https://www.smashwords.com/books/view/2024007');
  assert.equal(
    channels.find((c) => c.id === 'playbooks').url,
    'https://play.google.com/store/books/details/Ulises_Ram%C3%B3n_Cruz_Garc%C3%ADa_Las_tres_tentaciones?id=mQLWEQAAQBAJ'
  );

  const reallyWorks = BOOKS.find((b) => b.id === 1);
  const channelsEs = getBookPurchaseChannels(reallyWorks, 'es');
  assert.deepEqual(
    channelsEs.map((c) => c.id),
    ['smashwords', 'amazon', 'playbooks', 'playaudiobook', 'books2read']
  );
  assert.equal(channelsEs.find((c) => c.id === 'smashwords').url, 'https://www.smashwords.com/books/view/1893283');
  assert.equal(
    channelsEs.find((c) => c.id === 'playbooks').url,
    'https://play.google.com/store/books/details/Ulises_R_Cruz_Garc%C3%ADa_Descubre_lo_que_realmente_fun?id=D5CTEQAAQBAJ'
  );
  assert.equal(
    channelsEs.find((c) => c.id === 'playaudiobook').url,
    'https://play.google.com/store/audiobooks/details/Ulises_R_Cruz_Garc%C3%ADa_Descubre_lo_que_realmente_fun?id=AQAAAEBqfQM9eM'
  );
  assert.equal(
    channelsEs.find((c) => c.id === 'books2read').url,
    'https://books2read.com/Descubre-lo-que-realmente-funciona'
  );

  const channelsEn = getBookPurchaseChannels(reallyWorks, 'en');
  assert.equal(
    channelsEn.find((c) => c.id === 'playbooks').url,
    'https://play.google.com/store/books/details/Ulises_R_Cruz_Garc%C3%ADa_Discover_what_really_works?id=I5CTEQAAQBAJ'
  );

  const freeBook = BOOKS.find((b) => b.price === 0);
  assert.deepEqual(getBookPurchaseChannels(freeBook), []);
});

test('getStoreDirectory exposes Smashwords Holiday (-25%) alongside Amazon, Google Play Books (ES/EN/Audio), and Books2Read', () => {
  const storesEs = getStoreDirectory('es');
  assert.deepEqual(
    storesEs.map((s) => s.id),
    ['smashwords', 'amazon', 'playbooks', 'books2read']
  );

  const smashwordsStore = storesEs.find((s) => s.id === 'smashwords');
  assert.equal(smashwordsStore.isHolidayPromo, true);
  assert.deepEqual(
    smashwordsStore.books.map((b) => b.url),
    ['https://www.smashwords.com/books/view/2024007', 'https://www.smashwords.com/books/view/1893283']
  );

  const amazonStore = storesEs.find((s) => s.id === 'amazon');
  assert.equal(amazonStore.books.length, 2);
  assert.notEqual(amazonStore.books[0].url, amazonStore.books[1].url);

  const books2readStore = storesEs.find((s) => s.id === 'books2read');
  assert.equal(books2readStore.books.length, 2);
  assert.equal(books2readStore.books[0].url, 'https://books2read.com/editorialarcus');
  assert.equal(books2readStore.books[1].url, 'https://books2read.com/Descubre-lo-que-realmente-funciona');

  const playStore = storesEs.find((s) => s.id === 'playbooks');
  assert.equal(playStore.books.length, 4);
  assert.deepEqual(
    playStore.books.map((b) => b.url),
    [
      'https://play.google.com/store/books/details/Ulises_Ram%C3%B3n_Cruz_Garc%C3%ADa_Las_tres_tentaciones?id=mQLWEQAAQBAJ',
      'https://play.google.com/store/books/details/Ulises_R_Cruz_Garc%C3%ADa_Descubre_lo_que_realmente_fun?id=D5CTEQAAQBAJ',
      'https://play.google.com/store/books/details/Ulises_R_Cruz_Garc%C3%ADa_Discover_what_really_works?id=I5CTEQAAQBAJ',
      'https://play.google.com/store/audiobooks/details/Ulises_R_Cruz_Garc%C3%ADa_Descubre_lo_que_realmente_fun?id=AQAAAEBqfQM9eM',
    ]
  );

  const storesEn = getStoreDirectory('en');
  assert.equal(
    storesEn.find((s) => s.id === 'playbooks').books[1].url,
    'https://play.google.com/store/books/details/Ulises_R_Cruz_Garc%C3%ADa_Discover_what_really_works?id=I5CTEQAAQBAJ'
  );
});

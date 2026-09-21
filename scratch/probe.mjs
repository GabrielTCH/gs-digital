import puppeteer from 'file:///C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=pt-BR']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });

  const query = 'Dra dentista Moema Sao Paulo';
  console.log(`Buscando: ${query}`);
  await page.goto(`https://www.google.com.br/maps/search/${encodeURIComponent(query)}?hl=pt-BR`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  const items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a.hfpxzc')).slice(0, 3).map(a => ({
      name: a.getAttribute('aria-label'),
      url: a.href
    }));
  });

  console.log('Itens encontrados:', items);

  for (const item of items) {
    console.log(`\n--- Testando: ${item.name} ---`);
    await page.goto(item.url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2500));

    const data = await page.evaluate(() => {
      // Nome
      const h1 = document.querySelector('h1.DUwDvf');
      const name = h1 ? h1.innerText.trim() : '';

      // Telefone
      const phoneBtn = document.querySelector('button[data-tooltip*="telefone"], button[data-item-id*="phone"]');
      let phone = phoneBtn ? phoneBtn.innerText.trim() : null;
      let phoneAttr = phoneBtn ? phoneBtn.getAttribute('data-item-id') : null;

      // Website
      const webBtn = document.querySelector('a[data-tooltip*="site"], a[data-item-id="authority"]');
      const webUrl = webBtn ? webBtn.href : null;

      // Endereço
      const addrBtn = document.querySelector('button[data-item-id="address"]');
      const address = addrBtn ? addrBtn.innerText.trim() : null;

      // Avaliação
      const ratingSpan = document.querySelector('span.ceNzKf');
      const rating = ratingSpan ? ratingSpan.getAttribute('aria-label') : null;

      const numReviewsBtn = document.querySelector('button[aria-label*="avaliaç"]');
      const reviews = numReviewsBtn ? numReviewsBtn.innerText.trim() : null;

      return { name, phone, phoneAttr, webUrl, address, rating, reviews };
    });

    console.log(data);
  }

  await browser.close();
}

test().catch(console.error);

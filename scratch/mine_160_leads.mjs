import puppeteer from 'file:///C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';

const TARGET_QUERIES = [
  // Odontologia (Dentistas com nome do profissional)
  { niche: 'Odontologia', query: 'Dra dentista Moema Sao Paulo', neighborhood: 'Moema' },
  { niche: 'Odontologia', query: 'Dr dentista Pinheiros Sao Paulo', neighborhood: 'Pinheiros' },
  { niche: 'Odontologia', query: 'Dra dentista Jardins Sao Paulo', neighborhood: 'Jardins' },
  { niche: 'Odontologia', query: 'Dra dentista Itaim Bibi Sao Paulo', neighborhood: 'Itaim Bibi' },
  { niche: 'Odontologia', query: 'Dr dentista Vila Mariana Sao Paulo', neighborhood: 'Vila Mariana' },
  { niche: 'Odontologia', query: 'Dra dentista Tatuape Sao Paulo', neighborhood: 'Tatuapé' },
  { niche: 'Odontologia', query: 'Dr dentista Perdizes Sao Paulo', neighborhood: 'Perdizes' },
  { niche: 'Odontologia', query: 'Dra dentista Santana Sao Paulo', neighborhood: 'Santana' },
  { niche: 'Odontologia', query: 'Dr dentista Morumbi Sao Paulo', neighborhood: 'Morumbi' },
  { niche: 'Odontologia', query: 'Dra odontologia Higienopolis Sao Paulo', neighborhood: 'Higienópolis' },

  // Estética, Harmonização Facial & Dermatologia
  { niche: 'Estética & Harmonização', query: 'Dra harmonizacao facial Moema Sao Paulo', neighborhood: 'Moema' },
  { niche: 'Estética & Harmonização', query: 'Dra estetica avancada Jardins Sao Paulo', neighborhood: 'Jardins' },
  { niche: 'Estética & Harmonização', query: 'Dra biomedicina estetica Pinheiros Sao Paulo', neighborhood: 'Pinheiros' },
  { niche: 'Estética & Harmonização', query: 'Dra harmonizacao facial Itaim Bibi Sao Paulo', neighborhood: 'Itaim Bibi' },
  { niche: 'Estética & Harmonização', query: 'Dra estetica Vila Mariana Sao Paulo', neighborhood: 'Vila Mariana' },
  { niche: 'Estética & Harmonização', query: 'Dra harmonizacao Tatuape Sao Paulo', neighborhood: 'Tatuapé' },
  { niche: 'Estética & Harmonização', query: 'Dra estetica Perdizes Sao Paulo', neighborhood: 'Perdizes' },
  { niche: 'Estética & Harmonização', query: 'Dra dermatologista Moema Sao Paulo', neighborhood: 'Moema' },

  // Nutrição Clínica & Esportiva
  { niche: 'Nutrição', query: 'Nutricionista Moema Sao Paulo', neighborhood: 'Moema' },
  { niche: 'Nutrição', query: 'Dra nutricionista Jardins Sao Paulo', neighborhood: 'Jardins' },
  { niche: 'Nutrição', query: 'Dr nutricionista esportivo Itaim Bibi Sao Paulo', neighborhood: 'Itaim Bibi' },
  { niche: 'Nutrição', query: 'Nutricionista Pinheiros Sao Paulo', neighborhood: 'Pinheiros' },
  { niche: 'Nutrição', query: 'Dra nutricionista Vila Mariana Sao Paulo', neighborhood: 'Vila Mariana' },
  { niche: 'Nutrição', query: 'Nutricionista Tatuape Sao Paulo', neighborhood: 'Tatuapé' },
  { niche: 'Nutrição', query: 'Dra nutricionista Perdizes Sao Paulo', neighborhood: 'Perdizes' },

  // Psicologia & Psicoterapia
  { niche: 'Psicologia', query: 'Psicologa Moema Sao Paulo', neighborhood: 'Moema' },
  { niche: 'Psicologia', query: 'Dra psicologa Jardins Sao Paulo', neighborhood: 'Jardins' },
  { niche: 'Psicologia', query: 'Psicologo Pinheiros Sao Paulo', neighborhood: 'Pinheiros' },
  { niche: 'Psicologia', query: 'Dra psicologa Itaim Bibi Sao Paulo', neighborhood: 'Itaim Bibi' },
  { niche: 'Psicologia', query: 'Psicologa Vila Mariana Sao Paulo', neighborhood: 'Vila Mariana' },
  { niche: 'Psicologia', query: 'Psicologa Tatuape Sao Paulo', neighborhood: 'Tatuapé' },
  { niche: 'Psicologia', query: 'Psicologa Perdizes Sao Paulo', neighborhood: 'Perdizes' },

  // Advocacia (Bancas Unipessoais / Nome Próprio)
  { niche: 'Advocacia', query: 'Advogado Moema Sao Paulo', neighborhood: 'Moema' },
  { niche: 'Advocacia', query: 'Advocacia Dr Jardins Sao Paulo', neighborhood: 'Jardins' },
  { niche: 'Advocacia', query: 'Advogada Pinheiros Sao Paulo', neighborhood: 'Pinheiros' },
  { niche: 'Advocacia', query: 'Advogado Itaim Bibi Sao Paulo', neighborhood: 'Itaim Bibi' },
  { niche: 'Advocacia', query: 'Advocacia Tatuape Sao Paulo', neighborhood: 'Tatuapé' },

  // Arquitetura & Design de Interiores (Studio / Nome Próprio)
  { niche: 'Arquitetura', query: 'Arquiteta interiores Moema Sao Paulo', neighborhood: 'Moema' },
  { niche: 'Arquitetura', query: 'Studio arquitetura Jardins Sao Paulo', neighborhood: 'Jardins' },
  { niche: 'Arquitetura', query: 'Arquiteta Pinheiros Sao Paulo', neighborhood: 'Pinheiros' },
  { niche: 'Arquitetura', query: 'Studio design interiores Itaim Bibi Sao Paulo', neighborhood: 'Itaim Bibi' },
  { niche: 'Arquitetura', query: 'Arquiteta Vila Mariana Sao Paulo', neighborhood: 'Vila Mariana' }
];

// Validador de número de celular de SP (DDD 11 com nono dígito)
function extractValidCellPhone(rawPhone, rawAttr) {
  const combined = `${rawPhone || ''} ${rawAttr || ''}`;
  const digits = combined.replace(/\D/g, '');

  // Padrões de celular com DDD 11
  let match = combined.match(/\(?11\)?\s?9\d{4}[-\s]?\d{4}/);
  if (match) {
    const cleanDigits = match[0].replace(/\D/g, '');
    if (cleanDigits.length === 11 && cleanDigits.startsWith('119')) {
      return {
        formatted: `(11) ${cleanDigits.slice(2, 7)}-${cleanDigits.slice(7)}`,
        whatsappDigits: `55${cleanDigits}`
      };
    }
  }

  // Se veio direto no atributo tel:0119...
  const telMatch = combined.match(/(?:tel:0?|55)?(119\d{8})/);
  if (telMatch) {
    const cleanDigits = telMatch[1];
    return {
      formatted: `(11) ${cleanDigits.slice(2, 7)}-${cleanDigits.slice(7)}`,
      whatsappDigits: `55${cleanDigits}`
    };
  }

  return null;
}

// Validador de site: retorna TRUE se NÃO possui site próprio
function isWithoutWebsite(url) {
  if (!url || url.trim() === '') return { withoutSite: true, reason: 'Sem site cadastrado' };
  const u = url.toLowerCase();

  const socialPatterns = [
    'instagram.com',
    'facebook.com',
    'linktr.ee',
    'beacons.ai',
    'wa.me',
    'api.whatsapp.com',
    'trinks.com',
    'doctoralia.com.br',
    'app.keptclin.com.br',
    'wixsite.com',
    'site.me',
    'negocio.site' // sites padrão do antigo Google Sites desativados
  ];

  for (const pattern of socialPatterns) {
    if (u.includes(pattern)) {
      return { withoutSite: true, reason: `Apenas ${pattern.split('.')[0]}` };
    }
  }

  return { withoutSite: false, reason: 'Possui site próprio' };
}

// Extrair nome da pessoa para saudação
function extractPersonName(rawName) {
  if (!rawName) return 'Doutor(a)';
  let clean = rawName.split('-')[0].split('|')[0].trim();

  // Dra. / Dr.
  const docMatch = clean.match(/(Dra?\.|Doutor[a]?)\s+([A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)?)/i);
  if (docMatch) {
    return `${docMatch[1]} ${docMatch[2].split(' ')[0]}`;
  }

  // Nutricionista / Psicóloga / Arquiteta
  const profMatch = clean.match(/(Nutricionista|Psicólog[ao]|Arquiteta|Arquiteto|Advogad[ao])\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)/i);
  if (profMatch) {
    return profMatch[2];
  }

  // Studio / Consultório / Espaço
  const studioMatch = clean.match(/(Studio|Consultório|Espaço|Instituto)\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)/i);
  if (studioMatch) {
    return studioMatch[2];
  }

  // Primeiro e segundo nome
  const parts = clean.split(' ').filter(p => p.length > 2);
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1]}`;
  }

  return clean;
}

// Gerar mensagem de abordagem com foco em AÇÃO PROMOCIONAL
function generatePromotionalPitch(lead) {
  const person = lead.greeting;
  const niche = lead.niche.toLowerCase();
  const neighborhood = lead.neighborhood;
  const ratingText = lead.rating ? ` (vi que você tem nota ${lead.rating} no Google ⭐)` : '';

  let channelMention = '';
  if (lead.siteReason.includes('instagram')) channelMention = 'usando apenas o perfil do Instagram';
  else if (lead.siteReason.includes('linktr')) channelMention = 'usando apenas um link de Linktree';
  else channelMention = 'sem uma página oficial própria cadastrada no Google';

  return `Olá, ${person}! Tudo bem?

Estava acompanhando as referências de ${niche} em ${neighborhood} e encontrei o seu perfil${ratingText}. Parabéns pelo trabalho e pela reputação!

Notei que hoje você está ${channelMention}, sem um site institucional próprio com agendamento direto. Quando o paciente pesquisa no Google em ${neighborhood}, quem tem site profissional passa muito mais autoridade e capta o contato antes.

Aqui na GS Dev Studio estamos com uma *ação promocional especial neste mês para profissionais liberais de São Paulo*: desenvolvemos uma página de alta conversão para celular, otimizada para o Google e com botão direto de WhatsApp, incluindo toda a manutenção para você não se preocupar com nada técnico.

Posso te mandar uma prévia visual de 1 minuto sem nenhum compromisso para você ver como ficaria?`;
}

async function mine160Leads() {
  console.log('🚀 Iniciando minerador de alta performance para 160 leads SEM SITE...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--lang=pt-BR'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });

  // Otimização de rede: abortar imagens, mídias e fontes para velocidade máxima
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'media', 'font'].includes(req.resourceType())) req.abort();
    else req.continue();
  });

  const leads = [];
  const visitedPhones = new Set();
  const visitedNames = new Set();

  // Carregar leads existentes para evitar duplicatas se houver
  const existingFiles = [
    'C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/leads.json',
    'C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/leads_batch2.json'
  ];
  for (const f of existingFiles) {
    if (fs.existsSync(f)) {
      try {
        const raw = JSON.parse(fs.readFileSync(f, 'utf8') || '[]');
        raw.forEach(l => {
          if (l.whatsappDigits) visitedPhones.add(l.whatsappDigits);
          if (l.name) visitedNames.add(l.name.toLowerCase().trim());
        });
      } catch (e) {}
    }
  }

  console.log(`Leads anteriores conhecidos na base: ${visitedPhones.size} telefones.`);

  for (const target of TARGET_QUERIES) {
    if (leads.length >= 160) break;

    console.log(`\n🔎 [${leads.length}/160] Buscando: ${target.query}...`);
    const searchUrl = `https://www.google.com.br/maps/search/${encodeURIComponent(target.query)}?hl=pt-BR`;
    
    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2500));

      // Rolar a lista para carregar mais itens
      await page.evaluate(async () => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) {
          feed.scrollTop = 2500;
          await new Promise(r => setTimeout(r, 1500));
          feed.scrollTop = 5000;
          await new Promise(r => setTimeout(r, 1500));
        }
      });

      const cards = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a.hfpxzc')).map(a => ({
          name: a.getAttribute('aria-label') || '',
          url: a.href || ''
        })).filter(c => c.name && c.url);
      });

      console.log(`  Encontrados ${cards.length} estabelecimentos no feed.`);

      for (const card of cards) {
        if (leads.length >= 160) break;

        const cleanName = card.name.toLowerCase().trim();
        if (visitedNames.has(cleanName)) continue;
        visitedNames.add(cleanName);

        try {
          await page.goto(card.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
          await new Promise(r => setTimeout(r, 1200));

          const rawData = await page.evaluate(() => {
            const h1 = document.querySelector('h1.DUwDvf');
            const name = h1 ? h1.innerText.trim() : '';

            const phoneBtn = document.querySelector('button[data-tooltip*="telefone"], button[data-item-id*="phone"]');
            const phone = phoneBtn ? phoneBtn.innerText.trim() : null;
            const phoneAttr = phoneBtn ? phoneBtn.getAttribute('data-item-id') : null;

            const webBtn = document.querySelector('a[data-tooltip*="site"], a[data-item-id="authority"]');
            const webUrl = webBtn ? webBtn.href : null;

            const addrBtn = document.querySelector('button[data-item-id="address"]');
            const address = addrBtn ? addrBtn.innerText.trim() : null;

            const ratingSpan = document.querySelector('span.ceNzKf');
            const rating = ratingSpan ? ratingSpan.getAttribute('aria-label') : null;

            const numReviewsBtn = document.querySelector('button[aria-label*="avaliaç"]');
            const reviews = numReviewsBtn ? numReviewsBtn.innerText.trim() : null;

            return { name, phone, phoneAttr, webUrl, address, rating, reviews };
          });

          // 1. Validar se NÃO TEM SITE
          const siteCheck = isWithoutWebsite(rawData.webUrl);
          if (!siteCheck.withoutSite) {
            // Tem site próprio: DESCARTA!
            continue;
          }

          // 2. Validar se TEM CELULAR / WHATSAPP VÁLIDO (DDD 11)
          const validPhone = extractValidCellPhone(rawData.phone, rawData.phoneAttr);
          if (!validPhone) {
            // É fixo ou inválido: DESCARTA!
            continue;
          }

          if (visitedPhones.has(validPhone.whatsappDigits)) {
            continue;
          }
          visitedPhones.add(validPhone.whatsappDigits);

          // 3. Extrair nome do profissional
          const greeting = extractPersonName(rawData.name);

          // 4. Formatar avaliações
          let cleanRating = '5,0';
          if (rawData.rating) {
            const rMatch = rawData.rating.match(/(\d[,\.]\d)/);
            if (rMatch) cleanRating = rMatch[1].replace('.', ',');
          }
          let cleanReviews = 'Avaliações no Google';
          if (rawData.reviews) {
            const revMatch = rawData.reviews.match(/(\d+)/);
            if (revMatch) cleanReviews = `${revMatch[1]} avaliações`;
          }

          const lead = {
            id: `lead-${String(leads.length + 1).padStart(3, '0')}`,
            name: rawData.name,
            greeting: greeting,
            niche: target.niche,
            neighborhood: target.neighborhood,
            phone: validPhone.formatted,
            whatsappDigits: validPhone.whatsappDigits,
            rating: cleanRating,
            reviews: cleanReviews,
            siteStatus: 'SEM SITE PRÓPRIO',
            siteReason: siteCheck.reason,
            originalWebUrl: rawData.webUrl || 'Nenhum link cadastrado',
            address: (rawData.address || '').replace(/^\s*/, '').replace(/\n/g, ' '),
            mapsUrl: card.url
          };

          lead.pitchMessage = generatePromotionalPitch(lead);
          lead.waLink = `https://wa.me/${lead.whatsappDigits}?text=${encodeURIComponent(lead.pitchMessage)}`;

          leads.push(lead);
          console.log(`  ✅ [${leads.length}/160] ${lead.id}: ${lead.name} (${lead.greeting}) | ${lead.phone} | ${lead.siteReason}`);

          // Salvar progresso incremental a cada 10 leads
          if (leads.length % 10 === 0 || leads.length === 160) {
            saveOutputs(leads);
          }

        } catch (placeErr) {
          // Erro pontual no card, segue para o próximo
        }
      }

    } catch (queryErr) {
      console.log(`Erro na query ${target.query}: ${queryErr.message}`);
    }
  }

  await browser.close();
  console.log(`\n🎉 Mineração concluída! Total de leads coletados e validados: ${leads.length}`);
  saveOutputs(leads);
}

function saveOutputs(leads) {
  const jsonPath = 'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads_sp.json';
  const csvPath = 'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads_sp.csv';
  const htmlPath = 'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads.html';

  // 1. Salvar JSON
  fs.writeFileSync(jsonPath, JSON.stringify(leads, null, 2), 'utf8');

  // 2. Salvar CSV
  const csvHeader = 'ID;Nome;Saudacao;Nicho;Bairro;WhatsApp;Nota;Avaliacoes;SituacaoSite;LinkOriginal;Endereco;LinkWhatsApp;MensagemAbordagem\n';
  const csvRows = leads.map(l => {
    return [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.greeting}"`,
      `"${l.niche}"`,
      `"${l.neighborhood}"`,
      l.phone,
      l.rating,
      `"${l.reviews}"`,
      `"${l.siteReason}"`,
      `"${l.originalWebUrl}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      l.waLink,
      `"${l.pitchMessage.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ].join(';');
  }).join('\n');
  fs.writeFileSync(csvPath, '\uFEFF' + csvHeader + csvRows, 'utf8'); // BOM para abrir perfeito no Excel BR

  // 3. Salvar Painel HTML Interativo
  const htmlContent = generateDashboardHTML(leads);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  console.log(`💾 Arquivos atualizados com ${leads.length} leads:`);
  console.log(`   - JSON: ${jsonPath}`);
  console.log(`   - CSV:  ${csvPath}`);
  console.log(`   - HTML: ${htmlPath}`);
}

function generateDashboardHTML(leads) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GS Dev Studio — CRM Prospecção 160 Leads SP (Sem Site)</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #070b12; color: #f1f5f9; min-height: 100vh; padding: 24px; }
    .header { max-width: 1400px; margin: 0 auto 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid rgba(0, 240, 255, 0.15); padding-bottom: 20px; }
    .title h1 { font-size: 1.8rem; color: #fff; display: flex; align-items: center; gap: 10px; }
    .title h1 span { color: #00f0ff; }
    .title p { color: #94a3b8; font-size: 0.95rem; margin-top: 4px; }
    .stats-bar { display: flex; gap: 16px; flex-wrap: wrap; }
    .stat-pill { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 8px; font-size: 0.88rem; }
    .stat-pill strong { color: #00f0ff; font-size: 1.1rem; margin-right: 4px; }
    
    .filters { max-width: 1400px; margin: 0 auto 24px; display: flex; gap: 12px; flex-wrap: wrap; }
    .filter-btn { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .filter-btn.active, .filter-btn:hover { background: rgba(0, 240, 255, 0.15); border-color: #00f0ff; color: #00f0ff; }

    .grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 18px; }
    .card { background: rgba(13, 20, 36, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; justify-content: space-between; }
    .card:hover { transform: translateY(-3px); border-color: rgba(0, 240, 255, 0.4); }
    
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
    .card-id { font-size: 0.75rem; color: #00f0ff; background: rgba(0, 240, 255, 0.1); padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    .card-niche { font-size: 0.78rem; color: #cbd5e1; background: rgba(255, 255, 255, 0.06); padding: 2px 8px; border-radius: 4px; }
    
    .card-name { font-size: 1.15rem; font-weight: 600; color: #fff; margin-bottom: 6px; line-height: 1.3; }
    .card-person { color: #38bdf8; font-size: 0.88rem; font-weight: 500; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
    .card-meta { font-size: 0.82rem; color: #94a3b8; display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
    .badge-sem-site { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; }
    .badge-bairro { background: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; }
    
    .card-pitch { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 12px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.45; margin-bottom: 16px; white-space: pre-line; max-height: 130px; overflow-y: auto; }
    
    .card-actions { display: flex; gap: 10px; }
    .btn-wa { flex: 1; background: #22c55e; color: #fff; text-decoration: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.88rem; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s; }
    .btn-wa:hover { background: #16a34a; }
    .btn-copy { background: rgba(255, 255, 255, 0.08); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
    .btn-copy:hover { background: rgba(255, 255, 255, 0.15); color: #fff; }
  </style>
</head>
<body>

  <div class="header">
    <div class="title">
      <h1>GS Dev Studio <span>• 160 Leads SP</span></h1>
      <p>Prospecções de Alto Ticket em São Paulo • 100% Sem Site Próprio • WhatsApp Profissional Validados</p>
    </div>
    <div class="stats-bar">
      <div class="stat-pill">Total: <strong id="total-count">${leads.length}</strong> leads</div>
      <div class="stat-pill">Critério: <strong>100% Sem Site</strong></div>
      <div class="stat-pill">Canal: <strong>WhatsApp Celular SP</strong></div>
    </div>
  </div>

  <div class="filters">
    <button class="filter-btn active" onclick="filterNiche('all')">Todos (${leads.length})</button>
    <button class="filter-btn" onclick="filterNiche('Odontologia')">Odontologia</button>
    <button class="filter-btn" onclick="filterNiche('Estética & Harmonização')">Estética & Harmonização</button>
    <button class="filter-btn" onclick="filterNiche('Nutrição')">Nutrição</button>
    <button class="filter-btn" onclick="filterNiche('Psicologia')">Psicologia</button>
    <button class="filter-btn" onclick="filterNiche('Advocacia')">Advocacia</button>
    <button class="filter-btn" onclick="filterNiche('Arquitetura')">Arquitetura</button>
  </div>

  <div class="grid" id="leads-grid">
    ${leads.map(lead => `
      <div class="card" data-niche="${lead.niche}">
        <div>
          <div class="card-top">
            <span class="card-id">${lead.id}</span>
            <span class="card-niche">${lead.niche}</span>
          </div>
          <div class="card-name">${lead.name}</div>
          <div class="card-person">👤 Falar com: <strong>${lead.greeting}</strong></div>
          <div class="card-meta">
            <span class="badge-sem-site">⚠️ ${lead.siteReason}</span>
            <span class="badge-bairro">📍 ${lead.neighborhood}</span>
            <span>⭐ ${lead.rating} (${lead.reviews})</span>
          </div>
          <div class="card-pitch" id="pitch-${lead.id}">${lead.pitchMessage}</div>
        </div>
        <div class="card-actions">
          <a href="${lead.waLink}" target="_blank" class="btn-wa">
            <span>Abrir WhatsApp</span> 💬
          </a>
          <button class="btn-copy" onclick="copyPitch('${lead.id}')" title="Copiar mensagem">Copiar 📋</button>
        </div>
      </div>
    `).join('')}
  </div>

  <script>
    function filterNiche(niche) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        if (niche === 'all' || card.getAttribute('data-niche') === niche) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function copyPitch(id) {
      const el = document.getElementById('pitch-' + id);
      if (el) {
        navigator.clipboard.writeText(el.innerText).then(() => {
          alert('Mensagem copiada para a área de transferência!');
        });
      }
    }
  </script>
</body>
</html>`;
}

mine160Leads().catch(console.error);

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/node_modules/xlsx');

const rawLeadsPath = 'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads_sp.json';
const rawLeads = JSON.parse(fs.readFileSync(rawLeadsPath, 'utf8'));

console.log(`Lendo ${rawLeads.length} leads minerados...`);

// Atualizar mensagem personalizada com a ação de 50% OFF
const enrichedLeads = rawLeads.map((l, index) => {
  const leadId = `LEAD-${String(index + 1).padStart(3, '0')}`;
  const person = l.greeting || 'Doutor(a)';
  const niche = l.niche || 'serviços';
  const neighborhood = l.neighborhood || 'São Paulo';
  const ratingText = l.rating && l.rating !== 'Sem nota' ? ` com nota ${l.rating}★` : '';

  let channelMention = '';
  if (l.siteReason.includes('instagram')) channelMention = 'usando apenas o perfil do Instagram';
  else if (l.siteReason.includes('linktr')) channelMention = 'usando apenas um link de Linktree';
  else if (l.siteReason.includes('wa')) channelMention = 'direcionando apenas para o WhatsApp';
  else if (l.siteReason.includes('doctoralia')) channelMention = 'usando apenas a página do Doctoralia';
  else channelMention = 'sem uma página oficial própria cadastrada no Google';

  // Mensagem personalizada oficial com AÇÃO DE 50% OFF
  const pitchMessage = `Olá, ${person}! Tudo bem? Sou o Gabriel da GS Dev Studio.

Acompanho as referências de ${niche} em ${neighborhood} e encontrei o seu perfil no Google${ratingText}. Parabéns pela reputação e avaliações!

Notei que hoje você está ${channelMention}, sem um site institucional próprio com agendamento direto. Quando alguém pesquisa por ${niche} no Google em ${neighborhood}, quem tem site profissional passa muito mais credibilidade e recebe o contato antes.

Selecionei o seu perfil para a nossa *ação promocional exclusiva de 50% OFF nesta semana em São Paulo*: desenvolvemos a sua página profissional de alta conversão para celular com 50% de desconto no setup, com botão direto de WhatsApp e manutenção técnica contínua inclusa para você não se preocupar com nada.

Posso te mandar uma demonstração visual de 1 minuto sem compromisso para você ver como ficaria?`;

  const waLink = `https://wa.me/${l.whatsappDigits}?text=${encodeURIComponent(pitchMessage)}`;

  // Formatar nichoId
  let nicheId = 'odonto';
  if (l.niche.includes('Estética')) nicheId = 'estetica';
  else if (l.niche.includes('Nutrição')) nicheId = 'nutri';
  else if (l.niche.includes('Psicologia')) nicheId = 'psico';
  else if (l.niche.includes('Advocacia')) nicheId = 'advocacia';
  else if (l.niche.includes('Arquitetura')) nicheId = 'arquit';

  return {
    id: leadId,
    niche: l.niche,
    nicheId: nicheId,
    name: l.name,
    greeting: person,
    neighborhood: l.neighborhood,
    rating: l.rating || '5,0',
    reviews: l.reviews || 'Avaliações no Google',
    phone: l.phone,
    whatsappDigits: l.whatsappDigits,
    isCell: true,
    address: l.address,
    hasCustomSite: false,
    siteStatusLabel: `Sem site próprio (${l.siteReason})`,
    siteStatusClass: 'warning',
    websiteUrl: l.originalWebUrl !== 'Nenhum link cadastrado' ? l.originalWebUrl : null,
    mapsUrl: l.mapsUrl,
    pitchMessage: pitchMessage,
    waLink: waLink,
    perguntasConsultivas: [
      {
        title: "Primeiro contato e acolhimento",
        message: pitchMessage
      },
      {
        title: "Origem dos contatos em " + neighborhood,
        message: `Hoje a maior parte dos seus novos pacientes/clientes chega por indicação, pelo Instagram ou você já recebe pessoas que te acham no Google?`
      },
      {
        title: "Apresentação da demonstração visual",
        message: `Preparei um modelo de demonstração exclusivo para ${niche} com design moderno em modo escuro, carregamento instantâneo no celular e botão de WhatsApp direto. Posso te enviar o link para você dar uma olhada de 1 minuto?`
      },
      {
        title: "Condição especial de 50% OFF",
        message: `Como você foi selecionado(a) nesta ação promocional, conseguimos aplicar os 50% de desconto no desenvolvimento e já entregar tudo configurado, com domínio próprio e manutenção mensal inclusa. Se fizer sentido para você, podemos dar início hoje!`
      }
    ],
    respostasConsultivas: [
      {
        title: "Se disser que o Instagram já é suficiente",
        message: "O Instagram é ótimo para manter seus seguidores engajados. Mas quem precisa de um serviço urgente pesquisa no Google. O site é para captar esses clientes decididos e transmitir uma credibilidade que o Instagram sozinho não passa."
      },
      {
        title: "Se perguntar o valor",
        message: "Com a nossa condição promocional de 50% OFF desta semana, a página profissional completa sai de R$ 1.990 por apenas R$ 990 no setup (podendo parcelar no cartão), com o plano de manutenção preventiva contínua a R$ 189/mês para cuidar de segurança, velocidade e atualizações."
      },
      {
        title: "Se disser que não tem tempo",
        message: "Você não vai precisar se preocupar com nada técnico nem escrever textos. Nossa equipe estrutura todo o design, conecta seu WhatsApp e coloca tudo no ar. Seu único trabalho é aprovar o modelo e responder aos clientes!"
      }
    ],
    orientacaoContato: [
      `Número validado: ${l.phone} (WhatsApp Celular SP)`,
      `Situação do site: ${l.siteReason} (100% SEM SITE PRÓPRIO)`,
      `AÇÃO PROMOCIONAL: 50% de desconto no setup de desenvolvimento nesta semana`,
      `Falar diretamente com: ${person}`
    ]
  };
});

console.log(`Todos os ${enrichedLeads.length} leads enriquecidos com a ação de 50% OFF!`);

// 1. Salvar JSON atualizado
const jsonOut = 'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads_sp.json';
fs.writeFileSync(jsonOut, JSON.stringify(enrichedLeads, null, 2), 'utf8');

// 2. Salvar CSV formatado
const csvOut = 'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads_sp.csv';
const csvHeader = 'ID;Nome;FalarCom;Nicho;Bairro;WhatsApp;Nota;Avaliacoes;SituacaoSite;LinkOriginal;Endereco;LinkWhatsApp;MensagemAbordagem50Off\n';
const csvRows = enrichedLeads.map(l => {
  return [
    l.id,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.greeting}"`,
    `"${l.niche}"`,
    `"${l.neighborhood}"`,
    l.phone,
    l.rating,
    `"${l.reviews}"`,
    `"${l.siteStatusLabel}"`,
    `"${l.websiteUrl || 'Sem link'}"`,
    `"${l.address.replace(/"/g, '""')}"`,
    l.waLink,
    `"${l.pitchMessage.replace(/"/g, '""').replace(/\n/g, ' ')}"`
  ].join(';');
}).join('\n');
fs.writeFileSync(csvOut, '\uFEFF' + csvHeader + csvRows, 'utf8');

// 3. Gerar Planilha Excel (.xlsx) com abas e formatação profissional
const wsData = [
  ['ID', 'Nome / Estabelecimento', 'Falar com', 'Nicho', 'Bairro', 'WhatsApp', 'Nota Google', 'Avaliações', 'Situação do Site', 'Link Atual', 'Endereço Completo', 'Link WhatsApp Direto', 'Mensagem de Abordagem (50% OFF)']
];

enrichedLeads.forEach(l => {
  wsData.push([
    l.id,
    l.name,
    l.greeting,
    l.niche,
    l.neighborhood,
    l.phone,
    l.rating,
    l.reviews,
    l.siteStatusLabel,
    l.websiteUrl || 'Nenhum site cadastrado',
    l.address,
    l.waLink,
    l.pitchMessage
  ]);
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(wsData);

// Ajustar largura das colunas
ws['!cols'] = [
  { wch: 10 }, // ID
  { wch: 40 }, // Nome
  { wch: 20 }, // Falar com
  { wch: 25 }, // Nicho
  { wch: 15 }, // Bairro
  { wch: 18 }, // WhatsApp
  { wch: 12 }, // Nota
  { wch: 20 }, // Avaliações
  { wch: 30 }, // Situação do Site
  { wch: 35 }, // Link Atual
  { wch: 45 }, // Endereço
  { wch: 50 }, // Link WhatsApp
  { wch: 80 }  // Mensagem
];

XLSX.utils.book_append_sheet(wb, ws, '160 Leads SP - 50% OFF');

const xlsxPaths = [
  'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_clientes_sp.xlsx',
  'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads_sp.xlsx',
  'C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/prospeccao_clientes_sp.xlsx'
];

for (const p of xlsxPaths) {
  try {
    XLSX.writeFile(wb, p);
    console.log(`✅ Planilha Excel gravada com sucesso em: ${p}`);
  } catch (e) {
    console.log(`Erro ao gravar ${p}: ${e.message}`);
  }
}

// 4. Sincronizar com o CRM existente (crm.html e crm/index.html)
const crmFiles = [
  'C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/crm.html',
  'C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/crm/index.html',
  'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/crm.html'
];

const leadsJsonForCrm = JSON.stringify(enrichedLeads);

for (const crmPath of crmFiles) {
  if (fs.existsSync(crmPath)) {
    let html = fs.readFileSync(crmPath, 'utf8');

    // Substituir DEFAULT_LEADS
    const regex = /const DEFAULT_LEADS = \[[\s\S]*?\];/;
    if (regex.test(html)) {
      html = html.replace(regex, `const DEFAULT_LEADS = ${leadsJsonForCrm};`);
      
      // Incrementar chave de storage para v4 para limpar caches antigos do navegador e forçar o carregamento dos 160 novos leads
      html = html.replace(/ProspectaCRM-storage-v\d+/g, 'ProspectaCRM-storage-v4');
      html = html.replace(/<title>.*?<\/title>/, '<title>GS Dev Studio — CRM 160 Leads SP (50% OFF)</title>');

      fs.writeFileSync(crmPath, html, 'utf8');
      console.log(`✅ CRM sincronizado com os 160 leads em: ${crmPath}`);
    } else {
      console.log(`Aviso: DEFAULT_LEADS não encontrado em ${crmPath}`);
    }
  } else if (crmPath.endsWith('gs-digital/crm.html')) {
    // Copiar o CRM da pasta prospeccao-gmaps para gs-digital
    const source = 'C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/crm.html';
    if (fs.existsSync(source)) {
      let html = fs.readFileSync(source, 'utf8');
      html = html.replace(/const DEFAULT_LEADS = \[[\s\S]*?\];/, `const DEFAULT_LEADS = ${leadsJsonForCrm};`);
      html = html.replace(/ProspectaCRM-storage-v\d+/g, 'ProspectaCRM-storage-v4');
      html = html.replace(/<title>.*?<\/title>/, '<title>GS Dev Studio — CRM 160 Leads SP (50% OFF)</title>');
      fs.writeFileSync(crmPath, html, 'utf8');
      console.log(`✅ CRM copiado e sincronizado em: ${crmPath}`);
    }
  }
}

// 5. Atualizar o Painel Visual HTML em prospeccao_160_leads.html
const dashboardHtml = generateDashboard(enrichedLeads);
fs.writeFileSync('C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads.html', dashboardHtml, 'utf8');
console.log(`✅ Painel Visual de Prospecção atualizado em prospeccao_160_leads.html`);

function generateDashboard(leads) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GS Dev Studio — CRM 160 Leads SP (Ação 50% OFF)</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #070b12; color: #f1f5f9; min-height: 100vh; padding: 24px; }
    .header { max-width: 1440px; margin: 0 auto 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 20px; }
    .title h1 { font-size: 1.8rem; color: #fff; display: flex; align-items: center; gap: 10px; }
    .title h1 span { color: #00f0ff; }
    .title p { color: #94a3b8; font-size: 0.95rem; margin-top: 4px; }
    .badge-action { background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; font-size: 0.8rem; font-weight: 700; padding: 4px 12px; border-radius: 99px; letter-spacing: 0.05em; text-transform: uppercase; }
    .stats-bar { display: flex; gap: 12px; flex-wrap: wrap; }
    .stat-pill { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 8px; font-size: 0.88rem; }
    .stat-pill strong { color: #00f0ff; font-size: 1.1rem; margin-right: 4px; }
    
    .filters { max-width: 1440px; margin: 0 auto 20px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
    .filter-btn { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.12); color: #94a3b8; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .filter-btn.active, .filter-btn:hover { background: rgba(0, 240, 255, 0.15); border-color: #00f0ff; color: #00f0ff; font-weight: 600; }

    .search-input { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(0, 240, 255, 0.3); color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 0.88rem; outline: none; margin-left: auto; width: 280px; }
    .search-input:focus { border-color: #00f0ff; box-shadow: 0 0 10px rgba(0, 240, 255, 0.2); }

    .grid { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(440px, 1fr)); gap: 18px; }
    .card { background: rgba(13, 20, 36, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; justify-content: space-between; }
    .card:hover { transform: translateY(-3px); border-color: rgba(0, 240, 255, 0.4); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
    
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
    .card-id { font-size: 0.75rem; color: #00f0ff; background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.25); padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    .card-niche { font-size: 0.78rem; color: #cbd5e1; background: rgba(255, 255, 255, 0.06); padding: 2px 8px; border-radius: 4px; }
    
    .card-name { font-size: 1.18rem; font-weight: 600; color: #fff; margin-bottom: 6px; line-height: 1.3; }
    .card-person { color: #38bdf8; font-size: 0.9rem; font-weight: 500; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
    .card-meta { font-size: 0.82rem; color: #94a3b8; display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
    .badge-sem-site { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; }
    .badge-bairro { background: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; }
    .badge-rating { color: #fbbf24; font-weight: 600; }
    
    .card-pitch-wrapper { margin-bottom: 16px; }
    .pitch-header { font-size: 0.75rem; color: #00f0ff; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; margin-bottom: 6px; display: flex; justify-content: space-between; }
    .card-pitch { background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 12px; font-size: 0.83rem; color: #cbd5e1; line-height: 1.5; white-space: pre-line; max-height: 140px; overflow-y: auto; }
    
    .card-actions { display: flex; gap: 10px; }
    .btn-wa { flex: 1; background: #22c55e; color: #fff; text-decoration: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.88rem; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2); }
    .btn-wa:hover { background: #16a34a; transform: translateY(-1px); }
    .btn-copy { background: rgba(255, 255, 255, 0.08); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
    .btn-copy:hover { background: rgba(255, 255, 255, 0.15); color: #fff; }
  </style>
</head>
<body>

  <div class="header">
    <div class="title">
      <h1>GS Dev Studio <span>• 160 Leads SP</span> <span class="badge-action">Ação 50% OFF</span></h1>
      <p>160 Empresas e Profissionais Liberais em São Paulo • 100% Sem Site • WhatsApp Celular Validados</p>
    </div>
    <div class="stats-bar">
      <div class="stat-pill">Total: <strong>${leads.length}</strong> leads</div>
      <div class="stat-pill">Critério: <strong>100% Sem Site Próprio</strong></div>
      <div class="stat-pill">Campanha: <strong>50% OFF Setup</strong></div>
      <div class="stat-pill"><a href="prospeccao_clientes_sp.xlsx" style="color:#38bdf8; text-decoration:none; font-weight:600;">📥 Baixar Excel</a></div>
      <div class="stat-pill"><a href="crm.html" style="color:#00f0ff; text-decoration:none; font-weight:600;">📋 Abrir Kanban CRM</a></div>
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
    
    <input type="text" class="search-input" id="search-input" placeholder="🔍 Buscar por nome ou bairro..." oninput="searchLeads()">
  </div>

  <div class="grid" id="leads-grid">
    ${leads.map(lead => `
      <div class="card" data-niche="${lead.niche}" data-search="${(lead.name + ' ' + lead.greeting + ' ' + lead.neighborhood).toLowerCase()}">
        <div>
          <div class="card-top">
            <span class="card-id">${lead.id}</span>
            <span class="card-niche">${lead.niche}</span>
          </div>
          <div class="card-name">${lead.name}</div>
          <div class="card-person">👤 Falar com: <strong>${lead.greeting}</strong></div>
          <div class="card-meta">
            <span class="badge-sem-site">⚠️ ${lead.siteStatusLabel}</span>
            <span class="badge-bairro">📍 ${lead.neighborhood}</span>
            <span class="badge-rating">⭐ ${lead.rating}</span>
            <span>(${lead.reviews})</span>
          </div>
          <div class="card-pitch-wrapper">
            <div class="pitch-header">
              <span>Mensagem Personalizada (50% OFF)</span>
              <span>${lead.phone}</span>
            </div>
            <div class="card-pitch" id="pitch-${lead.id}">${lead.pitchMessage}</div>
          </div>
        </div>
        <div class="card-actions">
          <a href="${lead.waLink}" target="_blank" class="btn-wa">
            <span>Iniciar Conversa</span> 💬
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

    function searchLeads() {
      const q = document.getElementById('search-input').value.toLowerCase().trim();
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        const text = card.getAttribute('data-search');
        if (!q || text.includes(q)) {
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

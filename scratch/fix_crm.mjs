import fs from 'fs';

const rawLeads = JSON.parse(fs.readFileSync('C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/prospeccao_160_leads_sp.json', 'utf8'));
const leadsJson = JSON.stringify(rawLeads);

const targetFiles = [
  'C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/crm.html',
  'C:/Users/biels/.gemini/antigravity/scratch/prospeccao-gmaps/crm/index.html',
  'C:/Users/biels/.gemini/antigravity-ide/scratch/gs-digital/crm.html'
];

for (const filePath of targetFiles) {
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Atualizar DEFAULT_LEADS
  html = html.replace(/const DEFAULT_LEADS = \[[\s\S]*?\];/, 'const DEFAULT_LEADS = ' + leadsJson + ';');

  // 2. Atualizar CAMPAIGN
  const newCampaign = JSON.stringify({
    revision: '2026-09-21-160-leads-50off',
    total: 160,
    kept: 160,
    new: 160,
    excluded: 0,
    excludedIds: []
  });
  html = html.replace(/const CAMPAIGN = \{[\s\S]*?\};/, 'const CAMPAIGN = ' + newCampaign + ';');

  // 3. Atualizar chave de storage para crm_leads_160_v5
  html = html.replace(/crm_leads_v2/g, 'crm_leads_160_v5');
  html = html.replace(/crm_leads_160_v4/g, 'crm_leads_160_v5');
  html = html.replace(/ProspectaCRM-storage-v\d+/g, 'ProspectaCRM-storage-v6');

  // 4. Injetar botão e função forceReload160Leads se não existir
  if (!html.includes('forceReload160Leads')) {
    const btnHtml = '<button class="btn btn-outline" onclick="forceReload160Leads()" style="color:#00f0ff;border-color:#00f0ff;font-weight:600;margin-left:8px;">🔄 Recarregar 160 Leads (50% OFF)</button>';
    html = html.replace(/(<div class="header-actions">)/, '$1' + btnHtml);

    const funcCode = `
function forceReload160Leads() {
  if (confirm("Deseja recarregar todos os 160 leads com a ação de 50% OFF?")) {
    crmStore.removeItem("crm_leads_160_v5");
    leads = JSON.parse(JSON.stringify(DEFAULT_LEADS));
    crmStore.setItem("crm_leads_160_v5", JSON.stringify(leads));
    renderAll();
    if (typeof showToast === "function") showToast("160 Leads recarregados com sucesso!");
    else alert("160 Leads recarregados!");
  }
}
`;
    html = html.replace('function loadStorage', funcCode + '\nfunction loadStorage');
  }

  // 5. Atualizar título da página
  html = html.replace(/<title>.*?<\/title>/, '<title>GS Dev Studio — CRM 160 Leads SP (50% OFF)</title>');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Arquivo atualizado com sucesso: ${filePath}`);
}

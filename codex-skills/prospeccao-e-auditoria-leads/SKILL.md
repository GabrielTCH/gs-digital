---
name: prospeccao-e-auditoria-leads
description: >-
  Especialista em encontrar, minerar e qualificar clientes locais (clínicas, consultórios,
  escritórios, salões, restaurantes, comércio) no Google Maps, executar mini-auditorias
  técnicas reais nos sites dos leads (identificando noindex, HTTPS quebrado, velocidade mobile
  e falta de WhatsApp) e organizar pipelines de prospecção de alta conversão.
---

# Prospecção Ativa, Scraping e Mini-Auditoria Técnica de Leads Locais

Esta skill ensina como minerar clientes de alto poder aquisitivo no Google Maps, auditar sites reais em menos de 2 minutos para encontrar ganchos comerciais irrefutáveis e qualificar empresas prontas para comprar criação de site, SEO ou manutenção preventiva.

---

## 1. Seleção de Nichos e Regiões de Alto Ticket

Vender site para quem está sem dinheiro gera desgaste e pedidos de desconto. Foque em **negócios locais com ticket médio alto, alta margem e concorrência direta no Google**:

### Melhores Nichos no Brasil:
1. **Saúde & Estética**: Clínicas odontológicas (implantes, harmonização, Invisalign), clínicas de estética médica, dermatologistas, cirurgiões plásticos, oftalmologistas.
2. **Serviços Profissionais**: Bancas de advocacia (direito tributário, trabalhista empresarial, família), escritórios de arquitetura e design de interiores, imobiliárias de alto padrão, contabilidades consultivas.
3. **Beleza & Cuidados Pessoais**: Salões de beleza premium, spas urbanos, barbearias conceituadas.
4. **Gastronomia & Eventos**: Restaurantes à la carte, buffets infantis e corporativos, espaços de eventos.
5. **Comércio Especializado**: Lojas de móveis sob medida, revendas de veículos, oficinas mecânicas especializadas (câmbio automático, blindados).

### Critérios Geográficos:
- Priorize capitais e grandes centros urbanos.
- Escolha **bairros de classe média-alta e alta** (ex em São Paulo: Moema, Itaim Bibi, Pinheiros, Jardins, Tatuapé, Vila Mariana, Santana).
- Empresas nessas regiões já têm clientes pagando bem, mas muitas vezes possuem sites antigos, lentos ou que nem abrem direito no celular.

---

## 2. Mineração de Leads no Google Maps

### Coleta de Dados Básicos:
Ao pesquisar no Google Maps (ex: `"clínica odontológica em Moema São Paulo"`), extraia:
- **Nome fantasia da empresa**
- **Telefone / WhatsApp comercial**
- **Nota no Google Maps** (ex: 4.8★) e **Total de avaliações** (ex: 142 avaliações)
- **URL do site atual** (ou registrar se a empresa não tem site, usando apenas Instagram ou link de app)
- **Endereço e bairro**

### Como Diferenciar os Leads:
- **Lead Tipo A (Só tem Instagram ou está sem site)**:
  - Venda de **Site do Zero** (Landing Page ou Institucional).
  - Dor: dependem 100% de rede social, perdem todos os clientes que pesquisam no Google querendo agendar hoje.
- **Lead Tipo B (Já tem site)**:
  - Venda de **Melhoria, SEO Local, Velocidade e Manutenção Preventiva**.
  - Dor: o site existe, mas está desatualizado, lento, não aparece no topo do Google ou tem falhas que espantam o cliente no celular.

---

## 3. Protocolo de Mini-Auditoria Rápida (Em 2 Minutos)

**REGRA DE OURO DA PROSPECÇÃO:** *Nunca afirme uma falha técnica sem ter aberto e testado o site daquela empresa específica.* Falar que um site "não tem HTTPS" quando ele tem queima o seu contato e destrói sua credibilidade.

Execute este checklist rápido no site do lead antes de enviar qualquer mensagem:

### 1. Teste de HTTPS e Certificado de Segurança:
- Digite `http://site-do-lead.com.br` no navegador.
- **Cenário 1 (Perfeito):** Redireciona automaticamente para `https://` com cadeado verde/cinza. (Não use o gancho de HTTPS!).
- **Cenário 2 (Certificado Vencido):** O navegador exibe uma tela vermelha: *"Sua conexão não é privada / Alerta de Risco"*. 👉 **Gancho fortíssimo:** qualquer cliente que tenta entrar foge com medo de vírus.
- **Cenário 3 (Sem Redirecionamento):** O site abre em `http://` sem segurança e só fica seguro se a pessoa digitar `https://` manualmente.
- **Cenário 4 (Inseguro Total):** O site não tem SSL configurado.

### 2. Teste de Tag `noindex` (O Gancho Mais Lucrativo):
- Abra o site do lead no computador, clique com o botão direito e escolha **Exibir código-fonte da página** (`Ctrl + U`).
- Aperte `Ctrl + F` e busque por: `noindex`
- **Se encontrar `<meta name="robots" content="noindex...`**:
  - **O QUE SIGNIFICA:** O site está explicitamente mandando o robô do Google NÃO mostrar a empresa nas pesquisas! Muitas vezes o programador anterior deixou isso ativado em fase de testes e esqueceu ligado.
  - 👉 **Gancho imbatível:** *"A sua empresa está pagando por um site que pediu para o Google se esconder."*

### 3. Teste do Botão de WhatsApp no Celular:
- Abra o site pelo celular (ou simule no DevTools `F12` em modo mobile).
- O site tem um botão flutuante visível de WhatsApp que, ao clicar, abre direto o aplicativo de conversa?
- Se o cliente precisa copiar o número, salvar na agenda para depois mandar mensagem, a empresa perde até 60% dos contatos.

### 4. Teste de Velocidade e Core Web Vitals:
- Abra [pagespeed.web.dev](https://pagespeed.web.dev/) e insira o link do site.
- Verifique a nota na aba **Celular (Mobile)**:
  - Nota abaixo de 50: Site muito pesado, imagens não otimizadas, scripts travando a rolagem.
  - Carregamento acima de 3 segundos no 4G faz mais de 40% das pessoas desistirem antes da página abrir.

### 5. Teste de Consistência e Schema.org Local:
- Verifique se a empresa tem tags de `LocalBusiness` ou `PostalAddress` no código.
- Sem isso, o Google tem dificuldade de associar o site ao endereço no Google Maps.

---

## 4. Script de Auditoria Automatizada em Node.js

Para auditar dezenas de leads rapidamente via terminal, utilize um script como o modelo abaixo:

```javascript
// auditoria-express.mjs
import https from 'https';
import http from 'http';

async function auditarSite(urlTarget) {
  const url = new URL(urlTarget.startsWith('http') ? urlTarget : `https://${urlTarget}`);
  console.log(`\n🔍 Auditando: ${url.href}`);

  // 1. Testar Redirecionamento HTTP -> HTTPS
  http.get(`http://${url.hostname}`, (res) => {
    const isRedirect = [301, 302, 307, 308].includes(res.statusCode);
    const location = res.headers.location || '';
    const redirectsToHttps = isRedirect && location.startsWith('https://');
    console.log(`- Redirecionamento HTTPS: ${redirectsToHttps ? '✅ Ativo' : '⚠️ NÃO REDIRECIONA'}`);
  }).on('error', (e) => console.log(`- Erro HTTP: ${e.message}`));

  // 2. Testar Código-Fonte (noindex, schema, WhatsApp)
  https.get(url.href, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const temNoIndex = /<meta[^>]*robots[^>]*noindex/i.test(data);
      const temSchema = /schema\.org/i.test(data);
      const temWhatsApp = /(wa\.me|api\.whatsapp\.com)/i.test(data);

      console.log(`- Tag Noindex (site invisível): ${temNoIndex ? '🚨 DETECTADO NOINDEX!' : '✅ Liberado para o Google'}`);
      console.log(`- Botão de WhatsApp no código: ${temWhatsApp ? '✅ Presente' : '❌ AUSENTE'}`);
      console.log(`- Schema LocalBusiness: ${temSchema ? '✅ Identificado' : '⚠️ Não identificado'}`);
    });
  }).on('error', (e) => console.log(`- Erro HTTPS: ${e.message}`));
}

const target = process.argv[2];
if (target) auditarSite(target);
else console.log('Uso: node auditoria-express.mjs https://exemplo.com.br');
```

---

## 5. Matriz de Pontuação e Priorização de Leads

Classifique cada lead em uma planilha ou CRM com notas de 1 a 5:

| Critério | Peso | Como Pontuar |
| --- | --- | --- |
| **Poder Aquisitivo da Região** | 20% | Bairros nobres = 5; Demais = 2 |
| **Presença de Falha Crítica** | 30% | Noindex ou SSL quebrado = 5; Site lento = 3; Site perfeito = 1 |
| **Dependência de Clientes** | 25% | Serviços de agendamento/venda = 5; B2B estático = 2 |
| **Facilidade de Contato** | 25% | Celular/WhatsApp direto com dono/gerente = 5; Telefone fixo/recepção = 2 |

**Regra Prática de Operação:** Aborde primeiro os leads com nota final acima de 4.0. Eles têm urgência real e dinheiro para pagar.

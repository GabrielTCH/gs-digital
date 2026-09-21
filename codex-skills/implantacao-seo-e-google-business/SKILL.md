---
name: implantacao-seo-e-google-business
description: >-
  Especialista em implantar sites de alta performance, configurar deploy automatizado
  no GitHub e Vercel com domínio próprio e SSL gratuito, executar o checklist completo de
  SEO técnico (Google Search Console, sitemap.xml, Schema.org LocalBusiness) e configurar
  o Perfil da Empresa no Google (Google Meu Negócio) para atrair leads locais sem risco de suspensão.
---

# Implantação de Sites, Deploy Vercel, SEO Técnico e Google Meu Negócio

Esta skill reúne o roteiro técnico definitivo para colocar sites no ar com nível profissional de agência, garantir carregamento ultrarrápido, indexação no Google Search Console e posicionamento no Google Maps.

---

## 1. Arquitetura de Código de Alta Performance

Para atingir notas 95-100 no Google PageSpeed Insights sem custos pesados de servidor:

### Princípios Técnicos:
1. **Stack Limpa**: HTML5 semântico, CSS Vanilla moderno com CSS Variables e JavaScript Vanilla. Evite frameworks pesados (Next.js/React) para landing pages ou sites institucionais simples quando não houver backend dinâmico.
2. **Caminhos Estritamente Relativos**: Sempre utilize caminhos como `assets/css/styles.css` ou `./assets/images/logo.png`. Nunca use caminhos absolutos como `/assets/...`, pois eles quebram em subpastas, no GitHub Pages e em deploys com pré-visualização.
3. **Prevenção de CLS (Layout Shift)**: Toda tag `<img>` deve conter atributos explícitos de largura e altura (`width="800" height="450"`), além de `loading="lazy"` para imagens abaixo da primeira dobra.
4. **Mobile-First**: Teste com visão de 375px e 412px de largura. Botões de ação e WhatsApp devem ter área de toque de no mínimo 48x48px.

---

## 2. Deploy Automatizado: GitHub + Vercel + Domínio Próprio

A combinação GitHub + Vercel oferece hospedagem CDN global gratuita, SSL ilimitado e deploy contínuo automático a cada `git push`.

### Armadilhas Críticas e Como Evitar:

#### 1. A Armadilha do `server.js` (Erro 404 na Vercel):
- **O Problema:** Se existir um arquivo chamado `server.js` na raiz do projeto, a Vercel interpreta que o projeto é um backend Node.js Serverless (AWS Lambda) e ignora o `index.html`, retornando erro `404 Not Found (text/plain)`.
- **A Solução:** Renomeie servidores de teste locais para `local-server.js` e adicione ao `.vercelignore`. O projeto estático deve rodar com zero configuração.

#### 2. A Armadilha do PowerShell BOM (Invalid vercel.json):
- **O Problema:** No Windows, o comando PowerShell `Out-File -Encoding utf8` grava o Byte Order Mark (`0xEF, 0xBB, 0xBF`) no início do arquivo JSON, fazendo a Vercel falhar com o erro: *"Invalid vercel.json file provided"*.
- **A Solução:** Se for criar `vercel.json`, use Node.js (`fs.writeFileSync`) ou salve em UTF-8 sem BOM.

#### 3. Configuração de DNS no Domínio Próprio (Hostinger / Registro.br):
- Para o subdomínio `www`:
  - Tipo: **CNAME**
  - Nome / Host: `www`
  - Destino: `cname.vercel-dns.com`
- Para o domínio raiz (sem www):
  - Configure redirecionamento permanente (308/301) na Vercel ou na hospedagem para `www.seudominio.com.br`, ou aponte os IPs da Vercel (`76.76.21.21` ou `64.29.17.65` / `64.29.17.1`).
- O certificado SSL é emitido automaticamente em até 15 minutos após a propagação do DNS.

---

## 3. Checklist Completo de SEO Técnico

Antes de entregar o site ou colocá-lo em produção, garanta a presença de todos estes elementos:

### 1. Meta Tags Primárias no `<head>`:
```html
<title>Nome da Empresa | Criação de Sites que Vendem, SEO & Manutenções</title>
<meta name="description" content="Descrição comercial atrativa de até 160 caracteres com chamada para ação.">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="https://www.seudominio.com.br/">
```

### 2. Open Graph & WhatsApp Preview:
```html
<meta property="og:locale" content="pt_BR">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.seudominio.com.br/">
<meta property="og:title" content="Nome da Empresa | Título Comercial">
<meta property="og:description" content="Descrição que aparece ao compartilhar o link no WhatsApp.">
<meta property="og:image" content="https://www.seudominio.com.br/assets/images/logo.png">
<meta property="og:image:width" content="1024">
<meta property="og:image:height" content="1024">
```

### 3. Arquivo `robots.txt` (na raiz do site):
```txt
User-agent: *
Allow: /

Sitemap: https://www.seudominio.com.br/sitemap.xml
```

### 4. Arquivo `sitemap.xml` (na raiz do site):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.seudominio.com.br/</loc>
    <lastmod>2026-09-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 5. Dados Estruturados Schema.org em JSON-LD:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "GS Dev Studio",
  "url": "https://www.gsdevstudio.com.br/",
  "logo": "https://www.gsdevstudio.com.br/assets/images/logo.png",
  "image": "https://www.gsdevstudio.com.br/assets/images/logo.png",
  "telephone": "+55-11-96879-9692",
  "email": "gsdigitaldev@gmail.com",
  "priceRange": "R$ 1290 - R$ 4500",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "addressCountry": "BR"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "08:00",
    "closes": "19:00"
  }
}
</script>
```

---

## 4. Google Search Console: Verificação e Indexação

1. Acesse o [Google Search Console](https://search.google.com/search-console).
2. Escolha o método de verificação por **Prefixo da URL** com `https://www.seudominio.com.br/`.
3. Baixe o arquivo de verificação HTML fornecido pelo Google (ex: `google6f3bb88e46464643.html`).
4. Coloque o arquivo na raiz do repositório, faça commit e push.
5. Verifique se o arquivo abre no navegador acessando `https://www.seudominio.com.br/google...html`.
6. Clique em **Verificar** no Search Console.
7. Vá na aba **Sitemaps**, insira `sitemap.xml` e clique em **Enviar**.
8. Use a barra superior de **Inspeção de URL**, insira a home e clique em **Solicitar Indexação**.

---

## 5. Perfil da Empresa no Google (Google Meu Negócio)

Para ranquear no Google Maps sem risco de ter o perfil banido:

### 1. Nome da Empresa:
- **Regra do Google:** Não faça spam de palavras-chave exageradas (ex: *"Criação de Sites Barato São Paulo Menor Preço"*).
- **Formato Recomendado:** `[Marca Oficial] - [Especialidade Principal]`  
  *Exemplo:* `GS Dev Studio - Criação e Manutenção de Sites`

### 2. Endereço e Área de Cobertura (SAB - Service Area Business):
- Se você trabalha de home office ou atende clientes remotamente, **NUNCA marque que os clientes visitam sua empresa pessoalmente**.
- Marque **Empresa de Serviços**.
- Deixe o endereço residencial **oculto**.
- Em **Áreas de Cobertura / Atendimento**, adicione a cidade ou região atendida (ex: `São Paulo, SP` e Grande São Paulo).

### 3. Categoria Primária:
- Escolha a categoria mais específica possível. Para desenvolvedores de site: **"Designer de sites"** (Web designer) ou **"Agência de marketing"**.

### 4. Descrição do Perfil (Até 750 caracteres):
- **Atenção:** Nunca insira URLs ou números de telefone no texto da descrição, pois o Google desaprova a edição.
- Destaque os serviços (criação de sites profissionais, landing pages de alta conversão, SEO e manutenção preventiva).

### 5. Configuração de Serviços e Fotos:
- No botão **"Editar serviços"**, adicione: *Criação de Sites Profissionais, Landing Pages de Alta Conversão, Manutenção Preventiva de Sites, SEO e Otimização para o Google*.
- Adicione o **Logotipo** oficial na proporção 1:1 e fotos nítidas dos projetos do portfólio.

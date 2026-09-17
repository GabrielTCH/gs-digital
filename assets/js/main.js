// GS Digital - Core High-Tech Interaction System

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCalculator();
  initPortfolio();
  initNavigation();
  initContactForm();
});

/* -------------------------------------------------------------
 * 1. Lightweight Cyber Particle Canvas
 * ----------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 1,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Render particles & connections
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Link nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 110) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Link to mouse
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 140) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - mdist / 140) * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* -------------------------------------------------------------
 * 2. Interactive Budget Simulator (Synced with Admin Panel)
 * ----------------------------------------------------------- */
function initCalculator() {
  const projectCards = document.querySelectorAll('[data-calc-project]');
  const maintenanceCheckbox = document.getElementById('calc-maintenance-toggle');
  const urgencyCards = document.querySelectorAll('[data-calc-urgency]');
  
  const summaryProjectName = document.getElementById('summary-project-name');
  const summaryProjectPrice = document.getElementById('summary-project-price');
  const summaryMaintenanceRow = document.getElementById('summary-maintenance-row');
  const summaryMaintenancePrice = document.getElementById('summary-maintenance-price');
  const summaryTotalValue = document.getElementById('summary-total-value');
  const btnSendWhatsApp = document.getElementById('btn-send-calc-whatsapp');

  // Sync with Admin Settings if present in localStorage
  const savedServices = JSON.parse(localStorage.getItem('gs_services') || 'null');
  if (savedServices && savedServices.length > 0) {
    projectCards.forEach((card, idx) => {
      if (savedServices[idx]) {
        card.setAttribute('data-calc-name', savedServices[idx].name);
        card.setAttribute('data-calc-price', savedServices[idx].price);
        const nameSpan = card.querySelector('.calc-card-name');
        if (nameSpan) nameSpan.textContent = savedServices[idx].name.split(' ')[0] + ' ' + (savedServices[idx].name.split(' ')[1] || '');
      }
    });
  }

  const savedMaintPrice = parseInt(localStorage.getItem('gs_maint_price') || '189', 10);
  let maintenancePrice = savedMaintPrice;

  let currentProject = {
    name: projectCards[0] ? projectCards[0].getAttribute('data-calc-name') : 'Landing Page de Alta Conversão',
    price: projectCards[0] ? parseInt(projectCards[0].getAttribute('data-calc-price'), 10) : 1290
  };

  let maintenanceActive = true;
  let urgencyMultiplier = 1;

  // Project selector
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      projectCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      currentProject.name = card.getAttribute('data-calc-name');
      currentProject.price = parseInt(card.getAttribute('data-calc-price'), 10);
      updateSummary();
    });
  });

  // Urgency selector
  urgencyCards.forEach(card => {
    card.addEventListener('click', () => {
      urgencyCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      urgencyMultiplier = parseFloat(card.getAttribute('data-calc-multiplier'));
      updateSummary();
    });
  });

  // Maintenance Toggle
  if (maintenanceCheckbox) {
    maintenanceCheckbox.addEventListener('change', (e) => {
      maintenanceActive = e.target.checked;
      updateSummary();
    });
  }

  function updateSummary() {
    const calculatedProjectPrice = Math.round(currentProject.price * urgencyMultiplier);
    
    if (summaryProjectName) summaryProjectName.textContent = currentProject.name;
    if (summaryProjectPrice) summaryProjectPrice.textContent = `R$ ${calculatedProjectPrice.toLocaleString('pt-BR')}`;

    if (summaryMaintenanceRow) {
      if (maintenanceActive) {
        summaryMaintenanceRow.style.display = 'flex';
        if (summaryMaintenancePrice) {
          summaryMaintenancePrice.textContent = `+ R$ ${maintenancePrice.toLocaleString('pt-BR')} /mês`;
        }
      } else {
        summaryMaintenanceRow.style.display = 'none';
      }
    }

    if (summaryTotalValue) {
      let totalText = `R$ ${calculatedProjectPrice.toLocaleString('pt-BR')}`;
      if (maintenanceActive) {
        totalText += ` <span style="font-size: 1.1rem; font-weight: 500; color: #94a3b8;">(+ R$ ${maintenancePrice}/mês)</span>`;
      }
      summaryTotalValue.innerHTML = totalText;
    }

    // Update WhatsApp link & save lead on click
    if (btnSendWhatsApp) {
      const msg = `Olá GS Digital! Fiz uma simulação de projeto no site:%0A%0A` +
        `🚀 *Projeto:* ${currentProject.name}%0A` +
        `💰 *Investimento estimado:* R$ ${calculatedProjectPrice.toLocaleString('pt-BR')}%0A` +
        `🛡️ *Manutenção Preventiva:* ${maintenanceActive ? 'Sim (R$ ' + maintenancePrice + '/mês)' : 'Não inclusa'}%0A%0A` +
        `Gostaria de formalizar uma proposta e dar início!`;
      btnSendWhatsApp.href = `https://wa.me/5511999999999?text=${msg}`;

      btnSendWhatsApp.onclick = () => {
        // Save to Admin Leads
        const leads = JSON.parse(localStorage.getItem('gs_leads') || '[]');
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        leads.unshift({
          date: dateStr,
          client: 'Lead pelo Simulador',
          service: currentProject.name,
          price: `R$ ${calculatedProjectPrice.toLocaleString('pt-BR')}`,
          maint: maintenanceActive ? 'Sim' : 'Não',
          phone: '5511999999999'
        });
        localStorage.setItem('gs_leads', JSON.stringify(leads));
      };
    }
  }

  // Initial calculation
  updateSummary();
}

/* -------------------------------------------------------------
 * 3. Portfolio Filtering & Interactive Details Modal
 * ----------------------------------------------------------- */
const portfolioData = {
  ecommerce: {
    title: 'NOCTURNAL® — Loja Virtual & Streetwear',
    category: 'E-commerce & Lojas Virtuais',
    desc: 'Loja virtual de alta performance para marca de moda urbana e streetwear. Arquitetura headless ultrarrápida, gaveta lateral de carrinho com atualização de frete e cupom em tempo real, e simulação completa de checkout com geração de QR Code Pix e cópia de chave.',
    metrics: ['Carrinho Reativo Instantâneo', 'Checkout Pix Integrado', '99/100 Performance Mobile'],
    image: 'assets/images/cover_ecommerce.jpg',
    stack: 'HTML5 Moderno, Vanilla JS Reativo, Otimização WebP, Gateway Pix',
    liveUrl: 'demos/ecommerce/index.html'
  },
  advocacia: {
    title: 'Valente & Prado — Sociedade de Advogados',
    category: 'Profissionais Liberais / Direito Corporativo',
    desc: 'Site institucional corporativo de prestígio para banca jurídica especializada em Direito Tributário, Societário e Fusões & Aquisições (M&A). Inclui apresentação de sócios mestres pela USP/PUC, formulário de diagnóstico sob sigilo e atendimento prioritário.',
    metrics: ['Autoridade Visual & Prestígio', 'Formulário com Sigilo OAB', 'Estrutura Otimizada para SEO'],
    image: 'assets/images/cover_advocacia.jpg',
    stack: 'Design Editorial Luxo, Tipografia Cinzel, Formulário de Triagem, Alta Performance',
    liveUrl: 'demos/advocacia/index.html'
  },
  arquitetura: {
    title: 'Studio Arkhé — Arquitetura Sensorial & Interiores',
    category: 'Profissionais Liberais / Arquitetura & Design',
    desc: 'Site contemporâneo de arquitetura com estética editorial, grid de obras de alto padrão e uma calculadora interativa exclusiva que estima honorários e investimento de obra com base na metragem quadrada e padrão de acabamento.',
    metrics: ['Calculadora Dinâmica por m²', 'Galeria Imersiva de Obras', 'Estética Minimalista Internacional'],
    image: 'assets/images/cover_arquitetura.jpg',
    stack: 'CSS Grid Assimétrico, Slider Dinâmico em JS, Design Biofílico Acolhedor',
    liveUrl: 'demos/arquitetura/index.html'
  },
  psicologia: {
    title: 'Dra. Helena Vaz — Psicologia Clínica & Terapia Online',
    category: 'Profissionais Liberais / Saúde Mental',
    desc: 'Ambiente digital acolhedor e humanizado para psicoterapia individual e online regulamentada pelo CFP. Conta com sistema de agendamento de sessões, guia completo sobre emissão de recibos para reembolso em convênios e acordeon de dúvidas frequentes.',
    metrics: ['Agendamento Humanizado', 'Conformidade Resolução CFP', 'Alta Conversão para WhatsApp'],
    image: 'assets/images/cover_psicologia.jpg',
    stack: 'Paleta Suave Sage & Terracota, Acordeon FAQ Interativo, Integração WhatsApp API',
    liveUrl: 'demos/psicologia/index.html'
  },
  imobiliaria: {
    title: 'Horizon Ocean Residences — Empreendimento Frente Mar',
    category: 'Landing Pages / Lançamento Imobiliário',
    desc: 'Landing page de altíssima conversão para lançamento imobiliário de alto padrão no litoral. Conta com seletor interativo de plantas (168 a 420m² duplex), tour visual do condomínio, simulador de fluxo de pagamento na obra e captura automática de leads.',
    metrics: ['+48% de Conversão em Leads', 'Simulador de Financiamento Direto', 'Apresentação Interativa de Plantas'],
    image: 'assets/images/cover_imobiliaria.jpg',
    stack: 'Arquitetura de Alta Conversão, Simulador Financeiro JS, Plantas Dinâmicas',
    liveUrl: 'demos/imobiliaria/index.html'
  },
  nutricao: {
    title: 'Lucas Meneses — Nutrição Esportiva & Performance',
    category: 'Landing Pages & Profissionais / Saúde & Fitness',
    desc: 'Landing page atlética de alta energia para consultoria nutricional esportiva. Apresenta calculadora em tempo real de Taxa Metabólica Basal (TMB) e meta de ingestão de água, tabela comparativa de planos e histórico de evolução física de clientes.',
    metrics: ['Calculadora TMB Integrada', 'Tabela de Planos e Vagas VIP', 'Visual Volt Neon de Alto Impacto'],
    image: 'assets/images/cover_nutricao.jpg',
    stack: 'Fórmula Harris-Benedict em JS, UI Volt Neon & Dark Carbon, Seletor de Planos',
    liveUrl: 'demos/nutricao/index.html'
  }
};

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal handlers
  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const detailButtons = document.querySelectorAll('[data-project-id]');

  if (modalBackdrop && modalClose) {
    detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pid = btn.getAttribute('data-project-id');
        openProjectModal(pid);
      });
    });

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openProjectModal(id) {
    const data = portfolioData[id];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-desc').textContent = data.desc;
    document.getElementById('modal-img').src = data.image;
    document.getElementById('modal-stack').textContent = data.stack;

    const liveLinkBtn = document.getElementById('modal-live-demo-link');
    if (liveLinkBtn && data.liveUrl) {
      liveLinkBtn.href = data.liveUrl;
    }

    const metricsContainer = document.getElementById('modal-metrics');
    metricsContainer.innerHTML = '';
    data.metrics.forEach(m => {
      const span = document.createElement('span');
      span.className = 'portfolio-tag';
      span.textContent = m;
      metricsContainer.appendChild(span);
    });

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* -------------------------------------------------------------
 * 4. Header & Navigation
 * ----------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '70px';
      navMenu.style.left = '20px';
      navMenu.style.right = '20px';
      navMenu.style.background = 'rgba(10, 16, 26, 0.98)';
      navMenu.style.border = '1px solid rgba(0, 240, 255, 0.3)';
      navMenu.style.borderRadius = '16px';
      navMenu.style.padding = '20px';
    });
  }

  window.addEventListener('scroll', () => {
    // Header shadow
    if (window.scrollY > 50) {
      header.style.top = '10px';
    } else {
      header.style.top = '18px';
    }

    // ScrollSpy
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 5. Contact Form with Instant Feedback
 * ----------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const service = document.getElementById('contact-service').value;
    const message = document.getElementById('contact-message').value;

    // Save lead into Admin storage
    const leads = JSON.parse(localStorage.getItem('gs_leads') || '[]');
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    leads.unshift({
      date: dateStr,
      client: name,
      service: service,
      price: 'Sob Consulta',
      maint: 'Pendente',
      phone: '5511999999999'
    });
    localStorage.setItem('gs_leads', JSON.stringify(leads));

    const whatsappText = `Olá GS Digital! Meu nome é ${encodeURIComponent(name)}.%0A%0A` +
      `Estou interessado em: *${encodeURIComponent(service)}*.%0A%0A` +
      `Mensagem: ${encodeURIComponent(message)}`;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = `<span>Enviando para o WhatsApp...</span> ✦`;
    submitBtn.style.opacity = '0.8';

    setTimeout(() => {
      window.open(`https://wa.me/5511999999999?text=${whatsappText}`, '_blank');
      submitBtn.innerHTML = `<span>Mensagem Enviada!</span> ✓`;
      submitBtn.style.background = '#10b981';
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = `<span>Iniciar Conversa</span> <span class="btn-icon-right">→</span>`;
        submitBtn.style.background = '';
        submitBtn.style.opacity = '1';
      }, 4000);
    }, 600);
  });
}

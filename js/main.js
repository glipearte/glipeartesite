/* ==========================================================================
   Glipearte Pegue e Monte — main.js
   Funcionalidades globais: menu, scroll, dark mode, whatsapp, chat, etc.
   ========================================================================== */

const WHATSAPP_NUMBER = "5585999999999"; // Substituir pelo número real da Glipearte

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initDarkMode();
  initProgressBar();
  initBackToTop();
  initRevealOnScroll();
  initFaq();
  initTestimonialCarousel();
  initLightbox();
  initChatWidget();
  initContactForm();
  initNewsletterForm();
  initFavorites();
  initShareButtons();
  initWhatsappLinks();
  createFloatingDecor();
  initCatalogFilters();
  initCalculator();
});

/* ---------- Header com fundo ao rolar ---------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

/* ---------- Menu mobile ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!toggle || !nav) return;
  const closeMenu = () => {
    nav.classList.remove('open');
    backdrop && backdrop.classList.remove('open');
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    backdrop && backdrop.classList.toggle('open', isOpen);
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  backdrop && backdrop.addEventListener('click', closeMenu);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ---------- Modo escuro ---------- */
function initDarkMode() {
  const btn = document.querySelector('.dark-mode-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('glipearte-dark');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
    btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('glipearte-dark', isDark);
    btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });
}

/* ---------- Barra de progresso ---------- */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

/* ---------- Botão voltar ao topo ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) btn.classList.add('show');
    else btn.classList.remove('show');
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Animação de entrada ao rolar ---------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Carrossel de depoimentos ---------- */
function initTestimonialCarousel() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.querySelector('.testimonial-nav');
  const prevBtn = document.querySelector('.testimonial-arrow.prev');
  const nextBtn = document.querySelector('.testimonial-arrow.next');
  if (!cards.length) return;
  let current = 0;

  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(index) {
    cards[current].classList.remove('active');
    dotsWrap && dotsWrap.children[current].classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dotsWrap && dotsWrap.children[current].classList.add('active');
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  setInterval(() => goTo(current + 1), 6000);
}

/* ---------- Lightbox da galeria ---------- */
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item img');
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const images = Array.from(items).map(img => img.getAttribute('src'));
  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    lightboxImg.setAttribute('src', images[currentIndex]);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function show(delta) {
    currentIndex = (currentIndex + delta + images.length) % images.length;
    lightboxImg.setAttribute('src', images[currentIndex]);
  }

  items.forEach((img, i) => img.parentElement.addEventListener('click', () => open(i)));
  closeBtn && closeBtn.addEventListener('click', close);
  prevBtn && prevBtn.addEventListener('click', () => show(-1));
  nextBtn && nextBtn.addEventListener('click', () => show(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
  });
}

/* ---------- Chat inteligente (simulado, baseado em regras) ---------- */
function initChatWidget() {
  const toggleBtn = document.querySelector('.chat-toggle-btn');
  const widget = document.querySelector('.chat-widget');
  const closeBtn = document.querySelector('.chat-close-btn');
  const body = document.querySelector('.chat-body');
  const quickWrap = document.querySelector('.chat-quick');
  if (!widget) return;

  const respostas = {
    'Como funciona?': 'É simples: você escolhe o tema, reserva pelo WhatsApp, retira o kit, monta com nosso passo a passo, aproveita a festa e devolve depois! 🎉',
    'Quais temas vocês têm?': 'Temos Stitch, Frozen, Mickey, Minnie, Safari, Princesas, Super Heróis, Barbie, Dinossauro, Sonic, Pokémon e muito mais! Veja no nosso catálogo. 🎈',
    'Qual o preço?': 'Os kits variam de R$ 229,90 a R$ 599,90 dependendo do tema e ocasião. Fala com a gente no WhatsApp para um orçamento personalizado! 💬',
    'Quero falar no WhatsApp': 'REDIRECT'
  };

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', sender);
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  if (quickWrap) {
    Object.keys(respostas).forEach(question => {
      const btn = document.createElement('button');
      btn.textContent = question;
      btn.addEventListener('click', () => {
        addMessage(question, 'user');
        if (respostas[question] === 'REDIRECT') {
          window.open(buildWhatsappLink('Olá! Vim pelo site e gostaria de mais informações.'), '_blank');
          return;
        }
        setTimeout(() => addMessage(respostas[question], 'bot'), 500);
      });
      quickWrap.appendChild(btn);
    });
  }

  toggleBtn && toggleBtn.addEventListener('click', () => widget.classList.toggle('open'));
  closeBtn && closeBtn.addEventListener('click', () => widget.classList.remove('open'));
}

/* ---------- WhatsApp helper ---------- */
function buildWhatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initWhatsappLinks() {
  document.querySelectorAll('[data-whatsapp-msg]').forEach(el => {
    const msg = el.getAttribute('data-whatsapp-msg') || 'Olá! Gostaria de saber mais sobre os kits da Glipearte.';
    el.setAttribute('href', buildWhatsappLink(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}

/* ---------- Formulário de contato com validação ---------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const successMsg = form.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameField = form.querySelector('#contact-name');
    const emailField = form.querySelector('#contact-email');
    const phoneField = form.querySelector('#contact-phone');
    const msgField = form.querySelector('#contact-message');

    valid = validateField(nameField, v => v.trim().length >= 3) && valid;
    valid = validateField(emailField, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) && valid;
    valid = validateField(phoneField, v => v.replace(/\D/g, '').length >= 10) && valid;
    valid = validateField(msgField, v => v.trim().length >= 10) && valid;

    if (!valid) return;

    // Persistência simulada via Table API (sem backend próprio)
    fetch('tables/contatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'contato-' + Date.now(),
        nome: nameField.value,
        email: emailField.value,
        telefone: phoneField.value,
        mensagem: msgField.value,
        tema_interesse: form.querySelector('#contact-theme') ? form.querySelector('#contact-theme').value : ''
      })
    }).catch(() => {});

    successMsg && successMsg.classList.add('show');
    form.reset();
    setTimeout(() => successMsg && successMsg.classList.remove('show'), 5000);
  });

  function validateField(field, testFn) {
    if (!field) return true;
    const group = field.closest('.form-group');
    const ok = testFn(field.value);
    if (group) group.classList.toggle('invalid', !ok);
    return ok;
  }
}

/* ---------- Newsletter ---------- */
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Inscrição realizada com sucesso! 🎉');
    form.reset();
  });
}

/* ---------- Favoritos (localStorage) ---------- */
function initFavorites() {
  const favBtns = document.querySelectorAll('.kit-card-fav');
  const favorites = JSON.parse(localStorage.getItem('glipearte-favoritos') || '[]');

  favBtns.forEach(btn => {
    const id = btn.getAttribute('data-fav-id');
    if (favorites.includes(id)) btn.classList.add('active');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = favorites.indexOf(id);
      if (idx > -1) {
        favorites.splice(idx, 1);
        btn.classList.remove('active');
        showToast('Removido dos favoritos');
      } else {
        favorites.push(id);
        btn.classList.add('active');
        showToast('Adicionado aos favoritos ❤️');
      }
      localStorage.setItem('glipearte-favoritos', JSON.stringify(favorites));
    });
  });
}

/* ---------- Compartilhamento ---------- */
function initShareButtons() {
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-share-title') || document.title;
      const url = btn.getAttribute('data-share-url') || window.location.href;
      if (navigator.share) {
        try { await navigator.share({ title, url }); } catch (err) {}
      } else {
        try {
          await navigator.clipboard.writeText(url);
          showToast('Link copiado para a área de transferência!');
        } catch (err) {
          showToast('Não foi possível copiar o link.');
        }
      }
    });
  });
}

/* ---------- Toast ---------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.classList.add('toast');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- Balões e confetes animados no hero ---------- */
function createFloatingDecor() {
  const wrap = document.querySelector('.floating-decor');
  if (!wrap) return;
  const balloons = ['🎈', '🎈', '🎈', '🎉', '🎊'];
  const colors = ['#EC4899', '#44CFCB', '#4EA5D9', '#F4C542', '#F8D7E6'];

  for (let i = 0; i < 8; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    b.textContent = balloons[i % balloons.length];
    b.style.left = Math.random() * 95 + '%';
    b.style.top = Math.random() * 70 + 10 + '%';
    b.style.animationDelay = (Math.random() * 5) + 's';
    b.style.fontSize = (1.8 + Math.random() * 1.6) + 'rem';
    wrap.appendChild(b);
  }

  for (let i = 0; i < 20; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.backgroundColor = colors[i % colors.length];
    c.style.animationDelay = (Math.random() * 7) + 's';
    c.style.animationDuration = (5 + Math.random() * 4) + 's';
    wrap.appendChild(c);
  }
}

/* ---------- Filtros do catálogo (usado na home também, se houver) ---------- */
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.kit-card');
  const searchInput = document.querySelector('#catalog-search-input');
  if (!filterBtns.length && !searchInput) return;

  let activeFilter = 'Todos';

  function applyFilters() {
    const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
    cards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const matchesFilter = activeFilter === 'Todos' || category === activeFilter;
      const matchesSearch = !term || name.includes(term);
      card.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'Todos';
      applyFilters();
    });
  });

  searchInput && searchInput.addEventListener('input', applyFilters);
}

/* ---------- Calculadora de orçamento ---------- */
function initCalculator() {
  const form = document.querySelector('#calc-form');
  if (!form) return;
  const resultBox = document.querySelector('#calc-result');
  const resultValue = document.querySelector('#calc-value');

  const basePorTipo = {
    'infantil': 239.9,
    'adulto': 279.9,
    'cha-revelacao': 299.9,
    'cha-bebe': 289.9,
    'casamento': 599.9,
    'corporativo': 399.9
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = form.querySelector('#calc-tipo').value;
    const convidados = parseInt(form.querySelector('#calc-convidados').value || '20', 10);
    const extras = form.querySelectorAll('#calc-extras input:checked').length;

    let base = basePorTipo[tipo] || 249.9;
    let adicionalConvidados = convidados > 30 ? (convidados - 30) * 2.5 : 0;
    let adicionalExtras = extras * 40;

    const total = base + adicionalConvidados + adicionalExtras;

    resultValue.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    resultBox.style.display = 'block';
  });
}

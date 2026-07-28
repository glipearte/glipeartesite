/* ==========================================================================
   Glipearte Pegue e Monte — kits-data.js
   Carrega kits e depoimentos via Table API e renderiza dinamicamente.
   ========================================================================== */

const ICONS_POR_CATEGORIA = {
  'Infantil': 'fa-child-reaching',
  'Adulto': 'fa-champagne-glasses',
  'Chá Revelação': 'fa-baby-carriage',
  'Chá de Bebê': 'fa-baby',
  'Casamento': 'fa-rings-wedding',
  'Batizado': 'fa-dove',
  'Festa Junina': 'fa-fire',
  'Natal': 'fa-tree',
  'Corporativo': 'fa-building'
};

function starsHtml(rating) {
  const full = Math.round(rating);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fa-solid fa-star" style="${i <= full ? '' : 'opacity:.25'}"></i>`;
  }
  return html;
}

function kitCardHtml(kit) {
  const whatsMsg = `Olá! Gostaria de reservar o ${kit.nome} (${kit.categoria}).`;
  return `
  <article class="kit-card reveal" data-category="${kit.categoria}" data-name="${kit.nome}">
    <div class="kit-card-img">
      <img src="${kit.imagem}" alt="${kit.nome} - decoração para festa ${kit.categoria}" loading="lazy" width="400" height="300">
      <span class="kit-card-tag">${kit.categoria}</span>
      <button class="kit-card-fav" data-fav-id="${kit.id}" aria-label="Favoritar ${kit.nome}"><i class="fa-solid fa-heart"></i></button>
    </div>
    <div class="kit-card-body">
      <h3>${kit.nome}</h3>
      <p class="desc">${(kit.descricao || '').replace(/<[^>]+>/g, '').slice(0, 90)}...</p>
      <div class="kit-card-rating">${starsHtml(kit.avaliacao || 5)} <span>(${(kit.avaliacao || 5).toFixed ? kit.avaliacao.toFixed(1) : kit.avaliacao})</span></div>
      <div class="kit-card-price"><small>a partir de</small> <strong>R$ ${Number(kit.preco).toFixed(2).replace('.', ',')}</strong></div>
      <div class="kit-card-actions">
        <a class="btn btn-outline btn-sm" href="tema.html?id=${kit.id}">Ver detalhes</a>
        <a class="btn btn-whatsapp btn-sm" href="#" data-whatsapp-msg="${whatsMsg}"><i class="fa-brands fa-whatsapp"></i> Reservar</a>
      </div>
    </div>
  </article>`;
}

async function fetchKits() {
  try {
    const res = await fetch('tables/kits?limit=100');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('Não foi possível carregar os kits da Table API.', err);
    return [];
  }
}

async function fetchDepoimentos() {
  try {
    const res = await fetch('tables/depoimentos?limit=50');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('Não foi possível carregar os depoimentos.', err);
    return [];
  }
}

/* ---- Renderização: destaques na home ---- */
async function renderKitsDestaque() {
  const wrap = document.querySelector('#kits-destaque-grid');
  if (!wrap) return;
  const kits = await fetchKits();
  const destaque = kits.filter(k => k.destaque).slice(0, 6);
  wrap.innerHTML = destaque.map(kitCardHtml).join('') || '<p>Nenhum kit em destaque no momento.</p>';
  initFavorites();
  initWhatsappLinks();
  initRevealOnScroll();
}

/* ---- Renderização: catálogo completo ---- */
async function renderKitsCatalogo() {
  const wrap = document.querySelector('#catalog-grid');
  if (!wrap) return;
  const kits = await fetchKits();
  wrap.innerHTML = kits.map(kitCardHtml).join('') || '<p>Nenhum kit encontrado.</p>';
  initFavorites();
  initWhatsappLinks();
  initRevealOnScroll();
  initCatalogFilters();
}

/* ---- Renderização: temas em destaque (chips com imagens) ---- */
async function renderThemesChips() {
  const wrap = document.querySelector('#themes-chips-grid');
  if (!wrap) return;
  const kits = await fetchKits();
  const seen = new Set();
  const uniqueThemes = [];
  kits.forEach(k => {
    if (!seen.has(k.tema)) { seen.add(k.tema); uniqueThemes.push(k); }
  });
  wrap.innerHTML = uniqueThemes.slice(0, 12).map(k => `
    <a class="theme-chip reveal" href="tema.html?id=${k.id}">
      <img src="${k.imagem}" alt="Tema ${k.tema}" loading="lazy" width="220" height="290">
      <span>${k.tema}</span>
    </a>
  `).join('');
  initRevealOnScroll();
}

/* ---- Renderização: depoimentos dinâmicos ---- */
async function renderTestimonials() {
  const wrap = document.querySelector('#testimonials-wrap');
  if (!wrap) return;
  const list = await fetchDepoimentos();
  if (!list.length) return;
  wrap.innerHTML = list.map((d, i) => `
    <div class="testimonial-card ${i === 0 ? 'active' : ''}">
      <div class="testimonial-stars">${starsHtml(d.estrelas || 5)}</div>
      <p class="quote">"${(d.texto || '').replace(/<[^>]+>/g, '')}"</p>
      <div class="testimonial-author">${d.nome}</div>
      <div class="testimonial-tag">${d.tema_contratado || ''}</div>
    </div>
  `).join('');
  initTestimonialCarousel();
}

/* ---- Renderização: página de detalhe do kit ---- */
async function renderKitDetail() {
  const container = document.querySelector('#kit-detail-container');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const kits = await fetchKits();
  const kit = kits.find(k => k.id === id) || kits[0];
  if (!kit) {
    container.innerHTML = '<p>Kit não encontrado. <a href="catalogo.html">Voltar ao catálogo</a></p>';
    return;
  }

  document.title = `${kit.nome} | Glipearte Pegue e Monte`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', (kit.descricao || '').replace(/<[^>]+>/g, '').slice(0, 155));

  const itens = (kit.itens_inclusos || '').split(',').map(i => i.trim()).filter(Boolean);
  const cores = (kit.cores_disponiveis || '').split(',').map(c => c.trim()).filter(Boolean);
  const whatsMsg = `Olá! Gostaria de reservar o ${kit.nome} (${kit.categoria}).`;

  container.innerHTML = `
    <div class="kit-detail-grid">
      <div>
        <div class="kit-gallery-main"><img src="${kit.imagem}" alt="${kit.nome}" id="kit-main-image"></div>
      </div>
      <div class="reveal visible">
        <span class="section-tag">${kit.categoria}</span>
        <h1 class="section-title">${kit.nome}</h1>
        <div class="kit-card-rating">${starsHtml(kit.avaliacao || 5)} <span>(${kit.avaliacao || 5} de 5)</span></div>
        <p style="color:var(--texto-secundario); margin-top:14px;">${(kit.descricao || '').replace(/<[^>]+>/g,'')}</p>
        <div class="kit-info-price">R$ ${Number(kit.preco).toFixed(2).replace('.', ',')} <small>/ locação por evento</small></div>

        <h3 style="font-size:1rem; margin-top:20px;">Itens inclusos</h3>
        <ul class="kit-info-list">
          ${itens.map(i => `<li><i class="fa-solid fa-circle-check"></i> ${i}</li>`).join('')}
        </ul>

        <h3 style="font-size:1rem;">Cores disponíveis</h3>
        <div class="color-options">
          ${cores.map((c, i) => `<span class="color-chip ${i === 0 ? 'active' : ''}">${c}</span>`).join('')}
        </div>

        <div class="hero-actions" style="margin-top:24px;">
          <a class="btn btn-whatsapp" href="#" data-whatsapp-msg="${whatsMsg}"><i class="fa-brands fa-whatsapp"></i> Reservar pelo WhatsApp</a>
          <button class="btn btn-outline share-btn" data-share-title="${kit.nome} - Glipearte" data-share-url="${window.location.href}"><i class="fa-solid fa-share-nodes"></i> Compartilhar</button>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  initWhatsappLinks();
  initShareButtons();

  renderRelatedKits(kit, kits);
}

async function renderRelatedKits(currentKit, allKits) {
  const wrap = document.querySelector('#related-kits-grid');
  if (!wrap) return;
  const related = allKits.filter(k => k.categoria === currentKit.categoria && k.id !== currentKit.id).slice(0, 4);
  wrap.innerHTML = related.map(kitCardHtml).join('') || '<p>Nenhum kit relacionado.</p>';
  initFavorites();
  initWhatsappLinks();
  initRevealOnScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  renderKitsDestaque();
  renderKitsCatalogo();
  renderThemesChips();
  renderTestimonials();
  renderKitDetail();
});

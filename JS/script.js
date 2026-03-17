/* ════════════════════════════════════════════════════════
   script.js — Valhalla Bebidas
   Módulos: Auth | Nav Desktop | Nav Mobile | Carrinho
════════════════════════════════════════════════════════ */
 
/* ════════════════════════════════════════════════════════
   AUTH — Estado de autenticação
════════════════════════════════════════════════════════ */
const isLogado = localStorage.getItem('logado') === 'true';
const nomeUser = localStorage.getItem('nomeUser') || 'Usuário';
 
/* ════════════════════════════════════════════════════════
   NAV DESKTOP — Elementos
════════════════════════════════════════════════════════ */
const navGuest    = document.querySelector('.nav__guest');
const navUser     = document.getElementById('nav-user');
const userBtn     = document.getElementById('userBtn');
const userNameEl  = document.getElementById('userName');
const dropDesktop = document.getElementById('dropdown-desktop');
 
/* ════════════════════════════════════════════════════════
   NAV MOBILE — Elementos
════════════════════════════════════════════════════════ */
const menuBtn        = document.getElementById('menuBtn');
const dropMobile     = document.getElementById('dropdown-mobile');
const userNameMobile = document.getElementById('userNameMobile');
 
/* ════════════════════════════════════════════════════════
   AUTH — Aplica estado no Desktop
════════════════════════════════════════════════════════ */
if (isLogado) {
  navGuest.style.display     = 'none';
  navUser.style.display      = 'block';
  userNameEl.textContent     = nomeUser;
  userNameMobile.textContent = nomeUser;
} else {
  navGuest.style.display = 'flex';
  navUser.style.display  = 'none';
}
 
/* ════════════════════════════════════════════════════════
   AUTH — Aplica estado no Mobile
════════════════════════════════════════════════════════ */
 
/* Itens exclusivos do logado */
document.querySelectorAll('.dropdown-auth').forEach(el => {
  el.style.display = isLogado ? 'flex' : 'none';
});
 
/* Itens exclusivos do visitante */
document.querySelectorAll('.dropdown-guest').forEach(el => {
  el.style.display = isLogado ? 'none' : 'flex';
});
 
/* Dividers — corrige display de flex para block */
document.querySelectorAll('.nav__dropdown-divider.dropdown-auth').forEach(el => {
  el.style.display = isLogado ? 'block' : 'none';
});
 
document.querySelectorAll('.nav__dropdown-divider.dropdown-guest').forEach(el => {
  el.style.display = isLogado ? 'none' : 'block';
});
 
/* ════════════════════════════════════════════════════════
   NAV DESKTOP — Dropdown
════════════════════════════════════════════════════════ */
 
/* Abre / fecha ao clicar no botão do usuário */
userBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = dropDesktop.classList.toggle('open');
  userBtn.classList.toggle('open', isOpen);
});
 
/* Fecha ao clicar fora */
document.addEventListener('click', (e) => {
  if (!dropDesktop?.contains(e.target) && !userBtn?.contains(e.target)) {
    dropDesktop?.classList.remove('open');
    userBtn?.classList.remove('open');
  }
});
 
/* ════════════════════════════════════════════════════════
   NAV MOBILE — Dropdown
════════════════════════════════════════════════════════ */
 
/* Abre / fecha ao clicar no ícone hambúrguer */
menuBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  dropMobile.classList.toggle('open');
});
 
/* Fecha ao clicar fora */
document.addEventListener('click', (e) => {
  if (!dropMobile?.contains(e.target) && !menuBtn?.contains(e.target)) {
    dropMobile?.classList.remove('open');
  }
});
 
/* Fecha ao clicar em qualquer item */
dropMobile?.querySelectorAll('.nav__dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    dropMobile.classList.remove('open');
  });
});
 
/* ════════════════════════════════════════════════════════
   AUTH — Logout compartilhado desktop e mobile
════════════════════════════════════════════════════════ */
function logout() {
  localStorage.removeItem('logado');
  localStorage.removeItem('nomeUser');
  localStorage.removeItem('carrinho');
  window.location.href = 'index.html';
}
 
document.getElementById('btn-logout-desktop')?.addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});
 
document.getElementById('btn-logout-mobile')?.addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});
 
/* ════════════════════════════════════════════════════════
   CARRINHO — Elementos
════════════════════════════════════════════════════════ */
const cart        = document.getElementById('cart');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose   = document.getElementById('cartClose');
const cartBtn     = document.getElementById('cartBtn');
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
 
/* ════════════════════════════════════════════════════════
   CARRINHO — Visibilidade inicial
════════════════════════════════════════════════════════ */
 
/* Esconde o sidebar no carregamento — evita flash no F5 */
if (cart) cart.style.display = 'none';
 
/* Botão do carrinho só aparece para logado */
if (cartBtn) {
  cartBtn.style.display = isLogado ? 'flex' : 'none';
}
 
/* Visitante — garante carrinho limpo */
if (!isLogado) {
  localStorage.removeItem('carrinho');
}
 
/* ════════════════════════════════════════════════════════
   CARRINHO — Abrir e fechar
════════════════════════════════════════════════════════ */
function abrirCarrinho() {
  cart.style.display = 'flex';
  requestAnimationFrame(() => {
    cart.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
 
function fecharCarrinho() {
  cart.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
 
  /* Esconde após a animação de saída terminar */
  cart.addEventListener('transitionend', () => {
    if (!cart.classList.contains('open')) {
      cart.style.display = 'none';
    }
  }, { once: true });
}
 
cartBtn?.addEventListener('click', abrirCarrinho);
cartClose?.addEventListener('click', fecharCarrinho);
cartOverlay?.addEventListener('click', fecharCarrinho);
 
/* ════════════════════════════════════════════════════════
   CARRINHO — localStorage
════════════════════════════════════════════════════════ */
function salvarCarrinho(itens) {
  localStorage.setItem('carrinho', JSON.stringify(itens));
}
 
function carregarCarrinho() {
  return JSON.parse(localStorage.getItem('carrinho') || '[]');
}
 
/* ════════════════════════════════════════════════════════
   CARRINHO — Atualizar UI
════════════════════════════════════════════════════════ */
function atualizarContador(itens) {
  const total = itens.reduce((acc, item) => acc + item.quantidade, 0);
  if (cartCountEl) cartCountEl.textContent = total;
}
 
function atualizarTotal(itens) {
  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  if (cartTotalEl) cartTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}
 
/* ════════════════════════════════════════════════════════
   CARRINHO — Renderizar itens
════════════════════════════════════════════════════════ */
function renderizarItens(itens) {
  if (!cartItemsEl) return;
 
  if (itens.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart__empty">
        <p>Seu carrinho está vazio.</p>
      </div>
    `;
    return;
  }
 
  cartItemsEl.innerHTML = itens.map(item => `
    <div class="cart__item" data-id="${item.id}">
      <img class="cart__item-img" src="${item.imagem}" alt="${item.nome}" />
      <div class="cart__item-info">
        <h3>${item.nome}</h3>
        <p>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
      </div>
      <div class="cart__item-qty">
        <button class="cart__qty-menos" data-id="${item.id}">−</button>
        <span>${item.quantidade}</span>
        <button class="cart__qty-mais" data-id="${item.id}">+</button>
      </div>
    </div>
  `).join('');
 
  /* Listeners dos botões + e − */
  cartItemsEl.querySelectorAll('.cart__qty-mais').forEach(btn => {
    btn.addEventListener('click', () => alterarQtd(btn.dataset.id, 1));
  });
 
  cartItemsEl.querySelectorAll('.cart__qty-menos').forEach(btn => {
    btn.addEventListener('click', () => alterarQtd(btn.dataset.id, -1));
  });
}
 
/* ════════════════════════════════════════════════════════
   CARRINHO — Alterar quantidade
════════════════════════════════════════════════════════ */
function alterarQtd(id, delta) {
  let itens = carregarCarrinho();
  const index = itens.findIndex(i => i.id === id);
  if (index === -1) return;
 
  itens[index].quantidade += delta;
 
  /* Remove o item se quantidade chegar a zero */
  if (itens[index].quantidade <= 0) {
    itens.splice(index, 1);
  }
 
  salvarCarrinho(itens);
  renderizarItens(itens);
  atualizarContador(itens);
  atualizarTotal(itens);
}
 
/* ════════════════════════════════════════════════════════
   CARRINHO — Adicionar produto (chamado pelo catálogo)
════════════════════════════════════════════════════════ */
function adicionarAoCarrinho(produto) {
  let itens = carregarCarrinho();
  const index = itens.findIndex(i => i.id === produto.id);
 
  if (index !== -1) {
    itens[index].quantidade += 1;
  } else {
    itens.push({ ...produto, quantidade: 1 });
  }
 
  salvarCarrinho(itens);
  renderizarItens(itens);
  atualizarContador(itens);
  atualizarTotal(itens);
  abrirCarrinho();
}
 
/* ════════════════════════════════════════════════════════
   CARRINHO — Inicializa ao carregar a página
════════════════════════════════════════════════════════ */
if (isLogado) {
  const itensIniciais = carregarCarrinho();
  renderizarItens(itensIniciais);
  atualizarContador(itensIniciais);
  atualizarTotal(itensIniciais);
}
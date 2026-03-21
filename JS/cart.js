/* ════════════════════════════════════════════════════════
   cart.js — Valhalla Bebidas
   Responsável: carrinho lateral completo
   Carrega em: páginas autenticadas (index, catalogo, produto)
   Depende de: auth.js (isLogado)
════════════════════════════════════════════════════════ */
 
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
   CARRINHO — Adicionar produto (chamado pelo catalogo.js)
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
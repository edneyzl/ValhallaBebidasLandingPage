/* ════════════════════════════════════════════════════════
   carrinho.js — Valhalla Bebidas
   Módulos: Proteção | Elementos | Render | Quantidade | Total
   Depende de: auth.js (isLogado)
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   PROTEÇÃO — redireciona visitante
════════════════════════════════════════════════════════ */
if (!isLogado) {
    window.location.href = 'login.html';
  }
  
  /* ════════════════════════════════════════════════════════
     ELEMENTOS
  ════════════════════════════════════════════════════════ */
  const lista          = document.getElementById('carrinhoLista');
  const vazio          = document.getElementById('carrinhoVazio');
  const count          = document.getElementById('carrinhoCount');
  const resumoSubtotal = document.getElementById('resumoSubtotal');
  const resumoTotal    = document.getElementById('resumoTotal');
  const btnCheckout    = document.getElementById('btnCheckout');
  
  /* ════════════════════════════════════════════════════════
     LOCALSTORAGE — carregar e salvar
  ════════════════════════════════════════════════════════ */
  function carregarCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho') || '[]');
  }
  
  function salvarCarrinho(itens) {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }
  
  /* ════════════════════════════════════════════════════════
     ALTERAR QUANTIDADE
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
    renderizar();
  }
  
  /* ════════════════════════════════════════════════════════
     REMOVER ITEM
  ════════════════════════════════════════════════════════ */
  function removerItem(id) {
    let itens = carregarCarrinho();
    itens = itens.filter(i => i.id !== id);
    salvarCarrinho(itens);
    renderizar();
  }
  
  /* ════════════════════════════════════════════════════════
     ATUALIZAR TOTAIS
  ════════════════════════════════════════════════════════ */
  function atualizarTotais(itens) {
    const subtotal = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
    const formatar = v => `R$ ${v.toFixed(2).replace('.', ',')}`;
  
    resumoSubtotal.textContent = formatar(subtotal);
    resumoTotal.textContent    = formatar(subtotal); /* frete a calcular */
  
    if (count) {
      const total = itens.reduce((acc, i) => acc + i.quantidade, 0);
      count.textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;
    }
  }
  
  /* ════════════════════════════════════════════════════════
     RENDER — gera os itens
  ════════════════════════════════════════════════════════ */
  function renderizar() {
    const itens = carregarCarrinho();
  
    /* ── Vazio ── */
    if (itens.length === 0) {
      lista.innerHTML       = '';
      vazio.style.display   = 'flex';
      if (btnCheckout) btnCheckout.style.pointerEvents = 'none';
      atualizarTotais([]);
      return;
    }
  
    vazio.style.display = 'none';
    if (btnCheckout) btnCheckout.style.pointerEvents = 'auto';
  
    /* ── Itens ── */
    lista.innerHTML = itens.map(item => {
      const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
      const preco    = item.preco.toFixed(2).replace('.', ',');
      const temImg   = Boolean(item.imagem);
  
      return `
        <li class="carrinho__item" data-id="${item.id}">
  
          <!-- Produto -->
          <div class="carrinho__item-produto">
            <div class="carrinho__item-img">
              ${temImg
                ? `<img src="${item.imagem}" alt="${item.nome}" />`
                : `<span>🍺</span>`
              }
            </div>
            <div class="carrinho__item-info">
              <p class="carrinho__item-nome">${item.nome}</p>
              <button
                type="button"
                class="carrinho__item-remover"
                onclick="removerItem('${item.id}')"
              >
                Remover
              </button>
            </div>
          </div>
  
          <!-- Preço unitário -->
          <p class="carrinho__item-preco">R$ ${preco}</p>
  
          <!-- Quantidade -->
          <div class="carrinho__item-qty">
            <button type="button" class="carrinho__qty-btn" onclick="alterarQtd('${item.id}', -1)">−</button>
            <span class="carrinho__qty-num">${item.quantidade}</span>
            <button type="button" class="carrinho__qty-btn" onclick="alterarQtd('${item.id}', 1)">+</button>
          </div>
  
          <!-- Subtotal -->
          <p class="carrinho__item-subtotal">R$ ${subtotal}</p>
  
        </li>
      `;
    }).join('');
  
    atualizarTotais(itens);
  }
  
  /* ════════════════════════════════════════════════════════
     INIT — inicializa ao carregar a página
  ════════════════════════════════════════════════════════ */
  renderizar();
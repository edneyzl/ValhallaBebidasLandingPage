/* ════════════════════════════════════════════════════════
   PRODUTOS — Dados simulados
════════════════════════════════════════════════════════ */
const produtosMock = [
  { id: '1', nome: 'Brahma Duplo Malte 350ml',    preco: 4.90,  categoria: 'cervejas',      imagem: '' },
  { id: '2', nome: 'Heineken Long Neck 330ml',    preco: 8.50,  categoria: 'cervejas',      imagem: '' },
  { id: '3', nome: 'Corona Extra 355ml',          preco: 9.90,  categoria: 'cervejas',      imagem: '' },
  { id: '4', nome: 'Red Bull Energy 250ml',       preco: 12.90, categoria: 'energeticos',   imagem: '' },
  { id: '5', nome: 'Monster Energy 473ml',        preco: 10.90, categoria: 'energeticos',   imagem: '' },
  { id: '6', nome: 'Coca-Cola 2L',                preco: 8.90,  categoria: 'refrigerantes', imagem: '' },
  { id: '7', nome: 'Pepsi Black 2L',              preco: 7.50,  categoria: 'refrigerantes', imagem: '' },
  { id: '8', nome: 'Del Valle Uva 1L',            preco: 6.90,  categoria: 'sucos',         imagem: '' },
  { id: '9', nome: 'Minute Maid Laranja 1L',      preco: 7.20,  categoria: 'sucos',         imagem: '' },
  { id: '10', nome: 'Crystal sem Gás 1,5L',       preco: 3.50,  categoria: 'aguas',         imagem: '' },
  { id: '11', nome: 'Schin Pilsen 473ml',         preco: 4.20,  categoria: 'cervejas',      imagem: '' },
  { id: '12', nome: 'Guaraná Antarctica 2L',      preco: 7.90,  categoria: 'refrigerantes', imagem: '' },
  { id: '13', nome: 'Vodka 70ml',                 preco: 10.90, categoria: 'destilados',    imagem: '' },
  { id: '14', nome: 'Whisky 70ml',                 preco: 10.90, categoria: 'destilados',    imagem: '' },
  { id: '15', nome: 'Tequila 70ml',                 preco: 10.90, categoria: 'destilados',    imagem: '' },
];

/* ════════════════════════════════════════════════════════
 ESTADO GLOBAL
════════════════════════════════════════════════════════ */
let categoriaAtiva = 'todos';
let ordemAtiva     = 'relevancia';
let buscaAtiva     = '';

/* ════════════════════════════════════════════════════════
 ELEMENTOS (Ajustados para os IDs do seu novo HTML)
════════════════════════════════════════════════════════ */
const grid          = document.querySelector('.products'); // Seleciona pela classe do container UL
const countText     = document.querySelector('.product__title p');
const searchInput   = document.getElementById('search-input');
const emptyState    = document.createElement('div'); // Criaremos um dinâmico se não houver no HTML

/* ════════════════════════════════════════════════════════
 EVENT LISTENERS — Filtros (Categorias e Ordenação)
════════════════════════════════════════════════════════ */

// Mapeia os botões de categoria (Baseado no texto ou ordem)
document.querySelectorAll('.filter .cards')[0].querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
      // Remove active de todos nessa lista
      btn.closest('.cards').querySelectorAll('li').forEach(li => li.className = 'catalogo_filter-btn');
      btn.parentElement.className = 'catalogo_filter-btn-active';
      
      categoriaAtiva = btn.textContent.trim().toLowerCase();
      if (categoriaAtiva === 'todos') categoriaAtiva = 'todos';
      
      renderizar();
  });
});

// Mapeia os botões de ordenação
document.querySelectorAll('.filter .cards')[1].querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
      btn.closest('.cards').querySelectorAll('li').forEach(li => li.className = 'catalogo_filter-btn');
      btn.parentElement.className = 'catalogo_filter-btn-active';
      
      const label = btn.textContent.trim().toLowerCase();
      if (label.includes('menor')) ordemAtiva = 'menor-preco';
      else if (label.includes('maior')) ordemAtiva = 'maior-preco';
      else if (label.includes('nome')) ordemAtiva = 'nome';
      else ordemAtiva = 'relevancia';
      
      renderizar();
  });
});

/* ════════════════════════════════════════════════════════
 BUSCA COM DEBOUNCE
════════════════════════════════════════════════════════ */
let debounceTimer;
searchInput?.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
      buscaAtiva = e.target.value.toLowerCase().trim();
      renderizar();
  }, 300);
});

/* ════════════════════════════════════════════════════════
 LÓGICA DE FILTRAGEM
════════════════════════════════════════════════════════ */
function filtrarProdutos() {
  let resultado = [...produtosMock];

  if (categoriaAtiva !== 'todos') {
      resultado = resultado.filter(p => p.categoria.toLowerCase() === categoriaAtiva);
  }

  if (buscaAtiva) {
      resultado = resultado.filter(p => p.nome.toLowerCase().includes(buscaAtiva));
  }

  switch (ordemAtiva) {
      case 'menor-preco': resultado.sort((a, b) => a.preco - b.preco); break;
      case 'maior-preco': resultado.sort((a, b) => b.preco - a.preco); break;
      case 'nome': resultado.sort((a, b) => a.nome.localeCompare(b.nome)); break;
  }

  return resultado;
}

/* ════════════════════════════════════════════════════════
 RENDER — Compatível com o CSS Grid Novo
════════════════════════════════════════════════════════ */
function renderizar() {
  const produtos = filtrarProdutos();

  // Atualiza contador
  if (countText) {
      countText.textContent = `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} encontrado${produtos.length !== 1 ? 's' : ''}`;
  }

  if (produtos.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--color-text-muted);">Nenhum produto encontrado.</p>`;
      return;
  }

  // Renderiza os cards diretamente no container .products (sem .line!)
  grid.innerHTML = produtos.map(produto => {
      // Lógica de botão baseada na autenticação (assumindo variável isLogado global)
      const loggedIn = typeof isLogado !== 'undefined' ? isLogado : false;

      return `
          <li class="product-card" data-id="${produto.id}">
              <div class="product-img">
                  ${produto.imagem 
                      ? `<img src="${produto.imagem}" alt="${produto.nome}">` 
                      : `<span style="font-size: 50px;">🍺</span>`
                  }
              </div>
              <div>
                  <h1>${produto.nome}</h1>
                  <p>${produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)}</p>
              </div>
              <h2>R$ ${produto.preco.toFixed(2).replace('.', ',')}</h2>
              <div class="buttons">
                  ${loggedIn 
                      ? `<button class="market-button" onclick="adicionarAoCarrinho({ id: '${produto.id}', nome: '${produto.nome}', preco: ${produto.preco}, imagem: '${produto.imagem}' })">
                          Adicionar ao carrinho
                         </button>`
                      : `<button class="market-button" style="opacity: 0.5; cursor: not-allowed;" disabled>Faça login</button>`
                  }
                  <a href="produto.html?id=${produto.id}" class="details-button">Ver detalhes</a>
              </div>
          </li>
      `;
  }).join('');
}

/* ════════════════════════════════════════════════════════
 SKELETON (Ajustado para o novo design)
════════════════════════════════════════════════════════ */
function mostrarSkeleton() {
  grid.innerHTML = Array(6).fill('').map(() => `
      <li class="product-card" style="pointer-events: none;">
          <div class="product-img skeleton" style="height: 250px; background: var(--color-bg-card);"></div>
          <div style="display:flex; flex-direction:column; gap:10px;">
              <div class="skeleton" style="height: 20px; width: 80%; background: var(--color-bg-card);"></div>
              <div class="skeleton" style="height: 15px; width: 40%; background: var(--color-bg-card);"></div>
          </div>
          <div class="skeleton" style="height: 30px; width: 50%; margin-top: auto; background: var(--color-bg-card);"></div>
          <div class="buttons">
              <div class="skeleton" style="height: 40px; flex:1; border-radius: 30px; background: var(--color-bg-card);"></div>
              <div class="skeleton" style="height: 40px; flex:1; border-radius: 30px; background: var(--color-bg-card);"></div>
          </div>
      </li>
  `).join('');
}

/* ════════════════════════════════════════════════════════
 INIT
════════════════════════════════════════════════════════ */
mostrarSkeleton();

setTimeout(() => {
  renderizar();
}, 800);
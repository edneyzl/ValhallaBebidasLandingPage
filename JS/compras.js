/* ════════════════════════════════════════════════════════
   meus-pedidos.js — Valhalla Bebidas
   Módulos: Proteção | Mock | Filtros | Render
   Depende de: auth.js (isLogado)
════════════════════════════════════════════════════════ */

if (!isLogado) window.location.href = 'login.html';

/* ════════════════════════════════════════════════════════
   MOCK — pedidos simulados
   Substitui por fetch GET /api/pedidos/meus quando API pronta
════════════════════════════════════════════════════════ */
const pedidosMock = [
  {
    id: 'VLH-000123', data: '15/03/2026', status: 'Confirmado',
    itens: [
      { nome: 'Heineken Long Neck 330ml', quantidade: 6, preco: 8.50, imagem: '' },
      { nome: 'Red Bull Energy 250ml',    quantidade: 2, preco: 12.90, imagem: '' },
    ],
    total: 76.80,
  },
  {
    id: 'VLH-000098', data: '02/03/2026', status: 'Pendente',
    itens: [
      { nome: 'Coca-Cola 2L',          quantidade: 4, preco: 8.90,  imagem: '' },
      { nome: 'Guaraná Antarctica 2L', quantidade: 3, preco: 7.90,  imagem: '' },
    ],
    total: 59.30,
  },
  {
    id: 'VLH-000071', data: '18/02/2026', status: 'Cancelado',
    itens: [
      { nome: 'Monster Energy 473ml', quantidade: 5, preco: 10.90, imagem: '' },
    ],
    total: 54.50,
  },
];

/* ════════════════════════════════════════════════════════
   ESTADO
════════════════════════════════════════════════════════ */
let filtroAtivo = 'todos';

/* ════════════════════════════════════════════════════════
   FILTROS
════════════════════════════════════════════════════════ */
document.querySelectorAll('.pedidos__filtro').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pedidos__filtro').forEach(b =>
      b.classList.toggle('pedidos__filtro--active', b === btn)
    );
    filtroAtivo = btn.dataset.status;
    renderizar();
  });
});

/* ════════════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════════════ */
const statusConfig = {
  Pendente:   { classe: 'pedido__status--pendente',   label: 'Pendente' },
  Confirmado: { classe: 'pedido__status--confirmado', label: 'Confirmado' },
  Cancelado:  { classe: 'pedido__status--cancelado',  label: 'Cancelado' },
};

const formatar = v => `R$ ${v.toFixed(2).replace('.', ',')}`;

function renderizar() {
  const lista  = document.getElementById('pedidosLista');
  const vazio  = document.getElementById('pedidosVazio');
  const count  = document.getElementById('pedidosCount');

  const filtrados = filtroAtivo === 'todos'
    ? pedidosMock
    : pedidosMock.filter(p => p.status === filtroAtivo);

  count.textContent = `${pedidosMock.length} pedido${pedidosMock.length !== 1 ? 's' : ''}`;

  if (filtrados.length === 0) {
    lista.innerHTML = '';
    vazio.style.display = 'flex';
    return;
  }

  vazio.style.display = 'none';

  lista.innerHTML = filtrados.map(pedido => {
    const { classe, label } = statusConfig[pedido.status];
    const podeCancelar = pedido.status === 'Pendente';

    return `
      <div class="pedido__card">

        <!-- Topo -->
        <div class="pedido__card-topo">
          <div>
            <p class="pedido__card-id">${pedido.id}</p>
            <p class="pedido__card-data">${pedido.data}</p>
          </div>
          <span class="pedido__status ${classe}">
            <span class="pedido__status-dot"></span>
            ${label}
          </span>
        </div>

        <!-- Itens -->
        <ul class="pedido__itens">
          ${pedido.itens.map(item => `
            <li class="pedido__item">
              <div class="pedido__item-img">
                ${item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" />` : `<span>🍺</span>`}
              </div>
              <p class="pedido__item-nome">${item.nome}</p>
              <span class="pedido__item-qty">${item.quantidade}x</span>
              <p class="pedido__item-preco">${formatar(item.preco * item.quantidade)}</p>
            </li>
          `).join('')}
        </ul>

        <!-- Rodapé -->
        <div class="pedido__card-rodape">
          <div>
            <p class="pedido__total-label">Total do pedido</p>
            <p class="pedido__total-valor">${formatar(pedido.total)}</p>
          </div>
          <div class="pedido__card-acoes">
            <a href="#" class="pedido__btn pedido__btn--outline">Ver detalhes</a>
            ${podeCancelar
              ? `<button type="button" class="pedido__btn pedido__btn--cancelar" onclick="cancelarPedido('${pedido.id}')">Cancelar</button>`
              : ''
            }
          </div>
        </div>

      </div>
    `;
  }).join('');
}

/* ════════════════════════════════════════════════════════
   CANCELAR PEDIDO
════════════════════════════════════════════════════════ */
function cancelarPedido(id) {
  const pedido = pedidosMock.find(p => p.id === id);
  if (!pedido) return;
  pedido.status = 'Cancelado';
  renderizar();
}

/* ════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════ */
renderizar();

/* ════════════════════════════════════════════════════════
   API — descomenta quando pronto
════════════════════════════════════════════════════════ */
/*
async function carregarPedidos() {
  const res    = await fetch('https://localhost:7001/api/pedidos/meus', { credentials: 'include' });
  const dados  = await res.json();
  pedidosMock.length = 0;
  pedidosMock.push(...dados);
  renderizar();
}
carregarPedidos();
*/
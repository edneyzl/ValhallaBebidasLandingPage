/* ════════════════════════════════════════════════════════
   confirmacao.js — Valhalla Bebidas
   Depende de: auth.js (isLogado)
════════════════════════════════════════════════════════ */

if (!isLogado) window.location.href = 'login.html';

/* ── Número do pedido (via URL ou simulado) ── */
const params   = new URLSearchParams(window.location.search);
const pedidoId = params.get('pedido') || Math.floor(Math.random() * 900000 + 100000);
document.getElementById('numeroPedido').textContent = `Pedido #${pedidoId}`;

/* ── Itens do último pedido (localStorage) ── */
const itens = JSON.parse(localStorage.getItem('ultimoPedido') || '[]');
const lista  = document.getElementById('confirmacaoItens');
const formatar = v => `R$ ${v.toFixed(2).replace('.', ',')}`;

if (itens.length > 0) {
  lista.innerHTML = itens.map(item => `
    <li class="confirmacao__item">
      <div class="confirmacao__item-img">
        ${item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" />` : `<span>🍺</span>`}
      </div>
      <div class="confirmacao__item-info">
        <p>${item.nome}</p>
        <span>${item.quantidade}x · ${formatar(item.preco)}</span>
      </div>
      <p class="confirmacao__item-preco">${formatar(item.preco * item.quantidade)}</p>
    </li>
  `).join('');

  const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  document.getElementById('confirmacaoTotal').textContent = formatar(total);
}

/* ── Previsão simulada (+5 dias úteis) ── */
const previsao = new Date();
previsao.setDate(previsao.getDate() + 5);
document.getElementById('confirmacaoPrevisao').textContent =
  previsao.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

document.getElementById('confirmacaoPagamento').textContent = 'Cartão de crédito';
document.getElementById('confirmacaoEndereco').textContent  = 'Endereço cadastrado';
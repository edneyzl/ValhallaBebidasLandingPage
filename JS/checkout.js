/* ════════════════════════════════════════════════════════
   checkout.js — Valhalla Bebidas
   Módulos: Proteção | Resumo | Métodos | Máscaras | CEP | Submit
   Depende de: auth.js (isLogado)
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   PROTEÇÃO — redireciona visitante
════════════════════════════════════════════════════════ */
if (!isLogado) {
  window.location.href = 'login.html';
}

/* ════════════════════════════════════════════════════════
   CARRINHO — carrega do localStorage
════════════════════════════════════════════════════════ */
const itens = JSON.parse(localStorage.getItem('carrinho') || '[]');

if (itens.length === 0) {
  window.location.href = 'catalogo.html';
}

/* ════════════════════════════════════════════════════════
   RESUMO — Renderiza itens e totais
════════════════════════════════════════════════════════ */
function renderizarResumo() {
  const lista    = document.getElementById('resumoLista');
  const subtotal = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const formatar = v => `R$ ${v.toFixed(2).replace('.', ',')}`;

  lista.innerHTML = itens.map(item => `
    <li class="checkout__resumo-item">
      <div class="checkout__resumo-item-img">
        ${item.imagem
          ? `<img src="${item.imagem}" alt="${item.nome}" />`
          : `<span>🍺</span>`
        }
      </div>
      <div class="checkout__resumo-item-info">
        <p>${item.nome}</p>
        <span>${item.quantidade}x · ${formatar(item.preco)} cada</span>
      </div>
      <p class="checkout__resumo-item-preco">${formatar(item.preco * item.quantidade)}</p>
    </li>
  `).join('');

  document.getElementById('resumoSubtotal').textContent = formatar(subtotal);
  document.getElementById('resumoTotal').textContent    = formatar(subtotal);
}

renderizarResumo();

/* ════════════════════════════════════════════════════════
   MÉTODOS DE PAGAMENTO
════════════════════════════════════════════════════════ */
const paineis = {
  cartao: document.getElementById('painelCartao'),
  pix:    document.getElementById('painelPix'),
  boleto: document.getElementById('painelBoleto'),
};

document.querySelectorAll('.checkout__metodo').forEach(btn => {
  btn.addEventListener('click', () => {
    const metodo = btn.dataset.metodo;

    /* Toggle botões */
    document.querySelectorAll('.checkout__metodo').forEach(b =>
      b.classList.toggle('checkout__metodo--active', b === btn)
    );

    /* Toggle painéis */
    Object.entries(paineis).forEach(([key, painel]) => {
      painel.style.display = key === metodo ? (key === 'cartao' ? 'flex' : 'flex') : 'none';
    });
  });
});

/* ════════════════════════════════════════════════════════
   MÁSCARAS
════════════════════════════════════════════════════════ */

/* Número do cartão: 0000 0000 0000 0000 */
document.getElementById('numeroCartao')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
});

/* Validade: MM/AA */
document.getElementById('validade')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
  e.target.value = v.slice(0, 5);
});

/* CVV: só números */
document.getElementById('cvv')?.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

/* CEP: 00000-000 */
document.getElementById('cep')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  e.target.value = v.slice(0, 9);
});

/* Estado: UF maiúsculo */
document.getElementById('estado')?.addEventListener('input', (e) => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
});

/* ════════════════════════════════════════════════════════
   CEP — Busca via ViaCEP
════════════════════════════════════════════════════════ */
document.getElementById('cep')?.addEventListener('blur', async (e) => {
  const cep = e.target.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  try {
    const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) return;

    document.getElementById('logradouro').value = data.logradouro || '';
    document.getElementById('bairro').value     = data.bairro     || '';
    document.getElementById('cidade').value     = data.localidade || '';
    document.getElementById('estado').value     = data.uf         || '';
    document.getElementById('numero')?.focus();
  } catch { /* silencia */ }
});

/* ════════════════════════════════════════════════════════
   SUBMIT
════════════════════════════════════════════════════════ */
document.getElementById('btnConfirmar')?.addEventListener('click', async () => {
  const payload = {
    itens: itens.map(i => ({ produtoId: i.id, quantidade: i.quantidade })),
    entrega: {
      logradouro:  document.getElementById('logradouro').value.trim(),
      numero:      document.getElementById('numero').value.trim(),
      complemento: document.getElementById('complemento').value.trim(),
      bairro:      document.getElementById('bairro').value.trim(),
      cidade:      document.getElementById('cidade').value.trim(),
      estado:      document.getElementById('estado').value.trim(),
      cep:         document.getElementById('cep').value.replace(/\D/g, ''),
    },
  };

  /* ── Simulação ── */
  console.log('Payload:', payload);
  localStorage.removeItem('carrinho');
  window.location.href = 'confirmacao.html';

  /* ── API — descomenta quando pronto ── */
  /*
  try {
    const response = await fetch('https://localhost:7001/api/pedidos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) { alert(data.mensagem || 'Erro.'); return; }
    localStorage.removeItem('carrinho');
    window.location.href = `confirmacao.html?pedido=${data.pedidoId}`;
  } catch { alert('Erro de conexão.'); }
  */
});
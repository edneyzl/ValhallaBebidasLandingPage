/* ════════════════════════════════════════════════════════
   LOGIN — Menu mobile
════════════════════════════════════════════════════════ */
const loginMenuBtn    = document.getElementById('loginMenuBtn');
const loginDropMobile = document.getElementById('loginDropMobile');

/* Abre / fecha */
loginMenuBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  loginDropMobile?.classList.toggle('open');
});

/* Fecha ao clicar fora */
document.addEventListener('click', (e) => {
  if (!loginDropMobile?.contains(e.target) && !loginMenuBtn?.contains(e.target)) {
    loginDropMobile?.classList.remove('open');
  }
});

/* Fecha ao clicar em qualquer item */
loginDropMobile?.querySelectorAll('.nav__dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    loginDropMobile.classList.remove('open');
  });
});

/* ════════════════════════════════════════════════════════
   login.js — Valhalla Bebidas
   Responsável: submit do formulário de login
   Depende de: auth.js
════════════════════════════════════════════════════════ */

const formLogin = document.getElementById('formLogin');

formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  /* ── Simulação — substitui por fetch quando a API estiver pronta ── */
  const usuarioFake = {
    id: 1,
    nome: 'João Silva',
    email: email,
    sucesso: true,
    mensagem: 'Login realizado com sucesso.'
  };

  /* ── Quando tiver API — descomenta isso e remove o usuarioFake ── */
  /*
  const response = await fetch('https://localhost:7001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, senha })
  });

  const usuarioFake = await response.json();

  if (!response.ok) {
    mostrarErro(usuarioFake.mensagem);
    return;
  }
  */

  if (usuarioFake.sucesso) {
    localStorage.setItem('logado', 'true');
    localStorage.setItem('nomeUser', usuarioFake.nome);
    window.location.href = 'index.html';
  } else {
    mostrarErro(usuarioFake.mensagem);
  }
});

/* ════════════════════════════════════════════════════════
   FEEDBACK — Mensagem de erro
════════════════════════════════════════════════════════ */
function mostrarErro(mensagem) {
  const erroExistente = document.querySelector('.login__erro');
  if (erroExistente) erroExistente.remove();

  const erro = document.createElement('p');
  erro.className = 'login__erro';
  erro.textContent = mensagem;
  erro.style.cssText = `
    color: #e05c5c;
    font-size: 14px;
    text-align: center;
    margin-top: -16px;
  `;

  const actions = document.querySelector('.login__actions');
  actions?.insertBefore(erro, actions.firstChild);
}
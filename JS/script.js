/* ════════════════════════════════════════════════════════
   nav.js — Valhalla Bebidas
   Controla: estado logado/visitante + dropdowns desktop e mobile
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   ESTADO DE AUTENTICAÇÃO
════════════════════════════════════════════════════════ */
const isLogado  = localStorage.getItem('logado') === 'true';
const nomeUser  = localStorage.getItem('nomeUser') || 'Usuário';

/* ════════════════════════════════════════════════════════
   ELEMENTOS — Desktop
════════════════════════════════════════════════════════ */
const navGuest      = document.querySelector('.nav__guest');
const navUser       = document.getElementById('nav-user');
const userBtn       = document.getElementById('userBtn');
const userNameEl    = document.getElementById('userName');
const dropDesktop   = document.getElementById('dropdown-desktop');

/* ════════════════════════════════════════════════════════
   ELEMENTOS — Mobile
════════════════════════════════════════════════════════ */
const menuBtn       = document.getElementById('menuBtn');
const dropMobile    = document.getElementById('dropdown-mobile');
const userNameMobile = document.getElementById('userNameMobile');


/* ════════════════════════════════════════════════════════
   APLICA ESTADO — Desktop
════════════════════════════════════════════════════════ */
if (isLogado) {
  navGuest.style.display  = 'none';
  navUser.style.display   = 'block';
  userNameEl.textContent  = nomeUser;
  userNameMobile.textContent = nomeUser;
} else {
  navGuest.style.display  = 'flex';
  navUser.style.display   = 'none';
}

/* ════════════════════════════════════════════════════════
   APLICA ESTADO — Mobile
════════════════════════════════════════════════════════ */

/* Itens exclusivos do logado */
document.querySelectorAll('.dropdown-auth').forEach(el => {
  el.style.display = isLogado ? 'flex' : 'none';
});

/* Itens exclusivos do visitante */
document.querySelectorAll('.dropdown-guest').forEach(el => {
  el.style.display = isLogado ? 'none' : 'flex';
});

/* Dividers são <div> — corrige display de flex para block */
document.querySelectorAll('.nav__dropdown-divider.dropdown-auth').forEach(el => {
  el.style.display = isLogado ? 'block' : 'none';
});

document.querySelectorAll('.nav__dropdown-divider.dropdown-guest').forEach(el => {
  el.style.display = isLogado ? 'none' : 'block';
});

/* ════════════════════════════════════════════════════════
   DROPDOWN — Desktop
════════════════════════════════════════════════════════ */

/* Abre / fecha ao clicar no botão */
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
   DROPDOWN — Mobile
════════════════════════════════════════════════════════ */

/* Abre / fecha ao clicar no ícone */
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
   LOGOUT — compartilhado entre desktop e mobile
════════════════════════════════════════════════════════ */
function logout() {
  localStorage.removeItem('logado');
  localStorage.removeItem('nomeUser');
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
/* ════════════════════════════════════════════════════════
   nav.js — Valhalla Bebidas
   Responsável: dropdowns desktop e mobile + estado da nav
   Carrega em: todas as páginas com nav
   Depende de: auth.js (isLogado, nomeUser)
════════════════════════════════════════════════════════ */
 
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
 
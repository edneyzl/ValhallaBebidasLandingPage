/* ════════════════════════════════════════════════════════
   auth.js — Valhalla Bebidas
   Responsável: estado de autenticação e logout
   Carrega em: todas as páginas
════════════════════════════════════════════════════════ */
 
/* ════════════════════════════════════════════════════════
   ESTADO DE AUTENTICAÇÃO
════════════════════════════════════════════════════════ */
const isLogado = localStorage.getItem('logado') === 'true';
const nomeUser = localStorage.getItem('nomeUser') || 'Usuário';
 
/* ════════════════════════════════════════════════════════
   LOGOUT — compartilhado entre todas as páginas
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
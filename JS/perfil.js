/* ════════════════════════════════════════════════════════
   perfil.js — Valhalla Bebidas
   Módulos: Proteção | Tabs | Máscaras | CEP | Salvar
   Depende de: auth.js (isLogado)
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   PROTEÇÃO
════════════════════════════════════════════════════════ */
if (!isLogado) window.location.href = 'login.html';

/* ════════════════════════════════════════════════════════
   MOCK — dados do usuário logado
   Substitui por fetch GET /api/clientes/perfil quando API pronta
════════════════════════════════════════════════════════ */
const usuarioMock = {
  nome:           nomeUser,
  email:          localStorage.getItem('emailUser') || 'usuario@email.com',
  documento:      '123.456.789-00',
  telefone:       '(11) 99999-9999',
  dataNascimento: '01/01/1990',
  endereco: {
    logradouro:  'Rua das Bebidas',
    numero:      '123',
    complemento: 'Apto 45',
    bairro:      'Centro',
    cep:         '01310-100',
    cidade:      'São Paulo',
    estado:      'SP',
  }
};

/* ════════════════════════════════════════════════════════
   PREENCHE O HEADER
════════════════════════════════════════════════════════ */
document.getElementById('perfilNome').textContent   = usuarioMock.nome;
document.getElementById('perfilEmail').textContent  = usuarioMock.email;
document.getElementById('perfilInicial').textContent = usuarioMock.nome.charAt(0).toUpperCase();

/* ════════════════════════════════════════════════════════
   PREENCHE OS CAMPOS — Dados pessoais
════════════════════════════════════════════════════════ */
document.getElementById('nome').value           = usuarioMock.nome;
document.getElementById('email').value          = usuarioMock.email;
document.getElementById('documento').value      = usuarioMock.documento;
document.getElementById('telefone').value       = usuarioMock.telefone;
document.getElementById('dataNascimento').value = usuarioMock.dataNascimento;

/* ── Endereço ── */
document.getElementById('logradouro').value  = usuarioMock.endereco.logradouro;
document.getElementById('numero').value      = usuarioMock.endereco.numero;
document.getElementById('complemento').value = usuarioMock.endereco.complemento;
document.getElementById('bairro').value      = usuarioMock.endereco.bairro;
document.getElementById('cep').value         = usuarioMock.endereco.cep;
document.getElementById('cidade').value      = usuarioMock.endereco.cidade;
document.getElementById('estado').value      = usuarioMock.endereco.estado;

/* ════════════════════════════════════════════════════════
   TABS — Alternância entre seções
════════════════════════════════════════════════════════ */
const tabs = {
  dados:    document.getElementById('tabDados'),
  endereco: document.getElementById('tabEndereco'),
  senha:    document.getElementById('tabSenha'),
};

document.querySelectorAll('.perfil__nav-item[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    /* Ativa o botão */
    document.querySelectorAll('.perfil__nav-item[data-tab]').forEach(b =>
      b.classList.toggle('perfil__nav-item--active', b === btn)
    );

    /* Mostra o tab correto */
    Object.entries(tabs).forEach(([key, el]) => {
      el.style.display = key === tab ? 'block' : 'none';
    });
  });
});

/* ════════════════════════════════════════════════════════
   LOGOUT
════════════════════════════════════════════════════════ */
document.getElementById('btnLogout')?.addEventListener('click', () => {
  localStorage.removeItem('logado');
  localStorage.removeItem('nomeUser');
  localStorage.removeItem('carrinho');
  window.location.href = 'index.html';
});

/* ════════════════════════════════════════════════════════
   MÁSCARAS
════════════════════════════════════════════════════════ */
document.getElementById('dataNascimento')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
  if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
  e.target.value = v.slice(0, 10);
});

document.getElementById('documento')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length <= 11) {
    if (v.length > 3)  v = v.slice(0, 3) + '.' + v.slice(3);
    if (v.length > 7)  v = v.slice(0, 7) + '.' + v.slice(7);
    if (v.length > 11) v = v.slice(0, 11) + '-' + v.slice(11);
    e.target.value = v.slice(0, 14);
  } else {
    if (v.length > 2)  v = v.slice(0, 2) + '.' + v.slice(2);
    if (v.length > 6)  v = v.slice(0, 6) + '.' + v.slice(6);
    if (v.length > 10) v = v.slice(0, 10) + '/' + v.slice(10);
    if (v.length > 15) v = v.slice(0, 15) + '-' + v.slice(15);
    e.target.value = v.slice(0, 18);
  }
});

document.getElementById('telefone')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 0)  v = '(' + v;
  if (v.length > 3)  v = v.slice(0, 3) + ') ' + v.slice(3);
  if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
  e.target.value = v.slice(0, 15);
});

document.getElementById('cep')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  e.target.value = v.slice(0, 9);
});

document.getElementById('estado')?.addEventListener('input', (e) => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
});

/* ════════════════════════════════════════════════════════
   CEP — ViaCEP
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
   SALVAR — Dados pessoais
════════════════════════════════════════════════════════ */
document.getElementById('btnSalvarDados')?.addEventListener('click', async () => {
  const payload = {
    nome:           document.getElementById('nome').value.trim(),
    email:          document.getElementById('email').value.trim(),
    documento:      document.getElementById('documento').value.replace(/\D/g, ''),
    telefone:       document.getElementById('telefone').value.replace(/\D/g, ''),
    dataNascimento: converterData(document.getElementById('dataNascimento').value),
  };

  /* ── Simulação ── */
  console.log('Salvar dados:', payload);
  localStorage.setItem('nomeUser', payload.nome.split(' ')[0]);
  mostrarFeedback('Dados atualizados com sucesso!');

  /* ── API ── */
  /*
  const res = await fetch('https://localhost:7001/api/clientes/perfil', {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(payload)
  });
  if (res.ok) mostrarFeedback('Dados atualizados com sucesso!');
  */
});

/* ════════════════════════════════════════════════════════
   SALVAR — Endereço
════════════════════════════════════════════════════════ */
document.getElementById('btnSalvarEndereco')?.addEventListener('click', async () => {
  const payload = {
    logradouro:  document.getElementById('logradouro').value.trim(),
    numero:      parseInt(document.getElementById('numero').value),
    complemento: document.getElementById('complemento').value.trim(),
    bairro:      document.getElementById('bairro').value.trim(),
    cep:         document.getElementById('cep').value.replace(/\D/g, ''),
    cidade:      document.getElementById('cidade').value.trim(),
    estado:      document.getElementById('estado').value.trim(),
  };

  console.log('Salvar endereço:', payload);
  mostrarFeedback('Endereço atualizado com sucesso!');
});

/* ════════════════════════════════════════════════════════
   SALVAR — Senha
════════════════════════════════════════════════════════ */
document.getElementById('btnSalvarSenha')?.addEventListener('click', async () => {
  const senhaAtual    = document.getElementById('senhaAtual').value;
  const novaSenha     = document.getElementById('novaSenha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  const erroEl        = document.getElementById('erroSenha');

  erroEl.textContent = '';

  if (novaSenha.length < 6) {
    erroEl.textContent = 'A nova senha deve ter pelo menos 6 caracteres.';
    return;
  }

  if (novaSenha !== confirmarSenha) {
    erroEl.textContent = 'As senhas não conferem.';
    return;
  }

  console.log('Alterar senha');
  mostrarFeedback('Senha alterada com sucesso!');

  document.getElementById('senhaAtual').value     = '';
  document.getElementById('novaSenha').value      = '';
  document.getElementById('confirmarSenha').value = '';
});

/* ════════════════════════════════════════════════════════
   FEEDBACK — Toast de sucesso
════════════════════════════════════════════════════════ */
function mostrarFeedback(mensagem) {
  const toast = document.createElement('div');
  toast.textContent = mensagem;
  toast.style.cssText = `
    position: fixed; bottom: 32px; right: 32px;
    background: #161616; border: 1px solid #D6BD77;
    color: #fff; padding: 16px 24px; border-radius: 12px;
    font-size: 14px; font-family: Sora, sans-serif;
    z-index: 9999; opacity: 0;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ════════════════════════════════════════════════════════
   UTIL
════════════════════════════════════════════════════════ */
function converterData(dataBR) {
  if (!dataBR || !dataBR.includes('/')) return null;
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes}-${dia}T00:00:00`;
}
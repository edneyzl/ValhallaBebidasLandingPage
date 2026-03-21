/* ════════════════════════════════════════════════════════
   cadastro.js — Valhalla Bebidas
   Módulos: Nav Mobile | Redirecionamento | Máscaras |
            CEP | Validações | Toast | Submit | Utils
   Depende de: auth.js (isLogado)
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   NAV MOBILE — Dropdown
════════════════════════════════════════════════════════ */
const cadastroMenuBtn    = document.getElementById('cadastroMenuBtn');
const cadastroDropMobile = document.getElementById('cadastroDropMobile');

/* Abre / fecha ao clicar no hambúrguer */
cadastroMenuBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  cadastroDropMobile?.classList.toggle('open');
});

/* Fecha ao clicar fora */
document.addEventListener('click', (e) => {
  if (!cadastroDropMobile?.contains(e.target) && !cadastroMenuBtn?.contains(e.target)) {
    cadastroDropMobile?.classList.remove('open');
  }
});

/* Fecha ao clicar em qualquer item */
cadastroDropMobile?.querySelectorAll('.nav__dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    cadastroDropMobile.classList.remove('open');
  });
});

/* ════════════════════════════════════════════════════════
   REDIRECIONAMENTO — Usuário já logado
════════════════════════════════════════════════════════ */

/* Se já está logado não precisa de cadastro */
if (isLogado) {
  window.location.href = 'index.html';
}

/* ════════════════════════════════════════════════════════
   MÁSCARAS — Formatação automática dos campos
════════════════════════════════════════════════════════ */

/* ── Data: DD/MM/YYYY ── */
document.getElementById('dataNascimento')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
  if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
  e.target.value = v.slice(0, 10);
});

/* ── CPF: 000.000.000-00 | CNPJ: 00.000.000/0000-00 ── */
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

/* ── Telefone: (00) 00000-0000 ── */
document.getElementById('telefone')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 0)  v = '(' + v;
  if (v.length > 3)  v = v.slice(0, 3) + ') ' + v.slice(3);
  if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
  e.target.value = v.slice(0, 15);
});

/* ── CEP: 00000-000 ── */
document.getElementById('cep')?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  e.target.value = v.slice(0, 9);
});

/* ── Estado: UF maiúsculo ── */
document.getElementById('estado')?.addEventListener('input', (e) => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
});

/* ════════════════════════════════════════════════════════
   CEP — Busca automática via ViaCEP
════════════════════════════════════════════════════════ */
document.getElementById('cep')?.addEventListener('blur', async (e) => {
  const cep = e.target.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      mostrarErro('erroCep', 'CEP não encontrado.');
      return;
    }

    /* Preenche os campos automaticamente */
    document.getElementById('logradouro').value = data.logradouro || '';
    document.getElementById('bairro').value     = data.bairro     || '';
    document.getElementById('cidade').value     = data.localidade || '';
    document.getElementById('estado').value     = data.uf         || '';

    /* Foca no número após preencher */
    document.getElementById('numero')?.focus();
    limparErro('erroCep');

  } catch {
    mostrarErro('erroCep', 'Erro ao buscar CEP. Tente novamente.');
  }
});

/* ════════════════════════════════════════════════════════
   ERROS — Exibir e limpar mensagens
════════════════════════════════════════════════════════ */
function mostrarErro(id, mensagem) {
  const el = document.getElementById(id);
  if (el) el.textContent = mensagem;
}

function limparErro(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function limparTodosErros() {
  document.querySelectorAll('.cadastro__input-erro').forEach(el => {
    el.textContent = '';
  });
}

/* ════════════════════════════════════════════════════════
   VALIDAÇÕES — Todos os campos do formulário
════════════════════════════════════════════════════════ */
function calcularIdade(dataNasc) {
  const [dia, mes, ano] = dataNasc.split('/').map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

function validarFormulario(dados) {
  let valido = true;
  limparTodosErros();

  /* ── Nome ── */
  if (dados.nome.length < 3) {
    mostrarErro('erroNome', 'Nome deve ter pelo menos 3 caracteres.');
    valido = false;
  }

  /* ── Data de nascimento ── */
  const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regexData.test(dados.dataNascimento)) {
    mostrarErro('erroDataNascimento', 'Data inválida. Use o formato DD/MM/YYYY.');
    valido = false;
  } else if (calcularIdade(dados.dataNascimento) < 18) {
    mostrarErro('erroDataNascimento', 'Você deve ter pelo menos 18 anos.');
    valido = false;
  }

  /* ── Documento ── */
  const docLimpo = dados.documento.replace(/\D/g, '');
  if (docLimpo.length !== 11 && docLimpo.length !== 14) {
    mostrarErro('erroDocumento', 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos.');
    valido = false;
  }

  /* ── Telefone ── */
  const telLimpo = dados.telefone.replace(/\D/g, '');
  if (telLimpo.length < 10 || telLimpo.length > 11) {
    mostrarErro('erroTelefone', 'Telefone inválido.');
    valido = false;
  }

  /* ── Email ── */
  if (!dados.email.includes('@') || !dados.email.includes('.')) {
    mostrarErro('erroEmail', 'Digite um email válido.');
    valido = false;
  }

  /* ── Senha ── */
  if (dados.senha.length < 6) {
    mostrarErro('erroSenha', 'Senha deve ter pelo menos 6 caracteres.');
    valido = false;
  }

  /* ── Confirmar senha ── */
  if (dados.senha !== dados.confirmarSenha) {
    mostrarErro('erroConfirmarSenha', 'As senhas não conferem.');
    valido = false;
  }

  /* ── CEP ── */
  const cepLimpo = dados.cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) {
    mostrarErro('erroCep', 'CEP inválido.');
    valido = false;
  }

  /* ── Logradouro ── */
  if (!dados.logradouro.trim()) {
    mostrarErro('erroLogradouro', 'Informe o logradouro.');
    valido = false;
  }

  /* ── Número ── */
  if (!dados.numero.trim()) {
    mostrarErro('erroNumero', 'Informe o número.');
    valido = false;
  }

  /* ── Bairro ── */
  if (!dados.bairro.trim()) {
    mostrarErro('erroBairro', 'Informe o bairro.');
    valido = false;
  }

  /* ── Cidade ── */
  if (!dados.cidade.trim()) {
    mostrarErro('erroCidade', 'Informe a cidade.');
    valido = false;
  }

  /* ── Estado ── */
  if (dados.estado.length !== 2) {
    mostrarErro('erroEstado', 'Informe a UF. Ex: SP');
    valido = false;
  }

  return valido;
}

/* ════════════════════════════════════════════════════════
   TOAST — Feedback de sucesso
════════════════════════════════════════════════════════ */
function mostrarToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.classList.add('show');

  /* Remove a classe após a animação */
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

/* ════════════════════════════════════════════════════════
   SUBMIT — Envio do formulário
════════════════════════════════════════════════════════ */
const formCadastro = document.getElementById('formCadastro');

formCadastro?.addEventListener('submit', async (e) => {
  e.preventDefault();

  /* ── Coleta os dados ── */
  const dados = {
    nome:           document.getElementById('nome').value.trim(),
    dataNascimento: document.getElementById('dataNascimento').value.trim(),
    documento:      document.getElementById('documento').value.trim(),
    telefone:       document.getElementById('telefone').value.trim(),
    email:          document.getElementById('email').value.trim(),
    senha:          document.getElementById('senha').value,
    confirmarSenha: document.getElementById('confirmarSenha').value,
    logradouro:     document.getElementById('logradouro').value.trim(),
    cep:            document.getElementById('cep').value.trim(),
    numero:         document.getElementById('numero').value.trim(),
    complemento:    document.getElementById('complemento').value.trim(),
    bairro:         document.getElementById('bairro').value.trim(),
    cidade:         document.getElementById('cidade').value.trim(),
    estado:         document.getElementById('estado').value.trim(),
  };

  /* ── Valida antes de enviar ── */
  if (!validarFormulario(dados)) return;

  /* ── Monta o payload no formato do CriarClienteDto ── */
  const payload = {
    nome:           dados.nome,
    documento:      dados.documento.replace(/\D/g, ''),
    telefone:       dados.telefone.replace(/\D/g, ''),
    email:          dados.email,
    senha:          dados.senha,
    dataNascimento: converterData(dados.dataNascimento),
    endereco: {
      logradouro:  dados.logradouro,
      cep:         dados.cep.replace(/\D/g, ''),
      numero:      parseInt(dados.numero),
      complemento: dados.complemento,
      bairro:      dados.bairro,
      cidade:      dados.cidade,
      estado:      dados.estado,
    }
  };

  /* ════════════════════════════════════════════════════
     SIMULAÇÃO — remove quando a API estiver pronta
  ════════════════════════════════════════════════════ */
  console.log('Payload que será enviado para API:', payload);

  mostrarToast();

  setTimeout(() => {
    localStorage.setItem('logado', 'true');
    localStorage.setItem('nomeUser', dados.nome.split(' ')[0]);
    window.location.href = 'index.html';
  }, 2500);

  /* ════════════════════════════════════════════════════
     API — descomenta quando o backend estiver pronto
  ════════════════════════════════════════════════════ */
  /*
  try {
    const response = await fetch('https://localhost:7001/api/auth/cadastro', {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      body:        JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarErro('erroEmail', data.mensagem || 'Erro ao criar conta.');
      return;
    }

    mostrarToast();

    setTimeout(() => {
      localStorage.setItem('logado', 'true');
      localStorage.setItem('nomeUser', dados.nome.split(' ')[0]);
      window.location.href = 'index.html';
    }, 2500);

  } catch {
    mostrarErro('erroEmail', 'Erro de conexão. Tente novamente.');
  }
  */
});

/* ════════════════════════════════════════════════════════
   UTILS
════════════════════════════════════════════════════════ */

/* Converte DD/MM/YYYY para ISO 8601 — formato esperado pelo .NET */
function converterData(dataBR) {
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes}-${dia}T00:00:00`;
}
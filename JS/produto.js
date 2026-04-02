/* ════════════════════════════════════════════════════════
   produto.js — Valhalla Bebidas
   Módulos: URL Params | Carregar Produto | Quantidade | Adicionar
   Depende de: auth.js (isLogado) | cart.js (adicionarAoCarrinho)
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   MOCK — dados simulados
   Substitui por fetch GET /api/produtos/{id} quando API estiver pronta
════════════════════════════════════════════════════════ */
const produtosMock = [
    { id: '1',  nome: 'Brahma Duplo Malte 350ml', preco: 4.90,  categoria: 'Cervejas',      ean: '7891149107001', descricao: 'Cerveja premium com duplo malte, sabor encorpado e levemente adocicado. Ideal para o consumo gelado.',        estoque: 150, estoqueMin: 20, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '2',  nome: 'Heineken Long Neck 330ml', preco: 8.50,  categoria: 'Cervejas',      ean: '7891149107067', descricao: 'Cerveja de origem holandesa com sabor levemente amargo e refrescante. Produzida com lúpulo selecionado.',    estoque: 0,  estoqueMin: 15, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '3',  nome: 'Corona Extra 355ml',       preco: 9.90,  categoria: 'Cervejas',      ean: '7891149107002', descricao: 'Cerveja mexicana leve e refrescante. Perfeita para ser consumida com limão espremido.',                        estoque: 60,  estoqueMin: 10, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '4',  nome: 'Red Bull Energy 250ml',    preco: 12.90, categoria: 'Energéticos',   ean: '7891149107003', descricao: 'Energético premium com taurina, cafeína e vitaminas do complexo B. Estimula mente e corpo.',                   estoque: 200, estoqueMin: 30, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '5',  nome: 'Monster Energy 473ml',     preco: 10.90, categoria: 'Energéticos',   ean: '7891149107004', descricao: 'Energético com sabor marcante e longa duração. Contém cafeína, taurina e extrato de guaraná.',                estoque: 120, estoqueMin: 20, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '6',  nome: 'Coca-Cola 2L',             preco: 8.90,  categoria: 'Refrigerantes', ean: '7891149107005', descricao: 'O refrigerante mais famoso do mundo. Sabor único e inconfundível, perfeito para qualquer ocasião.',           estoque: 300, estoqueMin: 50, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '7',  nome: 'Pepsi Black 2L',           preco: 7.50,  categoria: 'Refrigerantes', ean: '7891149107006', descricao: 'Versão sem açúcar da Pepsi com sabor intenso e refrescante. Zero calorias.',                                 estoque: 180, estoqueMin: 30, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '8',  nome: 'Del Valle Uva 1L',         preco: 6.90,  categoria: 'Sucos',         ean: '7891149107008', descricao: 'Suco de uva Del Valle com polpa natural. Rico em antioxidantes e sabor intenso.',                             estoque: 90,  estoqueMin: 15, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '9',  nome: 'Minute Maid Laranja 1L',   preco: 7.20,  categoria: 'Sucos',         ean: '7891149107009', descricao: 'Suco de laranja com polpa selecionada. Fonte natural de vitamina C.',                                         estoque: 75,  estoqueMin: 15, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '10', nome: 'Crystal sem Gás 1,5L',     preco: 3.50,  categoria: 'Águas',         ean: '7891149107010', descricao: 'Água mineral natural sem gás, pura e cristalina. Fonte de hidratação essencial para o dia a dia.',            estoque: 500, estoqueMin: 80, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '11', nome: 'Schin Pilsen 473ml',        preco: 4.20,  categoria: 'Cervejas',      ean: '7891149107011', descricao: 'Cerveja Pilsen com sabor suave e refrescante. Alta qualidade com preço acessível.',                           estoque: 220, estoqueMin: 40, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '12', nome: 'Guaraná Antarctica 2L',     preco: 7.90,  categoria: 'Refrigerantes', ean: '7891149107012', descricao: 'O refrigerante mais brasileiro do Brasil. Sabor único de guaraná com a refrescância que você conhece.',       estoque: 260, estoqueMin: 40, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '13', nome: 'Vodka 70ml',                 preco: 10.90, categoria: 'Destilados',    ean: '7891149107013', descricao: 'Vodka com sabor marcante e refrescante. Ideal para ocasiões especiais e consumo imediato.',                           estoque: 100, estoqueMin: 20, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '14', nome: 'Whisky 70ml',                 preco: 10.90, categoria: 'Destilados',    ean: '7891149107014', descricao: 'Whisky com sabor marcante e refrescante. Ideal para ocasiões especiais e consumo imediato.',                           estoque: 100, estoqueMin: 20, imagem: '', dataCadastro: 'Jan 2026' },
    { id: '15', nome: 'Tequila 70ml',                 preco: 10.90, categoria: 'Destilados',    ean: '7891149107015', descricao: 'Tequila com sabor marcante e refrescante. Ideal para ocasiões especiais e consumo imediato.',                           estoque: 100, estoqueMin: 20, imagem: '', dataCadastro: 'Jan 2026' },
  ];
  
  /* ════════════════════════════════════════════════════════
     ELEMENTOS
  ════════════════════════════════════════════════════════ */
  const produtoImg        = document.getElementById('produtoImg');
  const produtoCategoria  = document.getElementById('produtoCategoria');
  const produtoNome       = document.getElementById('produtoNome');
  const produtoEan        = document.getElementById('produtoEan');
  const produtoDescricao  = document.getElementById('produtoDescricao');
  const produtoPreco      = document.getElementById('produtoPreco');
  const produtoEstoque    = document.getElementById('produtoEstoque');
  const btnAdicionar      = document.getElementById('btnAdicionar');
  const qtyValor          = document.getElementById('qtyValor');
  const qtyMenos          = document.getElementById('qtyMenos');
  const qtyMais           = document.getElementById('qtyMais');
  const detalheCategoria  = document.getElementById('detalheCategoria');
  const detalheEan        = document.getElementById('detalheEan');
  const detalheEstoqueMin = document.getElementById('detalheEstoqueMin');
  const detalheData       = document.getElementById('detalheData');
  
  /* ════════════════════════════════════════════════════════
     URL PARAMS — pega o id do produto
  ════════════════════════════════════════════════════════ */
  const params    = new URLSearchParams(window.location.search);
  const produtoId = params.get('id');
  
  /* ════════════════════════════════════════════════════════
     QUANTIDADE — controle local
  ════════════════════════════════════════════════════════ */
  let quantidade = 1;
  
  qtyMenos?.addEventListener('click', () => {
    if (quantidade > 1) {
      quantidade--;
      qtyValor.textContent = quantidade;
    }
  });
  
  qtyMais?.addEventListener('click', () => {
    quantidade++;
    qtyValor.textContent = quantidade;
  });
  
  /* ════════════════════════════════════════════════════════
     CARREGAR PRODUTO — preenche o layout
  ════════════════════════════════════════════════════════ */
  function carregarProduto(produto) {
    /* Título da página */
    document.title = `${produto.nome} - Valhalla Bebidas`;
  
    /* Imagem */
    if (produto.imagem) {
      produtoImg.innerHTML = `<img src="${produto.imagem}" alt="${produto.nome}" />`;
    }
  
    /* Textos */
    produtoCategoria.textContent  = produto.categoria;
    produtoNome.textContent       = produto.nome;
    produtoEan.textContent        = `EAN: ${produto.ean}`;
    produtoDescricao.textContent  = produto.descricao;
    produtoPreco.textContent      = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
  
    /* Estoque */
    const temEstoque = produto.estoque > 0;
    produtoEstoque.innerHTML = `
      <span class="produto__estoque-dot"></span>
      ${temEstoque ? `Em estoque (${produto.estoque} un.)` : 'Sem estoque'}
    `;
    if (!temEstoque) produtoEstoque.classList.add('produto__estoque--esgotado');
  
    /* Detalhes */
    detalheCategoria.textContent  = produto.categoria;
    detalheEan.textContent        = produto.ean;
    detalheEstoqueMin.textContent = `${produto.estoqueMin} unidades`;
    detalheData.textContent       = produto.dataCadastro;
  
    /* Botão — estado logado / visitante */
    if (!isLogado) {
      btnAdicionar.textContent = 'Faça login para comprar';
      btnAdicionar.disabled    = true;
      return;
    }
  
    if (!temEstoque) {
      btnAdicionar.textContent = 'Sem estoque';
      btnAdicionar.disabled    = true;
      return;
    }
  
    /* Adiciona ao carrinho com quantidade selecionada */
    btnAdicionar.addEventListener('click', () => {
      for (let i = 0; i < quantidade; i++) {
        adicionarAoCarrinho({
          id:     produto.id,
          nome:   produto.nome,
          preco:  produto.preco,
          imagem: produto.imagem,
        });
      }
    });
  }
  
  /* ════════════════════════════════════════════════════════
     INIT — carrega o produto pelo id da URL
  ════════════════════════════════════════════════════════ */
  if (!produtoId) {
    window.location.href = 'catalogo.html';
  } else {
    const produto = produtosMock.find(p => p.id === produtoId);
  
    if (!produto) {
      window.location.href = 'catalogo.html';
    } else {
      carregarProduto(produto);
    }
  }
  
  /* ════════════════════════════════════════════════════════
     API — descomenta quando o backend estiver pronto
  ════════════════════════════════════════════════════════ */
  /*
  async function carregarProdutoApi() {
    try {
      const response = await fetch(`https://localhost:7001/api/produtos/${produtoId}`, {
        credentials: 'include'
      });
  
      if (!response.ok) {
        window.location.href = 'catalogo.html';
        return;
      }
  
      const produto = await response.json();
      carregarProduto(produto);
  
    } catch {
      window.location.href = 'catalogo.html';
    }
  }
  
  if (!produtoId) {
    window.location.href = 'catalogo.html';
  } else {
    carregarProdutoApi();
  }
  */
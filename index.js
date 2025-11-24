const disciplinasIDs = [
  'icc', 'calculoI', 'gaal', 'empreendedorismo',
  'algProgramacao', 'calculoVV', 'algLinearComputacional', 'sistemasDigitais', 'matDiscreta',
  'aeds', 'gerenciaProjetos', 'metodologiaCient', 'arquiteturaI', 'introducaoTeoriaGrafos',
  'tecnicasBuscaOrdenacao', 'uceI', 'probEstatistica', 'arquiteturaII', 'poo',
  'organizacaoSistemasArquivos', 'pesquisaOperacional', 'engenhariaSoftware', 'sistemasOperacionais', 'desenvolvimentoWeb', 'projetoAnaliseAlg',
  'bancoDados', 'uceII', 'paradigmasProgramacao', 'algoritmosGrafos', 'complexidadeProblemasAproximacao',
  'gerenciamentoAplicacoesBD', 'computacaoGrafica', 'sistemasDistribuidos', 'redesComputadores', 'linguagensFormaisAutomatos',
  'introducaoIA', 'informaticaEticaSociedade', 'compiladores', 'optativaI',
  'projetoEstagioConclusaoCurso', 'optativaII', 'uceIII',
  'administracao', 'optativaIII',
];

const regras = [
  { requisitos: [0], libera: 4 }, { requisitos: [1], libera: 5 }, { requisitos: [2], libera: 6 },
  { requisitos: [4], libera: 9 }, { requisitos: [4], libera: 20 }, { requisitos: [5], libera: 16 },
  { requisitos: [6, 9], libera: 31 }, { requisitos: [7], libera: 12 }, { requisitos: [8], libera: 13 },
  { requisitos: [8, 14], libera: 24 }, { requisitos: [8], libera: 34 }, { requisitos: [9], libera: 14 },
  { requisitos: [9], libera: 25 }, { requisitos: [9], libera: 27 }, { requisitos: [9], libera: 35 },
  { requisitos: [9, 17, 34], libera: 37 }, { requisitos: [9], libera: 18 }, { requisitos: [9], libera: 19 },
  { requisitos: [12], libera: 17 }, { requisitos: [12], libera: 22 }, { requisitos: [13, 24], libera: 28 },
  { requisitos: [18], libera: 21 }, { requisitos: [18], libera: 23 }, { requisitos: [19, 25], libera: 30 },
  { requisitos: [21, 23], libera: 26 }, { requisitos: [22], libera: 32 }, { requisitos: [24], libera: 29 },
];

const semRequisitos = [0, 1, 2, 3, 7, 8, 10, 11, 15, 33, 36, 38, 39, 40, 41, 42, 43];

// Usaremos um Array de elementos DOM (disciplinas) e um Set para o estado
let disciplinasDOM = [];
let selecionadas = new Set();

const localStorageKey = 'disciplinas_selecionadas';

// Carregar estado do Local Storage
function carregarEstado() {
  const saved = localStorage.getItem(localStorageKey);
  if (saved) {
    selecionadas = new Set(JSON.parse(saved));
  }
}

// Salvar estado no Local Storage
function salvarEstado() {
  localStorage.setItem(localStorageKey, JSON.stringify(Array.from(selecionadas)));
}

// Lógica principal: calcula o estado atual de TODAS as disciplinas
function atualizarEstado() {
  const novasLiberadas = new Set();

  // 1. Disciplinas sem pré-requisitos (liberadas se não selecionadas)
  for (let idx of semRequisitos) {
    if (!selecionadas.has(idx)) {
      novasLiberadas.add(idx);
    }
  }

  // 2. Disciplinas com pré-requisitos (liberadas se requisitos cumpridos e não selecionadas)
  for (let regra of regras) {
    const requisitosCumpridos = regra.requisitos.every(r => selecionadas.has(r));
    const aindaNaoSelecionada = !selecionadas.has(regra.libera);

    if (requisitosCumpridos && aindaNaoSelecionada) {
      novasLiberadas.add(regra.libera);
    }
  }
  
  // 3. Aplicar classes CSS e gerenciar classes no DOM
  disciplinasDOM.forEach((disciplina, i) => {
    // Remove todas as classes de estado primeiro
    disciplina.classList.remove('selecionada', 'liberada', 'faltando');

    if (selecionadas.has(i)) {
      disciplina.classList.add('selecionada');
    } else if (novasLiberadas.has(i)) {
      disciplina.classList.add('liberada');
    }
    // Disciplinas sem classe 'selecionada' ou 'liberada' são implicitamente bloqueadas
  });

  return novasLiberadas;
}

// Manipulador de clique
function toggleConcluida(idx) {
  // Verifica se a disciplina está liberada ou já selecionada
  const isLiberada = disciplinasDOM[idx].classList.contains('liberada');
  const isSelecionada = selecionadas.has(idx);

  if (isLiberada || isSelecionada) {
    if (isSelecionada) {
      selecionadas.delete(idx);
    } else {
      selecionadas.add(idx);
    }
    salvarEstado();
    executarAtualizacao();
  }
}

// Encontra e aplica a classe 'faltando' nos pré-requisitos não cumpridos
function encontraDisciplinasAnteriores() {
  disciplinasDOM.forEach((disciplina, i) => {
    disciplina.addEventListener('mouseenter', () => {
      // Se a disciplina estiver concluída ou liberada, não mostramos os requisitos
      if (selecionadas.has(i) || disciplina.classList.contains('liberada')) return;

      // Encontra a regra onde esta disciplina é liberada
      const regraLigada = regras.find(({ libera }) => libera === i);
      if (!regraLigada) return;

      const requisitosNaoCumpridos = regraLigada.requisitos.filter(index => !selecionadas.has(index));

      // Aplica a classe 'faltando' apenas aos requisitos que faltam
      requisitosNaoCumpridos.forEach((index) => {
        disciplinasDOM[index].classList.add('faltando');
      });
    });

    disciplina.addEventListener('mouseleave', () => {
      // Remove a classe 'faltando' de todas as disciplinas ao sair
      disciplinasDOM.forEach(d => d.classList.remove('faltando'));
    });
  });
}

// Função para renderizar o grafo
function gerarGrafo() {
  const nodes = disciplinasDOM.map((disciplina, i) => {
    let color = '#f8d7e9'; // Cor padrão (Bloqueada)
    let borderColor = '#c08497';
    let fontColor = '#5b2a5a';
    
    if (disciplina.classList.contains('selecionada')) {
      color = '#c38d9e'; // Selecionada
      borderColor = '#7a3451';
      fontColor = '#fff';
    } else if (disciplina.classList.contains('liberada')) {
      color = '#f7e8f0'; // Liberada
      borderColor = '#c48db5';
      fontColor = '#7a3a70';
    } else if (disciplina.classList.contains('faltando')) {
      color = '#f4c4cf'; // Faltando
      borderColor = '#ab3e5e';
    }

    return {
      id: i,
      label: disciplina.querySelector('p')?.textContent || disciplina.id,
      color: {
        background: color,
        border: borderColor
      },
      shape: 'box', // Usando box para melhor visualização do texto
      font: { color: fontColor, size: 12, face: 'Open Sans' }
    };
  });

  const edges = regras.flatMap(({ requisitos, libera }) => {
    return requisitos.map(req => ({
      from: req,
      to: libera,
      arrows: 'to',
      color: '#7a3451',
      width: 2
    }));
  });

  const container = document.getElementById('grafo');
  if (!container) return;
  
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  const options = {
    nodes: { borderWidth: 2, shapeProperties: { borderRadius: 15 } },
    edges: {
      smooth: { type: 'curvedCW', roundness: 0.1 },
      color: { highlight: '#ab3e5e' }
    },
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'LR',
        sortMethod: 'directed',
        levelSeparation: 250
      }
    },
    physics: { enabled: false }
  };

  new vis.Network(container, data, options);
}

// Agrupador de execução
function executarAtualizacao() {
  atualizarEstado();
  gerarGrafo();
}

// ----------------------------------------------------------------------
// Inicialização
// ----------------------------------------------------------------------
window.onload = () => {
  // 1. Mapear e preparar os elementos DOM
  disciplinasDOM = disciplinasIDs.map(id => document.getElementById(id)).filter(el => el != null);
  
  // 2. Carregar estado salvo e aplicar estilos iniciais
  carregarEstado();
  executarAtualizacao();
  
  // 3. Adicionar Listeners de clique
  disciplinasDOM.forEach((disciplina, i) => {
    disciplina.addEventListener('click', () => toggleConcluida(i));
  });

  // 4. Adicionar Listeners de mouseover/mouseout
  encontraDisciplinasAnteriores();
};
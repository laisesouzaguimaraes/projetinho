document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DADOS (Baseado em disciplinas.ts)
    // ----------------------------------------------------------------------
    const disciplinasPorPeriodo = {
        1: [
            { id: 0, nome: 'Introdução à Computação', periodo: 1 },
            { id: 1, nome: 'Cálculo I', periodo: 1 },
            { id: 2, nome: 'Geometria Analítica e Álgebra Linear', periodo: 1 },
            { id: 3, nome: 'Empreendedorismo', periodo: 1 },
        ],
        2: [
            { id: 4, nome: 'Algoritmos e Programação', periodo: 2 },
            { id: 5, nome: 'Cálculo II', periodo: 2 },
            { id: 6, nome: 'Álgebra Linear Computacional', periodo: 2 },
            { id: 7, nome: 'Sistemas Digitais', periodo: 2 },
            { id: 8, nome: 'Matemática Discreta', periodo: 2 },
        ],
        3: [
            { id: 9, nome: 'Algoritmos e Estruturas de Dados', periodo: 3 },
            { id: 10, nome: 'Gerência de Projetos', periodo: 3 },
            { id: 11, nome: 'Metodologia Científica', periodo: 3 },
            { id: 12, nome: 'Arquitetura I', periodo: 3 },
            { id: 13, nome: 'Introdução à Teoria de Grafos', periodo: 3 },
        ],
        4: [
            { id: 14, nome: 'Técnicas de Busca e Ordenação', periodo: 4 },
            { id: 15, nome: 'UCE I', periodo: 4 },
            { id: 16, nome: 'Probabilidade e Estatística', periodo: 4 },
            { id: 17, nome: 'Arquitetura II', periodo: 4 },
            { id: 18, nome: 'Programação Orientada a Objetos', periodo: 4 },
        ],
        5: [
            { id: 19, nome: 'Organização de Sistemas de Arquivos', periodo: 5 },
            { id: 20, nome: 'Pesquisa Operacional', periodo: 5 },
            { id: 21, nome: 'Engenharia de Software', periodo: 5 },
            { id: 22, nome: 'Sistemas Operacionais', periodo: 5 },
            { id: 23, nome: 'Desenvolvimento Web', periodo: 5 },
            { id: 24, nome: 'Projeto e Análise de Algoritmos', periodo: 5 },
        ],
        6: [
            { id: 25, nome: 'Banco de Dados', periodo: 6 },
            { id: 26, nome: 'UCE II', periodo: 6 },
            { id: 27, nome: 'Paradigmas de Programação', periodo: 6 },
            { id: 28, nome: 'Algoritmos em Grafos', periodo: 6 },
            { id: 29, nome: 'Complexidade de Problemas e Aproximação', periodo: 6 },
        ],
        7: [
            { id: 30, nome: 'Gerenciamento de Aplicações em BD', periodo: 7 },
            { id: 31, nome: 'Computação Gráfica', periodo: 7 },
            { id: 32, nome: 'Sistemas Distribuídos', periodo: 7 },
            { id: 33, nome: 'Redes de Computadores', periodo: 7 },
            { id: 34, nome: 'Linguagens Formais e Autômatos', periodo: 7 },
        ],
        8: [
            { id: 35, nome: 'Introdução à Inteligência Artificial', periodo: 8 },
            { id: 36, nome: 'Informática, Ética e Sociedade', periodo: 8 },
            { id: 37, nome: 'Compiladores', periodo: 8 },
            { id: 38, nome: 'Optativa I', periodo: 8 },
            { id: 39, nome: 'Projeto, Estágio e Conclusão de Curso', periodo: 8 },
            { id: 40, nome: 'Optativa II', periodo: 8 },
            { id: 41, nome: 'UCE III', periodo: 8 },
            { id: 42, nome: 'Administração', periodo: 8 },
            { id: 43, nome: 'Optativa III', periodo: 8 },
        ],
    };

    const regras = [
        { requisitos: [0], libera: 4 },
        { requisitos: [1], libera: 5 },
        { requisitos: [2], libera: 6 },
        { requisitos: [4], libera: 9 },
        { requisitos: [4], libera: 20 },
        { requisitos: [5], libera: 16 },
        { requisitos: [6, 9], libera: 31 },
        { requisitos: [7], libera: 12 },
        { requisitos: [8], libera: 13 },
        { requisitos: [8, 14], libera: 24 },
        { requisitos: [8], libera: 34 },
        { requisitos: [9], libera: 10 },
        { requisitos: [9], libera: 14 },
        { requisitos: [9], libera: 18 },
        { requisitos: [10], libera: 21 },
        { requisitos: [11], libera: 27 },
        { requisitos: [12], libera: 17 },
        { requisitos: [13], libera: 28 },
        { requisitos: [14], libera: 25 },
        { requisitos: [15], libera: 26 },
        { requisitos: [16], libera: 29 },
        { requisitos: [17], libera: 32 },
        { requisitos: [18], libera: 19 },
        { requisitos: [20], libera: 22 },
        { requisitos: [21], libera: 23 },
        { requisitos: [25], libera: 30 },
        { requisitos: [28], libera: 33 },
    ];

    const sem_requisitos = [0, 1, 2, 3, 7, 8, 10, 11, 15, 19, 26, 35, 36, 37, 38, 40, 42];
    const totalDisciplinas = Object.values(disciplinasPorPeriodo).flat().length;

    // ----------------------------------------------------------------------
    // 2. ESTADO E PERSISTÊNCIA (Baseado em Home.tsx)
    // ----------------------------------------------------------------------
    let selecionadas = new Set();
    let liberadas = new Set();
    const TABELA_PERIODOS_CONTAINER = document.getElementById('tabela-periodos-container');
    const ESTATISTICAS_CONTAINER = document.getElementById('estatisticas');
    const LIMPAR_TODAS_BTN = document.getElementById('limparTodasBtn');

    // Carregar estado do localStorage
    function carregarEstado() {
        const saved = localStorage.getItem('disciplinas_selecionadas');
        if (saved) {
            selecionadas = new Set(JSON.parse(saved));
        }
    }

    // Salvar estado no localStorage
    function salvarEstado() {
        localStorage.setItem('disciplinas_selecionadas', JSON.stringify(Array.from(selecionadas)));
    }

    // ----------------------------------------------------------------------
    // 3. LÓGICA DE PRÉ-REQUISITOS (Baseado em Home.tsx)
    // ----------------------------------------------------------------------
    function atualizaLiberadas() {
        const novasLiberadas = new Set();
        // 1. Adicionar disciplinas sem pré-requisitos que não foram concluídas
        for (let idx of sem_requisitos) {
            if (!selecionadas.has(idx)) novasLiberadas.add(idx);
        }
        // 2. Adicionar disciplinas liberadas por regras, se todos os requisitos foram atendidos e não foram concluídas
        for (let regra of regras) {
            // Verifica se TODOS os requisitos foram concluídos
            const requisitosAtendidos = regra.requisitos.every(r => selecionadas.has(r));
            // Verifica se a disciplina liberada ainda não foi concluída
            if (requisitosAtendidos && !selecionadas.has(regra.libera)) {
                novasLiberadas.add(regra.libera);
            }
        }
        liberadas = novasLiberadas;
    }

    // ----------------------------------------------------------------------
    // 4. HANDLERS E VISUALIZAÇÃO
    // ----------------------------------------------------------------------
    function toggleConcluida(idx) {
        // Só permite marcar/desmarcar se a disciplina está concluída OU se está liberada
        const podeClicar = selecionadas.has(idx) || liberadas.has(idx);

        if (podeClicar) {
            if (selecionadas.has(idx)) {
                selecionadas.delete(idx);
            } else {
                selecionadas.add(idx);
            }
            salvarEstado();
            renderizarTudo();
        }
    }

    function limparTodas() {
        selecionadas = new Set();
        salvarEstado();
        renderizarTudo();
    }

    function getStatusDisciplina(idx) {
        if (selecionadas.has(idx)) return 'concluida';
        if (liberadas.has(idx)) return 'liberada';
        return 'bloqueada';
    }

    function getIcone(status) {
        switch (status) {
            case 'concluida': return '<i class="fa-solid fa-check-circle"></i>';
            case 'liberada': return '<i class="fa-regular fa-circle"></i>';
            default: return '<i class="fa-solid fa-lock"></i>';
        }
    }

    function renderizarEstatisticas() {
        const html = `
            <div class="stat-box concluidas">
                <div class="stat-label">Concluídas</div>
                <div class="stat-value">${selecionadas.size}</div>
            </div>
            <div class="stat-box liberadas">
                <div class="stat-label">Liberadas</div>
                <div class="stat-value">${liberadas.size}</div>
            </div>
            <div class="stat-box total">
                <div class="stat-label">Total</div>
                <div class="stat-value">${totalDisciplinas}</div>
            </div>
        `;
        ESTATISTICAS_CONTAINER.innerHTML = html;
    }

    function renderizarTabelaPeriodos() {
        let htmlTabela = '';
        
        Object.entries(disciplinasPorPeriodo).forEach(([periodo, disciplinas]) => {
            let tabelaDisciplinas = '';

            disciplinas.forEach((disc) => {
                const status = getStatusDisciplina(disc.id);
                const podeClicar = status !== 'bloqueada';
                const cursorClass = podeClicar ? 'cursor-pointer' : '';

                const statusCellClass = `status-${status}`;
                const nomeCellClass = `disciplina-nome-${status}`;
                const nomeDecoracao = status === 'concluida' ? 'text-decoration: line-through;' : '';

                tabelaDisciplinas += `
                    <tr 
                        class="disciplina-item ${cursorClass}"
                        data-id="${disc.id}" 
                        data-pode-clicar="${podeClicar}"
                        onclick="window.toggleConcluida(${disc.id})"
                    >
                        <td class="status-cell ${statusCellClass}">
                            ${getIcone(status)}
                        </td>
                        <td class="${nomeCellClass}" style="${nomeDecoracao}">
                            ${disc.nome}
                        </td>
                    </tr>
                `;
            });

            htmlTabela += `
                <div class="periodo-box">
                    <h3>${periodo}º Período</h3>
                    <table class="disciplina-tabela">
                        <thead>
                            <tr>
                                <th class="status-cell">Status</th>
                                <th>Disciplina</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tabelaDisciplinas}
                        </tbody>
                    </table>
                </div>
            `;
        });
        
        TABELA_PERIODOS_CONTAINER.innerHTML = htmlTabela;

        // Adicionar eventos de clique globalmente
        window.toggleConcluida = toggleConcluida;
    }

    function renderizarTudo() {
        atualizaLiberadas();
        renderizarEstatisticas();
        renderizarTabelaPeriodos();
    }
    
    // ----------------------------------------------------------------------
    // 5. INICIALIZAÇÃO
    // ----------------------------------------------------------------------
    carregarEstado();
    renderizarTudo();
    LIMPAR_TODAS_BTN.addEventListener('click', limparTodas);
});
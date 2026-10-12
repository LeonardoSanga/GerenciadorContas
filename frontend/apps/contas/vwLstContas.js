document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('contasListagem');
    var alertBox = document.getElementById('contasAlert');
    
    if (!listagem) {
        return;
    }

    var servidor = listagem.dataset.servidor;

    configurarOperacoesContas(alertBox);
    carregarContas(servidor, alertBox);
});

async function carregarContas(servidor, alertBox) {
    try {
        if (!servidor) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        var response = await fetch(servidor + '/getAllContas');

        if (!response.ok) {
            throw new Error('Nao foi possivel carregar a lista de contas.');
        }

        var data = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        inicializarTabelaContas(data.registro);
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar contas.');
        inicializarTabelaContas([]);
    }
}

function inicializarTabelaContas(contas) {
    new DataTable('#tblContas', {
        data: contas,
        columns: [
            { data: 'contapagarid', defaultContent: '' },
            { data: 'descricao', defaultContent: '' },
            {
                data: 'valor',
                defaultContent: '',
                render: function(data) {
                    if (data === null || data === undefined || data === '') {
                        return '';
                    }
                    return Number(data).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });
                }
            },
            {
                data: 'datavencimento',
                defaultContent: '',
                render: function(data) {
                    if (!data) {
                        return '';
                    }
                    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
                }
            },
            {
                data: 'datapagamento',
                defaultContent: '',
                render: function(data) {
                    if (!data) {
                        return '';
                    }
                    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
                }
            },
            {
                data: 'pago',
                defaultContent: '',
                render: function(data) {
                    return data === true ? '<i class="bi bi-hand-thumbs-up-fill text-success"></i>' : '<i class="bi bi-hand-thumbs-down-fill text-danger"></i>';
                }
            },
            { data: 'nome', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }
                    var contapagarId = escaparHtml(row.contapagarid || '');
                    return [
                    '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes da conta">',
                    '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-contapagarid="' + contapagarId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                    '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-contapagarid="' + contapagarId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                    '<button class="btn btn-outline-danger" type="button" data-action="remover" data-contapagarid="' + contapagarId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                    '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhuma conta cadastrado.',
            info: 'Mostrando _START_ ate _END_ de _TOTAL_ registros',
            infoEmpty: 'Mostrando 0 ate 0 de 0 registros',
            infoFiltered: '(filtrado de _MAX_ registros no total)',
            lengthMenu: 'Mostrar _MENU_ registros',
            loadingRecords: 'Carregando...',
            processing: 'Processando...',
            search: 'Pesquisar:',
            zeroRecords: 'Nenhum registro encontrado',
            paginate: {
                first: 'Primeiro',
                last: 'Ultimo',
                next: 'Proximo',
                previous: 'Anterior'
            }
        }
    });
}

function configurarOperacoesContas(alertBox) {
    var tabela = document.getElementById('tblContas');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-contapagarid]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var contapagarId = botao.dataset.contapagarid;

        if (action === 'visualizar') {
            window.location.href = '/contas/form?oper=Re&contapagarId=' + encodeURIComponent(contapagarId); 
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/contas/form?oper=Up&contapagarId=' + encodeURIComponent(contapagarId);
            return;
        }


        if (action === 'remover') {
            if (confirm('Confirma a remoção da conta ' + contapagarId + '?')) {
                window.location.href = '/contas/form?oper=De&contapagarId=' + encodeURIComponent(contapagarId);
            }
        }

    });
}

function exibirAviso(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-danger');
    alertBox.classList.add('alert-info');
    alertBox.classList.remove('d-none');
}

function escaparHtml(valor) {
    return String(valor).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function exibirErro(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }
    
    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-info');
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}

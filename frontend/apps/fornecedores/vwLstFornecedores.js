document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('fornecedoresListagem');
    var alertBox = document.getElementById('fornecedoresAlert');
    
    if (!listagem) {
        return;
    }

    var servidor = listagem.dataset.servidor;

    configurarOperacoesFornecedores(alertBox);
    carregarFornecedores(servidor, alertBox);
});

async function carregarFornecedores(servidor, alertBox) {
    try {
        if (!servidor) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidor + '/getAllFornecedores');

        if (!response.ok) {
            throw new Error('Nao foi possivel carregar a lista de fornecedores.');
        }

        var data = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta invalida do servidor backend.');
        }

        inicializarTabelaFornecedores(data.registro);
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar fornecedores.');
        inicializarTabelaFornecedores([]);
    }
}

function inicializarTabelaFornecedores(fornecedores) {
    new DataTable('#tblFornecedores', {
        data: fornecedores,
        columns: [
            { data: 'fornecedorid', defaultContent: '' },
            { data: 'nome', defaultContent: '' },
            {
                data: 'cnpj',
                defaultContent: '',
                render: function(data, type, row) {
                    if (!data) {
                        return '';
                    }

                    if (type !== 'display') {
                        return data;
                    }

                    var cnpj = String(data).replace(/\D/g, '');

                    if (cnpj.length !== 14) {
                        return escaparHtml(data);
                    }

                    return cnpj.replace(
                        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                        '$1.$2.$3/$4-$5'
                    );
                }
            },
            { data: 'email', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }
                    var fornecedorId = escaparHtml(row.fornecedorid || '');
                    return [
                    '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do fornecedor">',
                    '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-fornecedorid="' + fornecedorId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                    '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-fornecedorid="' + fornecedorId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                    '<button class="btn btn-outline-danger" type="button" data-action="remover" data-fornecedorid="' + fornecedorId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                    '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhum fornecedor cadastrado.',
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

function configurarOperacoesFornecedores(alertBox) {
    var tabela = document.getElementById('tblFornecedores');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-fornecedorid]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var fornecedorId = botao.dataset.fornecedorid;

        if (action === 'visualizar') {
            window.location.href = '/fornecedores/form?oper=Re&fornecedorId=' + encodeURIComponent(fornecedorId); 
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/fornecedores/form?oper=Up&fornecedorId=' + encodeURIComponent(fornecedorId); 
            return;
        }


        if (action === 'remover') {
            if (confirm('Confirma a remocao do fornecedor ' + fornecedorId + '?')) {
                window.location.href = '/fornecedores/form?oper=De&fornecedorId=' + encodeURIComponent(fornecedorId);
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

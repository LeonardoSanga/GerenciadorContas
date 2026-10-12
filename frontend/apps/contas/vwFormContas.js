document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmContas');

    if (!form) {
        return;
    }

    var oper = form.dataset.oper;
    var servidor = form.dataset.servidor;
    var btnInserir = document.getElementById('btnInserirConta');
    var btnAtualizar = document.getElementById('btnAtualizarConta');

    inicializarSelectFornecedores();

    if (oper === 'Cr') {
        dw3OcultarBotao('btnAtualizarConta'); 
        dw3OcultarBotao('btnRemoverConta');
        carregarFornecedoresToContas(servidor);
    }

    if (oper === 'Re') { 
        dw3OcultarBotao('btnInserirConta');
        dw3OcultarBotao('btnAtualizarConta');
        dw3OcultarBotao('btnRemoverConta');
        vwGetContaByID();
    }

    if (oper === 'Up') {
        dw3OcultarBotao('btnInserirConta');
        dw3OcultarBotao('btnRemoverConta');
        vwGetContaByID();
        btnAtualizar.disabled = !(vwGetContaByID());
        btnAtualizar.addEventListener('click', function() {
            vwUpdateConta();
        });
    }

    if (oper === 'De') { 
        dw3OcultarBotao('btnInserirConta');
        dw3OcultarBotao('btnAtualizarConta');
        var btnRemover = document.getElementById('btnRemoverConta'); 
        vwGetContaByID();
        btnRemover.disabled = !(vwGetContaByID());
        btnRemover.addEventListener('click', function() {
            vwDeleteConta();
        });
    }


    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertConta();
        });
    }
});

// Aqui é inicializado o componente Select2.js em branco
function inicializarSelectFornecedores() {
    $('#fornecedorid').select2({
        theme: 'bootstrap-5',
        placeholder: 'Selecione um fornecedor',
        width: '100%'
    });
}

// Aqui é preenchido o componente Select2 com os fornecedores disponíveis
async function carregarFornecedoresToContas(servidor) {
    try {
        if (!servidor) {
            throw new Error('Endereço do servidor backend nao configurado.');
        }

        var response = await fetch(servidor + '/getFornecedoresToContas', {
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possivel carregar as contas.');
        }

        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faca login novamente.');
        }
        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta invalida do servidor backend.');
        }

        preencherSelectFornecedores(data.registro);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar fornecedores.');
        return false; // opcional, mas deixa explícito o caminho de falha
    }
}

function preencherSelectFornecedores(fornecedores) {
    var fornecedorSelect = document.getElementById('fornecedorid');

    if (!fornecedorSelect) {
        return;
    }

    fornecedorSelect.innerHTML = '<option value="">Selecione um fornecedor</option>';
    fornecedores.forEach(function(fornecedor) {
        var option = document.createElement('option');
        option.value = fornecedor.fornecedorid;
        option.textContent = fornecedor.nome;
        fornecedorSelect.appendChild(option);
    });

    $('#fornecedorid').trigger('change');
}

async function vwGetContaByID() {
  var form = document.getElementById('frmContas');

  try {
    var parametros = new URLSearchParams(window.location.search);
    var contapagarId = parametros.get('contapagarId');
    var servidor = form.dataset.servidor;

    if (!contapagarId || !/^\d+$/.test(contapagarId) || Number(contapagarId) <= 0) {
      throw new Error('ID da conta inválido.');
    }

    if (!servidor) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidor + '/getContaByID/' + encodeURIComponent(contapagarId), {
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      })
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar a conta.');
    }

    var data = await response.json();

    if (data.auth === false) {
      throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
    }

    if (data.status !== 'ok') {
      throw new Error('Resposta inválida do servidor backend.');
    }

    var conta = Array.isArray(data.registro) ? data.registro[0] : data.registro;

    if (!conta) {
      throw new Error('Conta não encontrada.');
    }

    document.getElementById('contapagarid').value = conta.contapagarid;
    document.getElementById('descricao').value = conta.descricao ?? '';
    document.getElementById('valor').value = conta.valor ?? '';
    document.getElementById('datavencimento').value = conta.datavencimento ? conta.datavencimento.slice(0, 10) : '';
    document.getElementById('datapagamento').value = conta.datapagamento ? conta.datapagamento.slice(0, 10) : '';
    document.getElementById('pago').checked = conta.pago === true;
    document.getElementById('deleted').value = String(conta.deleted === true);

    if (!(await carregarFornecedoresToContas(servidor))) {
      return false;
    }
    $('#fornecedorid').val(conta.fornecedorid).trigger('change');
    return true;
  } catch (error) {
    alert(error.message || 'Erro ao carregar conta.');
    return false;
  }
}

async function vwInsertConta() {
    var form = document.getElementById('frmContas');
    var btnInserir = document.getElementById('btnInserirConta');

    try {
        if (!form.reportValidity()) {
            return;
        }

        var servidor = form.dataset.servidor;
        if (!servidor) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        if (btnInserir) {
            btnInserir.disabled = true;
        }

        var response = await fetch(servidor + '/insertConta', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({'content-type': 'application/json'}),
            body: JSON.stringify(montarContaDoFormulario())
        });

        if (!response.ok) {
            throw new Error('Nao foi possível inserir a conta.');
        }

        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faça login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir a conta.');
        }

        window.location.href = '/contas';
    } catch (error) {
        alert(error.message || 'Erro ao inserir conta.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwUpdateConta() {
    var form = document.getElementById('frmContas');
    var btnAtualizar = document.getElementById('btnAtualizarConta');
    
    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var contapagarId = new URLSearchParams(window.location.search).get('contapagarId');
        var servidor = form.dataset.servidor;

        if (!contapagarId || !/^\d+$/.test(contapagarId) || Number(contapagarId) <= 0) {
            throw new Error('ID da conta inválido.');
        }

        if (!servidor) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var conta = montarContaDoFormulario();
        conta.valor = Number(conta.valor);
        conta.fornecedorid = Number(conta.fornecedorid);

        var response = await fetch(servidor + '/updateConta/' + encodeURIComponent(contapagarId), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(conta)
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel atualizar a conta.');
        }

        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel atualizar a conta.');
        }
        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma conta foi atualizada.');
        }
        alert('Conta atualizada com sucesso.');
    } catch (error) {
        alert(error.message || 'Erro ao atualizar conta.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeleteConta() {
    var form = document.getElementById('frmContas');
    var btnRemover = document.getElementById('btnRemoverConta');

    if (btnRemover.disabled) {
        return;
    }
    if (!window.confirm('Confirma a remoção desta conta?')) {
        return;
    }

    try {
        var contapagarId = document.getElementById('contapagarid').value;
        var servidor = form.dataset.servidor;

        if (!contapagarId || !/^\d+$/.test(contapagarId) || Number(contapagarId) <= 0) {
            throw new Error('ID da conta inválido.');
        }
        if (!servidor) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidor + '/deleteConta/' + encodeURIComponent(contapagarId), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel remover a conta.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel remover a conta.');
        }
        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma conta foi removida.');
        }

        window.location.href = '/contas';
    } catch (error) {
        alert(error.message || 'Erro ao remover conta.');
    } finally {
        btnRemover.disabled = false;
    }
}

function montarContaDoFormulario() {
    return {
        descricao: document.getElementById('descricao').value,
        valor: document.getElementById('valor').value,
        datavencimento: document.getElementById('datavencimento').value,
        datapagamento: document.getElementById('datapagamento').value,
        pago: document.getElementById('pago').checked,
        fornecedorid: document.getElementById('fornecedorid').value,
        deleted: document.getElementById('deleted').value === 'true'
    };
}
document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmFornecedores');

    if (!form) {
        return;
    }

    var oper = form.dataset.oper;
    var servidor = form.dataset.servidor;
    var btnInserir = document.getElementById('btnInserirFornecedor');
    var btnAtualizar = document.getElementById('btnAtualizarFornecedor');

    if (oper === 'Cr') {
        dw3OcultarBotao('btnAtualizarFornecedor'); 
        dw3OcultarBotao('btnRemoverFornecedor');
    }

    if (oper === 'Re') { 
        dw3OcultarBotao('btnInserirFornecedor');
        dw3OcultarBotao('btnAtualizarFornecedor');
        dw3OcultarBotao('btnRemoverFornecedor');
        vwGetFornecedorByID();
    }

    if (oper === 'Up') {
        dw3OcultarBotao('btnInserirFornecedor');
        dw3OcultarBotao('btnRemoverFornecedor');
        vwGetFornecedorByID();
        btnAtualizar.disabled = !(vwGetFornecedorByID());
        btnAtualizar.addEventListener('click', function() {
            vwUpdateFornecedor();
        });
    }

    if (oper === 'De') {
        dw3OcultarBotao('btnInserirFornecedor');
        dw3OcultarBotao('btnAtualizarFornecedor');
        var btnRemover = document.getElementById('btnRemoverFornecedor'); 
        vwGetFornecedorByID();
        btnRemover.disabled = !(vwGetFornecedorByID());
        btnRemover.addEventListener('click', function() {
            vwDeleteFornecedor();
        });
    }


    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertFornecedor();
        });
    }
});

async function vwGetFornecedorByID() {
  var form = document.getElementById('frmFornecedores');

  try {
    var parametros = new URLSearchParams(window.location.search);
    var fornecedorId = parametros.get('fornecedorId');
    var servidor = form.dataset.servidor;

    if (!fornecedorId || !/^\d+$/.test(fornecedorId) || Number(fornecedorId) <= 0) {
      throw new Error('ID do fornecedor invalido.');
    }

    if (!servidor) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidor + '/getFornecedorByID/' + encodeURIComponent(fornecedorId), {
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      })
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o fornecedor.');
    }

    var data = await response.json();

    if (data.auth === false) {
      throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    var fornecedor = data.registro[0];

    if (!fornecedor) {
      throw new Error('Fornecedor nao encontrado.');
    }

    document.getElementById('fornecedorid').value = fornecedor.fornecedorid;
    document.getElementById('cnpj').value = fornecedor.cnpj ?? '';
    document.getElementById('nome').value = fornecedor.nome ?? '';
    document.getElementById('email').value = fornecedor.email ?? '';
    document.getElementById('deleted').value = String(fornecedor.deleted === true);

    return true;
  } catch (error) {
    alert(error.message || 'Erro ao carregar fornecedor.');
    return false;
  }
}

async function vwInsertFornecedor() {
    var form = document.getElementById('frmFornecedores');
    var btnInserir = document.getElementById('btnInserirFornecedor');

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

        var response = await fetch(servidor + '/insertFornecedor', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({'content-type': 'application/json'}),
            body: JSON.stringify(montarFornecedorDoFormulario())
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel inserir o fornecedor.');
        }

        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel inserir o fornecedor.');
        }

        window.location.href = '/fornecedores';
    } catch (error) {
        alert(error.message || 'Erro ao inserir fornecedor.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwUpdateFornecedor() {
    var form = document.getElementById('frmFornecedores');
    var btnAtualizar = document.getElementById('btnAtualizarFornecedor');
    
    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var fornecedorId = new URLSearchParams(window.location.search).get('fornecedorId');
        var servidor = form.dataset.servidor;

        if (!fornecedorId || !/^\d+$/.test(fornecedorId) || Number(fornecedorId) <= 0) {
            throw new Error('ID do fornecedor invalido.');
        }

        if (!servidor) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        btnAtualizar.disabled = true;

        var fornecedor = montarFornecedorDoFormulario();

        var response = await fetch(servidor + '/updateFornecedor/' + encodeURIComponent(fornecedorId), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(fornecedor)
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel atualizar o fornecedor.');
        }

        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel atualizar o fornecedor.');
        }
        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum fornecedor foi atualizado.');
        }
        alert('Fornecedor atualizado com sucesso.');
    } catch (error) {
        alert(error.message || 'Erro ao atualizar fornecedor.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeleteFornecedor() {
    var form = document.getElementById('frmFornecedores');
    var btnRemover = document.getElementById('btnRemoverFornecedor');

    if (btnRemover.disabled) {
        return;
    }
    if (!window.confirm('Confirma a remoção deste fornecedor?')) {
        return;
    }

    try {
        var fornecedorId = document.getElementById('fornecedorid').value;
        var servidor = form.dataset.servidor;

        if (!fornecedorId || !/^\d+$/.test(fornecedorId) || Number(fornecedorId) <= 0) {
            throw new Error('ID do fornecedor invalido.');
        }
        if (!servidor) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidor + '/deleteFornecedor/' + encodeURIComponent(fornecedorId), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel remover o fornecedor.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel remover o fornecedor.');
        }
        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum fornecedor foi removido.');
        }

        window.location.href = '/fornecedores';
    } catch (error) {
        alert(error.message || 'Erro ao remover fornecedor.');
    } finally {
        btnRemover.disabled = false;
    }
}

function montarFornecedorDoFormulario() {
    return {
        cnpj: document.getElementById('cnpj').value,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        deleted: document.getElementById('deleted').value === 'true'
    };
}
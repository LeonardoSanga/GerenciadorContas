const mdlContas = require("../model/mdlContas");

const GetAllContas = (req, res) => (async () => {
    let registro = await mdlContas.GetAllContas();

    for (let i = 0; i < registro.length; i++) {
        const row = registro[i]; // Current row

        if (row.datapagamento != null) {
            const formattedDatePagamento = row.datapagamento.toISOString().split('T')[0];
            row.datapagamento = formattedDatePagamento;
        }
        
        if (row.datavencimento != null) {
            const formattedDateVencimento = row.datavencimento.toISOString().split('T')[0];
            row.datavencimento = formattedDateVencimento;
        }
    }

    res.json({ status: "ok", "registro": registro });
})();

const GetContaByID = (req, res) => (async () => {
    const contaID = parseInt(req.params.contapagarid);
    let registro = await mdlContas.GetContaByID(contaID);
    registro = registro[0];

    if (registro.datapagamento != null) {
        const formattedDatePagamento = registro.datapagamento.toISOString().split('T')[0];
        registro.datapagamento = formattedDatePagamento;
    }
        
    if (registro.datavencimento != null) {
        const formattedDateVencimento = registro.datavencimento.toISOString().split('T')[0];
        registro.datavencimento = formattedDateVencimento;
    }

    res.json({ status: "ok", "registro": registro });
})();

const InsertConta = (request, res) => (async () => {
    //variável msg para retornar erros de banco de dados.
    const contaREG = request.body;
    let { msg, linhasAfetadas } = await mdlContas.InsertConta(contaREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const UpdateConta = (request, res) => (async () => {
    const contaID = parseInt(request.params.contapagarid);
    const contaREG = request.body;
    let { msg, linhasAfetadas } = await mdlContas.UpdateConta(contaID, contaREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const DeleteConta = (request, res) => (async () => {
    const contaID = parseInt(request.params.contapagarid);
    let { msg, linhasAfetadas } = await mdlContas.DeleteConta(contaID);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const GetFornecedoresToContas = (req, res) => (async () => {
    let registro = await mdlContas.GetFornecedoresToContas();
    res.json({ status: "ok", "registro": registro });
})();

module.exports = {
    GetAllContas,
    GetContaByID,
    InsertConta,
    UpdateConta,
    DeleteConta,
    GetFornecedoresToContas
};

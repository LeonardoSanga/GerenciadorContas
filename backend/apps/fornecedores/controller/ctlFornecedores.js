const mdlFornecedores = require("../model/mdlFornecedores");

const GetAllFornecedores = (req, res) => (async () => {
    let registro = await mdlFornecedores.GetAllFornecedores();

    res.json({ status: "ok", "registro": registro });
})();

const GetFornecedorByID = (req, res) => (async () => {
    const fornecedorID = parseInt(req.params.fornecedorid);
    let registro = await mdlFornecedores.GetFornecedorByID(fornecedorID);
    res.json({ status: "ok", "registro": registro });
})();

const InsertFornecedor = (request, res) => (async () => {
    //variável msg para retornar erros de banco de dados.
    const fornecedorREG = request.body;
    let { msg, linhasAfetadas } = await mdlFornecedores.InsertFornecedor(fornecedorREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const UpdateFornecedor = (request, res) => (async () => {
    const fornecedorID = parseInt(request.params.fornecedorid);
    const fornecedorREG = request.body;
    let { msg, linhasAfetadas } = await mdlFornecedores.UpdateFornecedor(fornecedorID, fornecedorREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const DeleteFornecedor = (request, res) => (async () => {
    const fornecedorID = parseInt(request.params.fornecedorid);
    let { msg, linhasAfetadas } = await mdlFornecedores.DeleteFornecedor(fornecedorID);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

module.exports = {
    GetAllFornecedores,
    GetFornecedorByID,
    InsertFornecedor,
    UpdateFornecedor,
    DeleteFornecedor,
};

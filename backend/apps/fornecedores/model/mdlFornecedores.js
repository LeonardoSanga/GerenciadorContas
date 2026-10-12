const db = require("../../../database/databaseconfig");

const GetAllFornecedores = async () => {
    return (
        await db.query(
            "SELECT * " +
            "FROM fornecedor WHERE deleted = false ORDER BY nome ASC"
        )
    ).rows;
};

const GetFornecedorByID = async (fornecedorIDPar) => {
    return (
        await db.query(
            "SELECT * " +
            "FROM fornecedor WHERE fornecedorid = $1 and deleted = false ORDER BY nome ASC",
            [fornecedorIDPar]
        )
    ).rows;
};

const InsertFornecedor = async (fornecedorREGPar) => {
    //variável msg para retornor erros de banco de dados.
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO fornecedor " + "values(default, $1, $2, $3, $4)",
                [
                    fornecedorREGPar.cnpj,
                    fornecedorREGPar.nome,
                    fornecedorREGPar.email,
                    fornecedorREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlFornecedores|InsertFornecedor] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const UpdateFornecedor = async (fornecedorIDPar, fornecedorREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE fornecedor SET " +
                "cnpj = $2, " +
                "nome = $3, " +
                "email = $4, " +
                "deleted = $5 " +
                "WHERE fornecedorid = $1",
                [
                    fornecedorIDPar,
                    fornecedorREGPar.cnpj,
                    fornecedorREGPar.nome,
                    fornecedorREGPar.email,
                    fornecedorREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlFornecedores|UpdateFornecedor] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const DeleteFornecedor = async (fornecedorIDPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE fornecedor SET " + "deleted = true " + "WHERE fornecedorid = $1",
                [fornecedorIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlFornecedores|DeleteFornecedor] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllFornecedores,
    GetFornecedorByID,
    InsertFornecedor,
    UpdateFornecedor,
    DeleteFornecedor,
};

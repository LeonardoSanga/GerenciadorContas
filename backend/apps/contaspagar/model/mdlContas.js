const db = require("../../../database/databaseconfig");

const GetAllContas = async () => {
    return (
        await db.query(
            "SELECT *,(SELECT nome from FORNECEDOR where fornecedorid = contapagar.fornecedorid)" +
            "FROM contapagar WHERE deleted = false ORDER BY datavencimento ASC"
        )
    ).rows;
};

const GetContaByID = async (contaIDPar) => {
    return (
        await db.query(
            "SELECT *,(SELECT nome from FORNECEDOR where fornecedorid = contapagar.fornecedorid)" +
            "FROM contapagar WHERE contapagarid = $1 and deleted = false ORDER BY datavencimento ASC",
            [contaIDPar]
        )
    ).rows;
};

const InsertConta = async (contaREGPar) => {
    //variável msg para retornor erros de banco de dados.
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO contapagar " + "values(default, $1, $2, $3, $4, $5, $6, $7)",
                [
                    contaREGPar.descricao,
                    contaREGPar.valor,
                    contaREGPar.datavencimento,
                    contaREGPar.datapagamento || null,
                    contaREGPar.pago,
                    contaREGPar.fornecedorid,
                    contaREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContas|insertContas] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const UpdateConta = async (contaIDPar, contaREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE contapagar SET " +
                "descricao = $2, " +
                "valor = $3, " +
                "datavencimento = $4, " +
                "datapagamento = $5, " +
                "pago = $6, " +
                "fornecedorid = $7, " +
                "deleted = $8 " +
                "WHERE contapagarid = $1",
                [
                    contaIDPar,
                    contaREGPar.descricao,
                    contaREGPar.valor,
                    contaREGPar.datavencimento,
                    contaREGPar.datapagamento || null,
                    contaREGPar.pago,
                    contaREGPar.fornecedorid,
                    contaREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContas|updateConta] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const DeleteConta = async (contaIDPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE contapagar SET " + "deleted = true " + "WHERE contapagarid = $1",
                [contaIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContas|deleteConta] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const GetFornecedoresToContas = async () => {
    return (await db.query("select fornecedorid, nome from fornecedor")).rows;
};


module.exports = {
    GetAllContas,
    GetContaByID,
    InsertConta,
    UpdateConta,
    DeleteConta,
    GetFornecedoresToContas,
};

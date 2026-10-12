const express = require("express");
const routerApp = express.Router();

const appFornecedores = require("../apps/fornecedores/controller/ctlFornecedores");
const appContas = require("../apps/contaspagar/controller/ctlContas");
const appLogin = require("../apps/login/controller/ctlLogin");

// middleware that is specific to this router
routerApp.use((req, res, next) => {
    next();
});
routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
});

//Rotas de Fornecedores
routerApp.get("/getAllFornecedores", appFornecedores.GetAllFornecedores);
routerApp.get("/getFornecedorByID/:fornecedorid", appLogin.AutenticaJWT, appFornecedores.GetFornecedorByID);
routerApp.post("/insertFornecedor", appLogin.AutenticaJWT, appFornecedores.InsertFornecedor);
routerApp.put("/updateFornecedor/:fornecedorid", appLogin.AutenticaJWT, appFornecedores.UpdateFornecedor);
routerApp.delete("/deleteFornecedor/:fornecedorid", appLogin.AutenticaJWT, appFornecedores.DeleteFornecedor);

//Rotas de Contas
routerApp.get("/getAllContas", appContas.GetAllContas);
routerApp.get("/getContaByID/:contapagarid", appLogin.AutenticaJWT, appContas.GetContaByID);
routerApp.post("/insertConta", appLogin.AutenticaJWT, appContas.InsertConta);
routerApp.put("/updateConta/:contapagarid", appLogin.AutenticaJWT, appContas.UpdateConta);
routerApp.delete("/deleteConta/:contapagarid", appLogin.AutenticaJWT, appContas.DeleteConta);
routerApp.get("/getFornecedoresToContas", appLogin.AutenticaJWT, appContas.GetFornecedoresToContas);

// Rota Login
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

module.exports = routerApp;
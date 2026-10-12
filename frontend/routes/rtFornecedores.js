var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('fornecedores/vwLstFornecedores', {
        title: 'Fornecedores',
        showNavbar: true,
        activeMenu: 'fornecedores',
        servidor: process.env.SERVIDOR // Usado para configurar a url do backend.
    });
});

router.get('/form', function(req, res) {
    res.render('fornecedores/vwFormFornecedores', {
        title: 'Formulário de fornecedores',
        showNavbar: true,
        activeMenu: 'fornecedores',
        servidor: process.env.SERVIDOR,
        oper: req.query.oper || 'Cr'
    });
});

module.exports = router;
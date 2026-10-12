var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('contas/vwLstContas', {
        title: 'Contas a pagar',
        showNavbar: true,
        activeMenu: 'contas',
        servidor: process.env.SERVIDOR
    });
});

router.get('/form', function(req, res) {
    res.render('contas/vwFormContas', {
        title: 'Formulário de contas',
        showNavbar: true,
        activeMenu: 'contas',
        servidor: process.env.SERVIDOR,
        oper: req.query.oper || 'Cr'
    });
});

module.exports = router;
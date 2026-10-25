const Contatos = require('../models/contatosModel')

exports.index = async (req, res, next) => {
    const contatos = await Contatos.buscaContatos();

    res.render('index', { contatos });
};
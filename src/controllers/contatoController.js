const Contato = require('../models/contatosModel')

exports.index = (req, res) => {
    res.render('contatoIndex', {
        contato: {}
    });
};

exports.register = async (req, res) => {

    try {
        const contato = new Contato(req.body);
        await contato.register();
        
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(req.get('Referrer') || '/contato/index'));
            return;
        }

        req.flash('success', 'Contato Registrado com sucesso!');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (error) {
        console.log(error);
        return res.render('bad404');
    }
};

exports.editIndex = async function(req, res) {
    if(!req.params.id) return res.render('bad404');

    try {
        const contato = await Contato.buscaPorID(req.params.id);

        if(!contato) return res.render('bad404');

        res.render('contatoIndex', {
            contato
        });
    } catch (error) {
        console.log(error);
        return res.render('bad404');
    }
};

exports.edit = async function(req, res) {
    if(!req.params.id) return res.render('bad404');

    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    try {        
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(req.get('Referrer') || '/contato/index'));
            return;
        }

        req.flash('success', 'Contato Editado com sucesso!');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (error) {
        console.log(error);
        return res.render('bad404');
    }
}

exports.delete = async function(req, res) {
    if(!req.params.id) return res.render('bad404');

    try {
        const contato = await Contato.delete(req.params.id);

        if(!contato) return res.render('bad404');

        req.flash('success', 'Contato excluído com sucesso!');
        req.session.save(() => res.redirect(req.get('Referrer') || '/'));
        return;

    } catch (error) {
        console.log(error);
        return res.render('bad404');
    }
}
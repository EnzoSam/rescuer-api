'use strict'

const Usuario = require('../models/usuario');
const UsuarioService = require('../services/usuario.service');

exports.prueba = async function (param) {

};

exports.quitarDatosSensibles = function (usuario) {

    usuario.password = undefined;
    usuario.codigoConfirmacion = undefined;
    usuario.intentosConfirmacion = undefined;
    usuario.intentosConfirmacion = undefined;
    usuario.ultimoIntento = undefined;
};

exports.obtenerUsuario = async function (idUsuario) {

    try {
        return await Usuario.findById(idUsuario)
            .populate({ path: 'contactos', populate: { path: 'tipoContacto' } })
            .populate('lugar')
            .populate({ path: 'lugar', populate: { path: 'lugarPadre' } })
            .exec();
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
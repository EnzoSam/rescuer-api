'use strict'

const PostulacionAdopcion = require('../models/postulacionAdopcion');
const UsuarioService = require('../services/usuario.service');

exports.obtenerPostulacionesUsuario =  async function (idUsuario) {
    try {

        if (idUsuario && idUsuario !== undefined) {
            let usuario = await UsuarioService.obtenerUsuario(idUsuario);
            let p = await PostulacionAdopcion.find({ usuario: usuario })
                .populate('usuario')
                .populate('animal')
                .sort({ fecha: 1 })
                .exec();                

                console.log(p);
                return p;
        }
        else
        {
            return await PostulacionAdopcion.find()
            .populate('usuario')
            .populate('animal')
            .sort({ fecha: 1 })
            .exec();
        }
    }
    catch (e) {
        console.log(e)
        return Promise.reject(e);
    }
};
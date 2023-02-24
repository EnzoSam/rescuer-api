'use strict'
const Publicacion = require('../models/publicacion');
const PublicacionesEnums = require('../enums/publicaciones.enum');
const Publicidad = require('../models/publicidad');

exports.crearPublicaciones = async function (publicidades) {
    try {
        let list = [];

        for (let p of publicidades) {
            let publicidad = await crearPublicacion(p);
            list.push(publicidad);
        }

        return Promise.resolve(list);
    }
    catch (e) {
        Promise.reject(e);
    }
};

exports.obtenerPublicidades = async function () {
    try {

        let p = new Publicidad();
        p.titulo = 'Same Devs';
        p.descripcion = 'Dessarrollos de Software';
        p.imagen = 'logo.jpg';
        
        let list = [];
        await list.push(p);

        return Promise.resolve(list);
    }
    catch (e) {
        Promise.reject(e);
    }
};


async function crearPublicacion(publicidad) {
    return new Publicacion
        (
            publicidad._id,
            publicidad.titulo,
            publicidad.imagen,
            publicidad.descripcion,
            publicidad.tipo = PublicacionesEnums.Publicidad,
            publicidad.create_at
        );
}
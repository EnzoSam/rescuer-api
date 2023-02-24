'use strict'
const Publicacion = require('../models/publicacion');
const PublicacionesEnums = require('../enums/publicaciones.enum');

exports.crearPublicacionAnimales = async function (animales) {
    try {
        let list = [];

        for (let a of animales) {
            let animal = await crearPublicacionAnimal(a);
            list.push(animal);
        }

        return Promise.resolve(list);
    }
    catch (e) {
        Promise.reject(e);
    }
};

async function crearPublicacionAnimal(animal) {
    return new Publicacion
        (
            animal._id,
            animal.nombres,
            animal.imagen,
            animal.descripcion,
            animal.tipo = PublicacionesEnums.Animal,
            animal.create_at
        );
}
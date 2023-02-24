'use strict'

var mongoose = require('mongoose');
const Atributo = require('./atributo');

var Schema = mongoose.Schema;

var TipoAnimalSchema = Schema({
    nombre: String,
    referencia:String,
    descripcion:String,
    orden:String,
    seleccionado:Boolean,
    imagen:String,
    atributos:[{type:Schema.ObjectId, ref:Atributo}]
});

module.exports = mongoose.model('TipoAnimal', TipoAnimalSchema);

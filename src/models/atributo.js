'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AtributoSchema = Schema({
    nombre: String,
    descripcion:String,
    agrupador:String,
    referencia:String,
    orden: Number,
    imagen:String,
    seleccionado:Boolean
});

module.exports = mongoose.model('Atributo', AtributoSchema);
'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TipoContactoSchema = Schema({
    nombre: String,
    descripcion:String,
    orden: Number
});

module.exports = mongoose.model('TipoContacto', TipoContactoSchema);
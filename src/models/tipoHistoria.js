'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TipoHistoriaSchema = Schema({
    nombre: String,
    descripcion:String,
    referencia: String
});

module.exports = mongoose.model('TipoHistoria', TipoHistoriaSchema);
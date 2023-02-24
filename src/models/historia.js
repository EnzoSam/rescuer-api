'use strict'

var mongoose = require('mongoose');
const usuario = require('./usuario');
const animal = require('./animal');
const tipoHistoria = require('./tipoHistoria');

var Schema = mongoose.Schema;

var HistoriaSchema = Schema({
    titulo: String,
    descripcion:String,
    visibilidad: Number,
    usuario:{type:Schema.ObjectId, ref:Usuario},
    animal:{type:Schema.ObjectId, ref:Animal},
    tipoHistoria:{type:Schema.ObjectId, ref:TipoHistoria}
});

module.exports = mongoose.model('Historia', HistoriaSchema);
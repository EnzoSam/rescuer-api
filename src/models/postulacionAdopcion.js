'use strict'

var mongoose = require('mongoose');
const Usuario = require('./usuario');
const Animal = require('./animal');

var Schema = mongoose.Schema;

var PostulacionAdopcionSchema = Schema({
    comentario: String,
    estado: Number,
    fecha:Date,
    animal:{type:Schema.ObjectId, ref:Animal},
    usuario:{type:Schema.ObjectId, ref:Usuario},
});

module.exports = mongoose.model('PostulacionAdopcion', PostulacionAdopcionSchema);
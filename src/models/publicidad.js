'use strict'

var mongoose = require('mongoose');
const Usuario = require('./usuario');

var Schema = mongoose.Schema;

var PublicidadSchema = Schema({
    titulo: String,
    descripcion: String,
    imagen: String,
    estado:Number,
    create_at:Date,
    usuario:{type:Schema.ObjectId, ref:Usuario},
});

module.exports = mongoose.model('Publicidad', PublicidadSchema);
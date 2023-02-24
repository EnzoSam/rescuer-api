'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DatoUtilSchema = Schema({
    titulo: String,
    subTitulo:String,
    telefono:String,
    celular:String,
    email:String,
    web:String,
    direccion:String,
    latitud:Number,
    longitud:Number,
    orden: Number,
    estado:Number
});

module.exports = mongoose.model('DatoUtil', DatoUtilSchema);
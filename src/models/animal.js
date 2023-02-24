'use strict'

var mongoose = require('mongoose');
const Usuario = require('./usuario');
const TipoAnimal = require('./tipoAnimal');
const Atributo = require('./atributo');

var Schema = mongoose.Schema;

var AnimalSchema = Schema({
    nombres: String,
    apellidos: String,
    descripcion: String,
    imagen: String,
    estado:Number,
    requierePostulacion:Boolean,
    castrado:Boolean,
    create_at:Date,
    tipoAnimal:{type:Schema.ObjectId, ref:TipoAnimal},
    usuario:{type:Schema.ObjectId, ref:Usuario},
    sexo:{type:Schema.ObjectId, ref:Atributo},
    tamanio:{type:Schema.ObjectId, ref:Atributo},
    atributos:[{type:Schema.ObjectId, ref:Atributo}]
});

module.exports = mongoose.model('Animal', AnimalSchema);
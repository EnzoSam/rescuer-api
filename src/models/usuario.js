'use strict'

var mongoose = require('mongoose');
//const Contacto = require('./contacto');
const TipoContacto = require('./tipoContacto');
const Atributo = require('./atributo');
const Lugar = require('./lugar');

const ESTADOS_SIN_ACTIVAR = 0;
const ESTADOS_ACTIVO = 1;
const ESTADOS_BLANQUEO_PASSWORD = 3;
var Schema = mongoose.Schema;

const Contacto = new Schema({  referencia: String,
    descripcion:String,
    esPredeterminado: Boolean,
    orden:Number,
    tipoContacto:{type:Schema.ObjectId, ref:TipoContacto} });



var UsuarioSchema = Schema({
    nombres: String,
    apellidos: String,
    apodo:String,
    email:String,
    password:String,
    imagen:String,
    rol:String,
    estado:Number,
    codigoConfirmacion:String,
    intentosConfirmacion:String,
    ultimoIntento:Date,
    contactos:[Contacto],
    lugar:{type:Schema.ObjectId, ref:Lugar},
    colaboraciones:[{type:Schema.ObjectId, ref:Atributo}]
});

module.exports = mongoose.model('Usuario', UsuarioSchema);

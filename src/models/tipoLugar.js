'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TipoLugarSchema = Schema({
    nombre: String,
    referencia:String,
    tipoHijo:{type:Schema.ObjectId, ref:'TipoLugar'},
    orden: Number
});

module.exports = mongoose.model('TipoLugar', TipoLugarSchema);
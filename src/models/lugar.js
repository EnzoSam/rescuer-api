'use strict'

var mongoose = require('mongoose');
const TipoLugar = require('./tipoLugar');

var Schema = mongoose.Schema;

var LugarSchema = Schema({
    nombre: String,
    tipo:{type:Schema.ObjectId, ref:TipoLugar},
    lugarPadre:{type:Schema.ObjectId, ref:'Lugar'},
    lugares: [ {type:Schema.Types.ObjectId, ref : 'Lugar'}]
});

module.exports = mongoose.model('Lugar', LugarSchema);
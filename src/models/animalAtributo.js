'use strict'

var mongoose = require('mongoose');
const animal = require('./animal');
const atributo = require('./atributo');

var Schema = mongoose.Schema;

var AnimalAtributoSchema = Schema({
    animal:{type:Schema.ObjectId, ref:Animal},
    atributo:{type:Schema.ObjectId, ref:Atributo},
    valor:String
});

module.exports = mongoose.model('AnimalAtributo', AnimalAtributoSchema);
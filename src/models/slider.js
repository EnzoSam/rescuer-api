'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SliderSchema = Schema({
    titulo: String,
    subtitulo: String,
    referencia: String,
    imagen:String,
    orden:Number,
    estado:Number
});

module.exports = mongoose.model('Slider', SliderSchema);

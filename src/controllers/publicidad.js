'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
const Publicidad = require('../models/publicidad');

var jwt = require('../services/jwt');


var controller = {

    probando: function (req, res) {
        return res.status(200).send({
            message: 'metodo probando publicidades'
        });
    },
    imagen: function (req, res) {
        var nombreArchivo = req.params.fileName;
        var pathArchivo = '../uploads/publicidad/' + nombreArchivo;

        var pathResolved = path.resolve(pathArchivo);

        return res.status(200).send({
            status: 'ok',
            url: pathResolved
        });
    },
}
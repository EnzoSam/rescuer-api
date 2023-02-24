'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function(usuario)
{
    var payLoad =
    {
        sub:usuario.id,
        nombre:usuario.nombre,
        email:usuario.email,
        rol:usuario.rol,
        imagen:usuario.imagen,
        iat:moment().unix(),
        exp:moment().add(30,'days').unix
    };

    return jwt.encode(payLoad,'epsilonsigma256');
};
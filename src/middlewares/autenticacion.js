'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'epsilonsigma256';

exports.autenticar = function(req,res,next)
{
    //comprobar si llega cabecera  de autenticacion
    if(!req.headers.authorization)
    {
        console.log('token la peticion necesita autorizacion');
        return res.status(403).send({
            message:'La peticion necesita autorizacion.'
        });
    }

    //limpiar token  y comillas

    var token = req.headers.authorization.replace(/['"]+/g,'');
    
    //decodificar token

    try{
        var payload = jwt.decode(token,secret)
        //comprobar expiracion de token

        if(payload.exp <= moment.unix)
        {
            console.log('token expirado');
            return res.status(404).send({
                message:'El token ha expirado.'                
            });
        }
    }
    catch(ex)
    {
        console.log('token no valido');
        return res.status(404).send({
            message:'El token no es valido.'
        });
    }

    req.usuario = payload;

    //adjuntar usuario identificado a la resquest
    
    //pasar a la siguiente accion
    next();
}
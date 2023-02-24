'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt');
var fs = require('fs');
var path = require('path');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');
var mailer = require('../services/mail');
//const { patch } = require('../rutes/usuario');
const UsuarioService = require('../services/usuario.service');
const PostulacionesService = require('../services/postulaciones.service');

var controller = {

    probando: function (req, res) {
        return res.status(200).send({
            message: 'metodo probando de usuario controleler 33333'
        });
    },
    registrar: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos

        try {
            var val_nombre = !validator.isEmpty(params.nombres);
            var val_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var val_password = !validator.isEmpty(params.password);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre && val_password && val_email) {
            //Crear objeto usuario
            var usuarioRegistro = new Usuario();
            //Adignar valores a objeto
            usuarioRegistro.nombres = params.nombres;
            usuarioRegistro.apellidos = params.apellidos;
            usuarioRegistro.apodo = params.apodo
            usuarioRegistro.email = params.email.toLowerCase();
            usuarioRegistro.rol = 'ROLE_USER';
            usuarioRegistro.password = null;
            usuarioRegistro.contactos = params.contactos;
            usuarioRegistro.estado = 0;
            //comprobar si el usuario existe
            Usuario.findOne({ email: usuarioRegistro.email }, (err, issetUsuario) => {
                if (err) {
                    return res.status(500).send({
                        message: 'No se pudo validar usuario.',
                        params
                    });
                }

                if (!issetUsuario) {
                    //si no existe cifrar contraseña

                    bcrypt.hash(params.password, 10, function (err, hash) {
                        usuarioRegistro.password = hash;

                        usuarioRegistro.save((err, usuarioGuardado) => {
                            if (err) {
                                return res.status(500).send({
                                    message: 'El usuario no se pudo guardar. ' + err,
                                    params
                                });
                            }

                            //devolver respuesta
                            if (usuarioGuardado) {
                                EnviarEmailConfirmacion(usuarioGuardado, res);
                                /*
                                                                return res.status(200).send({
                                                                    usuario: usuarioGuardado,
                                                                    status: 'success'
                                                                });
                                                                */
                            }
                            else {
                                return res.status(500).send({
                                    message: 'El usuario no se pudo guardar.',
                                    params
                                });
                            }
                        })


                    });

                }
                else {
                    return res.status(200).send({
                        message: 'El usuario ya existe.',
                        params
                    });
                }
            })
        }
        else {
            return res.status(200).send({
                message: 'Datos de usuario no valido.',
                params
            });
        }
    },
    login: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos
        try {
            var val_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var val_password = !validator.isEmpty(params.password);
        }
        catch (ex) {
            return res.status(404).send({
                status: 'error',
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (!val_password || !val_email) {
            return res.status(400).send({
                status: 'error',
                message: 'Datos de inicio de sesion no validos.',
                params
            });
        }

        Usuario.findOne({ email: params.email.toLowerCase() }, (err, usuarioEncontrado) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al indentificar.'
                });
            }
            if (!usuarioEncontrado) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El usuario no existe'
                });
            }
            else {
                bcrypt.compare(params.password, usuarioEncontrado.password, (err, check) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al indentificar'
                        });
                    }
                    if (check) {
                        if (usuarioEncontrado.estado === 0) {
                            return res.status(200).send({
                                status: 'error',
                                message: 'La cuenta no se ha activado.',
                                estado: 0
                            });
                        }
                        else {
                            if (params.getToken) {
                                usuarioEncontrado.password = undefined;
                                return res.status(200).send({
                                    status: 'ok',
                                    token: jwt.createToken(usuarioEncontrado)
                                });
                            }
                            else {
                                return res.status(200).send({
                                    status: 'ok',
                                    usuarioEncontrado
                                });
                            }
                        }
                    }
                    else {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Las credenciales no son correctas.'
                        });
                    }
                });
            }
        });

    },
    actualizar: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos
        console.log(params);
        try {
            var val_nombre = !validator.isEmpty(params.nombres);
            var val_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        }
        catch (ex) {
            console.log(ex);
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
                
            });
        }

        if (val_nombre && val_email) {
            //eliminar propiedades inecesarias

            delete params.password;

            var idUsuario = req.usuario.sub;

            if (req.usuario.email != params.email) {
                return res.status(500).send({
                    message: 'El email no es valido'
                });
            }

            Usuario.findByIdAndUpdate({ _id: idUsuario }, params, { new: true }, (err, usuarioActualizado) => {
                if (err || !usuarioActualizado) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar.',
                        error:err
                    });
                }

                return res.status(200).send({
                    status: 'ok',
                    message: 'Actualizacion exitosa.',
                    usuario: usuarioActualizado
                });
            });
        }
    },
    subirAvatar: function (req, res) {
        var nombreArchivo = 'Avatar no subido';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: 'FileName vacio.'
            });
        }

        var filePath = req.files.file0.path;

        var file_split = filePath.split('/');

        var fileName = file_split[2];
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if (fileExt != 'jpeg' && fileExt != 'png' && fileExt != 'gif' && fileExt != 'jpg') {
            fs.unlink(filePath, (err) => {
                return res.status(404).send({
                    status: 'error',
                    message: 'La extencion del archivo no es valida.'
                });
            });
        }
        else {
            var idUsuario = req.usuario.sub;

            Usuario.findByIdAndUpdate({ _id: idUsuario }, { imagen: filePath }, { new: true }, (err, usuarioActualizado) => {
                if (err || !usuarioActualizado) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar imagen.'
                    });
                }

                return res.status(200).send({
                    status: 'succes',
                    message: 'Actualizacion exitosa.',
                    usuario: usuarioActualizado
                });
            });
        }
    },
    avatar: function (req, res) {
        var nombreArchivo = req.params.fileName;
        var pathArchivo = '.uploads/usuarios/' + nombreArchivo;

        fs.exists(pathArchivo, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(pathArchivo));
            }
            else {
                return res.status(404).send({
                    status: 'error',
                    message: 'Archivo no encontaddo.'
                });
            }
        });
    },
    getUsuario: function (req, res) {
        var idUsuario = req.params.idUsuario;
        Usuario.findById(idUsuario)
        .populate({ path: 'contactos', populate: { path: 'tipoContacto' } })
        .populate('lugar')
        .populate({ path: 'lugar', populate: { path: 'lugarPadre' } })
        .exec((err, usuario) => {
            if (err || !usuario) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario.',
                    error:err
                });
            }
            else {
                UsuarioService.quitarDatosSensibles(usuario);
                return res.status(200).send({
                    status: 'ok',
                    usuario:usuario
                });
            }
        });
    },
    getUsuarios: function (req, res) {
        Usuario.find().exec((err, usuarios) => {
            if (err || !usuarios) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios.'
                });
            }
            else {
                return res.status(200).send({
                    status: 'succes',
                    usuarios
                });
            }
        });
    },
    validacionEmail: function (req, res) {

        let email = req.body.e;
        let codigo = req.body.c;

        Usuario.findOne({ email: email }).exec((err, usuario) => {
            if (err || !usuario) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario.'
                });
            }
            else {
                if (usuario.codigoConfirmacion === codigo) {

                    if (usuario.estado == 0) {
                        usuario.estado = 1;
                        usuario.codigoConfirmacion = '';
                        usuario.intentosConfirmacion = 0;
                        usuario.ultimoIntento = null;
                        usuario.save().then(savedDoc => {

                            return res.status(200).send({
                                status: 'ok',
                                estado: 0,
                                message: 'El usuario se activo correctamente.'
                            });
                        });
                    }
                    else if (usuario.estado == 3) {
                        return res.status(200).send({
                            status: 'ok',
                            estado: 3,
                            message: 'Codigo correcto para blanquear password.'
                        });
                    }
                }
            }
        });
    },
    reenviarCodigoActivacion(req, res) {
        let motivo = req.body.motivo;
        if (!req.body.email) {
            return res.status(500).send({
                status: 'error',
                message: 'Peticion incorrecta.'
            });
        }
        else {
            Usuario.findOne({ email: req.body.email }).exec((err, usuario) => {
                if (err || !usuario) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el usuario.'
                    });
                }
                else {

                    if (usuario.intentosConfirmacion > 20) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Demaciados intentos'
                        });
                    }
                    else {

                        console.log(usuario);
                        if (motivo && motivo == 3)
                            usuario.estado = 3;
                        EnviarEmailConfirmacion(usuario, res, req.body.motivo);
                    }
                }
            });
        }
    },
    cambiarPassword(req, res) {
        var val_email = !validator.isEmpty(req.body.email) && validator.isEmail(req.body.email);
        var val_codigo = !validator.isEmpty(req.body.codigo);
        var val_password = !validator.isEmpty(req.body.password);

        if (!val_email || !val_codigo || !val_password) {
            return res.status(500).send({
                status: 'error',
                message: 'Peticion incorrecta.'
            });
        }
        else {
            Usuario.findOne({ email: req.body.email }).exec((err, usuario) => {
                if (err || !usuario) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el usuario.'
                    });
                }
                else {

                    console.log(usuario.codigoConfirmacion + " " + req.body.codigo);
                    if (usuario.codigoConfirmacion == req.body.codigo) {
                        bcrypt.hash(req.body.password, 10, function (err, hash) {

                            if (err) {
                                return res.status(500).send({
                                    status: "error",
                                    message: 'El usuario no se pudo guardar. '
                                });
                            }
                            else {
                                Usuario.updateOne({ _id: usuario._id },
                                    {
                                        $set:
                                        {
                                            codigoConfirmacion: '',
                                            intentosConfirmacion: 0,
                                            ultimoIntento: null,
                                            estado: 1,
                                            password: hash
                                        }
                                    }, (err, usuarioGuardado) => {
                                        if (err) {
                                            return res.status(500).send({
                                                status: "error",
                                                message: 'El usuario no se pudo guardar. ' + err
                                            });
                                        }
                                        else if (usuarioGuardado) {
                                            res.status(200).send({
                                                status: 'ok',
                                                message: 'Password actualizado'
                                            });
                                        }

                                    });
                            }
                        });
                    }
                    else {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Token no valido.'
                        });
                    }
                }
            });
        }
    },
    async obtenerPostulaciones(req, res) {

        let postulaciones = await PostulacionesService.obtenerPostulacionesUsuario(req.params.idUsuario);
            console.log('postulaciones2');
            res.status(200).send({
                status: 'ok',
                postulaciones: postulaciones
            });            
    }
};

module.exports = controller;


function EnviarEmailConfirmacion(usuario, res) {
    try {
        let al = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

        usuario.codigoConfirmacion = al.toString();
        if (!usuario.intentosConfirmacion)
            usuario.intentosConfirmacion = 0;
        usuario.intentosConfirmacion++;
        usuario.ultimoIntento = new Date();

        Usuario.updateOne({ _id: usuario._id },
            {
                $set:
                {
                    codigoConfirmacion: usuario.codigoConfirmacion,
                    intentosConfirmacion: usuario.intentosConfirmacion,
                    ultimoIntento: usuario.ultimoIntento,
                    estado: usuario.estado
                }
            }, (err, usuarioGuardado) => {

                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: 'El usuario no se pudo guardar. ' + err
                    });
                }
                else if (usuarioGuardado) {
                    try {


                        console.log('enviano....');

                        mailer.enviarConfirmacion(usuario.email, usuario.apodo, usuario.codigoConfirmacion);

                        return res.status(200).send({
                            message: "Enviado",
                            status: 'ok'
                        });
                    }
                    catch (exc) {
                        console.log(exc);
                        return res.status(500).send({
                            status: "error",
                            message: "Erro en envio",
                            ex: ex
                        });
                    }
                }
                else {
                    return res.status(500).send({
                        status: "error",
                        message: 'El usuario no se pudo guardar.'
                    });
                }
            })
    }
    catch (ex) {

        console.log(ex);
        return res.status(500).send({
            status: "error",
            message: "Erro en envio",
            ex: ex
        });
    }
}
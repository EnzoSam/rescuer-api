'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

const  ObjectID = require('mongodb').ObjectId;

var Atributo = require('../models/atributo');
const TipoAnimal = require('../models/tipoAnimal');
const TipoContacto = require('../models/tipoContacto');
const Lugar = require('../models/lugar');
const TipoLugar = require('../models/tipoLugar');
const DatoUtil = require('../models/datoUtil');
const LugarService = require('../services/lugar.service');

var jwt = require('../services/jwt');


var controller = {

    probando: function (req, res) {
        return res.status(200).send({
            message: 'metodo probando de general controleler 33333'
        });
    },
    getTiposAnimales: function (req, res) {
        TipoAnimal.find().populate('atributos').exec((err, tipos) => {
            if (err || !tipos || tipos.length == 0) {
                var tipoPerro = new TipoAnimal();
                tipoPerro.nombre = 'Perro';
                tipoPerro.orden = 0;
                tipoPerro.referencia = 'Perro';
                tipoPerro.save();

                var tipoGato = new TipoAnimal();
                tipoGato.nombre = 'Gato';
                tipoGato.orden = 1;
                tipoGato.referencia = 'Gato';
                tipoGato.save();

                return res.status(404).send({
                    status: 'error',
                    message: 'No hay tipos de animales.'
                });
            }
            else {
                for (let t of tipos) {
                    t.seleccionado = false;
                }
                return res.status(200).send({
                    status: 'ok',
                    tiposAnimales: tipos
                });
            }
        });
    },
    insertarAtributo: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos

        try {
            var val_nombre = !validator.isEmpty(params.nombre);
            var val_referencia = !validator.isEmpty(params.referencia);
            var val_agrupador = !validator.isEmpty(params.agrupador);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre && val_referencia && val_agrupador) {
            //Crear objeto usuario
            var atributoInsert = new Atributo();
            //Adignar valores a objeto
            atributoInsert.nombre = params.nombre;
            atributoInsert.referencia = params.referencia;
            atributoInsert.agrupador = params.agrupador;
            atributoInsert.descripcion = params.descripcion;
            atributoInsert.orden = params.orden;
            atributoInsert.imagen = params.imagen;
            //comprobar si el usuario existe
            Atributo.findOne({ referencia: atributoInsert.referencia }, (err, issetAtributo) => {
                if (err) {
                    return res.status(500).send({
                        message: 'No se pudo validar el atributo.',
                        params
                    });
                }

                if (!issetAtributo) {
                    //guardar
                    atributoInsert.save((err, atributoGuardado) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'El atributo no se pudo guardar.',
                                params
                            });
                        }

                        //devolver respuesta
                        if (atributoGuardado) {
                            return res.status(200).send({
                                atributo: atributoGuardado,
                                status: 'ok'
                            });
                        }
                        else {
                            return res.status(500).send({
                                message: 'El atributo no se pudo guardar.',
                                status: 'error',
                                params
                            });
                        }
                    });
                }
                else {
                    return res.status(200).send({
                        message: 'El atributo ya existe.',
                        status: 'error',
                        params
                    });
                }
            })
        }
        else {
            return res.status(200).send({
                message: 'Datos de atributo no valido.',
                status: 'error',
                params
            });
        }
    },
    actualizarAtributo: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos
        try {
            var val_nombre = !validator.isEmpty(params.nombre);
            var val_referencia = !validator.isEmpty(params.referencia);
            var val_agrupador = !validator.isEmpty(params.agrupador);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre && val_referencia && val_agrupador) {
            //eliminar propiedades inecesarias

            delete params.seleccionado;

            Atributo.findByIdAndUpdate({ _id: params._id }, params, { new: true }, (err, atributoActualizado) => {
                if (err || !atributoActualizado) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar.'
                    });
                }

                return res.status(200).send({
                    status: 'ok',
                    message: 'Actualizacion exitosa.',
                    usuario: atributoActualizado
                });
            });
        }
    },
    getAtributo: function (req, res) {
        var idAtributo = req.params.idAtributo;

        Atributo.findById(idAtributo).exec((err, atributo) => {
            if (err || !atributo) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el atributo.'
                });
            }
            else {
                return res.status(200).send({
                    status: 'ok',
                    atributo: atributo
                });
            }
        });
    },
    getAtributos: function (req, res) {
        let agrupador = req.params.agrupador;

        if (agrupador && agrupador != '' && agrupador != undefined) {
            Atributo.find({ agrupador: agrupador }, (err, atributos) => {
                if (err || !atributos) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay atributos.'
                    });
                }
                else {
                    return res.status(200).send({
                        status: 'ok',
                        atributos: atributos
                    });
                }
            });
        }
        else {
            Atributo.find().exec((err, atributos) => {
                if (err || !atributos) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay atributos.'
                    });
                }
                else {
                    return res.status(200).send({
                        status: 'ok',
                        atributos: atributos
                    });
                }
            });
        }
    },
    insertarTipoAnimal: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos

        try {
            var val_nombre = !validator.isEmpty(params.nombre);
            var val_referencia = !validator.isEmpty(params.referencia);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre && val_referencia) {
            //Crear objeto usuario
            var tipoAnimalInsert = new TipoAnimal();
            //Adignar valores a objeto
            tipoAnimalInsert.nombre = params.nombre;
            tipoAnimalInsert.referencia = params.referencia;
            tipoAnimalInsert.orden = params.orden;
            tipoAnimalInsert.imagen = params.imagen;
            //comprobar si el usuario existe
            TipoAnimal.findOne({ referencia: tipoAnimalInsert.referencia }, (err, issetTipoAnimal) => {
                if (err) {
                    return res.status(500).send({
                        message: 'No se pudo validar el tipo animal.',
                        params
                    });
                }

                if (!issetTipoAnimal) {
                    //guardar
                    tipoAnimalInsert.save((err, tipoAnimalGuardado) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'El tipo animal no se pudo guardar.',
                                status: 'error',
                                params
                            });
                        }

                        //devolver respuesta
                        if (tipoAnimalGuardado) {
                            return res.status(200).send({
                                tipoAnimal: tipoAnimalGuardado,
                                status: 'ok'
                            });
                        }
                        else {
                            return res.status(500).send({
                                message: 'El atributo no se pudo guardar.',
                                status: 'error',
                                params
                            });
                        }
                    });
                }
                else {
                    return res.status(200).send({
                        message: 'El tipo animal ya existe.',
                        status: 'error',
                        params
                    });
                }
            })
        }
        else {
            return res.status(200).send({
                message: 'Datos de tipo animal no valido.',
                status: 'error',
                params
            });
        }
    },
    actualizarTipoAnimal: function (req, res) {
        var params = req.body;

        try {
            var val_nombre = !validator.isEmpty(params.nombre);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre) {

            delete params.seleccionado;

            TipoAnimal.findByIdAndUpdate({ _id: params._id }, params, { new: true }, (err, tipoActualizado) => {
                if (err || !tipoActualizado) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar.',
                        err
                    });
                }

                return res.status(200).send({
                    status: 'ok',
                    message: 'Actualizacion exitosa.',
                    tipoAnimal: tipoActualizado
                });
            });
        }
    },
    getTiposContactos: function (req, res) {
        TipoContacto.find().exec((err, tiposContactos) => {
            if (!err && tiposContactos) {

                return res.status(200).send({
                    status: 'ok',
                    tiposContactos: tiposContactos
                });
            }
        });
    },
    insertarTipoContacto: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos

        try {
            var val_nombre = !validator.isEmpty(params.nombre);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre) {
            //Crear objeto usuario
            var tipoContactoInsert = new TipoContacto();
            //Adignar valores a objeto
            tipoContactoInsert.nombre = params.nombre;
            tipoContactoInsert.descripcion = params.descripcion;
            tipoContactoInsert.orden = params.orden;
            //comprobar si el usuario existe
            TipoContacto.findOne({ nombre: tipoContactoInsert.nombre }, (err, issetTipoContacto) => {
                if (err) {
                    return res.status(500).send({
                        message: 'No se pudo validar el tipo contacto.',
                        params
                    });
                }

                if (!issetTipoContacto) {
                    //guardar
                    tipoContactoInsert.save((err, tipoContactoGuardado) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'El tipo contacto no se pudo guardar.',
                                status: 'error',
                                params
                            });
                        }

                        //devolver respuesta
                        if (tipoContactoGuardado) {
                            return res.status(200).send({
                                tipoContacto: tipoContactoGuardado,
                                status: 'ok'
                            });
                        }
                        else {
                            return res.status(500).send({
                                message: 'El tipo contacto no se pudo guardar.',
                                status: 'error',
                                params
                            });
                        }
                    });
                }
                else {
                    return res.status(200).send({
                        message: 'El tipo tipo contacto ya existe.',
                        status: 'error',
                        params
                    });
                }
            })
        }
        else {
            return res.status(200).send({
                message: 'Datos de tipo contacto no valido.',
                status: 'error',
                params
            });
        }
    },
    insertarLugar: async function (req, res) {
        //recoger datos de reqest
        var params = req.body;

        var arrayInsert = [];

        if (Array.isArray(params)) {

            for (let l of params) {
                var lugarInsert = new Lugar();
                lugarInsert.nombre = l.nombre;
                lugarInsert.tipo = l.tipo;
                lugarInsert.lugarPadre = l.lugarPadre;
                lugarInsert.lugares = l.lugares;
                arrayInsert.push(lugarInsert);
            }
        }
        else {
            var lugarInsert = new Lugar();
            lugarInsert.nombre = params.nombre;
            lugarInsert.tipo = params.tipo;
            lugarInsert.lugarPadre = params.lugarPadre;
            lugarInsert.lugares = params.lugares;
            arrayInsert.push(lugarInsert);
        }

        Lugar.insertMany(arrayInsert, (err, lugaresInsertados) => {
            if (err) {
                return res.status(500).send({
                    message: 'El lugar no se pudo guardar.',
                    params
                });
            }

            //devolver respuesta
            if (lugaresInsertados) {

                if (Array.isArray(params)) {
                    return res.status(200).send({
                        lugares: lugaresInsertados,
                        status: 'ok'
                    });
                }
                else {
                    return res.status(200).send({
                        lugar: lugaresInsertados[0],
                        status: 'ok'
                    });
                }
            }
            else {
                return res.status(500).send({
                    message: 'El lugar no se pudo guardar.',
                    status: 'error',
                    params
                });
            }
        });

    },
    eliminarLugar: function (req, res) {
        var id = req.params.id;

        Lugar.deleteOne({ _id: id }, (err) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar. ' + err
                });
            }
            else {
                return res.status(200).send({
                    status: 'ok',
                    message: 'Eliminacion exitosa.',
                });
            }
        });

    },
    eliminarLugares: function (req, res) {

        console.log('Eliminadno...');
        LugarService.eliminarLugares().then(() => {
            console.log('Eliminado controller');
            return res.status(200).send({
                status: 'ok',
                message: 'Eliminacion exitosa.',
            });
        }).catch((err) => {

            console.log('Eliminado Error controller');
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar. ' + err
            });
        })
    },
    getLugares: async function (req, res) {

        let idPadre = req.params.idPadre;
        let query;
        if (idPadre)
            query = Lugar.findById(idPadre);
        else
            query = Lugar.find();
        query.populate({path:'lugares', model:'Lugar'})
        .populate('tipo')
        .sort({ nombre: 1 })
        .exec((err, lugares) => {
            if (!err && lugares) {

                if(idPadre)
                {
                return res.status(200).send({
                    status: 'ok',
                    lugares: lugares.lugares
                });
            }
            else
            {
                return res.status(200).send({
                    status: 'ok',
                    lugares: lugares
                });                
            }
            }
            else if (err) {
                console.log(err)
                return res.status(500).send({
                    status: 'error',
                    err
                });
            }
        });
    },
    getLugar: function (req, res) {

        Lugar.find({ 'nombre': req.params.nombre }).populate('tipo').exec((err, lugar) => {
            if (!err && lugar) {

                return res.status(200).send({
                    status: 'ok',
                    lugar: lugar
                });
            }
            else if (err) {
                return res.status(500).send({
                    status: 'error',
                    err
                });
            }
        });
    },
    insertarTipoLugar: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos

        try {
            var val_nombre = !validator.isEmpty(params.nombre);
            var val_referencia = !validator.isEmpty(params.referencia);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre && val_referencia) {
            var tipoLugarInsert = new TipoLugar();
            tipoLugarInsert.nombre = params.nombre;
            tipoLugarInsert.tipo = params.tipo;
            tipoLugarInsert.referencia = params.referencia;
            tipoLugarInsert.orden = params.orden;
            //comprobar si  existe
            Lugar.findOne({ nombre: tipoLugarInsert.nombre }, (err, issetTipoLugar) => {
                if (err) {
                    return res.status(500).send({
                        message: 'No se pudo validar el tipo lugar.',
                        params
                    });
                }

                if (!issetTipoLugar) {
                    //guardar
                    tipoLugarInsert.save((err, tipoLugarGuardado) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'El tipo lugar no se pudo guardar.',
                                params
                            });
                        }

                        //devolver respuesta
                        if (tipoLugarGuardado) {
                            return res.status(200).send({
                                tipoLugar: tipoLugarGuardado,
                                status: 'ok'
                            });
                        }
                        else {
                            return res.status(500).send({
                                message: 'El tipo lugar no se pudo guardar.',
                                status: 'error',
                                params
                            });
                        }
                    });
                }
                else {
                    return res.status(200).send({
                        message: 'El tipo lugar ya existe.',
                        status: 'error',
                        params
                    });
                }
            })
        }
        else {
            return res.status(200).send({
                message: 'Datos de tipo lugar no valido.',
                status: 'error',
                params
            });
        }
    },
    actualizarLugar: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos


        console.log(params);

        try {
            var val_nombre = !validator.isEmpty(params.nombre);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre) {
            //eliminar propiedades inecesarias

            delete params.seleccionado;
            

            Lugar.findByIdAndUpdate({ _id: params._id }, params, { new: true }, (err, lugarActualizado) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar.',
                        err
                    });
                }

                return res.status(200).send({
                    status: 'ok',
                    message: 'Actualizacion exitosa.',
                    lugar: lugarActualizado
                });
            });
        }
    },
    eliminarTipoLugar: function (req, res) {
        var id = req.params.id;

        TipoLugar.deleteOne({ _id: id }, (err) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar. ' + err
                });
            }
            else {
                return res.status(200).send({
                    status: 'ok',
                    message: 'Eliminacion exitosa.',
                });
            }
        });

    },
    getTipoLugares: function (req, res) {

        TipoLugar.find().populate('tipoHijo').exec((err, tipos) => {
            if (!err && tipos) {

                return res.status(200).send({
                    status: 'ok',
                    tiposLugares: tipos
                });
            }
        });
    }
    ,
    insertarDatoUtil: function (req, res) {
        var params = req.body;
        //validar datos

        try {
            var val_titulo = !validator.isEmpty(params.titulo);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_titulo) {
            var datoInsert = new DatoUtil();
            datoInsert.titulo = params.titulo;
            datoInsert.subTitulo = params.subTitulo;
            datoInsert.telefono = params.telefono;
            datoInsert.celular = params.celular;
            datoInsert.email = params.email;
            datoInsert.web = params.web;
            datoInsert.direccion = params.direccion;
            datoInsert.latitud = params.latitud;
            datoInsert.longitud = params.longitud;
            datoInsert.orden = params.orden;
            datoInsert.estado = params.estado;
            //comprobar si  existe
            DatoUtil.findOne({ titulo: datoInsert.titulo }, (err, issetDatoUtil) => {
                if (err) {
                    return res.status(500).send({
                        message: 'No se pudo validar el dato.',
                        params
                    });
                }

                if (!issetDatoUtil) {
                    //guardar
                    datoInsert.save((err, datoInsertado) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'El slider no se pudo guardar.',
                                params
                            });
                        }

                        //devolver respuesta
                        if (datoInsertado) {
                            return res.status(200).send({
                                dato: datoInsertado,
                                status: 'ok'
                            });
                        }
                        else {
                            return res.status(500).send({
                                message: 'El dato no se pudo guardar.',
                                status: 'error',
                                params
                            });
                        }
                    });
                }
                else {
                    return res.status(200).send({
                        message: 'El dato ya existe.',
                        status: 'error',
                        params
                    });
                }
            })
        }
        else {
            return res.status(200).send({
                message: 'Datos de dato no valido.',
                status: 'error',
                params
            });
        }
    },
    eliminarDatoUtil: function (req, res) {
        var id = req.params.id;

        DatoUtil.deleteOne({ _id: id }, (err) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar. ' + err
                });
            }
            else {
                return res.status(200).send({
                    status: 'ok',
                    message: 'Eliminacion exitosa.',
                });
            }
        });

    },
    getDatosUtiles: function (req, res) {

        var estado = req.params.estado

        if (estado && estado != '-1' && estado != -1) {
            DatoUtil.find({ estado: estado }).sort({ orden: 1 }).exec((err, datos) => {
                if (!err && datos) {

                    return res.status(200).send({
                        status: 'ok',
                        datos: datos
                    });
                }
            });
        }
        else {
            DatoUtil.find().exec((err, datos) => {
                if (!err && datos) {

                    return res.status(200).send({
                        status: 'ok',
                        datos: datos
                    });
                }
            });
        }
    },
    getDatoUtil: function (req, res) {
        var idDato = req.params.id;

        DatoUtil.findById(idDato).exec((err, dato) => {
            if (!err && dato) {

                return res.status(200).send({
                    status: 'ok',
                    dato: dato
                });
            }
            else if (err) {
                return res.status(500).send({
                    status: 'error',
                    err
                });
            }
        });
    }
};

module.exports = controller;


async function guardarLugar(params, res, esIteracion) {
    try {
        var val_nombre = !validator.isEmpty(params.nombre);
        var val_tipo = params.tipo && params.tipo != undefined;
    }
    catch (ex) {
        return res.status(404).send({
            message: 'Datos de peticion incorrectos.',
            ex
        });
    }

    if (val_nombre && val_tipo) {
        var lugarInsert = new Lugar();
        lugarInsert.nombre = params.nombre;
        lugarInsert.tipo = params.tipo;
        lugarInsert.lugarPadre = params.lugarPadre;
        //comprobar si  existe
        Lugar.findOne({ nombre: lugarInsert.nombre, tipo: lugarInsert.tipo }, (err, issetLugar) => {
            if (err) {
                return res.status(500).send({
                    message: 'No se pudo validar el lugar.',
                    err,
                    params
                });
            }

            if (!issetLugar) {

                try {
                    //guardar
                    lugarInsert.save((err, lugarGuardado) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'El lugar no se pudo guardar.',
                                params
                            });
                        }

                        //devolver respuesta
                        if (lugarGuardado && !esIteracion) {
                            return res.status(200).send({
                                lugar: lugarGuardado,
                                status: 'ok'
                            });
                        }
                        else if (!lugarGuardado) {
                            return res.status(500).send({
                                message: 'El lugar no se pudo guardar.',
                                status: 'error',
                                params
                            });
                        }
                    });
                }
                catch (ex) { }
            }
            else {
                return res.status(200).send({
                    message: 'El lugar ya existe.',
                    status: 'error',
                    params
                });
            }
        })
    }
    else {
        return res.status(200).send({
            message: 'Datos de lugar no valido.',
            status: 'error',
            params
        });
    }
}
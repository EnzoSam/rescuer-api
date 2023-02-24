'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Animal = require('../models/animal');
//const { patch } = require('../rutes/animal');
const TipoAnimal = require('../models/tipoAnimal');
const Atributo = require('../models/atributo');
const Usuario = require('../models/usuario');
const PostulacionAdopcion = require('../models/postulacionAdopcion');
const Publicacion = require('../models/publicacion');
const PublicacionesEnums = require('../enums/publicaciones.enum');
const AnimalService = require('../services/animal.service');
const PublicidadService = require('../services/publicidad.service');

var controller = {

    probando: function (req, res) {
        return res.status(200).send({
            message: 'metodo probando de animal controleler 33333'
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
                    tipos
                });
            }
        });
    },
    getAnimales: function (req, res) {
        var filtro = req.body;

        let query = Animal.find();
        query = query.where('estado').equals(filtro.estado);
        if (filtro.tipos && filtro.tipos.length > 0)
            query = query.where('tipoAnimal').in(filtro.tipos);
        if (filtro.tamanios && filtro.tamanios.length > 0)
            query = query.where('tamanio').in(filtro.tamanios);
        if (filtro.sexos && filtro.sexos.length > 0)
            query = query.where('sexo').in(filtro.sexos);
        if (filtro.lugar)
            query = query.where('lugar').equals(filtro.lugar);


        query = query.skip((filtro.numeroPagina)*filtro.itemsPagina).limit(itemsPagina);
        
        query = query.sort({create_at:1})

        query.populate('usuario').populate('atributos');
        query.exec((err, animales) => {
            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: 'No hay animales.',
                    error: err
                });
            }
            else if (!animales || animales.length == 0) {
                return res.status(200).send({
                    status: 'ok',
                    message: 'No hay animales.'
                });
            }
            else {
                return res.status(200).send({
                    status: 'ok',
                    animales: animales
                });
            }
        });
    },
    getAnimal: function (req, res) {
        var idAnimal = req.params.id;

        Animal.findById(idAnimal)
            .populate({ path: 'usuario', populate: { path: 'contactos', populate: { path: 'tipoContacto' } } })
            .populate('atributos')
            .populate('tipoAnimal')
            .populate('sexo')
            .populate('sexo')
            .populate('tamanio').exec((err, animal) => {
                if (err || !animal) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el animal.'
                    });
                }
                else {
                    return res.status(200).send({
                        status: 'ok',
                        animal: animal
                    });
                }
            });
    },
    insertar: function (req, res) {

        var params = req.body;

        var idUsuario = req.usuario.sub;

        Usuario.findById(idUsuario).exec((err, usuario) => {
            if (err || !usuario) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario.'
                });
            }
            else {
                try {
                    var val_nombre = !validator.isEmpty(params.nombres);
                }
                catch (ex) {
                    return res.status(404).send({
                        message: 'Datos de peticion incorrectos.'
                    });
                }

                if (val_nombre) {
                    //Crear objeto usuario
                    var animalInsert = new Animal();
                    //Adignar valores a objeto
                    animalInsert.nombres = params.nombres;
                    animalInsert.apellidos = params.apellidos;
                    animalInsert.descripcion = params.descripcion;
                    animalInsert.estado = params.estado;
                    animalInsert.tipoAnimal = params.tipoAnimal;
                    animalInsert.sexo = params.sexo;
                    animalInsert.usuario = usuario;
                    animalInsert.imagen = params.imagen;
                    animalInsert.atributos = params.atributos;
                    animalInsert.tamanio = params.tamanio;
                    animalInsert.requierePostulacion = params.requierePostulacion;

                    //guardar
                    animalInsert.save((err, animalGuardado) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'El animal no se pudo guardar.',
                                params
                            });
                        }

                        //devolver respuesta
                        if (animalGuardado) {
                            return res.status(200).send({
                                animal: animalGuardado,
                                status: 'ok'
                            });
                        }
                        else {
                            return res.status(500).send({
                                status: 'error',
                                message: 'El animal no se pudo guardar.',
                                params
                            });
                        }
                    })
                }
                else {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Datos de usuario no valido.',
                        params
                    });
                }
            }
        });
    },
    actualizar: function (req, res) {
        //recoger datos de reqest
        var params = req.body;
        //validar datos

        try {
            var val_nombre = !validator.isEmpty(params.nombres);
        }
        catch (ex) {
            return res.status(404).send({
                message: 'Datos de peticion incorrectos.'
            });
        }

        if (val_nombre) {
            //eliminar propiedades inecesarias


            if (req.usuario.sub != params.usuario._id) {
                return res.status(500).send({
                    message: 'El usuario no es valido'
                });
            }
            else {
                Animal.findByIdAndUpdate({ _id: params._id }, params, { new: true }, (err, animalActualizado) => {
                    if (err || !animalActualizado) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar.'
                        });
                    }

                    return res.status(200).send({
                        status: 'ok',
                        message: 'Actualizacion exitosa.',
                        animal: animalActualizado
                    });
                });
            }
        }
    },
    eliminar: function (req, res) {
        var idAnimal = req.params.id;

        Animal.deleteOne({ _id: idAnimal }, (err) => {
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
    insertarPostulacion: function (req, res) {
        //recoger datos de reqest
        var params = req.body;

        var idUsuario = req.usuario.sub;

        Usuario.findById(idUsuario).exec((err, usuario) => {
            if (err || !usuario) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario.'
                });
            }
            else {
                //validar datos
                try {
                    var val_animal = params.animal ? true : false;
                    var val_comentario = !validator.isEmpty(params.comentario);
                }
                catch (ex) {
                    return res.status(404).send({
                        message: 'Datos de peticion incorrectos.'
                    });
                }

                if (val_animal && val_comentario) {
                    //Crear objeto usuario
                    var postulacionInsert = new PostulacionAdopcion();
                    postulacionInsert.animal = params.animal;
                    postulacionInsert.usuario = usuario;
                    postulacionInsert.comentario = params.comentario,
                        postulacionInsert.estado = 1,
                        postulacionInsert.fecha = params.fecha,
                        //guardar
                        postulacionInsert.save((err, postualcionGuardada) => {
                            if (err) {
                                return res.status(500).send({
                                    status: 'error',
                                    message: 'La postulacion no se pudo guardar.',
                                    params
                                });
                            }

                            //devolver respuesta
                            if (postualcionGuardada) {
                                return res.status(200).send({
                                    postualacion: postualcionGuardada,
                                    status: 'ok'
                                });
                            }
                            else {
                                return res.status(500).send({
                                    status: 'error',
                                    message: 'La postulacion no se pudo guardar.',
                                    params
                                });
                            }
                        })
                }
                else {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Datos de postulacion no valido.',
                        params
                    });
                }
            }
        });
    },
    getPostulaciones: function (req, res) {
        var idAnimal = req.params.idAnimal;

        PostulacionAdopcion.find({ animal: idAnimal }).exec((err, postulaciones) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error.',
                    err
                });
            }
            else if (!postulaciones) {
                return res.status(200).send({
                    status: 'ok',
                    message: 'No existen postulaciones.'
                });
            }
            else {
                return res.status(200).send({
                    status: 'ok',
                    postulaciones: postulaciones
                });
            }
        });
    },
    getPostulacion: function (req, res) {
        var id = req.params.id;

        PostulacionAdopcion.findById(id).populate('animal').populate('usuario').exec((err, postulacion) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error.',
                    err
                });
            }
            else if (!postulacion) {
                return res.status(200).send({
                    status: 'ok',
                    message: 'No existen postulaciones.'
                });
            }
            else {
                return res.status(200).send({
                    status: 'ok',
                    postulacion: postulacion
                });
            }
        });
    },
    subirImagen: function (req, res) {
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
            return res.status(200).send({
                status: 'ok',
                imagen: filePath,
                message: 'La imagen se subio correctamente'
            });
        }
    },
    imagen: function (req, res) {
        var nombreArchivo = req.params.fileName;
        var pathArchivo = '../uploads/animales/' + nombreArchivo;

        var pathResolved = path.resolve(pathArchivo);

        return res.status(200).send({
            status: 'ok',
            url: pathResolved
        });
    },
    getPublicaciones: function (req, res) {
        var filtro = req.body;

        obtenerAnimales(filtro)
            .then(data => {
                if (data.data) {
                    let listPublicaciones = [];
                    AnimalService.crearPublicacionAnimales(data.data).then
                        (data => {

                            Array.prototype.push.apply(listPublicaciones, data)

                            PublicidadService.obtenerPublicidades().then
                            (
                            data => {
                                PublicidadService.crearPublicaciones(data).then
                                    (
                                        data => {
                                            Array.prototype.push.apply(listPublicaciones, data);

                                            return res.status(200).send({
                                                status: 'ok',
                                                publicaciones: listPublicaciones
                                            });
                                        }
                                    );
                                }
                            );
                        });
                }
                else {
                    return res.status(200).send({
                        status: 'ok',
                        publicaciones: []
                    });
                }
            })
            .catch(error => {
                console.log(error);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error interno',
                    error:error.data
                });
            });
    }
};



function obtenerAnimales(filtro) {

    return new Promise((resolve, reject) => {

        try {

            let query = Animal.find();
            query = query.where('estado').equals(filtro.estado);
            if (filtro.tipos && filtro.tipos.length > 0)
                query = query.where('tipoAnimal').in(filtro.tipos);
            if (filtro.tamanios && filtro.tamanios.length > 0)
                query = query.where('tamanio').in(filtro.tamanios);
            if (filtro.sexos && filtro.sexos.length > 0)
                query = query.where('sexo').in(filtro.sexos);
            if (filtro.lugar)
                query = query.where('lugar').equals(filtro.lugar);

            query = query.skip(filtro.numeroPagina*filtro.itemsPagina).limit(filtro.itemsPagina);
            query = query.sort({create_at:1});
            console.log(filtro);
            query.populate('usuario').populate('atributos');
            query.exec((err, animales) => {
                if (err) {
                    return reject({
                        status: 'error',
                        message: 'No hay animales.',
                        data: err
                    });
                }
                else if (!animales || animales.length == 0) {
                    return resolve({
                        status: 'ok',
                        message: 'No hay animales.',
                        data: []
                    });
                }
                else {
                    return resolve({
                        status: 'ok',
                        data: animales
                    });
                }
            });
        }
        catch (exc) {
            return reject({
                status: 'error',
                message: 'Error interno.',
                data: exc
            });
        }
    });
}


module.exports = controller;
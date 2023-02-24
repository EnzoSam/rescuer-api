'use strict'

const Slider = require('../models/slider');
var validator = require('validator');

exports.guardar = async function (params) {

    const customPromise = new Promise(async (resolve, reject) => {
        
        try {
            var val_titulo = !validator.isEmpty(params.titulo);
        }
        catch (ex) {
            reject({
                message:'Datos de peticion incorrectos.',
                code:500,
                error:ex
            });
            return;
        }
        if(!val_titulo)
        {
            reject({
                message:'Datos de peticion incorrectos.',
                code:500,
            });
            return;
        }

        let sliderInsert; 
        if(params._id && params._id != '')
            sliderInsert = await Slider.findById(params._id);
        
        if(!sliderInsert)
            sliderInsert = new Slider();

        sliderInsert.titulo = params.titulo;
        sliderInsert.referencia = params.referencia;
        sliderInsert.subtitulo = params.subtitulo;
        sliderInsert.imagen = params.imagen;
        sliderInsert.orden = params.orden;
        sliderInsert.estado = params.estado;
        let guardado = await sliderInsert.save();        
        console.log(guardado);

        resolve(guardado);
    });

    return customPromise
}

exports.eliminar = async function (id) {

    const customPromise = new Promise(async (resolve, reject) => {
        
        try {
            await Slider.deleteOne({ _id: id });
            resolve(id);
        }
        catch (ex) {
            reject({
                message:'Datos de peticion incorrectos.',
                code:500,
                error:ex
            });
            return;
        }        
    });

    return customPromise
}

exports.obtener = async function (estado) {

    const customPromise = new Promise(async (resolve, reject) => {
        
        try {

            if (estado && estado != '0' && estado != 0) {
               let sliders = await Slider.find({ estado: estado }).sort({ orden: 1 }).exec();
                resolve(sliders);
                
            }
            else {
                let sliders = await Slider.find().sort({ orden: 1 }).exec();
                resolve(sliders);
            }            
        }
        catch (ex) {
            reject({
                message:'Error interno.',
                error:ex,
                code:500,
            });
        }        
    });

    return customPromise
}

/*


eliminarSlider: function (req, res) {
    var id = req.params.id;

    Slider.deleteOne({ _id: id }, (err) => {
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
getSliders: function (req, res) {

    var estado = req.params.estado

    if (estado && estado != '0' && estado != 0) {
        Slider.find({ estado: estado }).sort({ orden: 1 }).exec((err, sliders) => {
            if (!err && sliders) {

                return res.status(200).send({
                    status: 'ok',
                    sliders: sliders
                });
            }
        });
    }
    else {
        Slider.find().sort({ orden: 1 }).exec((err, sliders) => {
            if (!err && sliders) {

                return res.status(200).send({
                    status: 'ok',
                    sliders: sliders
                });
            }
        });
    }
}

*/
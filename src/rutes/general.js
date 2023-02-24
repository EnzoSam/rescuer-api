'use strict'

var express = require('express');
var aut_middlware = require('../middlewares/autenticacion');
var GeneralController = require('../controllers/general');

const multer = require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination:function (req,file,cb){//Indica la carpeta de destino
        cb(null,path.join(__dirname,'../public/uploads/general'));
    },
    filename:function(req,file,cb){//Indica el nombre del archivo
        cb(null,`${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
});
const uploader=multer({storage});//Se guardara la imagen en el servidor


var router = express.Router();

router.get('/general/atributo/:idAtributo', aut_middlware.autenticar,GeneralController.getAtributo);
router.put('/general/atributo/actualizar', aut_middlware.autenticar,GeneralController.actualizarAtributo);
router.post('/general/atributo/nuevo',aut_middlware.autenticar, GeneralController.insertarAtributo);
router.get('/general/tipos-animales',GeneralController.getTiposAnimales);
router.post('/general/tipo-animal/nuevo',aut_middlware.autenticar,GeneralController.insertarTipoAnimal);
router.put('/general/tipo-animal/actualizar',aut_middlware.autenticar,GeneralController.actualizarTipoAnimal);
router.get('/general/atributos/:agrupador', GeneralController.getAtributos);
router.get('/general/atributos', GeneralController.getAtributos);
router.get('/general/tiposContactos',GeneralController.getTiposContactos);
router.post('/general/tipo-contacto/nuevo',aut_middlware.autenticar,GeneralController.insertarTipoContacto);
router.post('/general/lugar/nuevo',aut_middlware.autenticar,GeneralController.insertarLugar);
router.put('/general/lugar/actualizar',aut_middlware.autenticar,GeneralController.actualizarLugar);
router.delete('/general/lugar/:id',aut_middlware.autenticar,GeneralController.eliminarLugar);
router.delete('/general/lugar',aut_middlware.autenticar,GeneralController.eliminarLugares);
router.get('/general/lugares/:idPadre?',GeneralController.getLugares);
router.get('/general/lugar/:nombre',GeneralController.getLugar);
router.post('/general/tipo-lugar/nuevo',aut_middlware.autenticar,GeneralController.insertarTipoLugar);
router.delete('/general/tipo-lugar/:id',aut_middlware.autenticar,GeneralController.eliminarTipoLugar);
router.get('/general/tipos-lugares',GeneralController.getTipoLugares);

router.get('/general/datos-utiles/:estado',GeneralController.getDatosUtiles);
router.post('/general/dato-util/nuevo',aut_middlware.autenticar,GeneralController.insertarDatoUtil);
router.delete('/general/datos-utiles/:id',aut_middlware.autenticar,GeneralController.eliminarDatoUtil);
router.get('/general/dato-util/:id',GeneralController.getDatoUtil);



router.post('/general/subir-archivo',uploader.single('file'),(req,res)=>{
    const {file,body}=req;//req.file existe gracias al middleware de multer
    res.status(200).json({
        body:body,
        file:file
    })
});

module.exports = router;
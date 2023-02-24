'use strict'

var express = require('express');
var aut_middlware = require('../middlewares/autenticacion');
var AnimalController = require('../controllers/animal');

const multer = require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination:function (req,file,cb){//Indica la carpeta de destino
        cb(null,path.join(__dirname,'../public/uploads/animales'));
    },
    filename:function(req,file,cb){//Indica el nombre del archivo
        cb(null,`${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
});
const uploader=multer({storage});//Se guardara la imagen en el servidor


var router = express.Router();
router.get('/animal/imagen/:fileName', AnimalController.imagen);
router.get('/animal/probando',AnimalController.probando);
router.put('/animal/listar',AnimalController.getAnimales);
router.put('/animal/publicaciones',AnimalController.getPublicaciones);
router.post('/animal/insertar',aut_middlware.autenticar,AnimalController.insertar);
router.put('/animal/actualizar',aut_middlware.autenticar,AnimalController.actualizar);
router.delete('/animal/:id',aut_middlware.autenticar,AnimalController.eliminar);
router.get('/animal/:id',aut_middlware.autenticar,AnimalController.getAnimal);
router.post('/animal/postulacion-adopcion/nueva',aut_middlware.autenticar,AnimalController.insertarPostulacion);
router.get('/animal/postulaciones/:idAnimal',aut_middlware.autenticar,AnimalController.getPostulaciones);
router.get('/animal/postulacion/:id',aut_middlware.autenticar,AnimalController.getPostulacion);
  
router.post('/animal/subir-archivo',uploader.single('file'),(req,res)=>{
    const {file,body}=req;//req.file existe gracias al middleware de multer
    //console.log(req);
    console.log(res);
   // console.log(body); 
    res.status(200).json({
        body:body,
        file:file
    })
});


 


module.exports = router;
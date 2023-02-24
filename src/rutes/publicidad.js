'use strict'

var express = require('express');
var aut_middlware = require('../middlewares/autenticacion');
var PublicidadController = require('../controllers/publicidad');

const multer = require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination:function (req,file,cb){//Indica la carpeta de destino
        cb(null,path.join(__dirname,'../public/uploads/publicidades'));
    },
    filename:function(req,file,cb){//Indica el nombre del archivo
        cb(null,`${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
});
const uploader=multer({storage});//Se guardara la imagen en el servidor


var router = express.Router();


router.post('/publicidad/subir-archivo',uploader.single('file'),(req,res)=>{
    const {file,body}=req;//req.file existe gracias al middleware de multer
    res.status(200).json({
        body:body,
        file:file
    })
});

module.exports = router;
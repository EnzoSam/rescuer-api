'use strict'

var express = require('express');
var aut_middlware = require('../middlewares/autenticacion');
var multipart = require('connect-multiparty');
var upload_middleware = multipart({uploadDir:'./uploads/usuarios'});

//const { route } = require('../app');
var UsuarioController = require('../controllers/usuario');

var router = express.Router();

router.put('/usuario/validarcodigo', UsuarioController.validacionEmail);
router.get('/usuario/probando',UsuarioController.probando);
router.post('/usuario/registrar',UsuarioController.registrar);
router.post('/usuario/login',UsuarioController.login);
router.put('/usuario/actualizar',aut_middlware.autenticar, UsuarioController.actualizar);
router.post('/usuario/subir-avatar', [aut_middlware.autenticar, upload_middleware],UsuarioController.subirAvatar);
router.get('/usuario/avatar/:fileName', UsuarioController.avatar);
router.get('/usuario/usuarios',UsuarioController.getUsuarios);
router.get('/usuario/:idUsuario',UsuarioController.getUsuario);
router.put('/usuario/reenviar-codigo', UsuarioController.reenviarCodigoActivacion);
router.put('/usuario/cambiar-password', UsuarioController.cambiarPassword);
router.get('/usuario/postulaciones/:idUsuario',UsuarioController.obtenerPostulaciones);

module.exports = router;
var express = require('express');
var aut_middlware = require('../middlewares/autenticacion');
var SliderController = require('../controllers/slider.controller');

var router = express.Router();

router.post('/general/slider/nuevo',aut_middlware.autenticar,SliderController.guardar);
router.delete('/general/slider/:id',aut_middlware.autenticar,SliderController.eliminar);
router.get('/general/sliders/:estado',SliderController.obtener);

module.exports = router;
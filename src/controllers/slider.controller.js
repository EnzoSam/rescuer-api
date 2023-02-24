const Slider = require('../models/slider');
const SliderService = require('../services/slider.service');

module.exports.guardar = function(req, res)
{
    SliderService.guardar(req.body)
    .then(slider=>
        {
            return res.status(200).send({
                status: 'ok',
                slider: slider
            });
        })
    .catch(err=>
    {
        return res.status(err.code).send({
            status: 'error',
            error: err
        });        
    });
}

module.exports.eliminar = function(req, res)
{
    SliderService.eliminar(req.params.id)
    .then(slider=>
        {
            return res.status(200).send({
                status: 'ok',
                id: req.params.id
            });
        })
    .catch(err=>
    {
        return res.status(err.code).send({
            status: 'error',
            error: err
        });        
    });
}


module.exports.obtener = function(req, res)
{
    SliderService.obtener(req.params.estado)
    .then(sliders =>
        {
            return res.status(200).send({
                status: 'ok',
                sliders: sliders
            });
        })
    .catch(err=>
    {
        return res.status(err.code).send({
            status: 'error',
            error: err
        });        
    });
}
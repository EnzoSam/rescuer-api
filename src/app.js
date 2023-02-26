'use strict'

//requires

var express = require('express');
var bodyParser = require('body-parser');
const path=require('path');
//ejecutar express

var app = express();

//cargar rutas

var usuario_routes = require('./rutes/usuario');
var animal_routes = require('./rutes/animal');
var general_routes = require('./rutes/general');
var publicidad_routes = require('./rutes/publicidad');
var slider_routes = require('./rutes/slider.route');

//middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.json({limit: '100mb'}));

app.use(bodyParser.json({
    limit: '100mb'
  }));
  
  app.use(bodyParser.urlencoded({
    limit: '100mb',
    parameterLimit: 9999999,
    extended: true 
  }));

  
// Configurar cabeceras y cors
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS,DELETE,PATCH');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

app.use(express.static(path.join(__dirname,'/public')));//Directorio para archivos staticos
app.use('/uploads/animales',express.static(path.join(__dirname,'/uploads/animales')));//Directorio de imagenes
app.use('/uploads/usuarios',express.static(path.join(__dirname,'/uploads/usuarios')));//Directorio de imagenes
app.use('/uploads/general',express.static(path.join(__dirname,'/uploads/general')));//Directorio de imagenes
app.use('/uploads/publicidades',express.static(path.join(__dirname,'/uploads/publicidades')));//Directorio de imagenes



//reescribir rutas

app.use('/api', usuario_routes);
app.use('/api', animal_routes);
app.use('/api', general_routes);
app.use('/api', publicidad_routes);
app.use('/api', slider_routes);
//exportar modulo

module.exports = app;
'use strict'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
  });

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

mongoose.set('useFindAndModify',false)
mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://rescatistas-mongodb/rescatistas_db',{useNewUrlParser: true, useUnifiedTopology: true})
//mongoose.connect('mongodb://localhost/rescatistas_db',{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>
            {
                console.log('Conexion exitosa');

                //crear servidor

                app.listen(port,()=>
                {
                    console.log("servidor corriendo ok")
                })
            }
        )
        .catch(error=> {
            console.log('Error al conectar');
            console.log(error);
        }
        )

    
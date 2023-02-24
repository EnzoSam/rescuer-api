'use strict'

const Lugar = require('../models/lugar');


exports.prueba = async function (param) {

};

exports.eliminarLugares = async function () {

    await Lugar.deleteMany((err) => {
        if (err) {

            console.log('Eliminado error service' + err);
            return Promise.reject(err);
        }
        else {

            console.log('Eliminado ok service');
            return Promise.resolve();
        }
    });
};
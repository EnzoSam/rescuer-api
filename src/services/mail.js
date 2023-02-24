'use strict'
var nodemailer = require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');

//const webHost = 'http://localhost:4200';
const webHost = 'https://rescatistas.000webhostapp.com/#';

exports.enviarConfirmacion = async function (destinatario, nombreDestinatario, codigoConfirmacion) {

    // var nodemailer = require('nodemailer');
    //var smtpTransport = require('nodemailer-smtp-transport');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'same.devs.ok@gmail.com',
        pass: 'epsilonsigmayox23'
      }
    });


    var mailOptions = ObtenerMailOptionActivacion(nombreDestinatario,destinatario,codigoConfirmacion);
   

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
};

function ObtenerMailOptionActivacion(nombreDestinatario, destinatario,codigoConfirmacion)
{
  let codigoValidacion = '<p><h2>Hola ' + nombreDestinatario +
  '</h2></p><p><h3>Este es tu codigo de validación</h3></p><p><h1>' + codigoConfirmacion + '</h1></>';
  let hr = webHost + '/usuario/validar-codigo/'+ destinatario + '/'+ codigoConfirmacion;
  let linkValidacion = '<p><h2>Hola ' + nombreDestinatario +
  '</h2></p><p><h4>Haz click en el siguiente enlace para activar tu cuenta</h4></p><p><a href="' + hr + '">' + hr+ '</a>';
//http://localhost:3999/api/usuario/validarcodigo/samudioenzo@yahoo.com/codigo/12123
  console.log(linkValidacion);
  let mailOptions = {
    from: 'same.devs.ok@gmail.com',
    to: destinatario,
    subject: 'Activación de cuenta',
    text: '',
    html: linkValidacion, // html body

  };

  return mailOptions;
}

function ObtenerMailOptionResetPasword(nombreDestinatario, destinatario,codigoConfirmacion)
{
  let codigoValidacion = '<p><h2>Hola ' + nombreDestinatario +
  '</h2></p><p><h3>Este es tu codigo de validación</h3></p><p><h1>' + codigoConfirmacion + '</h1></>';
  let hr =  webHost + '/usuario/reset-password/'+ destinatario + '/codigo/'+ codigoConfirmacion;
  let linkValidacion = '<p><h2>Hola ' + nombreDestinatario +
  '</h2></p><p><h4>Haz click en el siguiente enlace para activar tu cuenta</h4></p><p><a href="' + hr + '">' + hr+ '</a>';
//http://localhost:4200/usuario/validarcodigo/samudioenzo@yahoo.com/codigo/12123
  console.log(linkValidacion);
  let mailOptions = {
    from: 'same.devs.ok@gmail.com',
    to: destinatario,
    subject: 'Activación de cuenta',
    text: '',
    html: linkValidacion, // html body

  };

  return mailOptions;
}
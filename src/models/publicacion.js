'use strict'

module.exports = class Publicacion {
    constructor(id, titulo, imagen, descripcion, tipo, fecha) {
        this.id = id;
        this.titulo = titulo;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.fecha = fecha;
    }

}
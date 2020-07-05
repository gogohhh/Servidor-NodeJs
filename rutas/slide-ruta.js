const express = require('express');
const app = express();

//IMPORTAR EL CONTROLADOR
const Slide = require('../controladores/slide-controlador');

//CREAMOS LAS RUTAS HTTP
app.get('/mostrar-slide', Slide.mostrarSlide);

app.post('/crear-slide', Slide.crearSlide);

app.put('/editar-slide/:id', Slide.editarSlide);

app.delete('/borrar-slide/:id', Slide.borrarSlide);

//Exportar la ruta
module.exports = app;
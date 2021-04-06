const express = require('express');
const app = express();

//IMPORTAR EL CONTROLADOR
const Slide = require('../controladores/slide-controlador');

//MIDDLEWARES

const { verificarToken } = require('../middlewares/autenticacion');

//CREAMOS LAS RUTAS HTTP
app.get('/mostrar-slide', Slide.mostrarSlide);

app.post('/crear-slide', verificarToken, Slide.crearSlide);

app.put('/editar-slide/:id', verificarToken, Slide.editarSlide);

app.delete('/borrar-slide/:id', verificarToken, Slide.borrarSlide);

app.get('/mostrar-img/:imagen', verificarToken, Slide.mostrarImg);


//Exportar la ruta
module.exports = app;
const express = require('express');
const app = express();

//IMPORTAR EL CONTROLADOR
const Galeria = require('../controladores/galeria-controlador');

//CREAMOS LAS RUTAS HTTP
app.get('/mostrar-galeria', Galeria.mostrarGaleria);

app.post('/crear-galeria', Galeria.crearGaleria);

app.put('/editar-galeria/:id', Galeria.editarGaleria);

app.delete('/borrar-galeria/:id', Galeria.borrarGaleria);

//Exportar la ruta
module.exports = app;
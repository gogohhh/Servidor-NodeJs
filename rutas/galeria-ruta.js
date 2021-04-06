const express = require('express');
const app = express();

//IMPORTAR EL CONTROLADOR
const Galeria = require('../controladores/galeria-controlador');

const { verificarToken } = require('../middlewares/autenticacion');


//CREAMOS LAS RUTAS HTTP
app.get('/mostrar-galeria', Galeria.mostrarGaleria);

app.post('/crear-galeria', verificarToken, Galeria.crearGaleria);

app.put('/editar-galeria/:id', verificarToken, Galeria.editarGaleria);

app.delete('/borrar-galeria/:id', verificarToken, Galeria.borrarGaleria);

app.get('/mostrar-img-galeria/:imagen', Galeria.mostrarImg);

//Exportar la ruta
module.exports = app;
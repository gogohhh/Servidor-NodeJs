const express = require('express');
const app = express();

//IMPORTAR EL CONTROLADOR
const Articulos = require('../controladores/articulos-controlador');

const { verificarToken } = require('../middlewares/autenticacion');


//CREAMOS LAS RUTAS HTTP
app.get('/mostrar-articulos', Articulos.mostrarArticulos);

app.post('/crear-articulos', verificarToken, Articulos.crearArticulos);

app.put('/editar-articulos/:id', verificarToken, Articulos.editarArticulos);

app.delete('/borrar-articulos/:id', verificarToken, Articulos.borrarArticulos);

app.get('/mostrar-img-articulos/:imagen', verificarToken, Articulos.mostrarImg);

//Exportar la ruta
module.exports = app;
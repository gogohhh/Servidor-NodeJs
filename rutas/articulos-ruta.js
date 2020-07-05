const express = require('express');
const app = express();

//IMPORTAR EL CONTROLADOR
const Articulos = require('../controladores/articulos-controlador');

//CREAMOS LAS RUTAS HTTP
app.get('/mostrar-articulos', Articulos.mostrarArticulos);

//Exportar la ruta
module.exports = app;
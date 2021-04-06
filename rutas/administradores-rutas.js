const express = require('express');
const app = express();

//IMPORTAR EL CONTROLADOR
const Administradores = require("../controladores/administradores-contolador");

const { verificarToken } = require('../middlewares/autenticacion');

//CREAMOS LAS RUTAS HTTP
app.get('/mostrar-administradores', verificarToken,  Administradores.mostrarAdministradores);

app.post('/crear-administrador', verificarToken,  Administradores.crearAdministrador);

app.put('/editar-administrador/:id', verificarToken, Administradores.editarAdministrador);

app.delete('/borrar-administrador/:id', verificarToken, Administradores.borrarAdministrador);

app.post('/login', Administradores.login);

//Exportar la ruta
module.exports = app;
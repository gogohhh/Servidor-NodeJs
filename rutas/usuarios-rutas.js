const express = require('express');
const app = express();

//IMPORTAR EL CONTROLADOR
const Usuarios = require("../controladores/usuarios-contolador");

//CREAMOS LAS RUTAS HTTP
app.get('/mostrar-usuarios',  Usuarios.mostrarUsuarios);

app.post('/crear-usuario',  Usuarios.crearUsuario);

app.post('/login-usuario', Usuarios.loginUsuario);

//Exportar la ruta
module.exports = app;
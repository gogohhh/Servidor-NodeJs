//UBICAR LOS REQUERIMIENTOS

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');

//CREAMOS LA VARIANLE PARA LAS FUNCIONALIDADES DE EXPRESS
const app = express();

//PETICIÓN GET

app.get('/', (req,resp)=>{  //SE EJECUTA EN LA RUTA RAIZ
    //resp.send("Hola mundo desde express");

    let salida = {
        nombre:"Diego",
        edad:23,
        url: req.url
    }

    resp.send(salida);
}) 

//CONEXIÓN A LA BASE DE DATOS

mongoose.connect('mongodb://localhost:27017/apirest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, 
    (error, resp)=>{
        if(error) throw error;

        console.log("Conectado a la base de datos");
    }
);

//SALIDA DEL PUERTO

app.listen(4000, ()=>{
    console.log("Habilitado el puerto 4000");
})
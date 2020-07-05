//UBICAR LOS REQUERIMIENTOS

const express = require('express');

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

//SALIDA DEL PUERTO

app.listen(4000, ()=>{
    console.log("Habilitado el puerto 4000");
})
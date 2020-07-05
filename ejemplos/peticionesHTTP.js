//UBICAR LOS REQUERIMIENTOS

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

//CREAMOS LA VARIANLE PARA LAS FUNCIONALIDADES DE EXPRESS
const app = express();

//MIDDLEWARE PARA BODYPARSER, LOS MIDDLEWARE SON FUNCIONES QUE SE UTILIZAN EN EL ENTORNO DE TRABAJO

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//ESQUEMA PARA EL MODELO CONECTOR A MONGODB
let esquema = mongoose.Schema;

let slideEsquema = new esquema({
    imagen:{
        type:String,
        required:[true,"La imagen es obligarotia"]
    },
    titulo:{
        type:String,
        require:false
    },
    descripcion:{
        type:String,
        require:false
    }
})

//SE DECLARA EL MODELO CON EL NOMBRE DE LA COLECCION DE LA BASE DE DATOS QUE QUEREMOS TRABAJAR Y DESPUES EL ESQUEMA
const Slide = mongoose.model("slides", slideEsquema);

//PETICIÓN GET ****************************************************************

app.get('/', (req,resp)=>{  //SE EJECUTA EN LA RUTA RAIZ
    //resp.send("Hola mundo desde express");

    Slide.find({})
    .exec((error, data)=>{
        if(error){
            return resp.json({
                status:500,
                mensaje:"Error en la petición"
            })
        }
        resp.json({
            status:200,
            data
        })
    })
}) 

//PETICIÓN POST *********************************************************************
app.post('/crear-slide', (req, res)=>{
    let slide = req.body;
    res.json({
        slide
    })
})

//PETICIÓN PUT *********************************************************************
app.put('/editar-slide/:id', (req, res)=>{
    let slide = req.params.id;
    res.json({
        id
    })
})

//PETICIÓN DELEETE *********************************************************************
app.delete('/eliminar-slide/:id', (req, res)=>{
    let slide = req.params.id;
    res.json({
        id
    })
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
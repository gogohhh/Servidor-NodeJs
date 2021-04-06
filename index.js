//UBICAR LOS REQUERIMIENTOS

require("./config.js");

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');

//CREAMOS LA VARIANLE PARA LAS FUNCIONALIDADES DE EXPRESS
const app = express();

//LLAMADA AL CORS PARA UTILIZAR RECURSOS DE DIFERENTES PUERTOS
const cors = require('cors');

//MIDDLEWARE PARA BODYPARSER, LOS MIDDLEWARE SON FUNCIONES QUE SE UTILIZAN EN EL ENTORNO DE TRABAJO
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit:'10mb', extended: true }));

//parse application/json
app.use(bodyParser.json({ limit:'10mb', extended: true }));

//MIDDLEWARE PARA FILEUPLOAD
app.use(fileUpload());

//EJECUCIÓN DE CORS
app.use(cors());

//MOONGOSE DEPRECATIONS PARA EVITAR LAS DESAPROVACIONES
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', false);

//IMPORTAMOS LAS RUTAS
app.use(require('./rutas/slide-ruta'));
app.use(require('./rutas/galeria-ruta'));
app.use(require('./rutas/articulos-ruta'));
app.use(require('./rutas/administradores-rutas'));
app.use(require('./rutas/usuarios-rutas'));

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

app.listen(process.env.PORT, ()=>{
    console.log(`Habilitado el puerto ${process.env.PORT}`);
})
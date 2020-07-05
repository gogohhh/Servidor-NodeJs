const mongoose = require('mongoose');

//ESQUEMA PARA EL MODELO CONECTOR A MONGODB
let esquema = mongoose.Schema;

let slideEsquema = new esquema({
    imagen:{
        type:String,
        required:[true,"La imagen es obligatoria"]
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
module.exports = mongoose.model("slides", slideEsquema);
const mongoose = require('mongoose');

//ESQUEMA PARA EL MODELO CONECTOR A MONGODB
let esquema = mongoose.Schema;

let articulosEsquema = new esquema({
    portada:{
        type:String,
        required:[true,"La portada es obligatoria"]
    },
    url:{
        type:String,
        require:[true,"La url es obligatoria"]
    },
    titulo:{
        type:String,
        require:[true,"El titulo es obligarotio"]
    },
    intro:{
        type:String,
        require:[true,"La intro es obligatoria"]
    },
    contenido:{
        type:String,
        require:[true,"El contenido es obligatorio"]
    }
})

//SE DECLARA EL MODELO CON EL NOMBRE DE LA COLECCION DE LA BASE DE DATOS QUE QUEREMOS TRABAJAR Y DESPUES EL ESQUEMA
module.exports = mongoose.model("articulos", articulosEsquema);
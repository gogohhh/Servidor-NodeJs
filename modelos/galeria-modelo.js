const mongoose = require('mongoose');

//ESQUEMA PARA EL MODELO CONECTOR A MONGODB
let esquema = mongoose.Schema;

let galeriaEsquema = new esquema({
    foto:{
        type:String,
        required:[true,"La imagen es obligarotia"]
    }
})

//SE DECLARA EL MODELO CON EL NOMBRE DE LA COLECCION DE LA BASE DE DATOS QUE QUEREMOS TRABAJAR Y DESPUES EL ESQUEMA
module.exports = mongoose.model("galerias", galeriaEsquema);
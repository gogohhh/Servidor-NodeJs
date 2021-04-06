const mongoose = require('mongoose');


//ESQUEMA PARA EL MODELO CONECTOR A MONGODB
let esquema = mongoose.Schema;

let administradoresEsquema = new esquema({
    usuario:{
        type:String,
        required:[true, "El usuario es requerido"],
        unique: true
    },
    password:{
        type:String,
        required:[true, "La contraseña es requerida"],
    }
})

//EVITAR DEVOLVER EN LA DATA EL CAMPO PASSWORD

administradoresEsquema.methods.toJSON = function(){
     let admin = this;
     let adminObject = admin.toObject();
     delete adminObject.password;

     return adminObject;
}

//SE DECLARA EL MODELO CON EL NOMBRE DE LA COLECCION DE LA BASE DE DATOS QUE QUEREMOS TRABAJAR Y DESPUES EL ESQUEMA
module.exports = mongoose.model("administradores", administradoresEsquema);


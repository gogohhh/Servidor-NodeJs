const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//ESQUEMA PARA EL MODELO CONECTOR A MONGODB
let esquema = mongoose.Schema;

let usuariosEsquema = new esquema({
    usuario:{
        type:String,
        required:[true, "El usuario es requerido"],
        unique: true
    },
    password:{
        type:String,
        required:[true, "La contraseña es requerida"],
    },
    email:{
        type:String,
        required:[true, "El email es requerido"],
        unique: true
    }
})

//EVITAR DEVOLVER EN LA DATA EL CAMPO PASSWORD

usuariosEsquema.methods.toJSON = function(){
     let usuario = this;
     let usuarioObject = usuario.toObject();
     delete usuarioObject.password;

     return usuarioObject;
}

//DEVOLVER MENSAJE PERSONALIZADO PARA VALIDACIONES UNICAS
usuariosEsquema.plugin(uniqueValidator, {message: 'El {PATH} ya esta registrado en la base de datos'})


//SE DECLARA EL MODELO CON EL NOMBRE DE LA COLECCION DE LA BASE DE DATOS QUE QUEREMOS TRABAJAR Y DESPUES EL ESQUEMA
module.exports = mongoose.model("usuarios", usuariosEsquema);


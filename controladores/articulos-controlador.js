//IMPORTAR EL MODELO CON EL QUE SE VA A TRABAJAR Y SE DECARA EN LA CARPETA DE MODELOS

const Articulos = require('../modelos/articulos-modelo');

//PETICIÓN GET ****************************************************************

let mostrarArticulos = (req,resp)=>{  //SE EJECUTA EN LA RUTA RAIZ
    //resp.send("Hola mundo desde express");

    Articulos.find({})
    .exec((error, data)=>{
        if(error){
            return resp.json({
                status:500,
                mensaje:"Error en la petición"
            })
        }
        //CONTAR LA CANTIDAD DE REGISTROS
        Articulos.countDocuments({}, (error, total)=>{
            if(error){
                return resp.json({
                    status:500,
                    mensaje:"Error en la petición"
                })
            }

            resp.json({
                status:200,
                total,
                data
            })
        })
    })
}

//EXPORTAR LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    mostrarArticulos
}
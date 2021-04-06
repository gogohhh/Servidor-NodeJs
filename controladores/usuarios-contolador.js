//IMPORTAMOS EL MODELO
const Usuarios = require('../modelos/usuarios-modelo');

//REQUERIMOS EL MODULO PARA ENCRIPTAR CONTRASEÑAS
const bcrypt = require('bcrypt');

//FUNCION GET

let mostrarUsuarios = (req, res) => {
    Usuarios.find({})
    .exec((error, data)=>{
        if(error){
            return res.json({
                status:500,
                mensaje:"Error en la petición"
            })
        }

    //CONTAR LA CANTIDAD DE REGISTROS
        Usuarios.countDocuments({}, (error, total)=>{
            if(error){
                return res.json({
                    status:500,
                    mensaje:"Error en la petición"
                })
            }

            res.json({
                status:200,
                total,
                data
            })
        })
    })
}

//FNCIÓN POST

let crearUsuario = (req, res) =>{
    //Obtener el cuerpo del formulario
    let body = req.body;

    let usuarios = new Usuarios({
        usuario:body.usuario,
        password:bcrypt.hashSync(body.password,10),
        email:body.email
    })

    //GUARDAMOS LOS DATOS EN MONGO DB CON LA FUNCION .save
    usuarios.save((err,data)=>{
        if(err){
            return res.json({
                status:400,
                mensaje: err.message,
                err
            })
        }
        return res.json({
            status:200,
            data,
            mensaje:"El usuario ha sido creado con exito."
        })
    })
}

//FUNCIÓN LOGIN

let loginUsuario = (req, res)=>{
    let body = req.body;

    //Recoremos el cuerpo del formulario
    Usuarios.findOne({usuario:body.usuario}, (err,data)=>{
        if(err){
            return res.json({
                status:500,
                mensaje:"Error al borrar el servidor",
                err
            })
        }

        //Validar que ek usuario exista
        if(!data){
            return res.json({
                status: 400,
                mensaje:"El usuario es incorrecto"
            })
        }

        //VALIDAR QUE LA CONTRASEÑA EXISTA O SEA CORRECTA
        if(!bcrypt.compareSync){
            return res.json({
                status: 400,
                mensaje:"La contraseña es incorrecta"
            })
        }
        res.json({
            status:200,
            mensaje: "OK"
        })
    })

}

module.exports = {
    mostrarUsuarios,
    crearUsuario,
    loginUsuario
}
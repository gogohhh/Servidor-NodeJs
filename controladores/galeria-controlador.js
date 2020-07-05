//IMPORTAR EL MODELO CON EL QUE SE VA A TRABAJAR Y SE DECARA EN LA CARPETA DE MODELOS

const Galeria = require('../modelos/galeria-modelo');

//IMPORTAR fs para la administración de archivos y carpetas en NodeJS

const fs = require('fs');

//PETICIÓN GET ****************************************************************

let mostrarGaleria = (req,resp)=>{  //SE EJECUTA EN LA RUTA RAIZ
    

    Galeria.find({})
    .exec((error, data)=>{
        if(error){
            return resp.json({
                status:500,
                mensaje:"Error en la petición"
            })
        }

    //CONTAR LA CANTIDAD DE REGISTROS
        Galeria.countDocuments({}, (error, total)=>{
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

//CREAMOS LA FUNCIÓN POST
let crearGaleria = (req, resp)=>{

    //Creamos el cuerpo del formulario
    let body = req.body;
    
    //Funcion express-uploadfiles que verifica si viene un archivo
    if(!req.files){
        return resp.json({
            status:500,
            mensaje:"La imagen no puede ir vacia"
        })
    }

                    //CAPTURAMOS EL ARCHIVO
    
    let archivo = req.files.archivo;
    console.log("Archivo ",archivo);
    
    //Validación de la extencion del archivo
    if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){
        return resp.json({
            status:400,
            mensaje:"El formato de la imagen debe ser JPEG o PNG"
        })
    }

    //VALIDACIÓN DEL TAMAÑO DE LA IMAGEN
    if(archivo.size > 2000000){
        return resp.json({
            status:400,
            mensaje:"El tamaño de la imagen debe ser menor a 2MB"
        })
    }

    //CAMBIAR NOMBRE DEL ARCHIVO
    let nombre = Math.floor(Math.random()*10000);
    

    //CAPTURAR LA EXTENSIÓN DEL ARCHIVO
    let extension =  archivo.name.split('.').pop();

    //MOVEMOS EL ARCHIVO A LA CARPETA
    archivo.mv(`./archivos/galeria/${nombre}.${extension}`, err => {
        if(err){
            return resp.json({
                status:400,
                mensaje: "Error al guardar la imagen",
                err
            })
        }
        //Obtenemos los datos del formulario para pasarlos al modelo
        let galeria = new Galeria({
            foto:`${nombre}.${extension}`
        })
        //GUARDAMOS LOS DATOS EN MONGO DB CON LA FUNCION .save
        galeria.save((err,data)=>{
            if(err){
                return resp.json({
                    status:200,
                    mensaje: "Error al almacenar la foto de la galeria",
                    err
                })
            }
            return resp.json({
                status:200,
                data,
                mensaje:"La foto de la galeria ha sido creada con exito."
            })
        })
    })

}

//FUNCIÓN PUT PARA EDITAR LA GALERIA
let editarGaleria = (req, resp)=>{
    //Capturar el id
    let id = req.params.id;

    //Capturamos el body
    let body = req.body;

            //VALIDAR QUE EXISTA LA GALERIA QUE SE QUIERE EDITAR
            
    Galeria.findById(id, (err, data)=>{
        //Validar que no ocurra error en el proceso
        if(err){
            return resp.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //Existencia de la foto de la galeria
        if(!data){
            return resp.json({
                status:400,
                mensaje:"La foto de la galeria no existe en la base de datos",
                err
            })
        }

        let rutaImagen = data.foto;

        //2. VALIDAR QUE SE HAYAN EFECTUADO CAMBIOS EN LA IMAGEN

        let validarCambioArchivo = (req, rutaImagen)=>{
            return new Promise((resolve, reject)=>{

                if(req.files){

                    let archivo = req.files.archivo;
                    console.log("Archivo ",archivo);
                        
                    //Validación de la extencion del archivo
                    if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){
                        
                        let respuesta = {
                            resp: resp,
                            mensaje: "El formato de la imagen debe ser JPEG o PNG"
                        }

                        reject(respuesta);
                    }

                    //VALIDACIÓN DEL TAMAÑO DE LA IMAGEN
                    if(archivo.size > 2000000){
                        let respuesta = {
                            resp: resp,
                            mensaje: "El peso de la imagen debe ser menos a 2MB"
                        }

                        reject(respuesta);

                    }

                    //CAMBIAR NOMBRE DEL ARCHIVO
                    let nombre = Math.floor(Math.random()*10000);
                        
                    //CAPTURAR LA EXTENSIÓN DEL ARCHIVO
                    let extension =  archivo.name.split('.').pop();

                    //MOVER EL ARCHIVO A LA CARPETA
                    archivo.mv(`./archivos/galeria/${nonbre}.${extension}`, err=>{
                        if(err){
                            let respuesta = {
                                resp: resp,
                                mensaje: "Error al guardar la imagen"
                            }
                            reject(respuesta);
                        }

                        //BORRAR LA IMAGEN ANTIGUA
                        if(fs.existsSync(`./archivos/galeria/${rutaImagen}`)){
                            fs.unlinkSync(`./archivos/galeria/${rutaImagen}`);
                        }


                        //SE LE DA NUEVO VALOR A LA IMAGEN
                        rutaImagen = `${nonbre}.${extension}`;
                        resolve(rutaImagen);
                    })

                }else{
                    resolve(rutaImagen);
                }
            })
        }
        

        // 3. ACTUALIZAR LOS REGISTROS
        let cambiarRegistroBD = (id, rutaImagen)=>{
            return new Promise((resolve, reject)=>{

                let datosGaleria = {
                    foto:rutaImagen
                }
        
                //Actulizamos en MongoDB
                Galeria.findByIdAndUpdate(id, datosGaleria, {new:true, runValidators:true},(err, data)=>{
                    if(err){

                     let respuesta = {
                        resp: resp,
                        err:err
                     } 

                     reject(respuesta);

                     //return resp.json({
                        //status:400,
                       //mensaje:"Error al editar la galeria",
                        //err
                     //})
                    }

                    //resp.json({
                       // status:200,
                        // data,
                        // mensaje:"La galeria se actualizo con exito"
                    // })

                    let respuesta = {
                        resp:resp,
                        data:data
                    }
                    resolve(respuesta);
                })
            })
        }


        //SINCRONIZAMOS AMBAS PROMESAS
        validarCambioArchivo(req, rutaImagen).then( rutaImagen =>{

            cambiarRegistroBD(id, rutaImagen).then(respuesta => {

                respuesta["resp"].json({
                    status:200,
                    data: respuesta["data"],
                    mensaje:"La foto de la galeria ha sido actualizado con exito"
                })
            }).catch( respuesta => {
                respuesta["resp"].json({
                    status:400,
                    err: respuesta["err"],
                    mensaje:"Error al editar la galeria (err)"
                })
            })

        }).catch( respuesta => {
            respuesta["resp"].json({
                status:400,
                mensaje:respuesta["mensaje"]
            })
         })
        
    })

}

//FUNCIÓN DELETE

let borrarGaleria = (req, res) => {
    //Capturamos el id de la galeria que vamos a borrar

    let id = req.params.id;

    //VALIDAR QUE EXISTA LA GALERIA QUE SE QUIERE EDITAR
            
    Galeria.findById(id, (err, data)=>{
        //Validar que no ocurra error en el proceso
        if(err){
            return resp.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //Existencia de la galeria
        if(!data){
            return resp.json({
                status:400,
                mensaje:"La galeria no existe en la base de datos",
                err
            })
        }

        //BORRAR LA IMAGEN ANTIGUA
        if(fs.existsSync(`./archivos/galeria/${data.foto}`)){
            fs.unlinkSync(`./archivos/galeria/${data.foto}`);
        }

        //BORRAMOS EL REGISTRO EN MOGODB

        Galeria.findByIdAndRemove(id, (err, data) => {
            if(err){
                return res.json({
                    status:500,
                    mensaje:"Error al borrar la foto de la galeria",
                    err
                })
            }

            return res.json({
                status:200,
                mensaje:"La foto de la galeria ha sido borrado correctamente"
            })
        })
    })
}

//EXPORTAR LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    mostrarGaleria,
    crearGaleria,
    editarGaleria,
    borrarGaleria
}
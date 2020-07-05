//IMPORTAR EL MODELO CON EL QUE SE VA A TRABAJAR Y SE DECARA EN LA CARPETA DE MODELOS

const Slide = require('../modelos/slide-modelo');

//IMPORTAR fs para la administración de archivos y carpetas en NodeJS

const fs = require('fs');

//PETICIÓN GET ****************************************************************

let mostrarSlide = (req,resp)=>{  //SE EJECUTA EN LA RUTA RAIZ
    

    Slide.find({})
    .exec((error, data)=>{
        if(error){
            return resp.json({
                status:500,
                mensaje:"Error en la petición"
            })
        }

    //CONTAR LA CANTIDAD DE REGISTROS
        Slide.countDocuments({}, (error, total)=>{
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
let crearSlide = (req, resp)=>{

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
    archivo.mv(`./archivos/slide/${nombre}.${extension}`, err => {
        if(err){
            return resp.json({
                status:400,
                mensaje: "Error al guardar la imagen",
                err
            })
        }
        //Obtenemos los datos del formulario para pasarlos al modelo
        let slide = new Slide({
            imagen:`${nombre}.${extension}`,
            titulo:body.titulo,
            descripcion:body.descripcion
        })
        //GUARDAMOS LOS DATOS EN MONGO DB CON LA FUNCION .save
        slide.save((err,data)=>{
            if(err){
                return resp.json({
                    status:200,
                    mensaje: "Error al almacenar el slide",
                    err
                })
            }
            return resp.json({
                status:200,
                data,
                mensaje:"El slide ha sido creado con exito."
            })
        })
    })

}

//FUNCIÓN PUT PARA EDITAR EL SLIDE
let editarSlide = (req, resp)=>{
    //Capturar el id
    let id = req.params.id;

    //Capturamos el body
    let body = req.body;

            //VALIDAR QUE EXISTA EL SLIDE QUE SE QUIERE EDITAR
            
    Slide.findById(id, (err, data)=>{
        //Validar que no ocurra error en el proceso
        if(err){
            return resp.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //Existencia del slide
        if(!data){
            return resp.json({
                status:400,
                mensaje:"El slide no existe en la base de datos",
                err
            })
        }

        let rutaImagen = data.imagen;

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
                    archivo.mv(`./archivos/slide/${nonbre}.${extension}`, err=>{
                        if(err){
                            let respuesta = {
                                resp: resp,
                                mensaje: "Error al guardar la imagen"
                            }
                            reject(respuesta);
                        }

                        //BORRAR LA IMAGEN ANTIGUA
                        if(fs.existsSync(`./archivos/slide/${rutaImagen}`)){
                            fs.unlinkSync(`./archivos/slide/${rutaImagen}`);
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
        let cambiarRegistroBD = (body, id, rutaImagen)=>{
            return new Promise((resolve, reject)=>{

            
                let datosSlide = {
                    imagen:rutaImagen,
                    titulo:body.titulo,
                    descripcion: body.descripcion
                }
        
                //Actulizamos en MongoDB
                Slide.findByIdAndUpdate(id, datosSlide, {new:true, runValidators:true},(err, data)=>{
                    if(err){

                     let respuesta = {
                        resp: resp,
                        err:err
                     } 

                     reject(respuesta);

                     //return resp.json({
                        //status:400,
                       //mensaje:"Error al editar el slide",
                        //err
                     //})
                    }

                    //resp.json({
                       // status:200,
                        // data,
                        // mensaje:"El slide se actualizo con exito"
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

            cambiarRegistroBD(id, body, rutaImagen).then(respuesta => {

                respuesta["resp"].json({
                    status:200,
                    data: respuesta["data"],
                    mensaje:"El slide ha sido actualizado con exito"
                })
            }).catch( respuesta => {
                respuesta["resp"].json({
                    status:400,
                    err: respuesta["err"],
                    mensaje:"Error al editar el slide (err)"
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

let borrarSlide = (req, res) => {
    //Capturamos el id del slide que vamos a borrar

    let id = req.params.id;

    //VALIDAR QUE EXISTA EL SLIDE QUE SE QUIERE EDITAR
            
    Slide.findById(id, (err, data)=>{
        //Validar que no ocurra error en el proceso
        if(err){
            return resp.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //Existencia del slide
        if(!data){
            return resp.json({
                status:400,
                mensaje:"El slide no existe en la base de datos",
                err
            })
        }

        //BORRAR LA IMAGEN ANTIGUA
        if(fs.existsSync(`./archivos/slide/${data.imagen}`)){
            fs.unlinkSync(`./archivos/slide/${data.imagen}`);
        }

        //BORRAMOS EL REGISTRO EN MOGODB

        Slide.findByIdAndRemove(id, (err, data) => {
            if(err){
                return res.json({
                    status:500,
                    mensaje:"Error al borrar el slide",
                    err
                })
            }

            return res.json({
                status:200,
                mensaje:"El slide ha sido borrado correctamente"
            })
        })
    })
}

//EXPORTAR LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    mostrarSlide,
    crearSlide,
    editarSlide,
    borrarSlide
}
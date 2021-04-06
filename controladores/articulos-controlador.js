//IMPORTAR EL MODELO CON EL QUE SE VA A TRABAJAR Y SE DECARA EN LA CARPETA DE MODELOS

const Articulos = require('../modelos/articulos-modelo');

//IMPORTAR fs para la administración de archivos y carpetas en NodeJS

const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const path = require('path');
const { exists } = require('../modelos/articulos-modelo');

//PETICIÓN GET ****************************************************************

let mostrarArticulos = (req,resp)=>{  //SE EJECUTA EN LA RUTA RAIZ
    

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

//CREAMOS LA FUNCIÓN POST
let crearArticulos = (req, resp)=>{

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

    //CREAMOS LA NUEVA CARPETA CON LA URL
    let crearCarpeta = mkdirp.sync(`./archivos/articulos/${body.url}`);

    //MOVEMOS EL ARCHIVO A LA CARPETA
    archivo.mv(`./archivos/articulos/${body.url}/${nombre}.${extension}`, err => {
        if(err){
            return resp.json({
                status:400,
                mensaje: "Error al guardar la imagen",
                err
            })
        }

        //Obtenemos los datos del formulario para pasarlos al modelo
        let articulos = new Articulos({
            portada:`${nombre}.${extension}`,
            titulo:body.titulo,
            intro:body.intro,
            url:body.url,
            contenido:body.contenido
        })

        //GUARDAMOS LOS DATOS EN MONGO DB CON LA FUNCION .save
        articulos.save((err,data)=>{
            if(err){
                return resp.json({
                    status:200,
                    mensaje: "Error al almacenar el artículo",
                    err
                })
            }
            return resp.json({
                status:200,
                data,
                mensaje:"El artículo ha sido creado con exito."
            })
        })
    })

}

//FUNCIÓN PUT PARA EDITAR EL ARTICULO
let editarArticulos = (req, resp)=>{
    //Capturar el id
    let id = req.params.id;

    //Capturamos el body
    let body = req.body;

            //VALIDAR QUE EXISTA EL ARTICULO QUE SE QUIERE EDITAR
            
    Articulos.findById(id, (err, data)=>{
        //Validar que no ocurra error en el proceso
        if(err){
            return resp.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //Existencia del articulo
        if(!data){
            return resp.json({
                status:400,
                mensaje:"El articulo no existe en la base de datos",
                err
            })
        }

        let rutaImagen = data.portada;

        //2. VALIDAR QUE SE HAYAN EFECTUADO CAMBIOS EN LA IMAGEN

        let validarCambioArchivo = (req, body, rutaImagen)=>{
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
                    archivo.mv(`./archivos/articulos/${body.url}/${nonbre}.${extension}`, err=>{
                        if(err){
                            let respuesta = {
                                resp: resp,
                                mensaje: "Error al guardar la imagen"
                            }
                            reject(respuesta);
                        }

                        //BORRAR LA IMAGEN ANTIGUA
                        if(fs.existsSync(`./archivos/articulos/${body.url}/${rutaImagen}`)){
                            fs.unlinkSync(`./archivos/articulos/${body.url}/${rutaImagen}`);
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

            
                let datosArticulos = {
                    portada:rutaImagen,
                    titulo:body.titulo,
                    intro: body.intro,
                    url:body.url,
                    contenido:body.contenido
                }
        
                //Actulizamos en MongoDB
                Articulos.findByIdAndUpdate(id, datosArticulos, {new:true, runValidators:true},(err, data)=>{
                    if(err){

                     let respuesta = {
                        resp: resp,
                        err:err
                     } 

                     reject(respuesta);

                     //return resp.json({
                        //status:400,
                       //mensaje:"Error al editar el articulo",
                        //err
                     //})
                    }

                    //resp.json({
                       // status:200,
                        // data,
                        // mensaje:"El articulo se actualizo con exito"
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
        validarCambioArchivo(req, body, rutaImagen).then( rutaImagen =>{

            cambiarRegistroBD(id, body, rutaImagen).then(respuesta => {

                respuesta["resp"].json({
                    status:200,
                    data: respuesta["data"],
                    mensaje:"El articulo ha sido actualizado con exito"
                })
            }).catch( respuesta => {
                respuesta["resp"].json({
                    status:400,
                    err: respuesta["err"],
                    mensaje:"Error al editar el articulo (err)"
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

let borrarArticulos = (req, res) => {
    //Capturamos el id del articulo que vamos a borrar

    let id = req.params.id;

    //VALIDAR QUE EXISTA EL ARTICULO QUE SE QUIERE EDITAR
            
    Articulos.findById(id, (err, data)=>{
        //Validar que no ocurra error en el proceso
        if(err){
            return resp.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }
        //Existencia del articulo
        if(!data){
            return resp.json({
                status:400,
                mensaje:"El articulo no existe en la base de datos",
                err
            })
        }

        //BORRAR LA CARPETA DEL ARTICULO
        
        let rutaCarpeta = `./archivos/articulos/${data.url}`;

        rimraf.sync(rutaCarpeta);

        //BORRAMOS EL REGISTRO EN MOGODB

        Articulos.findByIdAndRemove(id, (err, data) => {
            if(err){
                return res.json({
                    status:500,
                    mensaje:"Error al borrar el articulo",
                    err
                })
            }

            return res.json({
                status:200,
                mensaje:"El articulo ha sido borrado correctamente"
            })
        })
    })
}

//FUNCIÓN GET PARA MOSTRAR LOS ARTICULOS DESDE EL SERVIDOR

let mostrarImg = (req, res)=>{
    let imagen = req.params.imagen.split('+');
    let rutaImagen = `./archivos/articulos/${imagen[0]}/${imagen[1]}`;

    fs.exists(rutaImagen, exists=>{

        if(!exists){
            return res.json({
                status:400,
                mensaje: "La imagen no existe"
            })
        }

        res.sendFile(path.resolve(rutaImagen));
    })
}

//EXPORTAR LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    mostrarArticulos,
    crearArticulos,
    editarArticulos,
    borrarArticulos,
    mostrarImg
}
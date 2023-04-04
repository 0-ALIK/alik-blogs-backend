const express = require('express');
const cors = require('cors');
const path = require('path');
const connection = require('../config/connection');
const fileUpload = require('express-fileupload');
const { usuario, blog, like, seguidor, comentario, auth, upload } = require('../routes');

/**
 * Esta clase define toda la configuración del servidor y API REST, como los Middlewares, las rutas, Sockets y conexiones con bases de datos
 */
class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
        this.paths = {
            usuario: '/api/usuario',
            blog: '/api/blog',
            like: '/api/like',
            comentario: '/api/comentario',
            seguidor: '/api/seguidor',
            auth: '/api/auth',
            upload: '/api/upload'
        }

        this.connection(); 
        this.middlewares();
        this.rutas();
    }

    /**
     * Realiza la coneccion a la base de datos
     */
    async connection() {
        await connection(); 
    }

    /**
     * Define los middlewares generales de la API
     */
    middlewares() {
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use( express.static('../public') );
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }) );
    }

    /**
     * Define las rutas endpoints del API REST
     */
    rutas() {
        this.app.get( '*', (req, res) => {
            res.sendFile( path.resolve(__dirname, '../public/index.html') );
        });
        this.app.use( this.paths.usuario, usuario );
        this.app.use( this.paths.blog, blog );
        this.app.use( this.paths.like, like );
        this.app.use( this.paths.seguidor, seguidor ); 
        this.app.use( this.paths.comentario, comentario ); 
        this.app.use( this.paths.auth, auth ); 
        this.app.use( this.paths.upload, upload );
    }

    /**
     * Enciende el API REST
     */
    init() {
        this.app.listen( this.PORT, () => {
            console.log('API started') ;
        });
    }

}   

module.exports = Server;
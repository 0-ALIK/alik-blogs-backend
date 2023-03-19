const express = require('express');
const cors = require('cors');
const connection = require('../config/connection');
const fileUpload = require('express-fileupload');
const { usuario, blog, like, seguidor, comentario, auth } = require('../routes');

class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
        this.paths = {
            usuario: '/usuario',
            blog: '/blog',
            like: '/like',
            comentario: '/comentario',
            seguidor: '/seguidor',
            auth: '/auth'
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
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }) );
    }

    /**
     * Define las rutas endpoints del API REST
     */
    rutas() {
        this.app.use( this.paths.usuario, usuario );
        this.app.use( this.paths.blog, blog );
        this.app.use( this.paths.like, like );
        this.app.use( this.paths.seguidor, seguidor ); 
        this.app.use( this.paths.comentario, comentario ); 
        this.app.use( this.paths.auth, auth ); 
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
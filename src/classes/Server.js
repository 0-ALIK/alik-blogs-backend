const express = require('express');
const cors = require('cors');
const connection = require('../config/connection');
const { usuario, blog, like, seguidor, comentario, auth } = require('../routes');
const { Usuario } = require('../models');

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
        this.test();
    }

    /**
     * Define los middlewares generales de la API
     */
    middlewares() {
        this.app.use( cors );
        this.app.use( express.json() );
    }

    async test() {

        try {
            const usuario = new Usuario({
                correo: 'correoXcorreo.com',
                nombre: 'pepe a', 
                pass: '1234',
            });
    
            await usuario.save()        
        } catch (error) {
            const validationErrors = Object.values(error.errors).map((error) => error.message);
                console.log(validationErrors);
        }
    
        
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
     * Realiza la coneccion a la base de datos
     */
    async connection() {
        await connection(); 
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
const { validarJWT } = require('../helpers/jwt-helpers');
const { validationResult } = require('express-validator');
const { Blog } = require('../models');
const { generarError } = require('../helpers/functions-helpers');

const validarJWTMiddleware = async ( req, res, next ) => {
    const token = req.header('x-token');

    if(!token) 
        return generarError(401, 'no se ha enviado el token', res);

    const { usuario, msg, tokenRenovado } = await validarJWT( token );

    if(!usuario) 
        return generarError(401, msg, res);

    if(tokenRenovado) {
        req.tokenRenovado = tokenRenovado;
    }

    req.usuarioAuth = usuario;
        
    next();
};

const mostrarErrores = ( req, res, next ) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()) {
        const errors = validation.array().map(error => {
            return {msg: error.msg};
        });
        return res.status(400).json({errors});
    }

    next();
};

const moverArchivosAlBody = (req, res, next) => {
    if (req.files) {
        for (const key in req.files) {
            req.body[key] = req.files[key];
        }
    }

    next();
};

/**
 * Middleware parametrizado para saber si un blog pertenece o no a un usuario, utilizar luego de haber aplicado validarJWTMiddleware y noExisteBlogById
 * @param {*} pertenece Define el modo en el que funcionará la función
 * @returns Un middleware
 */
const blogPerteneceUsuario = (pertenece = true) => {
    return async (req, res, next) => {
        const usuarioAuth = req.usuarioAuth;
        const { blogid } = req.params;
        const blog = await Blog.findOne({
            usuario: usuarioAuth._id,
            _id: blogid
        });

        if(pertenece && !blog) 
            return generarError(401, 'no tienes autorización para acceder a este blog', res);

        if(!pertenece && blog)
            return generarError(401, 'no puedes realizar esta acción sobre un blog de tu propiedad', res);
        
        next();
    };
};

module.exports = {
    validarJWTMiddleware,
    mostrarErrores,
    moverArchivosAlBody,
    blogPerteneceUsuario
}


/*

*/
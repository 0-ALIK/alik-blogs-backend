const { validarJWT } = require('../helpers/jwt-helpers');
const { validationResult } = require('express-validator');

const validarJWTMiddleware = async ( req, res, next ) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'no se envio en token en la petición'
        });
    }

    const { usuario, msg, tokenRenovado } = await validarJWT( token );

    if(!usuario) {
        return res.status(401).json({
            msg: msg
        });
    }

    if(tokenRenovado) {
        req.tokenRenovado = tokenRenovado;
    }

    req.usuarioAuth = usuario;
        
    next();
}

const mostrarErrores = ( req, res, next ) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json(errores);
    }

    next();
}

module.exports = {
    validarJWTMiddleware,
    mostrarErrores
}
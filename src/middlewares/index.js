const {response, request} = require('express');
const { validarJWT } = require('../helpers/jwt-helpers');
const { validationResult } = require('express-validator');

const validarJWTMiddleware = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    const { usuario, msg } = await validarJWT( token );

    if(!usuario) {
        return res.status(401).json({
            msg: msg
        });
    }

    req.usuarioAuth = usuario;
        
    next();

}

const mostrarErrores = (req, res, next) => {
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
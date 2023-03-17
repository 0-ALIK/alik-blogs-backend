const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const { Usuario } = require('../models');

/**
 * Genera un jwt nuevo, guardando el id del usuario en el payload
 * @param {*} _id Es el id del usuario
 * @returns Una promesa con el jwt
 */
const generarJWT = ( _id = '' ) => {

    return new Promise( (resolve, reject) => {
        
        const payload = { _id };

        jwt.sign( payload, SECRET, {
            expiresIn: '24h'
        }, (error, token) => {
            if(error) {
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

/**
 * Renueva el jwt del usuario autenticado si a su jwt le quedan 4 horas para expirar
 * @param {*} token Es el jwt actual del usuario autenticado
 * @param {*} usuarioAuth Es el usuario autenticado
 * @returns El nuevo token en caso de que se haya renovado, sino retorna undefined
 */
const renovarJWT = async (token = '', usuarioAuth) => {
    try {
        const decoded = jwt.verify( token, SECRET );
    
        const fechaExpiracion = new Date( decoded.exp * 1000 );
    
        const milisegRestantes = fechaExpiracion - new Date();
    
        if(milisegRestantes <= 14400000) {
            const token = await generarJWT( usuarioAuth._id );
            return token;
        }
    } catch (error) {
        return undefined;
    }
};

/**
 * Se encarga de validar el jwt del usuario para saber si es valido
 * @param {*} token Es el jwt del usuario
 * @returns Un objeto con la información de la validación
 */
const validarJWT = async (token = '') => {
    try {
        
        if(!token) {
            return {msg: 'no se envio ningun el token'}
        }

        const { _id } = jwt.verify( token, SECRET );

        const usuario = await Usuario.findById( _id ); 

        if(!usuario) {
            return {msg: 'usuario no existe'}
        }

        if(!usuario.estado) {
            return {msg: 'usuario deshabilitado'}
        }

        return {
            usuario,
            msg: 'validación exitosa'
        }

    } catch (error) {
        return {msg: 'token no valido'};
    }
};

module.exports = {
    generarJWT,
    renovarJWT,
    validarJWT
};
const { Usuario } = require("../models");

const existeUsuarioById = async (_id = '') => {
    try {
        const usuario = await Usuario.findById( _id );
        if(!usuario) {
            throw new Error('no existe un usuario con el id: '+_id);
        }
    } catch (error) {
        throw new Error('algo salió mal obteniendo al usuario por id');
    }
};

const noExisteUsuarioByCorreo = async (correo = '') => {
    try {
        const usuario = await Usuario.findOne( {correo} );
        if(correo) {
            throw new Error('ya existe un usuario con el correo: '+correo);
        }
    } catch (error) {
        throw new Error('algo salió mal obteniendo al usuario por correo');
    }
};

module.exports = {
    noExisteUsuarioByCorreo,
    existeUsuarioById
};
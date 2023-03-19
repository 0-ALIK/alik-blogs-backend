const { Usuario, Blog } = require('../models');

const nameRegExp = /^[a-zA-Z0-9_]+$/; 

const correoRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const passRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

const extensiones = ['png', 'jpg', 'gif'];

const noExisteUsuarioById = async (_id) => {
    const usuario = await Usuario.findById( _id );
    if(!usuario || !usuario.estado) {
        throw new Error('no existe un usuario con el id: '+_id);
    }
    return true;
};

const noExisteBlogById = async (_id) => {
    const blog = await Blog.findById( _id ).populate({
        path: 'usuario',
        match: {estado: true},
        select: '-pass -__v',
        options: { strict: false }
    });
    if(!blog || !blog.publicado) {
        throw new Error('no existe un blog con el id: '+_id);
    }
    return true;
};

const existeUsuarioByCorreo = async (correo) => {
    const usuario = await Usuario.findOne( {correo} );
    if(usuario) {
        throw new Error('ya existe un usuario con el correo: '+correo);
    }
    return true;
};

const validarExtension = (imagen) => {
    const arreglo = imagen.name.split('.');
    const extension = arreglo[ arreglo.length - 1 ].toLowerCase();
    if(!extensiones.includes(extension)) {
        throw new Error('la extensión '+extension+' no esta permitida, '+extensiones);
    }
    return true; 
}

module.exports = {
    existeUsuarioByCorreo,
    noExisteUsuarioById,
    noExisteBlogById,
    validarExtension,
    nameRegExp,
    correoRegExp,
    passRegExp,
    extensiones
};
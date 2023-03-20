const { Usuario, Blog } = require('../models');

const nameRegExp = /^[a-zA-Z0-9_]+$/; 

const correoRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const passRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

const extensiones = ['png', 'jpg', 'gif'];

/**
 * Esta función se utiliza con el custom de express-validator, utilizar sólo cuando sea realmente nesesario para no hacer doble consulta a la base de datos
 * @param {*} _id Es el id del usuario a validar su existencia
 * @returns true, en caso de si existir
 */
const noExisteUsuarioById = async (_id) => {
    const usuario = await Usuario.findById( _id );
    if(!usuario || !usuario.estado) {
        throw new Error('no existe un usuario con el id: '+_id);
    }
    return true;
};

/**
 * Esta función retorna una validación customizada de express-validatiors
 * @param {*} publicado define si se tomará en cuenta si esta publicado o no
 * @returns validación customizada
 */
const noExisteBlogById = (publicado = true) => {
    return async (_id) => {
        const blog = await Blog.findById( _id )
        .select({usuario: 0})
        .populate({
            path: 'usuario',
            match: {estado: true},
            select: '-pass -__v',
            options: { strict: false }
        });
        if( (publicado && !blog && !blog.publicado) || (!publicado && !blog) ) {
            throw new Error('no existe un blog con el id: '+_id);
        }
        return true;
    };
};

/**
 * Esta función se utiliza con el custom de express-validator, utilizar sólo cuando sea realmente nesesario para no hacer doble consulta a la base de datos
 * @param {*} correo Es el correo del usuario a validar
 * @returns true, en caso de no existir
 */
const existeUsuarioByCorreo = async (correo) => {
    const usuario = await Usuario.findOne( {correo} );
    if(usuario) {
        throw new Error('ya existe un usuario con el correo: '+correo);
    }
    return true;
};

/**
 * Esta función se utiliza con el custom de express-validator, utilizar sólo cuando sea realmente nesesario para no hacer doble consulta a la base de datos
 * @param {*} nombre Es el nombre del usuario a validar
 * @returns true, en caso de no existir
 */
const existeUsuarioByNombre = async (nombre) => {
    const usuario = await Usuario.findOne( {nombre} );
    if(usuario) {
        throw new Error('ya existe un usuario con el nombre: '+nombre);
    }
    return true;
};

/**
 * Esta función se utiliza con el custom de express-validator, valida un file tenga la extensión de imagen correcta
 * @param {*} imagen Es el file que se va a validar
 * @returns true, en caso de que su extensión sea la correcta
 */
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
    existeUsuarioByNombre,
    nameRegExp,
    correoRegExp,
    passRegExp,
    extensiones
};
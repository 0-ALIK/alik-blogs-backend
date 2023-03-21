const { errorPeticion, generarError } = require('../helpers/functions-helpers');
const { subirImagen, borrarImagen } = require('../helpers/cloudinary-helpers');
const { Usuario } = require('../models');
const { genSaltSync, hashSync } = require('bcrypt');

const getAll = async (req, res  ) => {
    try {
        const { limit = 10, skip = 0 } = req.query;
    
        const usuarios = await Usuario.find( {estado: true} )
            .limit( Number(limit) )
            .skip( Number(skip) );
    
        res.status(200).json({
            cantidad: usuarios.length,
            usuarios
        });

    } catch (error) {
        errorPeticion( res, error );
    }
};

const getById = async (req, res  ) => {
    try {
        const { userid } = req.params;
    
        const usuario = await Usuario.findById( userid );

        if(!usuario || !usuario.estado) 
            return generarError(404, 'no existe un usuario con el id '+userid, res);

        res.status(200).json({ usuario });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getByName = async (req, res  ) => {
    try {
        const { nombre } = req.params;
        const regex = new RegExp(nombre, 'i');
    
        const usuarios = await Usuario.find( {nombre: regex} );
    
        res.status(200).json( {usuarios} );
    } catch (error) {
        errorPeticion( res, error );
    }
};

const postUsuario = async (req, res  ) => {
    try {
        const { nombre, pass, correo } = req.body;

        const usuario = new Usuario({
            nombre,
            pass,
            correo
        });

        const salt = genSaltSync();
        usuario.pass = hashSync( pass, salt );

        await usuario.save();

        res.status(201).json(usuario);
        
    } catch (error) {
        errorPeticion( res, error );
    }
};

const putUsuario = async (req, res  ) => {
    try {
        const { nombre, about } = req.body;
        let { img } = req.body;
        const usuarioAuth = req.usuarioAuth;

        if( img ) {
            const { path } = await subirImagen( img.tempFilePath );
            img = path;
            if (usuarioAuth.img) {
                borrarImagen( usuarioAuth.img ); 
            }
        }

        const usuario = await Usuario.findByIdAndUpdate(usuarioAuth._id, {
            nombre,
            about,
            img
        }, {new: true});

        res.status(200).json({tokenRenovado: req.tokenRenovado, usuario})
    } catch (error) {
        errorPeticion( res, error );
    }
};

const deshabilitar = async (req, res  ) => {
    try {
        const usuarioAuth = req.usuarioAuth;
        
        // Este es el usuario deshabilitado
        const usuario = await Usuario.findByIdAndUpdate(
            usuarioAuth._id, 
            {estado: false}, 
            {new: true}
        );

        if (usuario.img) {
            borrarImagen( usuario.img );
        }
        
        res.status(200).json({
            usuario
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

module.exports = {
    getAll,
    getById,
    getByName,
    postUsuario,
    putUsuario,
    deshabilitar
};
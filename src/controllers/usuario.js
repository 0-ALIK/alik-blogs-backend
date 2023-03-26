const { errorPeticion, generarError } = require('../helpers/functions-helpers');
const { subirImagen, borrarImagen } = require('../helpers/cloudinary-helpers');
const { Usuario, Blog } = require('../models');
const { genSaltSync, hashSync } = require('bcrypt');
const { generarJWT } = require('../helpers/jwt-helpers');

const getAll = async (req, res  ) => {
    try {
        const { limit = 10, skip = 0 } = req.query;

        const [usuarios, cantidad] = await Promise.all([
            Usuario.find( {estado: true} )
                .limit( Number(limit) )
                .skip( Number(skip) ),
            Usuario.countDocuments({estado: true})
        ]);
    
        res.status(200).json({
            cantidad,
            usuarios
        });

    } catch (error) {
        errorPeticion( res, error );
    }
};

const find = async (req, res) => {
    try {
        const { nombre, correo } = req.query; 
        const query = {};

        if(nombre) 
            query.nombre = nombre;
            
        if(correo) 
            query.correo = correo;

        const usuarios = await Usuario.find(query);
        res.status(200).json({
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

        const token = await generarJWT( usuario._id );

        res.status(201).json({
            token,
            usuario
        });
        
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

        await Blog.updateMany({usuario: usuarioAuth._id}, {publicado: false});
        
        res.status(200).json({
            usuario
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

module.exports = {
    getAll,
    find,
    getById,
    getByName,
    postUsuario,
    putUsuario,
    deshabilitar
};
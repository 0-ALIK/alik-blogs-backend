const { request, response } = require('express');
const { errorPeticion, arregloErroresSave } = require('../helpers/functions-helpers');
const { Usuario } = require('../models');
const { genSaltSync, hashSync } = require('bcrypt')

const getAll = async (req = request, res = response) => {
    try {
        const { limit = 10, skip = 0 } = req.query;

        console.log(Usuario);
    
        const [cantidad, usuarios] = await Promise.all([
            Usuario.countDocuments( {estado: true} ),
            Usuario.find( {estado: true} )
                .limit( Number(limit) )
                .skip( Number(skip) )
        ]);
    
        res.status(200).json({
            cantidad,
            usuarios
        });

    } catch (error) {
        errorPeticion( res );
    }
};

const getById = async (req = request, res = response) => {
    try {
        const { userid } = req.params;
    
        const usuario = await Usuario.findById( userid );

        res.status(200).json( {usuario} );
    } catch (error) {
        errorPeticion( res );
    }
};

const getByName = async (req = request, res = response) => {
    try {
        const { nombre } = req.params;
        const regex = new RegExp(nombre, 'i');
    
        const usuarios = await Usuario.find( {nombre: regex} );
    
        res.status(200).json( {usuarios} );
    } catch (error) {
        errorPeticion( res );
    }
};

const postUsuario = async (req = request, res = response) => {
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

        res.status(201).json({
            usuario
        });
        
    } catch (error) {
        if(error.errors) {
            const errores = arregloErroresSave( error );
            res.status(400).json( {errores} ); 
        }
        errorPeticion( res );
    }
};

const putUsuario = async (req = request, res = response) => {
    try {
        const { nombre, pass, correo } = req.body;
        const usuarioAuth = req.usuarioAuth;

        const usuario = await Usuario.findByIdAndUpdate(usuarioAuth._id, {
            nombre,
            pass,
            correo
        }, {new: true});

        res.status(200).json({tokenRenovado: req.tokenRenovado, usuario})
    } catch (error) {
        errorPeticion( res );
    }
};

const deshabilitar = async (req = request, res = response) => {
    try {
        const usuarioAuth = req.usuarioAuth;

        const usuarioDeshabilitado = await Usuario.findByIdAndUpdate(usuarioAuth._id, 
            {estado: true}, 
            {new: true});
        
        res.status(200).json({
            usuarioDeshabilitado
        });
    } catch (error) {
        errorPeticion( res );
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
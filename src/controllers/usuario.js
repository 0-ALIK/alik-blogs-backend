const { request, response } = require('express');
const { errorPeticion } = require('../helpers/functions-helpers');
const { Usuario } = require('../models');
const { genSaltSync, hashSync } = require('bcrypt')

const getAll = async (req = request, res = response) => {
    try {
        const { limit = 10, skip = 0 } = req.query;
    
        const [cantidad, usuarios] = Promise.all([
            await Usuario.countDocuments( {estado: true} ),
            await Usuario.find( {estado: true} )
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

const postUser = async (req = request, res = response) => {
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
        
    } catch (error) {
        errorPeticion( res );
    }
};

module.exports = {
    getAll,
    getById,
    getByName,
    postUser
};
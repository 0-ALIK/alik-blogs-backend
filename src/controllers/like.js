const { request, response } = require('express');
const { errorPeticion } = require('../helpers/functions-helpers');
const { Like } = require('../models');

const populationUsuarios = {
    path: 'usuario',
    match: { estado: true },
    select: '-pass -__v -estado -fecha -correo -nombre',
    options: { strict: false }
};

const populationBlogs = {
    path: 'blog',
    match: { estado: true },
    select: '-__v -contenido -fecha -publicado',
    options: { strict: false }
};

const getUsuariosLike = async (req = request, res = response) => {
    try {
        const { blogid } = req.params;

        const usuarios = await Like.find({blog: blogid})
            .populate( populationUsuarios )
            .select({blog: 0});

        res.status(200).json({
            cantidad: usuarios.length,
            usuarios
        });
    } catch (error) {
        errorPeticion( res, error ); 
    }
};

const getBlogsLike = async (req = request, res = response) => {
    try {
        const { userid } = req.params;

        const blogs = await Like.find({usuario: userid})
            .populate( populationBlogs )
            .select({usuario: 0});

        res.status(200).json({
            cantidad: blogs.length,
            blogs
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const darLike = async (req = request, res = response) => {
    try {
        const { blogid } = req.params; 
        const userid = req.usuarioAuth._id;

        const like = new Like({
            blog: blogid,
            usuario: userid
        });

        await like.save();

        res.status(201).json({
            tokenRenovado: req.tokenRenovado,
            like
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const quitarLike = async (req = request, res = response) => {
    try {
        const { blogid } = req.params; 
        const userid = req.usuarioAuth._id;

        
        //tokenRenovado: req.tokenRenovado
    } catch (error) {
        errorPeticion( res, error );
    }
};

module.exports = {
    getUsuariosLike,
    getBlogsLike,
    darLike,
    quitarLike
};
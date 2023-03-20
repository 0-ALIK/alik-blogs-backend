const { request, response } = require('express');
const { errorPeticion, generarError } = require('../helpers/functions-helpers');
const { subirImagen, borrarImagen } = require('../helpers/cloudinary-helpers');
const { Blog } = require('../models');

const population = {
    path: 'usuario',
    match: { estado: true },
    select: '-pass -__v',
    options: { strict: false }
};

const getAll = async (req = request, res = response) => {
    try {
        const { limit = 10, skip = 0 } = req.query;

        const blogs = await Blog.find( {publicado: true} )
            .limit( Number(limit) )
            .skip( Number(skip) )
            .populate( population )
            .sort({fecha: 'desc'});
        
        res.status(200).json({
            cantidad: blogs.length,
            blogs
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getById = async (req = request, res = response) => {
    try {
        const { blogid } = req.params;

        const blog = await Blog.findById( blogid ).populate( population );

        if(!blog || !blog.publicado)
            return generarError(404, 'no se encontro un blog con el id: '+blogid, res);

        res.status(200).json(blog);
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getAllByUserId = async (req = request, res = response) => {
    try {
        const { userid } = req.params;

        const blogs = await Blog.find({publicado: true, usuario: userid});

        res.status(200).json({
            cantidad: blogs.length,
            blogs
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getByTitle = async (req = request, res = response) => {
    try {
        const { titulo } = req.params;
        const regex = new RegExp(titulo, 'i');

        const blogs = await Blog.find({titulo: regex}).populate(population);

        res.status(200).json(blogs);
    } catch (error) {
        
    }
};

const getAllNoPub = async (req = request, res = response) => {
    try {
        const usuarioAuth = req.usuarioAuth;

        const blogs = await Blog.find({
            publicado: false, 
            usuario: usuarioAuth._id
        });

        res.status(200).json(blogs);
    } catch (error) {
        errorPeticion( res, error );
    }
};

const postBlog = async (req = request, res = response) => {
    try {
        const { titulo } = req.body;
        const usuarioAuth = req.usuarioAuth;
        let { portada } = req.body;

        if( portada ){
            const { path } = await subirImagen( portada.tempFilePath );
            portada = path;
        }

        const blog = new Blog({
            titulo,
            usuario: usuarioAuth._id,
            portada
        });

        await blog.save();

        res.status(200).json({
            tokenRenovado: req.tokenRenovado,
            blog
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const putBlog = async (req = request, res = response) => {
    try {
        const { blogid } = req.params;
        const { titulo, contenido, publicado } = req.body;
        let { portada } = req.body;

        if( portada ) {
            const { path } = await subirImagen( portada.tempFilePath );
            portada = path;
            const blog = await Blog.findById( blogid );
            if(blog.portada) {
                borrarImagen( blog.portada );
            }
        }

        const blog = await Blog.findByIdAndUpdate( blogid, {
            titulo,
            contenido,
            publicado,
            portada
        });

        res.status(201).json({
            blog
        });

    } catch (error) {
        errorPeticion( res, error );
    }
};

const deleteBlog = async (req = request, res = response) => {
    try {
        const { blogid } = req.params;

        const blog = await Blog.findByIdAndDelete( blogid );

        res.status(204).json({
            blog
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

module.exports = {
    getAll,
    getById,
    getAllByUserId,
    getByTitle,
    getAllNoPub,
    postBlog,
    putBlog,
    deleteBlog
};
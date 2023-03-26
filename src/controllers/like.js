const { errorPeticion } = require('../helpers/functions-helpers');
const { Like } = require('../models');

const populationUsuarios = {
    path: 'usuario',
    match: { estado: true },
    select: '-pass -__v -estado -fecha -correo',
    options: { strict: false }
};

const populationBlogs = {
    path: 'blog',
    match: { publicado: true },
    select: '-__v -contenido -fecha -publicado',
    options: { strict: false }
};

const getUsuariosLike = async (req, res) => {
    try {
        const { blogid } = req.params;

        const likes = await Like.find({blog: blogid})
            .populate( populationUsuarios )
            .select({blog: 0, _id: 0});

        const usuarios = likes.map( like => like.usuario );

        res.status(200).json({
            cantidad: usuarios.length,
            usuarios
        });
    } catch (error) {
        errorPeticion( res, error ); 
    }
};

const getBlogsLike = async (req , res) => {
    try {
        const { userid } = req.params;

        const likes = await Like.find({usuario: userid})
            .populate( populationBlogs )
            .select({usuario: 0, _id: 0});

        const blogs = likes.map( like => like.blog );

        res.status(200).json({
            cantidad: blogs.length,
            blogs
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const darLike = async (req, res) => {
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

const quitarLike = async (req, res) => {
    try {
        const { blogid } = req.params; 
        const userid = req.usuarioAuth._id;

        const like = await Like.deleteOne({usuario: userid, blog: blogid});
    
        res.status(200).json({
            tokenRenovado: req.tokenRenovado,
            like
        });
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
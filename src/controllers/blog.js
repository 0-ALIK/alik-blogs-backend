const { errorPeticion, generarError } = require('../helpers/functions-helpers');
const { subirImagen, borrarImagen } = require('../helpers/cloudinary-helpers');
const { Blog, Comentario, Like } = require('../models');

const population = {
    path: 'usuario',
    match: { estado: true },
    select: '-pass -__v -estado -fecha -correo',
    options: { strict: false }
};

const getAll = async (req , res ) => {
    try {
        const { limit = 10, skip = 0 } = req.query;

        const [blogs, cantidad] = await Promise.all([
            Blog.find( {publicado: true} )
                .limit( Number(limit) )
                .skip( Number(skip) )
                .populate( population )
                .select({contenido: 0, publicado: 0})
                .sort({fecha: 'desc'}),
            Blog.countDocuments( {publicado: true} )
                .populate( population )
        ]);
        
        res.status(200).json({
            cantidad,
            blogs
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getById = async (req , res ) => {
    try {
        const { blogid } = req.params;

        const blog = await Blog.findById( blogid ).populate( population );

        if(!blog || !blog.publicado)
            return generarError(404, 'no se encontro un blog con el id: '+blogid, res);

        res.status(200).json({blog});
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getAllByUserId = async (req , res ) => {
    try {
        const { userid } = req.params;

        const blogs = await Blog.find({publicado: true, usuario: userid})
            .select({usuario: 0})
            .sort({fecha: 'desc'});

        res.status(200).json({
            cantidad: blogs.length,
            blogs
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getByTitle = async (req , res ) => {
    try {
        const { titulo } = req.params;
        const regex = new RegExp(titulo, 'i');

        const blogs = await Blog.find({titulo: regex}).populate(population);

        res.status(200).json({blogs});
    } catch (error) {
        
    }
};

const getAllNoPub = async (req , res ) => {
    try {
        const usuarioAuth = req.usuarioAuth;

        const blogs = await Blog.find({
            publicado: false, 
            usuario: usuarioAuth._id
        });

        res.status(200).json({
            tokenRenovado: req.tokenRenovado,
            cantidad: blogs.length,
            blogs
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getByIdAuth = async (req, res) => {
    try {
        const { blogid } = req.params;
        const usuarioAuth = req.usuarioAuth;

        const blog = await Blog.findOne({_id: blogid, usuario: usuarioAuth._id});

        if(!blog) {
            generarError(404, 'No existe blog', res);
        }

        res.status(200).json({
            tokenRenovado: req.tokenRenovado,
            blog
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const postBlog = async (req , res ) => {
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

const putBlog = async (req , res ) => {
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
        }, {new: true});

        res.status(201).json({
            tokenRenovado: req.tokenRenovado,
            blog
        });

    } catch (error) {
        errorPeticion( res, error );
    }
};

const deleteBlog = async (req , res ) => {
    try {
        const { blogid } = req.params

        console.log('1')

        await Comentario.deleteMany({blog: blogid});
        await Like.deleteMany({blog: blogid});
        const blog = await Blog.findByIdAndDelete( blogid );

        if(blog.portada) {
            borrarImagen( blog.portada );
        }

        res.status(200).json({
            tokenRenovado: req.tokenRenovado,
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
    deleteBlog,
    getByIdAuth
};
const { errorPeticion, generarError } = require('../helpers/functions-helpers');
const { Comentario } = require('../models');

const population = {
    path: 'usuario',
    match: {estado: true},
    select: '-pass -__v -estado -fecha -correo',
    options: { strict: false }
};

const getAllById = async (req , res ) => {
    try {
        const { blogid } = req.params;

        const comentarios = await Comentario.find({blog: blogid})
            .populate( population )
            .select({blog: 0});

        res.status(200).json({
            comentarios,
            cantidad: comentarios.length
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const postComentario = async (req , res ) => {
    try {
        const userid = req.usuarioAuth._id;
        const { blogid } = req.params;
        const { contenido } = req.body;

        const comentario = new Comentario({
            usuario: userid,
            blog: blogid,
            contenido
        });

        await comentario.save();

        res.status(201).json({
            tokenRenovado: req.tokenRenovado,
            comentario
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const deleteComentario = async (req , res ) => {
    try {
        const { comentarioid } = req.params;
        const userid = req.usuarioAuth._id;

        const comentarioTest = await Comentario.findOne({
            _id: comentarioid,
            usuario: userid
        });

        if(!comentarioTest)
            return generarError(401, 'este comentario no te pertenece', res);

        const comentario = await Comentario.findByIdAndDelete( comentarioid );

        res.status(200).json({
            tokenRenovado: req.tokenRenovado,
            comentario
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

module.exports = {
    getAllById,
    postComentario,
    deleteComentario
};
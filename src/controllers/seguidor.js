const { errorPeticion } = require('../helpers/functions-helpers');
const { Seguidor } = require('../models');

const getSeguidores = async (req, res  ) => {
    try {
        const { userid } = req.params;

        const seguidores = await Seguidor.find({usuario: userid})
            .select({ _id: 0, usuario: 0 })
            .populate({
                path: 'seguidor', 
                match: { estado: true }, 
                options: { strict: false },
                select: '-pass -__v'
            });
            
        const usuarios = seguidores.map(seguidor => seguidor.seguidor);

        res.status(200).json({
            cantidad: usuarios.length,
            usuarios
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const getAmigos = async (req, res  ) => {
    try {
        const { userid } = req.params;

        const seguidores = await Seguidor.find({usuario: userid});

        const seguidoresIds = seguidores.map( seguidor => seguidor.seguidor );

        const amigos = await Seguidor.find({
            usuario: {$in: seguidoresIds},
            seguidor: userid
        })
        .select({ _id: 0, seguidor: 0 })
        .populate({
            path: 'usuario', 
            match: { estado: true }, 
            options: { strict: false },
            select: '-pass -__v'
        });

        const usuarios = amigos.map(amigo => amigo.usuario);

        res.status(200).json({
            cantidad: usuarios.length,
            usuarios
        });
    } catch (error) {
        console.log(error);
        errorPeticion( res, error );
    }
};

const usuariosQueSigue = async (req, res  ) => {
    try {
        const { userid } = req.params;

        const seguidos = await Seguidor.find({seguidor: userid})
            .select({  _id: 0, seguidor: 0 })
            .populate({
                path: 'usuario', 
                match: { estado: true }, 
                options: { strict: false },
                select: '-pass -__v'
            });

        const usuarios = seguidos.map(seguido => seguido.usuario);

        res.status(200).json({
            cantidad: usuarios.length,
            usuarios
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const seguirUsuario = async (req, res  ) => {
    try {
        const { userid } = req.params;
        const usuarioAuth = req.usuarioAuth;

        console.log(userid);

        const seguidor = new Seguidor({
            usuario: userid,
            seguidor: usuarioAuth._id
        });

        await seguidor.save();

        res.status(201).json({
            tokenRenovado: req.tokenRenovado,
            seguidor
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

const dejarDeSeguir = async (req, res  ) => {
    try {
        const { userid } = req.params;
        const usuarioAuth = req.usuarioAuth;

        await Seguidor.findOneAndDelete({
            usuario: userid,
            seguidor: usuarioAuth
        });

        res.status(200).json({
            tokenRenovado: req.tokenRenovado,
            msg: 'has dejado de seguir a este usuario'
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

module.exports = {
    getSeguidores,
    usuariosQueSigue,
    seguirUsuario,
    dejarDeSeguir,
    getAmigos
};
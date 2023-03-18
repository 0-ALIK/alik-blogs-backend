const { compareSync } = require('bcrypt');
const { Usuario } = require('../models');
const { errorPeticion } = require('../helpers/functions-helpers');
const { generarJWT } = require('../helpers/jwt-helpers');

const login = async (req, res  ) => {
    const { correo, pass } = req.body;

    try {
        const usuario = await Usuario.findOne( {correo} );

        const isPassCorrect = compareSync( pass, usuario.pass || '' );

        if(!usuario || !isPassCorrect) {
            return res.status(400).json({msg: 'el correo / contraseña no son validos'});
        }

        if(!usuario.estado) {
            return res.status(400).json({msg: 'el usuario esta deshabilitado'});
        }

        const token = await generarJWT( usuario._id );

        res.status(200).json({
            token,
            usuario
        });

    } catch (error) {
        errorPeticion( res, error );
    }
};

const verificarAuth = async (req, res  ) => {
    const tokenRenovado = req.tokenRenovado

    res.status(200).json({
        usuario: req.usuarioAuth,
        tokenRenovado    
    });
};

module.exports = {
    login,
    verificarAuth
};
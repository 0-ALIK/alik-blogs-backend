const { subirImagen, borrarImagen } = require('../helpers/cloudinary-helpers');
const { errorPeticion, generarError } = require('../helpers/functions-helpers');

// /upload/subir
const subir = async (req, res) => {
    try {
        const { imagen } = req.body;
        const { path, msg } = await subirImagen( imagen.tempFilePath );

        if(msg) {
            generarError(500, msg, res);
        }

        res.status(201).json({
            tokenRenovado: req.tokenRenovado,
            path
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

// /upload/borrar
const borrar = async (req, res) => {
    try {
        const { src } = req.body;
        
        await borrarImagen( src );

        res.status(200).json({
            tokenRenovado: req.tokenRenovado,
            path: src
        });
    } catch (error) {
        errorPeticion( res, error );
    }
};

module.exports = {
    subir,
    borrar
};
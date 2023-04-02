const cloudinary = require('cloudinary').v2;
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
const cheerio = require('cheerio');
cloudinary.config( CLOUDINARY_URL );

/**
 * Subir una imagen a Cloudinary
 * @param {*} tempFile Es el directorio temporal dende se guarda la imagen enviada en el body de una petición HTTP
 * @returns Un Objeto {} que puede contener el path o el msg de error en caso de que salga mal
 */
const subirImagen = async tempFile => {
    try {
        const path = await cloudinary.uploader.upload( tempFile );
        return {path: path.url};
    } catch (error) {
        return {msg: 'algo salio mal al subir la imagen'};
    }
}

/**
 * Borrar una imagen de Cloudinary, esta función se encarga de obtener el id del src de la imagen para proceder con su eliminación
 * @param {*} src Es el path src de la imagen en cloudinary
 * @returns retorna un mensaje en caso de que salga mal
 */
const borrarImagen = async (src = '') => {
    try {
        const srcSplit = src.split('/');
        const id = srcSplit[ srcSplit.length - 1 ].split('.')[0];

        await cloudinary.uploader.destroy( id );
    } catch (error) {
        console.log(error);
    }
}

const borrarVariasImagen = async (text = '') => {
    try {
        const $ = cheerio.load(text);
        const idList = $('img').map(function() {
            const srcSplit = $(this).attr('src').split('/');
            const id = srcSplit[ srcSplit.length - 1 ].split('.')[0];
            return id;
        }).get();

        idList.forEach( async (id) => {
            try {
                await cloudinary.uploader.destroy( id );
            } catch (error) {
                console.log('Error al eliminar la imagen con id '+id);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    borrarVariasImagen,
    subirImagen,
    borrarImagen
};
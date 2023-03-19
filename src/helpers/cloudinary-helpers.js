const cloudinary = require('cloudinary').v2;
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
cloudinary.config( CLOUDINARY_URL );

/**
 * Subir una imagen a Cloudinary
 * @param {*} tempFile Es el directorio temporal dende se guarda la imagen
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
 * Borrar una imagen de Cloudinary
 * @param {*} src Es el path src de la imagen en cloudinary
 * @returns retorna un mensaje en caso de que salga mal
 */
const borrarImagen = async (src = '') => {
    try {
        srcSplit = src.split('/');
        const id = srcSplit[ srcSplit.length - 1 ].split('.')[0];
        await cloudinary.uploader.destroy( id );
    } catch (error) {
        return 'algo salio mal al eliminar la imagen';
    }
}

module.exports = {
    subirImagen,
    borrarImagen
};
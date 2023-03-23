const { Router } = require('express');
const { check } = require('express-validator');
const { subir, borrar } = require('../controllers/upload');
const { validarJWTMiddleware, moverArchivosAlBody, mostrarErrores } = require('../middlewares');
const { validarExtension } = require('../helpers/data-base-helpers');
const router = Router();

router.post( '/subir', [
    
    moverArchivosAlBody,
    check('imagen', 'no es una imagen valida').notEmpty().isObject(),
    check('imagen').custom( validarExtension ),
    mostrarErrores
], subir );

router.delete( '/borrar', [
    
    check('src', 'no es un url valido de cloudinary').notEmpty().isURL(),
    mostrarErrores
], borrar )

module.exports = router;
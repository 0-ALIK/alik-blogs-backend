const { Router } = require('express');
const { check } = require('express-validator');
const { getAll, getById, getAllByUserId, getByTitle, getAllNoPub, postBlog, putBlog, deleteBlog } = require('../controllers/blog');
const { validarExtension, noExisteBlogById } = require('../helpers/data-base-helpers');
const { mostrarErrores, validarJWTMiddleware, moverArchivosAlBody, blogPerteneceUsuario } = require('../middlewares');

const router = Router();

router.get( '/all', getAll );

router.get( '/:blogid', [
    check('blogid', 'el id debe ser un id valido de mongo').notEmpty().isMongoId(),
    mostrarErrores
], getById );

router.get( '/all/:userid', [
    check('userid', 'el id debe ser un id valido de mongo').notEmpty().isMongoId(),
    mostrarErrores
], getAllByUserId );

router.get( '/titulo/:titulo', [
    check('titulo', 'el query de búsqueda es obligatorio').notEmpty(),
    check('titulo', 'la búsqueda debe tener mínimo 2 caracteres').isLength( {min: 2} ),
    mostrarErrores
], getByTitle );

// Requiere autenticación
router.get( '/no/publicados', [
    validarJWTMiddleware
], getAllNoPub );

// Requiere autenticación
router.post( '/', [ 
    validarJWTMiddleware,
    moverArchivosAlBody,
    check('titulo', 'el titulo debe tener mínimo 2 caracteres y máximo 30').notEmpty().isLength({min: 2, max: 50}),
    check('portada', 'no es una imagen valida').optional().isObject(),
    check('portada').optional().custom( validarExtension ),
    mostrarErrores
], postBlog );

// Requiere autenticación
router.put( '/:blogid', [
    validarJWTMiddleware,
    moverArchivosAlBody,
    check('blogid', 'no es un id valido de mongo').isMongoId(),
    check('blogid').custom( noExisteBlogById( false ) ),
    mostrarErrores,
    blogPerteneceUsuario(),
    check('titulo', 'el titulo debe tener mínimo 2 caracteres y máximo 30')
        .optional()
        .isLength({min: 2, max: 50}),
    check('portada').optional().custom( validarExtension ),
    mostrarErrores
], putBlog );

// Requiere autenticación
router.delete( '/:blogid', [
    validarJWTMiddleware,
    check('blogid', 'no es un id valido de mongo').isMongoId(),
    mostrarErrores,
    blogPerteneceUsuario
], deleteBlog );

module.exports = router; 
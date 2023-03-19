const { Router } = require('express');
const { check } = require('express-validator');
const { getAll, getById, getAllByUserId, getByTitle, getAllNoPub, postBlog, putBlog, deleteBlog } = require('../controllers/blog');
const { noExisteBlogById, noExisteUsuarioById, validarExtension } = require('../helpers/data-base-helpers');
const { mostrarErrores, validarJWTMiddleware, moverArchivosAlBody } = require('../middlewares');

const router = Router();

router.get( '/all', getAll );

router.get( '/:blogid', [
    check('blogid', 'el id debe ser un id valido de mongo').notEmpty().isMongoId(),
    check('blogid').custom( noExisteBlogById ),
    mostrarErrores
], getById );

router.get( '/all/:userid', [
    check('userid', 'el id debe ser un id valido de mongo').notEmpty().isMongoId(),
    check('userid').custom( noExisteUsuarioById ),
    mostrarErrores
], getAllByUserId );

router.get( '/titulo/:titulo', [
    check('titulo', 'el query de búsqueda es obligatorio').notEmpty(),
    check('titulo', 'la búsqueda debe tener mínimo 2 caracteres').isLength( {min: 2} ),
    mostrarErrores
], getByTitle );

router.get( '/all/nopub', [
    validarJWTMiddleware
], getAllNoPub );

router.post( '/', [
    validarJWTMiddleware,
    moverArchivosAlBody,
    check('titulo', 'el titulo debe tener mínimo 2 caracteres y máximo 30').notEmpty().isLength({min: 2, max: 30}),
    check('portada', 'no es una imagen valida').optional().isObject(),
    check('portada').optional().custom( validarExtension ),
    mostrarErrores
], postBlog );

router.put( '/:blogid', [
    validarJWTMiddleware,
    mostrarErrores
], putBlog );

router.delete( '/:blogid', [
    validarJWTMiddleware,
    mostrarErrores
], deleteBlog );

module.exports = router; 
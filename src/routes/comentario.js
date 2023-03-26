const { Router } = require('express');
const { check } = require('express-validator');
const { getAllById, postComentario, deleteComentario } = require('../controllers/comentario');
const { noExisteBlogById, noExisteComentarioById } = require('../helpers/data-base-helpers');
const { mostrarErrores, validarJWTMiddleware } = require('../middlewares');

const router = Router();

router.get( '/all/:blogid', [
    check('blogid', 'el id debe ser un id valido de mongo').isMongoId(),
    check('blogid').custom( noExisteBlogById() ),
    mostrarErrores
], getAllById );

// Requiere autenticación
router.post( '/:blogid', [
    validarJWTMiddleware,
    check('blogid', 'el id debe ser un id valido de mongo').isMongoId(),
    check('blogid').custom( noExisteBlogById() ),
    check('contenido').notEmpty().isLength({min: 2, max: 150}),
    mostrarErrores
], postComentario );

// Requiere autenticación
router.delete( '/:comentarioid', [
    validarJWTMiddleware,
    check('comentarioid', 'el comentarioid debe ser un id valido de mongo').isMongoId(),
    check('comentarioid').custom( noExisteComentarioById ),
    mostrarErrores
], deleteComentario );

module.exports = router; 
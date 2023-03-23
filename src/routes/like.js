const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuariosLike, getBlogsLike, darLike, quitarLike } = require('../controllers/like');
const { noExisteBlogById, noExisteUsuarioById } = require('../helpers/data-base-helpers');
const { validarJWTMiddleware, mostrarErrores, blogPerteneceUsuario } = require('../middlewares');

const router = Router();

router.get( '/usuario/:blogid', [
    check('blogid', 'no es un id valido de mongo').isMongoId(),
    check('blogid').custom( noExisteBlogById() ),
], getUsuariosLike );

router.get( '/blog/:userid', [
    check('userid', 'no es un id valido de mongo').isMongoId(),
    check('userid').custom( noExisteUsuarioById )
], getBlogsLike );

// Requiere autenticación
router.post( '/:blogid', [
    validarJWTMiddleware,
    check('blogid', 'no es un id valido de mongo').isMongoId(),
    check('blogid').custom( noExisteBlogById() ),
    mostrarErrores,
    blogPerteneceUsuario( false )
], darLike );

// Requiere autenticación
router.delete( '/:blogid', [
    validarJWTMiddleware,
    check('blogid', 'no es un id valido de mongo').isMongoId(),
    check('blogid').custom( noExisteBlogById() ),
], quitarLike );

module.exports = router; 
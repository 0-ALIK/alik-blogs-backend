const { Router } = require('express');
const { seguirUsuario, dejarDeSeguir, usuariosQueSigue, getSeguidores, getAmigos } = require('../controllers/seguidor');
const { validarJWTMiddleware, mostrarErrores } = require('../middlewares');
const { check } = require('express-validator');
const { noExisteUsuarioById } = require('../helpers/data-base-helpers');

const router = Router();

router.get( '/seguidos/:userid', [
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    check('userid').custom( noExisteUsuarioById ),
    mostrarErrores
], usuariosQueSigue );

router.get( '/seguidores/:userid', [
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    check('userid').custom( noExisteUsuarioById ),
    mostrarErrores
], getSeguidores );

router.get( '/amigos/:userid', [
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    check('userid').custom( noExisteUsuarioById ),
    mostrarErrores
], getAmigos);

router.post( '/seguir/:userid', [
    validarJWTMiddleware,
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    check('userid').custom( noExisteUsuarioById ),
    mostrarErrores
], seguirUsuario );

router.delete( '/unfollow/:userid', [
    validarJWTMiddleware,
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    check('userid').custom( noExisteUsuarioById ),
    mostrarErrores
], dejarDeSeguir );

module.exports = router; 
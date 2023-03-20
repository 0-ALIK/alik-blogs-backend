const { Router } = require('express');
const { seguirUsuario, dejarDeSeguir, usuariosQueSigue, getSeguidores, getAmigos } = require('../controllers/seguidor');
const { validarJWTMiddleware, mostrarErrores } = require('../middlewares');
const { check } = require('express-validator');

const router = Router();

router.get( '/seguidos/:userid', [
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    mostrarErrores
], usuariosQueSigue );

router.get( '/seguidores/:userid', [
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    mostrarErrores
], getSeguidores );

router.get( '/amigos/:userid', [
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    mostrarErrores
], getAmigos);

// Requiere autenticación
router.post( '/seguir/:userid', [
    validarJWTMiddleware,
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    mostrarErrores
], seguirUsuario );

// Requiere autenticación
router.delete( '/unfollow/:userid', [
    validarJWTMiddleware,
    check('userid', 'el id debe ser un id de mongo').notEmpty().isMongoId(),
    mostrarErrores
], dejarDeSeguir );

module.exports = router; 
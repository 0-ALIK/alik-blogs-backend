const { Router } = require('express');
const { check } = require('express-validator');
const { login, verificarAuth } = require('../controllers/auth');
const { mostrarErrores, validarJWTMiddleware } = require('../middlewares');

const router = Router();

router.post( '/login', [
    check('correo', 'el correo es obligatorio').isEmail().notEmpty(),
    check('pass', 'la contraseña es obligatoria').notEmpty(),
    mostrarErrores
], login );

router.get( '/', [
    validarJWTMiddleware
], verificarAuth );

module.exports = router; 
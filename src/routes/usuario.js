const { Router } = require('express');
const { check } = require('express-validator');
const { getAll, getById, getByName, postUsuario, putUsuario, deshabilitar } = require('../controllers/usuario');
const { mostrarErrores, validarJWTMiddleware } = require('../middlewares');
const { existeUsuarioByCorreo, noExisteUsuarioById, nameRegExp, passRegExp } = require('../helpers/data-base-helpers');

const router = Router();

router.get( '/all', getAll );

router.get( '/nombre/:nombre', [
    check('nombre', 'el query de búsqueda es obligatorio').notEmpty(),
    check('nombre', 'la búsqueda debe tener mínimo 2 caracteres').isLength( {min: 2} ),
    mostrarErrores
], getByName );

router.get( '/:userid', [
    check('userid', 'el id debe ser un id valido de MongoDB').isMongoId(),
    check('userid').custom( noExisteUsuarioById ),
    mostrarErrores
], getById );

router.post( '/', [
    check('nombre', 'el nombre es obligatorio').notEmpty(),
    check('nombre', 'el nombre no cumple el formato valido').matches( nameRegExp ),
    check('pass', 'la contraseña es obligatoria').notEmpty(),
    check('pass', 'la contraseña no tiene un formato seguro').matches( passRegExp ).isLength({min: 8, max: 32}),
    check('correo', 'el correo es obligatorio').notEmpty(),
    check('correo', 'el correo no es valido').isEmail(),
    check('correo').custom( existeUsuarioByCorreo ),
    mostrarErrores
], postUsuario );

router.put('/', [
    validarJWTMiddleware,
    check('nombre', 'el nombre no cumple el formato valido').optional().matches( nameRegExp ),
    check('about', 'la descripción no puede superar los 200 caracteres').optional().isLength( {min: 2, max: 200} ),
    mostrarErrores
], putUsuario );

router.delete( '/', [
    validarJWTMiddleware
], deshabilitar );

module.exports = router; 

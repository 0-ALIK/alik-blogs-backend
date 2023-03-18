const { Router } = require('express');
const { check } = require('express-validator');
const { getAll, getById, getByName, postUsuario, putUsuario, deshabilitar } = require('../controllers/usuario');
const { mostrarErrores, validarJWTMiddleware } = require('../middlewares');
const { noExisteUsuarioByCorreo, existeUsuarioById, nameRegExp, passRegExp } = require('../helpers/data-base-helpers');

const router = Router();

router.get( '/all', getAll );

router.get( '/nombre/:nombre', [
    check('nombre', 'la búsqueda debe tener mínimo 2 caracteres').isLength( {min: 2} ),
    mostrarErrores
], getByName );

router.get( '/:userid', [
    check('userid', 'el id debe ser un id valido de MongoDB').isMongoId(),
    check('userid').custom( existeUsuarioById ),
    mostrarErrores
], getById );

router.post( '/', [
    check('nombre', 'el nombre es obligatorio').notEmpty(),
    check('nombre', 'el nombre no cumple el formato valido').matches( nameRegExp ),
    check('pass', 'la contraseña es obligatoria').notEmpty(),
    check('pass', 'la contraseña no tiene un formato seguro').matches( passRegExp ),
    check('correo', 'el correo es obligatorio').notEmpty(),
    check('correo', 'el correo no es valido').isEmail(),
    check('correo').custom( noExisteUsuarioByCorreo ),
    mostrarErrores
], postUsuario );

router.put('/', [
    validarJWTMiddleware,
    check('nombre', 'el nombre no cumple el formato valido').optional().matches( nameRegExp ),
    check('pass', 'la contraseña no tiene un formato seguro').optional().matches( passRegExp ),
    check('correo', 'el correo no es valido').optional().isEmail(),
    check('correo').optional().custom( noExisteUsuarioByCorreo ),
    mostrarErrores
], putUsuario );

router.delete( '/', [
    validarJWTMiddleware
], deshabilitar );

module.exports = router; 

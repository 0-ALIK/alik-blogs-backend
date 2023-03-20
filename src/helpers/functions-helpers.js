/**
 * Esta función generaliza una respuesta de error en caso de que algo salga mal a la hora de procesar una petición http
 * @param {*} res Es el parámetro de respuesta del controlador
 * @param {*} error Es el error producido por una petición fallida
 */
const errorPeticion = (res, error) => {
    res.status(500).json({
        errors: error
    });
}

/**
 * Esta función genera una respuesta de error con cierto formato
 * @param {*} codigo Es el código de status de la petición
 * @param {*} msg Es el mensaje de error
 * @param {*} res Es el parámetro de respuesta del middleware o controlador
 * @returns Una respuesta http final
 */
const generarError = (codigo, msg, res) => {
    return res.status(codigo).json({
        errors: [{msg}]
    });
};

module.exports = {
    errorPeticion,
    generarError
};
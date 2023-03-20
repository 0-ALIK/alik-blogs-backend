const errorPeticion = (res, error) => {
    res.status(500).json({
        errors: error
    });
}

const generarError = (codigo, msg, res) => {
    return res.status(codigo).json({
        errors: [{msg}]
    });
};

module.exports = {
    errorPeticion,
    generarError
};
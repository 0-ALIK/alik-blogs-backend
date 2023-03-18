const errorPeticion = (res, error) => {
    if(error.errors) {
        const errores = arregloErroresSave( error );
        res.status(500).json({
            msg: 'errores al interactuar con la base de datos',
            errores
        });
    } else {
        res.status(500).json({
            msg: 'algo ha salido mal al realizar esta petición, lo siento',
        });
    }
}

const arregloErroresSave = error => {
    const errorsArray = Object.values( error.errors ).map( error => error.message );
    return errorsArray; 
}

module.exports = {
    errorPeticion,
    arregloErroresSave
};
const errorPeticion = (res) => {
    res.status(500).json({
        msg: 'algo ha salido mal al realizar esta petición, lo siento',
    });
}

const arregloErroresSave = error => {
    const errorsArray = Object.values( error.errors ).map( error => error.message );
    return errorsArray; 
}

module.exports = {
    errorPeticion,
    arregloErroresSave
};
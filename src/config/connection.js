const mongoose = require('mongoose');

/**
 * Esta función establece la conexión con la base de datos de forma asíncrona
 */
const connection = async () => {

    try {
        
        await mongoose.connect( process.env.BD_URL );

        console.log('Data base started');

    } catch (error) {
        console.log('Connection error -> '+error);
    }
}

module.exports = connection;
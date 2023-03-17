const mongoose = require('mongoose');

const connection = async () => {

    try {
        
        await mongoose.connect( process.env.BD_URL );

        console.log('Data base started');

    } catch (error) {
        console.log('Connection error -> '+error);
    }
}

module.exports = connection;
const express = require('express');
const cors = require('cors');


class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;

        this.middlewares(); 
    }

    middlewares() {
        this.app.use( cors );
        this.app.use( express.json() );
    }

    init() {
        this.app.listen( this.PORT, () => {
            console.log('API started') ;
        });
    }

}   

module.exports = Server;
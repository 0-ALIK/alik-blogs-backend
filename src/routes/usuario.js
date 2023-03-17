const { Router } = require('express');

const router = Router();

router.get('/all', (req, resp) => {
    resp.json({
        msg: 'get - /all'
    });
});

router.get('/:id', (req, resp) => {
    resp.json({
        msg: 'get /:id'
    });
});

router.get('/nombre/:nombre', (req, resp) => {
    resp.json({
        msg: 'get /nombre'
    });
});

router.post('/', (req, resp) => {
    resp.json({
        msg: '/'
    });
});

router.put('/', (req, resp) => {
    resp.json({
        msg: ''
    });
});

router.delete('/', (req, resp) => {
    resp.json({
        msg: ''
    });
});

module.exports = router; 

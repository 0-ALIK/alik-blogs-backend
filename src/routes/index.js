const usuario = require('./usuario');
const blog = require('./blog');
const like = require('./like');
const comentario = require('./comentario');
const seguidor = require('./seguidor');
const auth = require('./auth'); 
const upload = require('./upload');

module.exports = {
    usuario,
    blog,
    like,
    comentario,
    seguidor,
    auth,
    upload
};
const { Schema, model } = require('mongoose');

const comentarioSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: [true, 'el usuario es obligatorio']
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'blog',
        required: [true, 'el id de blog es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    contenido: {
        type: String,
        required: [true, 'el contenido es obligatorio'],
        minLength: [2, 'el contenido no puede tener menos de 2 caracteres'],
        maxLength: [150, 'el contenido no puede superar los 200 caracteres']
    }
});

comentarioSchema.methods.toJSON = function() {
    const {__v, ...resto} = this.toObject();
    return resto;
};

module.exports = model('comentario', comentarioSchema);
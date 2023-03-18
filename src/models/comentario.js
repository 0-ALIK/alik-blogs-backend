const { Schema, model } = require('mongoose');

const comentarioSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'blog'
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

comentarioSchema.index({usuario: 1, blog: 1}, {unique: true});

comentarioSchema.methods.toJSON = function() {
    const {__v, ...resto} = this.toObject();
    return resto;
};

module.exports = model('comentario', comentarioSchema);
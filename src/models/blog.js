const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'el titulo es obligatorio'],
        minLength: [2, 'el titulo no puede tener menos de 2 caracteres'],
        maxLength: [30, 'el titulo no puede superar los 30 caracteres']
    },
    contenido: {
        type: String,
        required: [true, 'el contenido es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    portada: {
        type: String
    },  
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    }
});

blogSchema.methods.toJSON = function() {
    const {__v, ...resto} = this.toObject();
    return resto;
};

module.exports = model('blog', blogSchema);
const { Schema, model } = require('mongoose');

function notAutoFollow(value) {
    return value.toString() !== this.seguidor.toString();
}

const seguidorSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: [true, 'el usuario a seguir es obligatorio'],
        validate: [notAutoFollow, 'un usuario no se puede seguir a si mismo']
    },
    seguidor: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: [true, 'el usuario seguidor obligatorio']
    }
});

seguidorSchema.index({usuario: 1, seguidor: 1}, {unique: true});

seguidorSchema.methods.toJSON = function() {
    const {__v, ...resto} = this.toObject();
    return resto;
};

module.exports = model('seguidor', seguidorSchema);
const { Schema, model } = require('mongoose');

function notAutoFollow(value) {
    return value.toString() !== this.seguidor.toString();
}

const seguidorSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        validate: [notAutoFollow, 'un usuario no se puede seguir a si mismo']
    },
    seguidor: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    }
});

seguidorSchema.index({usuario: 1, seguidor: 1}, {unique: true});

module.exports = model('seguidor', seguidorSchema);
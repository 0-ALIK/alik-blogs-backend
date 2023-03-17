const { Schema, model } = require('mongoose');

const likeSchema = new Schema({
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
});

likeSchema.index({usuario: 1, blog: 1}, {unique: true});

module.exports = model('like', likeSchema);
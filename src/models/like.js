const { Schema, model } = require('mongoose');

const likeSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'blog'
    }
});

likeSchema.index({usuario: 1, blog: 1}, {unique: true});

likeSchema.methods.toJSON = function() {
    const {__v, ...resto} = this.toObject();
    return resto;
};

module.exports = model('like', likeSchema);
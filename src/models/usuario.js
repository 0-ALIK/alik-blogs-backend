const { Schema, model } = require("mongoose");

const usuarioSchema = new Schema({
    correo: {
        type: String,
        required: [true, 'el correo es obligatorio'],
        unique: [true, 'este correo ya esta en uso'], 
        maxLength: [255, 'el correo no puede superar los 255 caracteres'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'el correo no cumple el formato valido']
    },
    pass: {
        type: String,
        required: [true, 'la contraseña es obligatoria'],
        maxLength: [32, 'la contraseña no puede superar los 32 caracteres'],
        minLength: [8, 'la contraseña no puede tener menos de 8 caracteres'],
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'La contraseña no tiene un formato seguro']
    },
    nombre: {
        type: String,
        required: [true, 'el nombre es obligatorio'],
        unique: [true, 'este nombre ya esta en uso'], 
        maxLength: [20, 'el nombre no puede superar los 20 caracteres'],
        minLength: [2, 'el nombre no puede tener menos de 2 caracteres'],
        match: [/^[a-zA-Z0-9_]+$/, 'el nombre de usuario no cumple el formato valido']
    },
    img: {
        type: String
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('usuario', usuarioSchema);
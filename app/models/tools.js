    const mongoose = require('mongoose');

    const UserSchema = new mongoose.Schema(
        {
            id: {
                type: Number,
            },
            nombre: {
                type: String,
            },
            acronimo: {
                type: String,
            },
            categoria: {
                type: String,
            },
            items: {
                type: [
                    {
                        id: {
                            type: Number,
                        },
                        num: {
                            type: Number,
                        },
                        descripcion: {
                            type: String,
                        },
                        registro: {
                            type: String,
                        },
                        tiempo: {
                            type: Number,
                        },
                        escala: {
                            type: Number,
                        },
                        imageUrl: {
                            type: String,
                        },
                    },
                ],
            },
        },
        {
            timestamps: true,
            versionKey: false,
        }
    );

    module.exports = mongoose.model('tools', UserSchema);

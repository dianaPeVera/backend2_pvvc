const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true },

        doctor: {
            type: String,

        },
        paciente: {
            type: String,

        },
        instrumento: {
            type: String,
        },
        item: {
            type: String,
        },
        puntuacion: {
            type: String,
        },
        fecha: {
            type: Date,
        },
        documento: {
            type: String,
        },
        nombreOriginal: {
            type: String,
        }
       
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


module.exports = mongoose.model('Agenda', AgendaSchema);

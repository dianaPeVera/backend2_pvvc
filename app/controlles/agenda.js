const express = require('express');
const router = express.Router();
const { httpError } = require('../helpers/handleError');
const agendaModel = require('../models/agenda');
const userModel = require('../models/users');
const csv = require('csv-parser');
const fastCsv = require('fast-csv');
const toolModel = require('../models/tools');

const getAllAgendaData = async (req, res) => {
    try {
        // Obtener el nombre y rol de los parámetros de la URL
        const { name, rol } = req.params;
        console.log('Nombre:', name);
        console.log('Rol:', rol);
        // Verificar el rol del usuario
        if (rol === 'Administrador') {
          // Si el usuario es administrador, devolver toda la información
          const agendaData = await agendaModel.find();
          return res.status(200).json({ data: agendaData });
        } else if (rol === 'Medico') {
          // Si el usuario es médico, filtrar la información para mostrar solo sus pacientes
          const agendaDataForMedico = await agendaModel.find({ medico: name });
          return res.status(200).json({ data: agendaDataForMedico });
        } else {
          // Otros roles pueden ser manejados según tus necesidades
          return res.status(403).json({ message: 'Acceso no permitido para este rol' });
        }
      } catch (error) {
        console.error('Error al obtener datos de la agenda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
  };
  
  

const updateUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { paciente, doctor, instrumento, item, puntuacion, fecha, documento } = req.body;
        const { name, rol, email, password, assignedTo } = req.body;

        // Busca en la tabla User usando el id proporcionado desde el frontend
        const user = await userModel.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Actualiza en la tabla User
        const updatedUser = await userModel.findByIdAndUpdate(user._id, {
            name: paciente, // Asigna el nuevo nombre (paciente) a name
            rol, email, password, assignedTo
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User no encontrada para el usuario.' });
        }

        // Busca y obtiene los _id de todos los registros en la tabla Agenda con el mismo id
        const agendaRecords = await agendaModel.find({ id: userId });

        if (!agendaRecords || agendaRecords.length === 0) {
            return res.status(404).json({ message: 'Agendas no encontradas para el usuario.' });
        }

        const agendaIds = agendaRecords.map(record => record._id);

        // Actualiza todos los registros en la tabla Agenda con los _id obtenidos
        const updatedAgendas = await agendaModel.updateMany(
            { _id: { $in: agendaIds } },
            {
                paciente, doctor, instrumento, item, puntuacion, fecha, documento
            },
            { new: true }
        );

        if (updatedAgendas) {
            console.log('Nombre del Paciente Actualizado en Agenda:', updatedAgendas[0]?.paciente);
            res.status(200).json({ data: updatedAgendas, userData: updatedUser });
        } else {
            res.status(404).json({ message: 'Agendas no encontradas para el usuario.' });
        }
    } catch (error) {
        console.error('Ocurrió un error en updateUserById:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};












const updateUser = async (userId) => {
    try {
        const newData = { paciente: updatedUser.value.paciente, rol: updatedUser.value.rol };

        // Actualizar en la colección User
        const updatedUserInUser = await updateUserInUser(userId, newData);

        feedbackMessage.value = `Usuario actualizado: ${updatedUserInUser.name}`;
        closeUpdateUserModal();
    } catch (error) {
        console.error("Error updating user:", error);
        feedbackMessage.value = "Error updating user.";
    }
};




// Obtener usuario por name
const getUserByAssignedTo = async (req, res) => {
    try {
        const userName = req.params.assignedTo;
        const user = await userModel.findOne({ name: userName });
        if (user) {
            res.status(200).json({ message: 'Usuario consultado con éxito.', data: user });
        } else {
            res.status(404).json({ message: 'El medico no tiene pacientes dados de alta' });
        }
    } catch (error) {
        httpError(res, error);
    }
}


// ...

module.exports = {  updateUser, getAllAgendaData,updateUserById,  getUserByAssignedTo };

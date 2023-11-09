const express = require('express');
const router = express.Router();
const checkOrigin = require('../middleware/origin');
const { getUsers, authenticateUser, createUser, getUserByName, updateUserByName, deleteUserByName, getUserById, updateUserById, deleteUserById, getUserByAssignedTo} = require('../controlles/users');

// Middleware para verificar el token de autorización
//router.use(checkOrigin);

// Rutas principales

router.get('/', getUsers); // Ruta para obtener todos los elementos
router.post('/', createUser); // Ruta para actualizar un elemento (debería ser router.patch)
router.post('/authenticate', authenticateUser); // Ruta para authentificar usuario.

// Rutas CRUD propiedad ID

/*
router.get('/:id', getUserById); // Ruta para obtener un elemento por ID
router.patch('/:id', updateUserById); // Ruta para actualizar un elemento (debería ser router.patch)
router.delete('/:id', deleteUserById; // Ruta para eliminar un elemento
*/

// Rutas CRUD propiedad name

router.get('/:name', getUserByName); // Ruta para obtener un elemento por Name
router.get('/filter/:assignedTo', getUserByAssignedTo);
router.patch('/:name', updateUserByName); // Ruta para actualizar un elemento (debería ser router.patch)
router.delete('/:name', deleteUserByName); // Ruta para eliminar un elemento

module.exports = router;

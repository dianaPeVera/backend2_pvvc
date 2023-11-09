const express = require('express');
const router = express.Router();
const checkOrigin = require('../middleware/origin');
const { getTools, createTool, getToolById, updateToolById, deleteToolById, getToolByName, updateToolByName, deleteToolByName, } = require('../controlles/tools');

// Middleware para verificar el token de autorización
//router.use(checkOrigin);

/* FUNCIONES PRINCIPALES */
router.get('/', getTools); // Ruta para obtener todos los elementos
router.post('/', createTool); // Ruta para crear un elemento

// Rutas CRUD propiedad ID

/*
router.get('/:id', getToolById); // Ruta para obtener un elemento por ID
router.patch('/:id', updateToolById); // Ruta para actualizar un elemento
router.delete('/:id', deleteToolById); // Ruta para eliminar un elemento
*/

// Rutas CRUD propiedad name

router.get('/:nombre', getToolByName); // Ruta para obtener un elemento por ID
router.patch('/:nombre', updateToolByName); // Ruta para actualizar un elemento
router.delete('/:nombre', deleteToolByName); // Ruta para eliminar un elemento


module.exports = router;

const express = require('express');
const router = express.Router();
const checkOrigin = require('../middleware/origin');
const multer = require('multer');
const agendaModel = require('../models/agenda');
const datasetsModel = require('../models/datasets');
const userModel = require('../models/users');
const { updateAgendaById,updateUser,getAllAgendaData, getUserNameById, updateUserByName, deleteUserByName, getUserById, updateUserById, deleteUserById, getUserByAssignedTo } = require('../controlles/agenda');
const fs = require('fs');
const csv = require('csv-parser');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const axios = require('axios');


router.get('/agenda/:entryId/base64', async (req, res) => {
    try {
        const entryId = req.params.entryId;
        const entry = await agendaModel.findById(entryId);

        if (!entry) {
            return res.status(404).json({ message: 'Entrada no encontrada' });
        }

        // Convierte la cadena base64 del documento a un buffer
        const base64Buffer = Buffer.from(entry.documento, 'base64');

        // Lee el contenido del archivo CSV desde el buffer
        const csvContent = base64Buffer.toString('utf-8');

        // Parsea el contenido CSV y calcula el promedio de accX
        let sumAccX = 0;
        let countAccX = 0;

        const processData = (data) => {
            const accX = parseFloat(data.accX);
            if (!isNaN(accX)) {
                sumAccX += accX;
                countAccX++;
            }
        };

        await new Promise((resolve, reject) => {
            // Parsea el contenido CSV
            fs.createReadStream(csvContent)
                .pipe(csv())
                .on('data', processData)
                .on('end', resolve)
                .on('error', reject);
        });

        // Calcula el promedio de accX
        const averageAccX = countAccX === 0 ? 0 : sumAccX / countAccX;

        // Envía el promedio como respuesta
        res.json({ averageAccX });
    } catch (error) {
        console.error('Ocurrió un error al obtener el documento de la agenda en base64:', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener el documento de la agenda en base64' });
    }
});

// Función para obtener el nombre original del archivo
const obtenerNombreOriginal = (originalname) => {
    // Aquí debes implementar la lógica para extraer el nombre original según tus necesidades
    return originalname;
};

// Ruta para guardar el CSV
const storage = multer.memoryStorage(); // Almacena el archivo en memoria
const upload = multer({ storage: storage });
router.get('/data/:name/:rol', getAllAgendaData);

router.patch('/:userId', updateUserById); // Ruta para actualizar un elemento (debería ser router.patch)




router.post('/', upload.single('csvFile'), async (req, res) => {
    try {
        const userId = req.body.userId; // Asegúrate de que este campo esté presente en la solicitud

        // Convierte el buffer del archivo a una cadena base64
        const csvContent = req.file.buffer.toString('base64');
        const nombreOriginal = obtenerNombreOriginal(req.file.originalname);

        // Guarda el registro en la base de datos
        const entry = new agendaModel({
            userId: userId,
            documento: nombreOriginal,
           // nombreOriginal: nombreOriginal, // Guardamos el nombre original
        });

        await entry.save();

        res.status(200).json({ message: 'Archivo CSV subido con éxito.' });
    } catch (error) {
        console.error('Ocurrió un error al subir el archivo CSV:', error);
        res.status(500).json({ message: 'Ocurrió un error al subir el archivo CSV' });
    }
});

const contentDisposition = require('content-disposition');

router.get('/descargar-csv/:entryId', async (req, res) => {
    try {
        const entryId = req.params.entryId;
        const entry = await agendaModel.findById(entryId);

        if (!entry) {
            return res.status(404).json({ message: 'Entrada no encontrada' });
        }

        // Convierte la cadena base64 nuevamente a un buffer antes de enviarla
        const csvBuffer = Buffer.from(entry.documento, 'base64');

        // Configura el nombre del archivo para la descarga
        const downloadFileName = `${entry.nombreOriginal}.csv`;

        // Establece el encabezado de respuesta para la descarga
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', contentDisposition(downloadFileName));

        // Envía el contenido del archivo al cliente
        res.send(csvBuffer);
    } catch (error) {
        console.error('Ocurrió un error al descargar el archivo CSV:', error);
        res.status(500).json({ message: 'Ocurrió un error al descargar el archivo CSV' });
    }
});





router.post('/procesar', async (req, res) => {
    try {
        // Asegúrate de que el archivo CSV esté presente en la solicitud
        if (!req.body.userId || !req.body.csvFile) {
            return res.status(400).json({ message: 'No se proporcionó el ID del usuario o el archivo CSV.' });
        }

        // Obtener el ID del usuario y el archivo CSV del cuerpo de la solicitud
        const userId = req.body.userId;
        const csvFile = req.body.csvFile; // El archivo CSV como Buffer

        try {
            // Busca el usuario por el ID en la base de datos de usuarios
            const user = await userModel.findOne({ id: userId });

            if (user) {
                // Almacena los datos en el campo 'documento' como una cadena CSV
                const csvContent = csvFile.toString('base64');
                const nombreOriginal = csvFile.name;  // Puedes ajustar el nombre según tus necesidades

                // Abre el archivo CSV y lee solo la segunda línea
                const csvArray = req.file.buffer.toString().split('\n');
                const secondLine = csvArray.length > 1 ? csvArray[1] : '';

                // Procesa la segunda línea del CSV
                const row = secondLine.split(',');

                const instrumento = row[13]; // Índice 14 corresponde a 'test' en el CSV
                const item = row[14]; // Índice 15 corresponde a 'item' en el CSV
                const puntuacion = row[15]; // Índice 16 corresponde a 'score' en el CSV

                // Crea una nueva entrada en la base de datos de agendas
                const entry = new agendaModel({
                    id:userId,
                    doctor: '', // Puedes dejarlo en blanco por ahora
                    paciente: user.name,
                    instrumento,
                    item,
                    puntuacion,
                    fecha: new Date(), // Puedes ajustar la fecha según tus necesidades
                    documento: csvContent,
                    nombreOriginal: nombreOriginal, // Guardamos el nombre original
                });

                // Guarda la entrada en la base de datos
                const savedEntry = await entry.save();
                console.log('Entrada guardada con éxito:', savedEntry);

                // Envía la respuesta al cliente
                res.status(200).json({ message: 'Proceso de CSV completado con éxito.', data: savedEntry });
            } else {
                console.error('Usuario no encontrado con el ID:', userId);
                res.status(404).json({ message: 'Usuario no encontrado en la base de datos de usuarios.' });
            }
        } catch (error) {
            console.error('Ocurrió un error al procesar el archivo CSV:', error);
            res.status(500).json({ message: 'Ocurrió un error al procesar el archivo CSV' });
        }
    } catch (error) {
        console.error('Ocurrió un error al procesar el archivo CSV:', error);
        res.status(500).json({ message: 'Ocurrió un error al procesar el archivo CSV' });
    }
});


router.get('/agenda/:entryId/base64', async (req, res) => {
    try {
        const entryId = req.params.entryId;
        const entry = await agendaModel.findById(entryId);

        if (!entry) {
            return res.status(404).json({ message: 'Entrada no encontrada' });
        }

        // Convierte la cadena base64 del documento a un buffer
        const base64Buffer = Buffer.from(entry.documento, 'base64');

        // Establece el encabezado de respuesta para el tipo de contenido
        res.setHeader('Content-Type', 'application/octet-stream');

        // Envía el contenido del archivo al cliente
        res.send(base64Buffer);
    } catch (error) {
        console.error('Ocurrió un error al obtener el documento de la agenda en base64:', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener el documento de la agenda en base64' });
    }
});


// Lista para almacenar los _id de los conjuntos de datos accedidos
let accessedDatasetIds = [];

// Ruta para obtener todos los conjuntos de datos y enviarlos a procesar
// Ruta para obtener todos los conjuntos de datos y enviarlos a procesar
router.get('/datasets', async (req, res) => {
    try {
        const datasets = await datasetsModel.find();

        // Filtra los conjuntos de datos que no han sido accedidos
        const newDatasets = datasets.filter(dataset => !accessedDatasetIds.includes(dataset._id.toString()));

        // Realiza la solicitud POST a la ruta /procesar para cada conjunto de datos no accedido
        for (const dataset of newDatasets) {
            try {
                const userId = dataset.id;
                const csvFile = dataset.file; // El archivo CSV como Buffer

                await axios.post('http://localhost:5038/api/1.0/agenda/procesar', {
                    userId: userId,
                    csvFile: csvFile,
                });

                // Agrega el _id a la lista de accedidos
                accessedDatasetIds.push(dataset._id.toString());
            } catch (error) {
                console.error('Error al realizar la solicitud POST a /procesar:', error);
                // Puedes manejar el error según tus necesidades
            }
        }

        res.json(newDatasets);
    } catch (error) {
        console.error('Ocurrió un error al obtener los conjuntos de datos:', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener los conjuntos de datos' });
    }
});

// Ruta para obtener un conjunto de datos por su ID
router.get('/datasets/:datasetId', async (req, res) => {
    try {
        const datasetId = req.params.datasetId;
        const dataset = await datasetsModel.findById(datasetId);

        if (!dataset) {
            return res.status(404).json({ message: 'Conjunto de datos no encontrado' });
        }

        // Realiza la solicitud POST a la ruta /procesar
        try {
            await axios.post('http://localhost:5038/api/1.0/agenda/procesar', {
                userId: dataset.id,  // Utiliza el id del conjunto de datos como userId
                csvFile: dataset.file.toString('base64'),
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Agrega el _id a la lista de accedidos
            accessedDatasetIds.push(dataset._id.toString());

            // Puedes devolver el buffer directamente o realizar cualquier otra lógica según tus necesidades
            res.json({ id: dataset.id, file: dataset.file.toString('base64') });
        } catch (error) {
            console.error('Error al realizar la solicitud POST a /procesar:', error);
            res.status(500).json({ message: 'Ocurrió un error al procesar el conjunto de datos' });
        }

    } catch (error) {
        console.error('Ocurrió un error al obtener el conjunto de datos:', error);
        res.status(500).json({ message: 'Ocurrió un error al obtener el conjunto de datos' });
    }
});



module.exports = router;

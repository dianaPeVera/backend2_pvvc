require('dotenv').config();
const epxress = require('express');
const cors = require('cors');
const { dbConnect } = require('./config/mongo');

const app = epxress();
const PORT = process.env.PORT || 5038;

// Configura el middleware para manejar CORS
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Aumenta el límite de tamaño de carga útil
app.use(epxress.json({ limit: '10mb' }));
app.use(epxress.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/api/1.0', require('./app/routes'));

// Conexión a la base de datos
dbConnect();

// Inicia el servidor
app.listen(PORT, () => {
    console.log('API lista por el puerto ', PORT);
});

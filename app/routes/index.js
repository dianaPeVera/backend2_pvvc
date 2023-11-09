const express = require('express');
const router = express.Router();
const fs = require('fs');

const pathRouter = __dirname; // No necesitas `${__dirname}` aquí

const removeExtension = (filename) => {
    return filename.split('.').shift();
}

// Utiliza fs.readdirSync para obtener una lista de archivos en el directorio
const files = fs.readdirSync(pathRouter);

files.forEach((file) => {
    const fileWithOutExt = removeExtension(file);
    const skip = ['index'].includes(fileWithOutExt);
    if (!skip) {
        router.use(`/${fileWithOutExt}`, require(`./${fileWithOutExt}`)); //TODO: localhost/users
        // Si no se encuentra en la lista de omitidos, puedes cargar la ruta o realizar otras acciones aquí.
        console.log('RUTA CARGADA ---->', fileWithOutExt);
    }
});

router.get('*', (req,res) => {
    res.status(404); 
    res.send({error:'Not found'})
});

module.exports = router;

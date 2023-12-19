const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: false,
  },
  file: {
    type: Buffer, // Assuming you want to store the CSV content as a Buffer
    required: true,
  },
});

module.exports = mongoose.model('datasets', datasetSchema);

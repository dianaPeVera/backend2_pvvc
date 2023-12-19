const express = require('express');
const router = express.Router();
const checkOrigin = require('../middleware/origin');
const {
  createDataset,
  getAllDatasets,
  getDatasetById,
  updateDatasetById,
  deleteDatasetById,
} = require('../controlles/datasets');

// Create a new dataset
router.post('/', createDataset);

// Get all datasets
router.get('/', getAllDatasets);

// Get a specific dataset by ID
router.get('/:id', getDatasetById);

// Update a dataset by ID
router.patch('/:id', updateDatasetById);

// Delete a dataset by ID
router.delete('/:id', deleteDatasetById);

module.exports = router;

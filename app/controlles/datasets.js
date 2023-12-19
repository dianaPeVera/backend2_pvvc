const Dataset = require('../models/datasets');

// Create a new dataset
const createDataset = async (req, res) => {
  try {
    const { id, file } = req.body;
    const newDataset = new Dataset({ id, file });
    console.log(newDataset);
    await newDataset.save();
    res.status(201).json(newDataset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Get all datasets
const getAllDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find();
    res.status(200).json(datasets);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Get a specific dataset by ID
const getDatasetById = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ id: req.params.id });
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    res.status(200).json(dataset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Update a dataset by ID
const updateDatasetById = async (req, res) => {
  try {
    const { id, file } = req.body;
    const updatedDataset = await Dataset.findOneAndUpdate(
      { id: req.params.id },
      { id, file },
      { new: true }
    );
    if (!updatedDataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    res.status(200).json(updatedDataset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Delete a dataset by ID
const deleteDatasetById = async (req, res) => {
  try {
    const deletedDataset = await Dataset.findOneAndDelete({ id: req.params.id });
    if (!deletedDataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    res.status(200).json(deletedDataset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  createDataset,
  getAllDatasets,
  getDatasetById,
  updateDatasetById,
  deleteDatasetById,
};

const s3Service = require('../services/s3Service');
const dbService = require('../services/dbService');
const snsService = require('../services/snsService');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const s3Key = await s3Service.uploadFile(file);

    const fileExtension = file.originalname.split('.').pop();
    const fileSize = file.size;

    await dbService.insertMetadata({
      name: file.originalname,
      s3_key: s3Key,
      file_extension: fileExtension,
      size: fileSize,
    });

    res.status(200).json({ message: 'File uploaded and metadata saved', s3_key: s3Key });
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
};

exports.downloadImage = async (req, res) => {
  const { fileName } = req.params; 

  try {
    const fileContent = await s3Service.downloadFile(fileName);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(fileContent);
  } catch (err) {
    console.error(err);
    if (err.message === 'File not found') {
      return res.status(404).send('File not found');
    }
    res.status(500).send('Error while downloading the file');
  }
};

exports.getImageMetadata = async (req, res) => {
  const { fileName } = req.params;

  try {
    const metadata = await dbService.getImageMetadataByName(fileName);
    res.status(200).json(metadata); 
  } catch (err) {
    console.error(err);
    if (err.message === 'Image not found in database') {
      return res.status(404).send('Image not found in database');
    }
    res.status(500).send('Error while retrieving metadata');
  }
};

exports.getRandomImageMetadata = async (req, res) => {
    try {
      const metadata = await dbService.getRandomImageMetadata();
      res.status(200).json(metadata);
    } catch (err) {
      console.error(err);
      if (err.message === 'No images found in database') {
        return res.status(404).send('No images in database');
      }
      res.status(500).send('Error retrieving random image metadata');
    }
  };
  
  exports.deleteImage = async (req, res) => {
    const { fileName } = req.params;
  
    try {
      await s3Service.deleteFile(fileName);
  
      await dbService.deleteImageMetadata(fileName);
  
      res.status(200).send('Image and metadata deleted');
    } catch (err) {
      console.error(err);
      if (err.message === 'File not found') {
        return res.status(404).send('File not found');
      }
      res.status(500).send('Error deleting image');
    }
  };

  exports.subscribeEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send('Email is required');
    }
    try {
      await snsService.subscribeEmail(email);
      res.status(200).send(`Confirmation email sent to ${email}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error subscribing email');
    }
  };
  
  exports.unsubscribeEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send('Email is required');
    }
    try {
      await snsService.unsubscribeEmail(email);
      res.status(200).send(`Email ${email} unsubscribed successfully`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error unsubscribing email');
    }
  };
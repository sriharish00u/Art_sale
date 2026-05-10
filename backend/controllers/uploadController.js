const { uploadWithWatermark } = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await uploadWithWatermark(req.file);
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = await Promise.all(req.files.map(uploadWithWatermark));
    const urls = results.map(r => ({ url: r.secure_url, publicId: r.public_id }));
    res.json({ urls });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { uploadImage, uploadMultiple };

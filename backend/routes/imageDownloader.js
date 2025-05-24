const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const crypto = require('crypto');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

function getFileNameFromUrl(url) {
  const cleanUrl = url.split('?')[0];
  const hash = crypto.createHash('md5').update(cleanUrl).digest('hex');
  const ext = path.extname(cleanUrl) || '.jpg';
  return `${hash}${ext}`;
}

router.post('/download-images', async (req, res) => {
  const { imageUrls } = req.body;
  const uploadedUrls = [];

  for (let url of imageUrls) {
    try {
      const fileName = getFileNameFromUrl(url);
      const publicId = `docs-images/${fileName.replace(path.extname(fileName), '')}`;

      try {
          const existing = await cloudinary.api.resource(publicId);
          uploadedUrls.push(existing.secure_url);
          continue;
        } catch (e) {
          if (e.http_code === 404 || e.error?.message?.includes("Resource not found")) {
          } else {
            console.error(`Lỗi khác khi kiểm tra Cloudinary cho ${publicId}:`, e);
            return res.status(500).json({ error: true, message: "Cloudinary check failed" });
          }
        }

      const response = await axios.get(url, { responseType: 'stream' });
      const tmpFile = tmp.fileSync();
      const writer = fs.createWriteStream(tmpFile.name);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const uploadRes = await cloudinary.uploader.upload(tmpFile.name, {
        folder: 'docs-images',
        public_id: publicId.split('/').pop(), 
      });

      uploadedUrls.push(uploadRes.secure_url);
      tmpFile.removeCallback();

    } catch (err) {
      console.error(`Lỗi upload ảnh ${url}:`, err.message);
    }
  }

  res.json({ paths: uploadedUrls });
});

module.exports = router;

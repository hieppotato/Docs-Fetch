const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const crypto = require('crypto');

function getFileNameFromUrl(url) {
  const hash = crypto.createHash('md5').update(url.split('?')[0]).digest('hex');
  const ext = path.extname(url.split('?')[0]) || '.jpg';
  return `${hash}${ext}`;
}


router.post('/download-images', async (req, res) => {
  const { imageUrls } = req.body;
  const savedPaths = [];

  for (let url of imageUrls) {
    const fileName = getFileNameFromUrl(url); // lấy tên ảnh
    const localPath = path.join(__dirname, '../public/images', fileName);

    // Nếu ảnh đã tồn tại thì bỏ qua tải lại
    if (!fs.existsSync(localPath)) {
      try {
        const response = await axios.get(url, { responseType: 'stream' });
        const writer = fs.createWriteStream(localPath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      } catch (err) {
        console.error(`Lỗi tải ảnh: ${url}`, err);
        continue;
      }
    }

    savedPaths.push(`/images/${fileName}`);
  }

  res.json({ paths: savedPaths });
});

module.exports = router;

const express = require('express');
const app = express();
const cors = require('cors');
const imageDownloader = require('./routes/imageDownloader');

app.use(cors({
    origin: 'http://localhost:5173'
  }));

app.use(express.json());
app.use('/images', express.static('public/images'));
app.use('/api', imageDownloader);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const app = express();
const cors = require('cors');
const imageDownloader = require('./routes/imageDownloader');
const config = require("./config.json")
const Docs = require("./models/docs.models");
const mongoose = require('mongoose');

app.use(cors({
    origin: 'http://localhost:5173'
  }));

mongoose.connect(config.connectionString);

app.use(express.json());
app.use('/images', express.static('public/images'));
app.use('/api', imageDownloader);

app.post("/upload-docs-id", async (req, res) => {
    const newDoc = new Docs(req.body);
    await newDoc.save();
    res.status(200).json({newDoc: newDoc});
});

app.get("/get-all-docs", async (req, res) => {
    const docs = await Docs.find();
    console.log(1);
    res.status(200).json(docs);
});

app.delete("/delete-post/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Docs.find({id : id});
        if (!post) {
            return res.status(404).json({ error: true, message: "Bài đăng không tồn tại" });
        }

        await Docs.findAndDelete({id : id});

        res.status(200).json({ success: true, message: "Xóa bài đăng thành công" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

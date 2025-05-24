const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const docs = new Schema({
    title: {type: String, required: true},
    id: { type:String, required: true},
});



module.exports = mongoose.model("Docs", docs);
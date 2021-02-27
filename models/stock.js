var mongoose = require('mongoose');
var stockSchema = new mongoose.Schema({
    name : String,
    desc : String,
    industry : String,
    price : Number,
    sym: String,
    numStocks: Number
});

module.exports= mongoose.model("stock", stockSchema);
var mongoose = require('mongoose');
var s1Schema = new mongoose.Schema({
    sym : String,
    desc : String,
    industry : String,
    price : Number,
    sym: String,
    numStocks: Number
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // stock:{ type: mongoose.Schema.Types.ObjectId, ref: 'stock', required: true },
    // count:Number
});

module.exports= mongoose.model("s1", s1Schema);
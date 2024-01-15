const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = new Schema({
    author:  {type: Schema.Types.ObjectId,ref: 'User'},
    car: {type: Schema.Types.ObjectId,ref: 'Trade'},
    }
);

//collection name is stories in the database
module.exports = mongoose.model('Favorite', itemSchema);
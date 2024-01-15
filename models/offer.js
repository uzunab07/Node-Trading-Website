const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = new Schema({
    author:  {type: Schema.Types.ObjectId,ref: 'User'},
    recipient:  {type: Schema.Types.ObjectId,ref: 'User'},
    myCar: {type: Schema.Types.ObjectId,ref: 'Trade'},
    likeCar: {type: Schema.Types.ObjectId,ref: 'Trade'},

    }
);

const newLocal = 'Offer';
//collection name is stories in the database
module.exports = mongoose.model(newLocal, itemSchema);
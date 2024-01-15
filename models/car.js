const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    model: {type: String, required:[true, 'title is required']},
    brand: {type: String, required:[true, 'brand is required']},
    author: {type: Schema.Types.ObjectId,ref: 'User'},
    details: {type: String, required:[true, 'details is required'], minLength: [10,'the content must have at least 10 character']},
    category: {type: String, required:[true, 'category is required']},
    img: {type: String, required:[true, 'category is required']},
    status: {type: String},

});
const categorySchema = new Schema({
    category:  {type: String}
});

// collection name should be trades
module.exports.newCar = mongoose.model("Trade", carSchema);

module.exports.newCategory = mongoose.model("Category",categorySchema);

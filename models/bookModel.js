const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    date_created: {
        type: Date, default: Date.now
      },
      user_id:String
})

exports.BookModel = mongoose.model("books", schema);


exports.validateBook = (_reqBody) =>{
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(150).required(),
        info:Joi.string().min(2).max(400).required(),
        category:Joi.string().min(2).max(100).required(),
        price:Joi.number().min(1).max(999999).required(),
        img_url:Joi.string().min(2).max(480).allow(null,""), 
    })
    return joiSchema.validate(_reqBody);
}
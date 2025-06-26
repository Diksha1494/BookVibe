const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({ //all are taken from book.json file

    title:{
  type: String,
  required:true,

    },
    description:
    {type: String,
  required:true,
    },
    category:{
        type: String,
  required:true,
    },
    trending:{
        type: Boolean,
  required:true,
    },
   coverImage:{
    type: String,
  required:true,
   },
   oldprice:Number,
   newPrice:Number,
   createdAt:{
    type:Date,
    default: Date.now,
   }
},{
    timestamps:true,
 }
);
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
const mongoose = require('mongoose');

const bookCategories = [
    'business',
    'technology',
    'fiction',
    'horror',
    'adventure',
    'School',
    'ICSE',
    'CBSE',
    'Business',
    'Fiction',
    'Horror',
    'Adventure',
    'Devotional'
];

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
  enum: bookCategories,
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
   oldPrice:Number,
   newPrice:Number,
   author: {
    type: String,
    trim: true,
    default: "",
   },
  //  createdAt:{
  //   type:Date,
  //   default: Date.now,
  //  }
},{
    timestamps:true,
}
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

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
   condition: {
    type: String,
    enum: ["like-new", "good", "fair", "used"],
    default: "good",
   },
   owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
   },
   ownerName: {
    type: String,
    trim: true,
    default: "",
   },
   listingMode: {
    type: String,
    enum: ["sell", "borrow", "exchange"],
    default: "sell",
   },
   availabilityStatus: {
    type: String,
    enum: ["available", "borrowed", "exchanged", "sold", "reserved", "inactive"],
    default: "available",
   },
   borrowEnabled: {
    type: Boolean,
    default: false,
   },
   exchangeEnabled: {
    type: Boolean,
    default: false,
   },
  //  createdAt:{
  //   type:Date,
  //   default: Date.now,
  //  }
},{
    timestamps:true,
 }
);
bookSchema.index({ owner: 1, createdAt: -1 });
bookSchema.index({ listingMode: 1, availabilityStatus: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

// book.controller.js
const Book = require("./book.model");

const postABook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(200).send({
      message: "Book posted successfully",
      book: savedBook,
    });
  } catch (error) {
    // console.error("Error creating book:", error.message);
    res.status(500).send({
      message: "Failed to create book",
      error: error.message,
    });
  }
};

//get all book
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({createdAt:-1}); // ✅ Fetch all books
    res.status(200).send({ // ✅ Send the response
      message: "Books fetched successfully",
      books: books,
    });
  } catch (error) {
    console.error("Error in fetching books:", error.message);
    res.status(500).send({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};
const getSingleBook = async(req,res) => {
    try {
   const {id} = req.params;
   const book = await Book.findById(id)
   if(!book){
     res.status(404).send({
      message: "Book not Found"})

   }
    res.status(200).send(book);
  } catch (error) {
    console.error("Error in fetching book:", error.message);
    res.status(500).send({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
}
//update book data
const UpdateBook = async(req,res)=>{
  try{
    const {id}=req.params;
    const updateBook = await Book.findByIdAndUpdate(id,req.body,{new:true});
    if(!updateBook){
      res.status(404).send({message:"Book is not Found"})
    }
     res.status(200).send({
      message:"book updated successfully",
      book:updateBook
  })
  }catch (error) {
    console.error("Error in updating  a book:", error.message);
    res.status(500).send({
      message: "Failed to update a book",
      
    });
}};

const deleteABook =async(req,res)=>{
try{
const{id}=req.params;
const deleteBook = await Book.findByIdAndDelete(id);
 if(!deleteBook){
      res.status(404).send({message:"Book is not Found"})
    }res.status(200).send({
      message:"book deleted successfully",
      book:deleteBook
  })
}catch (error) {
    console.error("Error in deleting  a book:", error.message);
    res.status(500).send({
      message: "Failed to delete a book",
      error: error.message,
    });
  }
};
module.exports = { 
    postABook ,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook

};

const Book = require("./book.model");

const postABook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();

    return res.status(200).send({
      message: "Book posted successfully",
      book: savedBook,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Failed to create book",
      error: error.message,
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).send({
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    console.error("Error in getAllBooks:", error.message);

    return res.status(500).send({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

const getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const books = await Book.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    }).sort({ createdAt: -1 });

    return res.status(200).send({
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    console.error("Error in fetching books by category:", error.message);

    return res.status(500).send({
      message: "Failed to fetch books by category",
      error: error.message,
    });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send({
        message: "Book not Found",
      });
    }

    return res.status(200).send(book);
  } catch (error) {
    console.error("Error in fetching book:", error.message);

    return res.status(500).send({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateBook = await Book.findByIdAndUpdate(id, req.body, { new: true });

    if (!updateBook) {
      return res.status(404).send({ message: "Book is not Found" });
    }

    return res.status(200).send({
      message: "book updated successfully",
      book: updateBook,
    });
  } catch (error) {
    console.error("Error in updating a book:", error.message);

    return res.status(500).send({
      message: "Failed to update a book",
      error: error.message,
    });
  }
};

const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBook = await Book.findByIdAndDelete(id);

    if (!deleteBook) {
      return res.status(404).send({ message: "Book is not Found" });
    }

    return res.status(200).send({
      message: "book deleted successfully",
      book: deleteBook,
    });
  } catch (error) {
    console.error("Error in deleting a book:", error.message);

    return res.status(500).send({
      message: "Failed to delete a book",
      error: error.message,
    });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getBooksByCategory,
  getSingleBook,
  UpdateBook,
  deleteABook,
};

const Book = require("./book.model");

const normalizeMarketplaceBook = (body, user) => {
  const mode = ["borrow", "exchange", "sell"].includes(body.listingMode || body.bookMode)
    ? body.listingMode || body.bookMode
    : "sell";
  const price = Number(body.newPrice ?? body.price ?? 0);

  return {
    title: String(body.title || "").trim(),
    author: String(body.author || "").trim(),
    description: String(body.description || "").trim(),
    category: body.category || "Fiction",
    trending: false,
    coverImage: body.coverImage || body.imagePreview || "book-1.png",
    oldprice: Number(body.oldprice ?? body.oldPrice ?? price),
    oldPrice: Number(body.oldPrice ?? body.oldprice ?? price),
    newPrice: price,
    condition: body.condition || "good",
    owner: user.id,
    ownerName: user.username || user.email?.split("@")[0] || "Community Seller",
    listingMode: mode,
    availabilityStatus: "available",
    borrowEnabled: mode === "borrow",
    exchangeEnabled: mode === "exchange",
  };
};

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
    const books = await Book.find()
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

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
    }).populate("owner", "username email").sort({ createdAt: -1 });

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
    const book = await Book.findById(id).populate("owner", "username email");

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

const createMarketplaceListing = async (req, res) => {
  try {
    const payload = normalizeMarketplaceBook(req.body, req.user);

    if (!payload.title || !payload.description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const book = await Book.create(payload);
    const populatedBook = await Book.findById(book._id).populate("owner", "username email");

    return res.status(201).json({
      message: "Marketplace listing created.",
      book: populatedBook,
    });
  } catch (error) {
    console.error("Create marketplace listing error:", error.message);
    return res.status(500).json({
      message: "Failed to create marketplace listing",
      error: error.message,
    });
  }
};

const getMyListings = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.id }).sort({ createdAt: -1 });
    return res.json({ books });
  } catch (error) {
    console.error("Get my listings error:", error.message);
    return res.status(500).json({ message: "Failed to fetch your listings." });
  }
};

const deleteMyListing = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!book) {
      return res.status(404).json({ message: "Listing not found." });
    }

    return res.json({ message: "Listing removed.", book });
  } catch (error) {
    console.error("Delete my listing error:", error.message);
    return res.status(500).json({ message: "Failed to remove listing." });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getBooksByCategory,
  getSingleBook,
  UpdateBook,
  deleteABook,
  createMarketplaceListing,
  getMyListings,
  deleteMyListing,
};

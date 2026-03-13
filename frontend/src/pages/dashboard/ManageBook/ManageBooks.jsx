import React from 'react';
import './ManageBooks.css';
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link, useNavigate } from 'react-router-dom';


const ManageBooks = () => {
  const navigate = useNavigate();
  const { data, refetch } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();
  const books = data?.books || [];
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id).unwrap();
      alert('Book deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Failed to delete book:', error.message);
      alert('Failed to delete book. Please try again.');
    }
  };

  return (
    <section className="manage-books-section">
      <div className="container">
        <div className="table-card">
          <div className="card-header">
            <h3>All Books</h3>
            <button className="see-all-btn">See all</button>
          </div>

          <div className="table-wrapper">
            <table className="book-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {books &&
                  books.map((book, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{book.title}</td>
                      <td>{book.category}</td>
                      <td>${book.newPrice}</td>
                      <td className="actions-cell">
                        <Link
                          to={`/dashboard/edit-book/${book._id}`}
                          className="edit-link"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageBooks;

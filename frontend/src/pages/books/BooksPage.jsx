import React from 'react';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import BookCard from './BookCard';
import './BooksPage.css';

const BooksPage = () => {
  const { data, isLoading, isError } = useFetchAllBooksQuery();
  const books = data?.books || [];

  if (isLoading) {
    return <div className="books-page-state">Loading books...</div>;
  }

  if (isError) {
    return <div className="books-page-state">Failed to load books.</div>;
  }

  return (
    <section className="books-page">
      <div className="books-page-header">
        <p className="books-page-eyebrow">BookVibe collection</p>
        <h1 className="books-page-title">Explore books</h1>
        <p className="books-page-description">
          Browse the latest titles and discover your next read from our curated collection.
        </p>
      </div>

      <div className="books-page-grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default BooksPage;

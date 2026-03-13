import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './TopSellers.css';
import BookCard from '../books/BookCard';

// Swiper core components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = [
  "Choose a genre",
  "School",
  "ICSE",
  "CBSE",
  "Business",
  "Fiction",
  "Horror",
  "Adventure",
  "Devotional",
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

const { data } = useFetchAllBooksQuery();
const books = data?.books || [];


  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory === "Choose a genre" ||
      book.category?.toLowerCase() === selectedCategory.toLowerCase();

    const searchableText = [
      book.title,
      book.author,
      book.category,
      book.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchQuery || searchableText.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="top-sellers-section">
      <h2 className="top-sellers-title">
        {searchQuery ? `Search results for "${searchParams.get("q")}"` : "Top Sellers"}
      </h2>

      <div className="top-sellers-filter">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          name="category"
          id="category"
          className="top-sellers-select"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
          <div className="slider-wrapper">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {filteredBooks.length > 0 &&
          filteredBooks.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
      </Swiper>
      </div>
    </div>
  );
};

export default TopSellers;

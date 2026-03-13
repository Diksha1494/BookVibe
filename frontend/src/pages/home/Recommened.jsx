import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import './Recommened.css'; // Link to your normal CSS file

const Recommened = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const { data } = useFetchAllBooksQuery();
  const books = data?.books || [];
  const filteredBooks = books.filter((book) => {
    if (!searchQuery) return true;

    const searchableText = [
      book.title,
      book.author,
      book.category,
      book.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchQuery);
  });

  return (
    <div className="recommended-section">
      <h2 className="recommended-heading">
        {searchQuery ? "More matching books" : "Recommended for you"}
      </h2>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 2, spaceBetween: 50 },
          1180: { slidesPerView: 3, spaceBetween: 50 },
        }}
        modules={[Pagination, Navigation]}
        className="recommended-swiper"
      >
        {filteredBooks.length > 0 &&
          filteredBooks.slice(8, 18).map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Recommened;

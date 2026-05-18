import { useEffect, useState } from "react";

const ExchangeModal = ({ isOpen, onClose, onConfirm, myBooks = [], bookTitle, loading = false }) => {
  const [selectedBookId, setSelectedBookId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedBookId("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const selectedBook = myBooks.find((item) => item?._id === selectedBookId) || null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedBook) {
      return;
    }
    await onConfirm?.(selectedBook);
  };

  return (
    <div className="marketplace-modal-overlay" onClick={onClose}>
      <div className="marketplace-modal" onClick={(event) => event.stopPropagation()}>
        <div className="marketplace-modal-header">
          <div>
            <p className="marketplace-modal-eyebrow">Exchange Request</p>
            <h3>Exchange for {bookTitle || "this book"}</h3>
          </div>
          <button type="button" className="marketplace-icon-btn" onClick={onClose} aria-label="Close modal">
            x
          </button>
        </div>

        <form className="marketplace-form-stack" onSubmit={handleSubmit}>
          <label className="marketplace-field">
            <span>Select one of my books</span>
            <select value={selectedBookId} onChange={(event) => setSelectedBookId(event.target.value)}>
              <option value="">Choose a book</option>
              {myBooks.map((book) => (
                <option key={book?._id} value={book?._id}>
                  {book?.title}
                </option>
              ))}
            </select>
          </label>

          <p className="marketplace-helper-text">
            Exchange requests stay isolated from orders and cart so your current checkout flow remains untouched.
          </p>

          <div className="marketplace-modal-actions">
            <button type="button" className="marketplace-btn marketplace-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="marketplace-btn marketplace-btn-primary"
              disabled={loading || !selectedBookId}
            >
              {loading ? "Sending..." : "Send Exchange Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExchangeModal;

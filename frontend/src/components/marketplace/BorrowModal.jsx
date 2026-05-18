import { useEffect, useState } from "react";

const BorrowModal = ({ isOpen, onClose, onConfirm, bookTitle, loading = false }) => {
  const [duration, setDuration] = useState("7");

  useEffect(() => {
    if (isOpen) {
      setDuration("7");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onConfirm?.(Number(duration));
  };

  return (
    <div className="marketplace-modal-overlay" onClick={onClose}>
      <div className="marketplace-modal" onClick={(event) => event.stopPropagation()}>
        <div className="marketplace-modal-header">
          <div>
            <p className="marketplace-modal-eyebrow">Borrow Request</p>
            <h3>Borrow {bookTitle || "this book"}</h3>
          </div>
          <button type="button" className="marketplace-icon-btn" onClick={onClose} aria-label="Close modal">
            x
          </button>
        </div>

        <form className="marketplace-form-stack" onSubmit={handleSubmit}>
          <label className="marketplace-field">
            <span>Borrow duration</span>
            <select value={duration} onChange={(event) => setDuration(event.target.value)}>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="21">21 days</option>
              <option value="30">30 days</option>
            </select>
          </label>

          <p className="marketplace-helper-text">
            This request is stored safely in your marketplace dashboard without affecting checkout.
          </p>

          <div className="marketplace-modal-actions">
            <button type="button" className="marketplace-btn marketplace-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="marketplace-btn marketplace-btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal;

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MarketplaceDashboardShell from "../../components/marketplace/MarketplaceDashboardShell";
import { addMarketplaceListing } from "../../utils/marketplaceStorage";

const initialState = {
  title: "",
  author: "",
  description: "",
  condition: "good",
  price: "",
  bookMode: "sell",
  imagePreview: "",
};

const SellBook = () => {
  const auth = useAuth?.();
  const currentUser = auth?.currentUser || null;
  const navigate = useNavigate();
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDisabled = useMemo(() => {
    return (
      loading ||
      !formState.title.trim() ||
      !formState.author.trim() ||
      !formState.description.trim() ||
      !String(formState.price).trim()
    );
  }, [formState, loading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormState((prev) => ({
        ...prev,
        imagePreview: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      setError("Please sign in before creating a marketplace listing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      addMarketplaceListing({
        title: formState.title.trim(),
        author: formState.author.trim(),
        description: formState.description.trim(),
        condition: formState.condition,
        price: Number(formState.price),
        newPrice: Number(formState.price),
        oldPrice: Number(formState.price),
        listingMode: formState.bookMode,
        availabilityStatus: "available",
        coverImage: formState.imagePreview,
        ownerEmail: currentUser?.email || "",
        ownerName: currentUser?.displayName || currentUser?.email?.split("@")[0] || "Community Seller",
      });

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Listing saved to marketplace dashboard",
        showConfirmButton: false,
        timer: 2200,
      });

      setFormState(initialState);
      navigate("/my-listings");
    } catch (submitError) {
      setError(submitError?.message || "Unable to create listing right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketplaceDashboardShell
      title="Sell Your Book"
      description="Create a community listing with isolated local state so the current store checkout and auth flow remain untouched."
    >
      <div className="marketplace-card">
        <form className="marketplace-form-grid" onSubmit={handleSubmit}>
          <label className="marketplace-field">
            <span>Book title</span>
            <input name="title" value={formState.title} onChange={handleChange} placeholder="Atomic Habits" />
          </label>

          <label className="marketplace-field">
            <span>Author</span>
            <input name="author" value={formState.author} onChange={handleChange} placeholder="James Clear" />
          </label>

          <label className="marketplace-field marketplace-field-full">
            <span>Description</span>
            <textarea
              name="description"
              rows="5"
              value={formState.description}
              onChange={handleChange}
              placeholder="Add edition details, highlights, and condition notes."
            />
          </label>

          <label className="marketplace-field">
            <span>Condition</span>
            <select name="condition" value={formState.condition} onChange={handleChange}>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="used">Used</option>
            </select>
          </label>

          <label className="marketplace-field">
            <span>Price</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formState.price}
              onChange={handleChange}
              placeholder="12.99"
            />
          </label>

          <label className="marketplace-field">
            <span>Book mode</span>
            <select name="bookMode" value={formState.bookMode} onChange={handleChange}>
              <option value="sell">Sell</option>
              <option value="borrow">Borrow</option>
              <option value="exchange">Exchange</option>
            </select>
          </label>

          <label className="marketplace-field">
            <span>Image upload</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <div className="marketplace-upload-preview">
            {formState.imagePreview ? (
              <img src={formState.imagePreview} alt="Book preview" className="marketplace-upload-image" />
            ) : (
              <div className="marketplace-upload-placeholder">Upload a book cover preview</div>
            )}
          </div>

          {error ? <p className="marketplace-error">{error}</p> : null}

          <div className="marketplace-form-footer">
            <button type="submit" className="marketplace-btn marketplace-btn-primary" disabled={isDisabled}>
              {loading ? "Saving..." : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </MarketplaceDashboardShell>
  );
};

export default SellBook;

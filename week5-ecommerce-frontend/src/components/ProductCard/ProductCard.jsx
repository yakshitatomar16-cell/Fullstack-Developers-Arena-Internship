import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart 🛒`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    const alreadyInWishlist = isInWishlist(product.id);

    toggleWishlist(product);

    if (alreadyInWishlist) {
      toast.info(`${product.name} removed from wishlist 💔`);
    } else {
      toast.success(`${product.name} added to wishlist ❤️`);
    }
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <button className="wishlist-btn" onClick={handleWishlist}>
        {isInWishlist(product.id) ? "❤️" : "🤍"}
      </button>

      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>

      <p className="price">${product.price}</p>

      {/* ⭐ Rating */}
      <p className="rating">
        ⭐ {product.rating} / 5
      </p>

      <button className="cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
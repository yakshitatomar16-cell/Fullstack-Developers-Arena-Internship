import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./Header.css";

function Header({ search = "", setSearch = () => {} }) {
  const { wishlist } = useWishlist();
  const { cart } = useContext(CartContext);

  // Total quantity in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="logo">
        <h2>ShopEase</h2>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/products">Products</Link>
          </li>

          <li>
            <Link to="/wishlist">
              ❤️ Wishlist ({wishlist.length})
            </Link>
          </li>

          <li>
            <Link to="/cart">
              🛒 Cart ({cartCount})
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
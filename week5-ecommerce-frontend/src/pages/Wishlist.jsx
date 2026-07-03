import { useWishlist } from "../context/WishlistContext";
import Header from "../components/Header/Header";
import ProductCard from "../components/ProductCard/ProductCard";

function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <>
      <Header search="" setSearch={() => {}} />

      <div style={{ padding: "30px" }}>
        <h1 style={{ textAlign: "center" }}>❤️ My Wishlist</h1>

        {wishlist.length === 0 ? (
          <h2 style={{ textAlign: "center", marginTop: "40px" }}>
            Your wishlist is empty.
          </h2>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "30px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;
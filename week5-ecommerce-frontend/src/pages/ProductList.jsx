import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import ProductCard from "../components/ProductCard/ProductCard";
import { getProducts } from "../services/api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sortOrder === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <Header search={search} setSearch={setSearch} />

      <div style={{ padding: "30px" }}>
        <h1 style={{ textAlign: "center" }}>All Products</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            margin: "30px 0",
            flexWrap: "wrap",
          }}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Shoes">Shoes</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "60px",
            }}
          >
            <h2>⏳ Loading Products...</h2>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "30px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <h2>No Products Found</h2>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ProductList;
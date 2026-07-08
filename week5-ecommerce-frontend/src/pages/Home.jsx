import { useState } from "react";
import Header from "../components/Header/Header";
import ProductCard from "../components/ProductCard/ProductCard";

const products = [
  {
    id: 1,
    name: "Nike Shoes",
    price: 120,
    image: "https://picsum.photos/200?random=1",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 180,
    image: "https://picsum.photos/200?random=2",
  },
  {
    id: 3,
    name: "Headphones",
    price: 90,
    image: "https://picsum.photos/200?random=3",
  },
  {
    id: 4,
    name: "Laptop",
    price: 850,
    image: "https://picsum.photos/200?random=4",
  },
];

function Home() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header search={search} setSearch={setSearch} />

      <div style={{ padding: "40px" }}>
        <h1 style={{ textAlign: "center" }}>Featured Products</h1>

        <div
          style={{
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "40px",
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
      </div>
    </>
  );
}

export default Home;
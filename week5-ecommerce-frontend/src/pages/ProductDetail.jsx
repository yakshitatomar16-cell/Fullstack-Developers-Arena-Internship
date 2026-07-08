import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import { getProductById } from "../services/api";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct(data);
    });
  }, [id]);

  if (!product) {
    return (
      <>
        <Header />
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading...
        </h2>
      </>
    );
  }

  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
        }}
      >
        <div
          style={{
            background: "#fff",
            color: "#000",
            borderRadius: "10px",
            padding: "25px",
            width: "400px",
            textAlign: "center",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            width="250"
            style={{ borderRadius: "10px" }}
          />

          <h2>{product.name}</h2>

          <h3 style={{ color: "blue" }}>${product.price}</h3>

          <p>
            <strong>Category:</strong> {product.category}
          </p>

          <p>
            <strong>Rating:</strong> ⭐ {product.rating}
          </p>

          <p>{product.description}</p>

          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
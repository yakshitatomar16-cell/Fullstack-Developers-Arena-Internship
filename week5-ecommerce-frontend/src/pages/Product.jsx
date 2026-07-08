import ProductCard from "../components/ProductCard";

const dummyProducts = [
  { id: 1, name: "Nike Shoes", price: 100, image: "https://via.placeholder.com/150" },
  { id: 2, name: "Laptop", price: 800, image: "https://via.placeholder.com/150" },
  { id: 3, name: "Headphones", price: 50, image: "https://via.placeholder.com/150" }
];

function Products() {
  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {dummyProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default Products;
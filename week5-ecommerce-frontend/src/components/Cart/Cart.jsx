import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cart } = useContext(CartContext);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <h2>Cart is Empty</h2>
      ) : (
        cart.map((item, index) => (
          <div className="cart-item" key={index}>
            <img src={item.image} alt={item.name} />

            <div className="cart-info">
              <h3>{item.name}</h3>
              <h4>${item.price}</h4>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header search="" setSearch={() => {}} />

      <div className="cart-page">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <h2>🛒 Cart is Empty</h2>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h3>{item.name}</h3>

                  <h4>${item.price}</h4>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button onClick={() => decreaseQuantity(item.id)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.id)}>
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      marginTop: "10px",
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <hr />

            <h2>Total: ${total}</h2>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default CartPage;
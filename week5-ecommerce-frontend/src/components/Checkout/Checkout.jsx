import "./Checkout.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { setCart } = useContext(CartContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("🎉 Order Placed Successfully!");

    // Empty cart
    setCart([]);

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Shipping Address"
          rows="4"
          required
          value={formData.address}
          onChange={handleChange}
        />

        <select
          name="payment"
          required
          value={formData.payment}
          onChange={handleChange}
        >
          <option value="">Select Payment Method</option>
          <option>Cash on Delivery</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>UPI</option>
        </select>

        <button type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;
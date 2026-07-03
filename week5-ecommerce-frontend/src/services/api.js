// src/services/api.js

const products = [
  {
    id: 1,
    name: "Nike Running Shoes",
    price: 120,
    category: "Shoes",
    rating: 4.8,
    description:
      "Comfortable Nike running shoes with lightweight cushioning for everyday use.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },

  {
    id: 2,
    name: "Apple Smart Watch",
    price: 180,
    category: "Electronics",
    rating: 4.7,
    description:
      "Premium smartwatch with fitness tracking, heart rate monitoring and notifications.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },

  {
    id: 3,
    name: "Sony Headphones",
    price: 90,
    category: "Electronics",
    rating: 4.6,
    description:
      "Wireless noise-cancelling headphones with crystal clear sound quality.",
    image:
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600",
  },

  {
    id: 4,
    name: "Dell Laptop",
    price: 850,
    category: "Electronics",
    rating: 4.9,
    description:
      "High-performance laptop suitable for coding, gaming and professional work.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
  },
];

export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 500);
  });
};

export const getProductById = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.find((item) => item.id === Number(id)));
    }, 500);
  });
};
import ProductCard from "./components/ProductCard";

function App() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 2999,
      description: "Noise cancelling over-ear headphones.",
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 4999,
      description: "Fitness tracking smartwatch with heart rate monitor.",
      inStock: false,
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      price: 1999,
      description: "Portable speaker with deep bass and clear sound.",
      inStock: true,
    },
    {
      id: 4,
      name: "Laptop Backpack",
      price: 1499,
      description: "Water-resistant backpack with laptop compartment.",
      inStock: true,
    },
    {
      id: 5,
      name: "Wireless Mouse",
      price: 899,
      description: "Ergonomic mouse with smooth tracking.",
      inStock: false,
    },
    {
      id: 6,
      name: "Mechanical Keyboard",
      price: 3499,
      description: "RGB mechanical keyboard with tactile switches.",
      inStock: true,
    },
    {
      id: 7,
      name: "USB-C Hub",
      price: 1299,
      description: "Multiport adapter with HDMI and USB 3.0.",
      inStock: true,
    },
    {
      id: 8,
      name: "Webcam",
      price: 2199,
      description: "Full HD webcam with noise reduction mic.",
      inStock: false,
    },
  ];

  return (
    <div className="app">
      <h1 className="app-title">Our Products</h1>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

export default App;

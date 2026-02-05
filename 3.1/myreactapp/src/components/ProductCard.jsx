import "./ProductCard.css";

function ProductCard({ name, price, description, inStock }) {
  return (
    <div className="product-card">
      <h2 className="product-name">{name}</h2>

      <p className="product-description">{description}</p>

      <p className="product-price">₹{price}</p>

      <div
        className={`stock-badge ${
          inStock ? "available" : "unavailable"
        }`}
      >
        {inStock ? "Available" : "Out of Stock"}
      </div>
    </div>
  );
}

export default ProductCard;

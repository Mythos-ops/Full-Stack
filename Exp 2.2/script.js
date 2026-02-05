const products = [
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
    { id: 2, name: 'Headphones', price: 199, category: 'Electronics' },
    { id: 3, name: 'Coffee Maker', price: 79, category: 'Home' },
    { id: 4, name: 'Desk Chair', price: 299, category: 'Furniture' },
    { id: 5, name: 'Mouse', price: 29, category: 'Electronics' },
    { id: 6, name: 'Lamp', price: 49, category: 'Home' },
    { id: 7, name: 'Bookshelf', price: 159, category: 'Furniture' },
    { id: 8, name: 'Keyboard', price: 89, category: 'Electronics' }
];

const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const productGrid = document.getElementById('productGrid');

function displayProducts() {
    
    const category = categoryFilter.value;
    const sort = sortBy.value;
    
    let filtered = category === 'All' 
        ? products 
        : products.filter(p => p.category === category);
    
    filtered.sort((a, b) => {
        if (sort === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sort === 'price-low') {
            return a.price - b.price;
        } else if (sort === 'price-high') {
            return b.price - a.price;
        }
    });
  
    productGrid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <span class="category-badge">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price}</p>
        </div>
    `).join('');
}

categoryFilter.addEventListener('change', displayProducts);
sortBy.addEventListener('change', displayProducts);

displayProducts();
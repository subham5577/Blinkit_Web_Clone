// Sample Products Data
const products = [
    { id: 1, name: 'Organic Banana', category: 'grocery', price: 60, originalPrice: 80, weight: '1 kg', discount: '25%', emoji: '🍌' },
    { id: 2, name: 'Fresh Milk', category: 'dairy', price: 45, originalPrice: 60, weight: '1 L', discount: '25%', emoji: '🥛' },
    { id: 3, name: 'Whole Wheat Bread', category: 'grocery', price: 35, originalPrice: 50, weight: '400g', discount: '30%', emoji: '🍞' },
    { id: 4, name: 'Orange Juice', category: 'beverages', price: 80, originalPrice: 120, weight: '1 L', discount: '33%', emoji: '🧃' },
    { id: 5, name: 'Potato Chips', category: 'snacks', price: 40, originalPrice: 60, weight: '100g', discount: '33%', emoji: '🥔' },
    { id: 6, name: 'Cheddar Cheese', category: 'dairy', price: 250, originalPrice: 350, weight: '200g', discount: '28%', emoji: '🧀' },
    { id: 7, name: 'Yogurt', category: 'dairy', price: 55, originalPrice: 80, weight: '500g', discount: '31%', emoji: '🥣' },
    { id: 8, name: 'Cookies', category: 'snacks', price: 50, originalPrice: 70, weight: '150g', discount: '28%', emoji: '🍪' },
    { id: 9, name: 'Apples', category: 'grocery', price: 120, originalPrice: 180, weight: '1 kg', discount: '33%', emoji: '🍎' },
    { id: 10, name: 'Almonds', category: 'snacks', price: 200, originalPrice: 300, weight: '250g', discount: '33%', emoji: '🥜' },
    { id: 11, name: 'Coconut Water', category: 'beverages', price: 70, originalPrice: 100, weight: '1 L', discount: '30%', emoji: '🥥' },
    { id: 12, name: 'Tomato Sauce', category: 'grocery', price: 60, originalPrice: 90, weight: '200ml', discount: '33%', emoji: '🍅' },
];

// Categories
const categories = [
    { name: 'Grocery', emoji: '🛒' },
    { name: 'Snacks', emoji: '🍿' },
    { name: 'Beverages', emoji: '🧋' },
    { name: 'Dairy', emoji: '🥛' },
    { name: 'Bakery', emoji: '🍞' },
];

// Shopping Cart
let cart = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    displayProducts('all');
    setupEventListeners();
    loadCartFromStorage();
});

// Load Categories
function loadCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    categoryGrid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.name.toLowerCase()}')">
            <div style="font-size: 50px;">${cat.emoji}</div>
            <p>${cat.name}</p>
        </div>
    `).join('');
}

// Display Products
function displayProducts(filter) {
    const productsGrid = document.getElementById('productsGrid');
    let filteredProducts = products;

    if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-details">
                    <span class="product-weight">${product.weight}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <span class="product-price">₹${product.price}</span>
                        <span class="original-price">₹${product.originalPrice}</span>
                    </div>
                    <span class="discount-badge">${product.discount} OFF</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Filter by Category
function filterByCategory(category) {
    displayProducts(category);
    // Scroll to products section
    document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
}

// Filter Button Functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        displayProducts(this.dataset.filter);
    });
});

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Update Cart
function updateCart() {
    updateCartCount();
    saveCartToStorage();
    updateCartDisplay();
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update Cart Display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        subtotal.textContent = '₹0';
        total.textContent = '₹0';
        return;
    }

    let subtotalAmount = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotalAmount += itemTotal;

        return `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="decrementQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="incrementQuantity(${item.id})">+</button>
                    <button onclick="removeFromCart(${item.id})" style="background-color: #ff4444; color: white; margin-left: 5px;">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    const deliveryFee = 50;
    const totalAmount = subtotalAmount + deliveryFee;

    subtotal.textContent = `₹${subtotalAmount}`;
    total.textContent = `₹${totalAmount}`;
}

// Increment Quantity
function incrementQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Decrement Quantity
function decrementQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Modal Functions
const cartModal = document.getElementById('cartModal');
const loginModal = document.getElementById('loginModal');
const cartBtn = document.getElementById('cartBtn');
const loginBtn = document.getElementById('loginBtn');
const closeButtons = document.querySelectorAll('.close');

cartBtn.addEventListener('click', () => {
    updateCartDisplay();
    cartModal.style.display = 'block';
});

loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Checkout Button
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your order! Delivery in 10 minutes.');
    cart = [];
    updateCart();
    cartModal.style.display = 'none';
});

// Login Form
document.querySelector('.login-submit').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        alert(`Welcome back, ${email}!`);
        loginModal.style.display = 'none';
        document.getElementById('loginBtn').textContent = `${email.split('@')[0]}`;
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    } else {
        alert('Please fill in all fields');
    }
});

// Search Functionality
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const productsGrid = document.getElementById('productsGrid');
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
    );

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found</p>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-details">
                    <span class="product-weight">${product.weight}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <span class="product-price">₹${product.price}</span>
                        <span class="original-price">₹${product.originalPrice}</span>
                    </div>
                    <span class="discount-badge">${product.discount} OFF</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
});

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('blinkit_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('blinkit_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
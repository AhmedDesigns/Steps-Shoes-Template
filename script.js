// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });
    }
    
    // Cart toggle
    const cartButtons = document.querySelectorAll('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartClose = document.querySelector('.cart-close');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
    });
    
    if (cartClose) {
        cartClose.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    }
    
    // Search toggle
    const searchButtons = document.querySelectorAll('.search-btn');
    const searchContainer = document.querySelector('.search-container');
    
    searchButtons.forEach(button => {
        button.addEventListener('click', function() {
            searchContainer.classList.toggle('active');
        });
    });
    
    // Continue shopping button in cart
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    }
    
    // Mobile dropdown functionality
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        const link = item.querySelector('.mobile-nav-link');
        if (link.querySelector('.fa-chevron-down')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = item.querySelector('.mobile-dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('active');
                    link.querySelector('.fa-chevron-down').classList.toggle('rotated');
                }
            });
        }
    });
    
    // Initialize cart
    updateCart();
});

// Cart functionality
let cart = [];
const cartCountElements = document.querySelectorAll('.cart-count');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productCategory = productCard.querySelector('.product-category').textContent;
            const productPriceText = productCard.querySelector('.current-price').textContent;
            const productPrice = parseFloat(productPriceText.replace('$', '').replace(',', ''));
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.title === productTitle);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    title: productTitle,
                    category: productCategory,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification('Product added to cart!', 'success');
        });
    });
});

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    
    // Render cart items
    renderCartItems();
    
    // Update total
    updateTotal();
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <p>Your shopping cart is empty</p>
                <a href="#products" class="btn btn-primary">Shop Now</a>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-category">${item.category}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-title="${item.title}">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn plus" data-title="${item.title}">+</button>
                    <button class="remove-item" data-title="${item.title}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const item = cart.find(item => item.title === title);
            if (item) {
                item.quantity -= 1;
                if (item.quantity === 0) {
                    cart = cart.filter(i => i.title !== title);
                }
                updateCart();
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const item = cart.find(item => item.title === title);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            cart = cart.filter(item => item.title !== title);
            updateCart();
        });
    });
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    // Close notification when close button is clicked
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}
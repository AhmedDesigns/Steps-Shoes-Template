// Mobile menu functionality and all other features
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
    
    // ===== FLASH SALE COUNTDOWN TIMER - INFINITE LOOP =====
    function updateCountdown() {
        const now = new Date().getTime();
        let endTime = localStorage.getItem('flashSaleEndTime');
        
        if (!endTime || parseInt(endTime) <= now) {
            endTime = now + (2 * 24 * 60 * 60 * 1000);
            localStorage.setItem('flashSaleEndTime', endTime.toString());
            
            const saleBadge = document.querySelector('.sale-badge');
            if (saleBadge) {
                saleBadge.textContent = 'New Sale Started!';
                setTimeout(() => {
                    saleBadge.textContent = 'Limited Time Offer';
                }, 3000);
            }
        }
        
        const countdownDate = parseInt(endTime);
        const distance = countdownDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
        
        if (distance < 0) {
            localStorage.removeItem('flashSaleEndTime');
            
            const timerItems = document.querySelectorAll('.timer-item');
            timerItems.forEach(item => {
                item.style.opacity = '0.5';
                item.style.transform = 'scale(0.95)';
            });
            
            setTimeout(() => {
                timerItems.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                });
                updateCountdown();
            }, 2000);
        }
        
        if (distance < 60000) {
            if (secondsElement) {
                secondsElement.style.color = 'var(--accent)';
                if (!secondsElement.style.animation) {
                    secondsElement.style.animation = 'pulse 1s infinite';
                }
            }
        } else if (secondsElement) {
            secondsElement.style.color = '';
            secondsElement.style.animation = '';
        }
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // بدء المؤقت
    updateCountdown();
    const countdownTimer = setInterval(updateCountdown, 1000);
    
    // ===== CART FUNCTIONALITY =====
    let cart = [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productCategory = productCard.querySelector('.product-category').textContent;
            const productPriceText = productCard.querySelector('.current-price').textContent;
            const productPrice = parseFloat(productPriceText.replace('$', '').replace(',', ''));
            const productImage = productCard.querySelector('.product-image img').src;
            
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
    
    function updateCart() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
        
        renderCartItems();
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
        if (totalPriceElement) {
            totalPriceElement.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                }
            }
        });
    });
    
    const desktopNavItems = document.querySelectorAll('.desktop-nav-item');
    desktopNavItems.forEach(item => {
        const link = item.querySelector('.desktop-nav-link');
        const dropdown = item.querySelector('.desktop-dropdown');
        const arrow = item.querySelector('.dropdown-arrow');

        if (dropdown) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });

            item.addEventListener('mouseenter', () => {
                dropdown.classList.add('active');
            });

            item.addEventListener('mouseleave', () => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            showNotification('Proceeding to checkout...', 'success');
            setTimeout(() => {
                alert(`Checkout functionality would be implemented here.\nTotal: ${totalPriceElement.textContent}`);
            }, 500);
        });
    }
    
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email && email.includes('@') && email.includes('.')) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
    
    updateCart();
});

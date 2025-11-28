// Professional Shoe Website JavaScript
class STEPWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.initializeComponents();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.startSaleTimer();
        console.log('STEP Website Initialized');
    }

    initializeComponents() {
        // Mobile menu elements
        this.menuToggle = document.getElementById('menuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileMenuClose = document.getElementById('mobileMenuClose');
        
        // Cart functionality
        this.cartCount = 0;
        this.cartCountElement = document.querySelector('.cart-count');
        
        // Wishlist functionality
        this.wishlist = new Set();
        
        // Newsletter form
        this.newsletterForm = document.querySelector('.newsletter-form');
    }

    setupEventListeners() {
        // Mobile menu
        if (this.menuToggle && this.mobileMenu && this.mobileMenuClose) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
            this.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
            
            // Close mobile menu when clicking on links
            document.querySelectorAll('.mobile-menu-link').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Product interactions
        this.setupProductInteractions();

        // Newsletter form
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        // Search functionality
        this.setupSearch();
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
        this.menuToggle.classList.toggle('active');
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        this.menuToggle.classList.remove('active');
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'var(--secondary)';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }

        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupProductInteractions() {
        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleWishlist(btn);
            });
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.quickViewProduct(btn);
            });
        });

        // Add to cart functionality
        document.querySelectorAll('.product-card .btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart(btn);
            });
        });
    }

    toggleWishlist(button) {
        const productCard = button.closest('.product-card');
        const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
        
        if (this.wishlist.has(productId)) {
            this.wishlist.delete(productId);
            button.classList.remove('active');
            button.innerHTML = '<i class="far fa-heart"></i>';
            this.showNotification('Product removed from wishlist', 'info');
        } else {
            this.wishlist.add(productId);
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
            this.showNotification('Product added to wishlist', 'success');
        }
        
        // Add bounce animation
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = 'bounce 0.5s';
        }, 10);
    }

    quickViewProduct(button) {
        const productCard = button.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        this.showNotification(`Quick view: ${productTitle} - ${productPrice}`, 'info');
        
        // In a real implementation, this would open a modal with product details
        console.log('Quick view for:', productTitle);
    }

    addToCart(button) {
        this.cartCount++;
        
        if (this.cartCountElement) {
            this.cartCountElement.textContent = this.cartCount;
            this.cartCountElement.style.animation = 'bounce 0.5s';
            
            setTimeout(() => {
                this.cartCountElement.style.animation = '';
            }, 500);
        }
        
        const productCard = button.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        this.showNotification(`${productTitle} added to cart!`, 'success');
        
        // Add to cart animation
        button.innerHTML = '<div class="loading"></div>';
        setTimeout(() => {
            button.innerHTML = 'Added! <i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = 'Add to Cart';
            }, 2000);
        }, 1000);
    }

    setupSearch() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.showNotification('Search functionality would open here', 'info');
            });
        }
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const emailInput = this.newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (this.validateEmail(email)) {
            const submitBtn = this.newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<div class="loading"></div>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = 'Subscribed! <i class="fas fa-check"></i>';
                this.showNotification('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        } else {
            this.showNotification('Please enter a valid email address', 'error');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        return colors[type] || '#17a2b8';
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    startSaleTimer() {
        const timerElements = document.querySelectorAll('.timer-number');
        if (timerElements.length === 0) return;

        const days = timerElements[0];
        const hours = timerElements[1];
        const minutes = timerElements[2];

        // Set end date (2 days from now)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 2);
        endDate.setHours(12, 45, 0, 0);

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                days.textContent = '00';
                hours.textContent = '00';
                minutes.textContent = '00';
                return;
            }

            const daysLeft = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            days.textContent = daysLeft.toString().padStart(2, '0');
            hours.textContent = hoursLeft.toString().padStart(2, '0');
            minutes.textContent = minutesLeft.toString().padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }
}

// Add bounce animation to CSS
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(bounceStyle);

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new STEPWebsite();
});

// Add fade-in class to elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.product-card, .feature-card, .category-card, .section-header');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
    });
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/400x300/f8f9fa/666666?text=Image+Not+Found';
            this.alt = 'Image not available';
        });
    });
});
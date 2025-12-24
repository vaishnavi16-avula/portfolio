// Modern Restaurant JavaScript
class ModernRestaurant {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
        this.menuItems = this.initializeMenuItems();
        
        this.initializeElements();
        this.bindEvents();
        this.updateCartDisplay();
        this.renderMenu();
        this.setupSmoothScrolling();
        this.setupNavbarScroll();
    }

    initializeElements() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.cartBtn = document.getElementById('cart-btn');
        this.cartCount = document.getElementById('cart-count');
        this.cartModal = document.getElementById('cart-modal');
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.menuGrid = document.getElementById('menu-grid');
        this.toastContainer = document.getElementById('toast-container');
        this.reservationModal = document.getElementById('reservation-modal');
        this.contactForm = document.getElementById('contact-form');
        this.reservationForm = document.getElementById('reservation-form');
    }

    initializeMenuItems() {
        return [
            // Appetizers
            {
                id: 1,
                name: "Chicken Wings",
                description: "Crispy chicken wings with spicy buffalo sauce",
                price: 299,
                category: "appetizers",
                image: "🍗",
                popular: true
            },
            {
                id: 2,
                name: "Caesar Salad",
                description: "Fresh romaine lettuce with parmesan cheese and croutons",
                price: 199,
                category: "appetizers",
                image: "🥗"
            },
            {
                id: 3,
                name: "Garlic Bread",
                description: "Toasted bread with garlic butter and herbs",
                price: 149,
                category: "appetizers",
                image: "🍞"
            },
            {
                id: 4,
                name: "Mozzarella Sticks",
                description: "Golden fried mozzarella with marinara sauce",
                price: 249,
                category: "appetizers",
                image: "🧀"
            },

            // Main Course
            {
                id: 5,
                name: "Grilled Salmon",
                description: "Fresh Atlantic salmon with lemon herb butter",
                price: 599,
                category: "mains",
                image: "🐟",
                popular: true
            },
            {
                id: 6,
                name: "Beef Steak",
                description: "Tender ribeye steak cooked to perfection",
                price: 799,
                category: "mains",
                image: "🥩"
            },
            {
                id: 7,
                name: "Chicken Biryani",
                description: "Fragrant basmati rice with spiced chicken",
                price: 449,
                category: "mains",
                image: "🍛"
            },
            {
                id: 8,
                name: "Pasta Carbonara",
                description: "Creamy pasta with bacon and parmesan cheese",
                price: 399,
                category: "mains",
                image: "🍝"
            },

            // Desserts
            {
                id: 9,
                name: "Chocolate Lava Cake",
                description: "Warm chocolate cake with molten center",
                price: 299,
                category: "desserts",
                image: "🍰",
                popular: true
            },
            {
                id: 10,
                name: "Tiramisu",
                description: "Classic Italian dessert with coffee and mascarpone",
                price: 249,
                category: "desserts",
                image: "🍮"
            },
            {
                id: 11,
                name: "Ice Cream Sundae",
                description: "Vanilla ice cream with chocolate sauce and nuts",
                price: 199,
                category: "desserts",
                image: "🍨"
            },

            // Beverages
            {
                id: 12,
                name: "Fresh Orange Juice",
                description: "Freshly squeezed orange juice",
                price: 99,
                category: "beverages",
                image: "🍊"
            },
            {
                id: 13,
                name: "Coffee Latte",
                description: "Rich espresso with steamed milk",
                price: 149,
                category: "beverages",
                image: "☕"
            },
            {
                id: 14,
                name: "Mango Smoothie",
                description: "Creamy mango smoothie with yogurt",
                price: 179,
                category: "beverages",
                image: "🥭"
            }
        ];
    }

    bindEvents() {
        // Navigation
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Cart
        this.cartBtn.addEventListener('click', () => this.toggleCart());
        document.getElementById('cart-close').addEventListener('click', () => this.toggleCart());
        document.getElementById('clear-cart').addEventListener('click', () => this.clearCart());
        document.getElementById('checkout').addEventListener('click', () => this.checkout());

        // Menu filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterMenu(e.target.dataset.filter));
        });

        // Buttons
        document.getElementById('explore-menu').addEventListener('click', () => this.scrollToSection('menu'));
        document.getElementById('book-table').addEventListener('click', () => this.openReservationModal());
        document.querySelectorAll('.reservation-btn').forEach(btn => {
            btn.addEventListener('click', () => this.openReservationModal());
        });

        // Forms
        this.contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        this.reservationForm.addEventListener('submit', (e) => this.handleReservationForm(e));

        // Modal close events
        document.getElementById('reservation-close').addEventListener('click', () => this.closeReservationModal());
        
        // Click outside to close modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-modal')) {
                this.toggleCart();
            }
            if (e.target.classList.contains('modal')) {
                this.closeReservationModal();
            }
        });
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupNavbarScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                this.navbar.style.boxShadow = 'none';
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    renderMenu(filter = 'all') {
        const filteredItems = filter === 'all' 
            ? this.menuItems 
            : this.menuItems.filter(item => item.category === filter);

        this.menuGrid.innerHTML = filteredItems.map(item => `
            <div class="menu-item" data-category="${item.category}">
                <div class="menu-item-image">
                    <div style="font-size: 4rem;">${item.image}</div>
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-header">
                        <h3 class="menu-item-title">${item.name}</h3>
                        <span class="menu-item-price">₹${item.price}</span>
                    </div>
                    <p class="menu-item-description">${item.description}</p>
                    <div class="menu-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="restaurant.decreaseQuantity(${item.id})">-</button>
                            <span class="quantity" id="qty-${item.id}">${this.getQuantity(item.id)}</span>
                            <button class="quantity-btn" onclick="restaurant.increaseQuantity(${item.id})">+</button>
                        </div>
                        <button class="add-to-cart" onclick="restaurant.addToCart(${item.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterMenu(category) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${category}"]`).classList.add('active');

        // Filter and render menu
        this.renderMenu(category);
    }

    getQuantity(itemId) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        return item ? item.quantity : 0;
    }

    increaseQuantity(itemId) {
        const menuItem = this.menuItems.find(item => item.id === itemId);
        const existingItem = this.cart.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                ...menuItem,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        this.updateQuantityDisplay(itemId);
        this.saveCart();
        this.showToast(`${menuItem.name} added to cart!`, 'success');
    }

    decreaseQuantity(itemId) {
        const existingItem = this.cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity--;
            if (existingItem.quantity <= 0) {
                this.cart = this.cart.filter(item => item.id !== itemId);
            }
        }

        this.updateCartDisplay();
        this.updateQuantityDisplay(itemId);
        this.saveCart();
    }

    addToCart(itemId) {
        this.increaseQuantity(itemId);
    }

    updateQuantityDisplay(itemId) {
        const quantityElement = document.getElementById(`qty-${itemId}`);
        if (quantityElement) {
            quantityElement.textContent = this.getQuantity(itemId);
        }
    }

    updateCartDisplay() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;

        // Render cart items
        this.cartItems.innerHTML = this.cart.length === 0 
            ? '<div style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</div>'
            : this.cart.map(item => `
                <div class="cart-item">
                    <div style="font-size: 2rem;">${item.image}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="restaurant.decreaseQuantity(${item.id})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="restaurant.increaseQuantity(${item.id})">+</button>
                    </div>
                </div>
            `).join('');

        // Update total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartTotal.textContent = total;
    }

    toggleCart() {
        this.cartModal.classList.toggle('active');
    }

    clearCart() {
        this.cart = [];
        this.updateCartDisplay();
        this.saveCart();
        this.renderMenu();
        this.showToast('Cart cleared!', 'success');
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty!', 'warning');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.showToast(`Order placed successfully! Total: ₹${total}`, 'success');
        this.clearCart();
        this.toggleCart();
    }

    openReservationModal() {
        this.reservationModal.classList.add('active');
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('res-date').min = today;
    }

    closeReservationModal() {
        this.reservationModal.classList.remove('active');
    }

    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Simulate form submission
        this.showToast('Thank you! Your message has been sent successfully.', 'success');
        e.target.reset();
    }

    handleReservationForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const guests = formData.get('guests');
        const date = formData.get('date');
        const time = formData.get('time');

        // Simulate reservation booking
        this.showToast(`Table reserved for ${guests} guests on ${date} at ${time}!`, 'success');
        e.target.reset();
        this.closeReservationModal();
    }

    saveCart() {
        localStorage.setItem('restaurantCart', JSON.stringify(this.cart));
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize restaurant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.restaurant = new ModernRestaurant();
});

// Add some fun animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Animate menu items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe menu items
    setTimeout(() => {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }, 100);

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});






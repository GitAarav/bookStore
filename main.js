// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const categoryButtons = document.querySelectorAll(".category-btn");
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
const cartNotification = document.getElementById("cart-notification");
const newsletterForm = document.getElementById("newsletter-form");
const feedbackForm = document.getElementById("feedback-form");
const dropdowns = document.querySelectorAll(".dropdown");

// Check for saved theme preference or use system preference
document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.body.classList.toggle('dark', savedTheme === 'dark');
    } else {
        // Check system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark', prefersDarkMode);
        localStorage.setItem('theme', prefersDarkMode ? 'dark' : 'light');
    }

    // Initialize cart count
    updateCartCount();

    // Initialize category display if on category page
    if (window.location.pathname.includes('categories.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        if (category) {
            filterBooksByCategory(category);
            document.getElementById('category-title').textContent = category.charAt(0).toUpperCase() + category.slice(1);

            // Set active category button
            categoryButtons.forEach(button => {
                if (button.dataset.category === category) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-toggle') && !e.target.closest('.nav-links')) {
        navLinks.classList.remove('active');
    }
});

// Mobile Dropdown Toggle
dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');

    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Tab Switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});

// Category Filtering
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Filter books
        const category = button.dataset.category;
        filterBooksByCategory(category);

        // Update category title
        document.getElementById('category-title').textContent =
            category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1);
    });
});

function filterBooksByCategory(category) {
    const books = document.querySelectorAll('.book-card');

    books.forEach(book => {
        if (category === 'all' || book.dataset.category === category) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    });
}

// Cart Functionality
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartNotification = document.getElementById('cart-notification');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(e) {
        const bookCard = e.target.closest('.book-card');
        if (!bookCard) return;

        const bookTitle = bookCard.querySelector('h3').textContent;
        const bookPrice = bookCard.querySelector('.current-price').textContent;
        const bookImageElement = bookCard.querySelector('img');
        const bookImage = bookImageElement ? bookImageElement.src : '';

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingBook = cart.find(item => item.title === bookTitle);

        if (existingBook) {
            existingBook.quantity += 1;
        } else {
            cart.push({
                title: bookTitle,
                price: bookPrice,
                image: bookImage,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification();
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);

        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    function showNotification() {
        if (!cartNotification) return;

        cartNotification.classList.add('show');

        setTimeout(() => {
            cartNotification.classList.remove('show');
        }, 3000);
    }

    updateCartCount();
});


// Form Validation
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form inputs
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Validate inputs
        let isValid = true;

        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            clearError(nameInput);
        }

        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else {
            clearError(messageInput);
        }

        // If form is valid, submit
        if (isValid) {
            // In a real application, you would send the form data to a server
            alert('Thank you for your feedback!');
            feedbackForm.reset();
        }
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector('input[type="email"]');

        if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
            alert('Please enter a valid email address');
        } else {
            // In a real application, you would send the email to a server
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');

    input.classList.add('error');
    errorElement.textContent = message;
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');

    input.classList.remove('error');
    errorElement.textContent = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize cart page if on cart.html
if (window.location.pathname.includes('cart.html')) {
    displayCartItems();
}

function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const cartEmptyMessage = document.querySelector('.cart-empty');

    if (!cartItemsContainer) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartSummaryContainer.style.display = 'none';
        cartEmptyMessage.style.display = 'block';
        return;
    }

    cartItemsContainer.style.display = 'block';
    cartSummaryContainer.style.display = 'block';
    cartEmptyMessage.style.display = 'none';

    // Clear previous items
    cartItemsContainer.innerHTML = '';

    // Add cart items
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p class="price">${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners to quantity buttons and remove buttons
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeButtons = document.querySelectorAll('.remove-btn');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCartItems();
                updateCartCount();
            }
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            cart[index].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        });
    });

    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const index = input.dataset.index;
            const quantity = Number.parseInt(input.value);

            if (quantity >= 1) {
                cart[index].quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCartItems();
                updateCartCount();
            } else {
                input.value = 1;
            }
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        });
    });

    // Update cart summary
    updateCartSummary(cart);
}

function updateCartSummary(cart) {
    const summaryContainer = document.querySelector('.summary-items');
    const totalElement = document.querySelector('.summary-total .amount');

    if (!summaryContainer || !totalElement) return;

    // Clear previous summary
    summaryContainer.innerHTML = '';

    // Calculate subtotal
    let subtotal = 0;

    cart.forEach(item => {
        const price = Number.parseFloat(item.price.replace(/[₹,]/g, '')) || 0; // Fix NaN issue
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        const summaryItem = document.createElement('div');
        summaryItem.classList.add('summary-item');

        summaryItem.innerHTML = `
            <span>${item.title} x ${item.quantity}</span>
            <span>₹${itemTotal.toFixed(2)}</span>
        `;

        summaryContainer.appendChild(summaryItem);
    });

    // Add shipping and tax
    const shipping = subtotal > 500 ? 0 : 100;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const shippingItem = document.createElement('div');
    shippingItem.classList.add('summary-item');
    shippingItem.innerHTML = `
        <span>Shipping</span>
        <span>${shipping === 0 ? 'Free' : '₹' + shipping.toFixed(2)}</span>
    `;

    const taxItem = document.createElement('div');
    taxItem.classList.add('summary-item');
    taxItem.innerHTML = `
        <span>Tax</span>
        <span>₹${tax.toFixed(2)}</span>
    `;

    summaryContainer.appendChild(shippingItem);
    summaryContainer.appendChild(taxItem);

    // Update total
    totalElement.textContent = '₹' + total.toFixed(2);

    // Add checkout button event listener
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Thank you for your purchase! This is a demo, so no actual purchase was made.');
            localStorage.removeItem('cart');
            displayCartItems();
            updateCartCount();
        });
    }
}


// Login form validation
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        let isValid = true;

        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (passwordInput.value.trim() === '') {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        if (isValid) {
            // In a real application, you would send the login data to a server
            alert('Login successful! This is a demo, so no actual login occurred.');
            loginForm.reset();
        }
    });
}

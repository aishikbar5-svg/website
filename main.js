/**
 * Aurora Luxe - Jewelry E-commerce Website
 * Main JavaScript File
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initHeroSlider();
    initMobileMenu();
    initStickyHeader();
    initProductGallery();
    initProductCustomization();
    initCartFunctions();
    initCheckoutForm();
    initFilters();
    initAnimations();
});

/**
 * Hero Slider Functionality
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dots .dot');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto-advance slides
    const autoSlide = setInterval(nextSlide, slideInterval);
    
    // Click events for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoSlide);
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Pause on hover
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', () => clearInterval(autoSlide));
        hero.addEventListener('mouseleave', () => {
            // Don't restart if we manually clicked
        });
    }
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (!menuBtn || !nav) return;
    
    menuBtn.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
        menuBtn.classList.toggle('active');
    });
}

/**
 * Sticky Header
 */
function initStickyHeader() {
    const header = document.querySelector('.header-main');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Product Gallery (Product Detail Page)
 */
function initProductGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (!mainImage || thumbnails.length === 0) return;
    
    // Make main image zoomable
    mainImage.addEventListener('mousemove', function(e) {
        const { left, top, width, height } = this.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        
        this.style.transformOrigin = `${x}% ${y}%`;
        this.style.transform = 'scale(1.5)';
    });
    
    mainImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Thumbnail click handlers
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Get image source from onclick attribute
            const newSrc = this.getAttribute('data-image') || this.querySelector('img').src;
            mainImage.src = newSrc.replace('w=200', 'w=800');
        });
    });
}

/**
 * Product Customization (Product Detail Page)
 */
function initProductCustomization() {
    // Metal Selection
    const metalOptions = document.querySelectorAll('.metal-option');
    metalOptions.forEach(option => {
        option.addEventListener('click', function() {
            metalOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Karat Selection
    const karatOptions = document.querySelectorAll('.karat-option');
    karatOptions.forEach(option => {
        option.addEventListener('click', function() {
            karatOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Ring Size Selection
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Diamond Selection
    const diamondOptions = document.querySelectorAll('input[name="diamond"]');
    diamondOptions.forEach(option => {
        option.addEventListener('change', function() {
            updatePrice();
        });
    });
}

/**
 * Update Price based on selections
 */
function updatePrice() {
    const metalPrice = 18500;
    const selectedDiamond = document.querySelector('input[name="diamond"]:checked');
    let diamondPrice = 15000;
    
    if (selectedDiamond) {
        const priceMatch = selectedDiamond.nextElementSibling.textContent.match(/\+₹([\d,]+)/);
        if (priceMatch) {
            diamondPrice = parseInt(priceMatch[1].replace(/,/g, ''));
        }
    }
    
    const makingCharges = 8500;
    const subtotal = metalPrice + diamondPrice + makingCharges;
    const gst = Math.round(subtotal * 0.03);
    const total = subtotal + gst;
    
    // Update price breakdown
    const priceRows = document.querySelectorAll('.price-row');
    if (priceRows.length >= 4) {
        priceRows[0].querySelector('span:last-child').textContent = `₹${metalPrice.toLocaleString('en-IN')}`;
        priceRows[1].querySelector('span:last-child').textContent = `₹${diamondPrice.toLocaleString('en-IN')}`;
        priceRows[2].querySelector('span:last-child').textContent = `₹${makingCharges.toLocaleString('en-IN')}`;
        priceRows[3].querySelector('span:last-child').textContent = `₹${gst.toLocaleString('en-IN')}`;
        priceRows[4].querySelector('span:last-child').textContent = `₹${total.toLocaleString('en-IN')}`;
    }
}

/**
 * Cart Functions
 */
function initCartFunctions() {
    // Quantity update
    window.updateQuantity = function(btn, change) {
        const quantitySpan = btn.parentElement.querySelector('span');
        let quantity = parseInt(quantitySpan.textContent) + change;
        
        if (quantity < 1) quantity = 1;
        if (quantity > 10) quantity = 10;
        
        quantitySpan.textContent = quantity;
        
        // Update total for this item (simplified)
        updateCartTotal();
    };
    
    // Remove item
    window.removeItem = function(btn) {
        const cartItem = btn.closest('.cart-item');
        if (cartItem) {
            cartItem.style.opacity = '0';
            setTimeout(() => {
                cartItem.remove();
                updateCartTotal();
            }, 300);
        }
    };
    
    // Apply coupon
    window.applyCoupon = function() {
        const couponInput = document.querySelector('.coupon-section input');
        if (couponInput) {
            const code = couponInput.value.toUpperCase();
            
            if (code === 'AURORA10') {
                alert('Coupon applied! 10% discount applied to your order.');
            } else if (code === 'LUXE20') {
                alert('Coupon applied! 20% discount applied to your order.');
            } else {
                alert('Invalid coupon code. Please try again.');
            }
        }
    };
}

/**
 * Update Cart Total
 */
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const priceText = item.querySelector('.cart-total').textContent;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        subtotal += price;
    });
    
    const gst = Math.round(subtotal * 0.03);
    const total = subtotal + gst;
    
    // Update summary
    const summaryRows = document.querySelectorAll('.cart-summary .summary-row');
    if (summaryRows.length >= 3) {
        const itemCount = cartItems.length;
        summaryRows[0].querySelector('span:first-child').textContent = `Subtotal (${itemCount} items)`;
        summaryRows[0].querySelector('span:last-child').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        summaryRows[2].querySelector('span:last-child').textContent = `₹${total.toLocaleString('en-IN')}`;
    }
}

/**
 * Checkout Form
 */
function initCheckoutForm() {
    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide card details based on selection
            const cardDetails = document.getElementById('cardDetails');
            if (cardDetails) {
                const selectedText = this.querySelector('span:last-child').textContent;
                if (selectedText.includes('Credit') || selectedText.includes('Debit')) {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            }
        });
    });
    
    // Place order
    window.placeOrder = function() {
        // Simple validation
        const firstName = document.querySelector('input[placeholder="Enter first name"]');
        const lastName = document.querySelector('input[placeholder="Enter last name"]');
        const email = document.querySelector('input[type="email"]');
        const phone = document.querySelector('input[type="tel"]');
        const address = document.querySelector('input[placeholder="Enter address"]');
        
        if (!firstName.value || !lastName.value || !email.value || !phone.value || !address.value) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Simulate order placement
        alert('Order placed successfully! Thank you for shopping with Aurora Luxe.\n\nOrder ID: #AL-2024-' + Math.floor(Math.random() * 10000));
        
        // Redirect to confirmation (in real app)
        // window.location.href = 'order-confirmation.html';
    };
    
    // Toggle promo code
    window.togglePromo = function() {
        const promoDiv = document.getElementById('promoCode');
        if (promoDiv) {
            promoDiv.style.display = promoDiv.style.display === 'none' ? 'block' : 'none';
        }
    };
}

/**
 * Product Filters
 */
function initFilters() {
    const filterSections = document.querySelectorAll('.filter-section h4');
    
    filterSections.forEach(title => {
        title.addEventListener('click', function() {
            const options = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (options.style.display === 'none') {
                options.style.display = 'flex';
                if (icon) icon.classList.remove('fa-chevron-down');
                if (icon) icon.classList.add('fa-chevron-up');
            } else {
                options.style.display = 'none';
                if (icon) icon.classList.remove('fa-chevron-up');
                if (icon) icon.classList.add('fa-chevron-down');
            }
        });
    });
}

/**
 * Animations and Scroll Effects
 */
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.product-card, .category-card, .occasion-card, .material-card');
    animateElements.forEach(el => observer.observe(el));
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = '';
            }
        }
    });
}

/**
 * Change Image (for product detail page)
 */
function changeImage(thumbnail, imageSrc) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

/**
 * Select Metal
 */
function selectMetal(element, metalType) {
    const options = document.querySelectorAll('.metal-option');
    options.forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

/**
 * Select Size
 */
function selectSize(element) {
    const options = document.querySelectorAll('.size-option');
    options.forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

/**
 * Newsletter Form
 */
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    if (emailInput.value) {
        alert('Thank you for subscribing to Aurora Luxe!');
        emailInput.value = '';
    }
});

/**
 * Search Functionality (placeholder)
 */
document.querySelector('.search-bar button')?.addEventListener('click', function() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput.value) {
        alert(`Search for: ${searchInput.value}\n\nThis would navigate to the products page with filters applied.`);
    }
});

/**
 * Wishlist Toggle
 */
document.querySelectorAll('.product-actions button[title="Add to Wishlist"]').forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.querySelector('i').classList.remove('far');
            this.querySelector('i').classList.add('fas');
        } else {
            this.querySelector('i').classList.remove('fas');
            this.querySelector('i').classList.add('far');
        }
    });
});

/**
 * Quick View Modal (placeholder)
 */
document.querySelectorAll('.product-actions button[title="Quick View"]').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Quick View modal would open here.\n\nThis would show a popup with product details.');
    });
});

/**
 * Compare Products (placeholder)
 */
document.querySelectorAll('.product-actions button[title="Compare"]').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Product added to comparison list.\n\nYou can compare up to 4 products.');
    });
});

// Export functions for global use
window.changeImage = changeImage;
window.selectMetal = selectMetal;
window.selectSize = selectSize;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.applyCoupon = applyCoupon;
window.placeOrder = placeOrder;
window.togglePromo = togglePromo;

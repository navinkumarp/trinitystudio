// Trinity Studio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
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

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Form validation
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Enhanced form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            let errors = [];
            
            requiredFields.forEach(field => {
                const label = field.labels && field.labels.length > 0 ? field.labels[0].textContent : field.name;
                
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#FF6B6B';
                    field.style.boxShadow = '0 0 0 2px rgba(255, 107, 107, 0.2)';
                    errors.push(`${label} is required`);
                    
                    // Add shake animation
                    field.classList.add('error-shake');
                    setTimeout(() => field.classList.remove('error-shake'), 500);
                } else {
                    field.style.borderColor = 'rgba(255, 180, 0, 0.3)';
                    field.style.boxShadow = '0 0 0 2px rgba(255, 180, 0, 0.1)';
                }
            });

            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.style.borderColor = '#FF6B6B';
                }
            }

            if (isValid) {
                // Show loading message
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Send email using EmailJS
                if (typeof emailjs !== 'undefined') {
                    const templateParams = {
                        from_name: contactForm.querySelector('#name').value,
                        from_email: contactForm.querySelector('#email').value,
                        phone: contactForm.querySelector('#phone').value || 'Not provided',
                        booking_type: contactForm.querySelector('#booking-type').value,
                        preferred_date: contactForm.querySelector('#date').value || 'Not specified',
                        message: contactForm.querySelector('#message').value,
                        to_email: 'bookings@trinitystudiochennai.com'
                    };
                    
                    emailjs.send('service_hcfqwke', 'template_e9tg4mx', templateParams)
                        .then(function(response) {
                            console.log('SUCCESS!', response.status, response.text);
                            showMessage('🎉 Thank you! Your booking request has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
                            contactForm.reset();
                            
                            // Reset all field styles
                            requiredFields.forEach(field => {
                                field.style.borderColor = '';
                                field.style.boxShadow = '';
                            });
                        })
                        .catch(function(error) {
                            console.log('FAILED...', error);
                            showMessage('❌ Sorry, there was an error sending your message. Please try again or contact us directly at bookings@trinitystudiochennai.com', 'error');
                        })
                        .finally(function() {
                            submitButton.textContent = originalButtonText;
                            submitButton.disabled = false;
                        });
                } else {
                    // Fallback if EmailJS is not loaded
                    showMessage('🎉 Thank you! Your booking request has been received. We\'ll get back to you within 24 hours. (Note: Please contact us directly at bookings@trinitystudiochennai.com to ensure we receive your request)', 'success');
                    contactForm.reset();
                    
                    // Reset all field styles
                    requiredFields.forEach(field => {
                        field.style.borderColor = '';
                        field.style.boxShadow = '';
                    });
                    
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
            } else {
                const errorMessage = errors.length > 0 ? errors.join('\n• ') : 'Please fill in all required fields correctly.';
                showMessage(`❌ Please correct the following errors:\n• ${errorMessage}`, 'error');
            }
        });
    }

    // Show message function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            ${type === 'success' ? 
                'background-color: rgba(34, 197, 94, 0.1); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3);' : 
                'background-color: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3);'
            }
        `;

        // Insert message after form
        contactForm.insertAdjacentElement('afterend', messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Header background opacity on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const opacity = Math.min(0.95 + (scrolled / 1000) * 0.05, 1);
            header.style.backgroundColor = `rgba(14, 14, 14, ${opacity})`;
        });
    }

    // Enhanced loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.filter = 'blur(5px)';
            
            const loadHandler = () => {
                img.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
                img.style.opacity = '1';
                img.style.filter = 'blur(0px)';
            };
            
            if (img.complete) {
                loadHandler();
            } else {
                img.addEventListener('load', loadHandler);
                // Add error handling
                img.addEventListener('error', () => {
                    img.style.opacity = '0.5';
                    img.style.filter = 'grayscale(100%)';
                    console.warn('Failed to load image:', img.src);
                });
            }
        }
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .space-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (isElementInViewport(el)) {
                el.classList.add('visible');
            }
        });
    }, 100);

    // Utility function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});

// Preload critical images with loading states
function preloadImages() {
    const imageUrls = [
        'assets/images/Trinity-Studio-Logos-White.png',
        'assets/images/recording_studio.jpeg',
        'assets/images/greenmatte-area1.jpg',
        'assets/images/PHOTO-2025-02-17-17-27-22.jpg'
    ];
    
    const loadPromises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject(url);
            img.src = url;
        });
    });
    
    Promise.allSettled(loadPromises).then(results => {
        console.log('Image preloading completed:', results);
    });
}

// Call preload on page load and add performance monitoring
window.addEventListener('load', function() {
    preloadImages();
    
    // Performance optimization - lazy load non-critical images
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                }
            });
        });
        
        document.querySelectorAll('img.lazy').forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
    
    // Add scroll performance optimization
    let ticking = false;
    function updateOnScroll() {
        const header = document.querySelector('.header');
        if (header) {
            const scrolled = window.pageYOffset;
            const opacity = Math.min(0.95 + (scrolled / 1000) * 0.05, 1);
            header.style.backgroundColor = `rgba(14, 14, 14, ${opacity})`;
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
});
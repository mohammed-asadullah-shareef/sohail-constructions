// Navigation functionality
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu');
        
        // Toggle hamburger icon
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('show-menu')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY >= 80) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href*=${sectionId}]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', scrollActive);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Project modal functionality
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');

const projectData = {
    1: {
        title: 'Modern Villa Project',
        category: 'Residential',
        image: 'assets/image1.jpg'
    },
    2: {
        title: 'Commercial Complex',
        category: 'Commercial',
        image: 'assets/image2.jpg'
    },
    3: {
        title: 'Luxury Apartment Complex',
        category: 'Residential',
        image: 'assets/image3.jpg'
    },
    4: {
        title: 'Modern Office Building',
        category: 'Commercial',
        image: 'assets/image4.jpg'
    },
    5: {
        title: 'Residential Township',
        category: 'Residential',
        image: 'assets/image5.jpg'
    },
    6: {
        title: 'Industrial Construction',
        category: 'Industrial',
        image: 'assets/image6.jpg'
    }
};

function openModal(projectId) {
    const project = projectData[projectId];
    if (project) {
        modalImage.src = project.image;
        modalImage.alt = project.title;
        modalTitle.textContent = project.title;
        modalCategory.textContent = project.category;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Contact form handling with Web3Forms
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formButton = contactForm.querySelector('.form__button');
    const buttonText = formButton.querySelector('.button__text');
    const originalText = buttonText.textContent;
    
    // Show loading state
    formButton.disabled = true;
    buttonText.textContent = 'Sending...';
    formStatus.style.display = 'none';
    
    // Convert FormData to JSON
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    showFormStatus('info', 'Please wait...');
    
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            showFormStatus('success', 'Thank you! Your message has been sent successfully. We will contact you soon.');
            contactForm.reset();
        } else {
            console.log(response);
            showFormStatus('error', json.message || 'Sorry, there was an error sending your message. Please try again.');
        }
    })
    .catch(error => {
        console.log(error);
        showFormStatus('error', 'Something went wrong! Please try again or contact us directly.');
    })
    .finally(function() {
        // Reset button state
        formButton.disabled = false;
        buttonText.textContent = originalText;
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            if (formStatus.classList.contains('success')) {
                formStatus.style.display = 'none';
            }
        }, 5000);
    });
});

function showFormStatus(type, message) {
    formStatus.className = `form__status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
}

// Enhanced mobile-friendly animations
function initMobileAnimations() {
    // Check if device supports animations properly
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Show all elements immediately if user prefers reduced motion
        document.querySelectorAll('.service__card, .project__card, .testimonial__card, .highlight').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }

    // Enhanced Intersection Observer for mobile
    const observerOptions = {
        threshold: [0.1, 0.3],
        rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Use both standard and webkit transforms for iOS
                target.style.opacity = '1';
                target.style.transform = 'translateY(0) translateZ(0)';
                target.style.webkitTransform = 'translateY(0) translateZ(0)';
                
                // Add animation class for CSS animations
                target.classList.add('animated');
                
                // Stop observing this element
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Initialize animations after DOM is loaded
    const initAnimations = () => {
        const animatedElements = document.querySelectorAll('.service__card, .project__card, .testimonial__card, .highlight');
        
        // Set initial state for animations
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px) translateZ(0)';
            el.style.webkitTransform = 'translateY(30px) translateZ(0)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.webkitTransition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    };

    // Wait for page load and a small delay for iOS
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initAnimations, 100);
        });
    } else {
        setTimeout(initAnimations, 100);
    }
}

// Initialize mobile animations
initMobileAnimations();

// Form validation
const inputs = document.querySelectorAll('.form__input, .form__textarea');

inputs.forEach(input => {
    input.addEventListener('blur', validateInput);
    input.addEventListener('input', clearValidation);
});

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Remove existing validation classes
    input.classList.remove('error');
    
    if (!value) {
        input.classList.add('error');
        return false;
    }
    
    if (input.type === 'email' && !isValidEmail(value)) {
        input.classList.add('error');
        return false;
    }
    
    return true;
}

function clearValidation(e) {
    e.target.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add error styles to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .form__input.error,
    .form__textarea.error {
        border-color: #dc2626;
        background-color: #fef2f2;
    }
`;
document.head.appendChild(style);

// Preload hero image
const heroImage = new Image();
heroImage.src = 'assets/hero-bg.jpg';

// Performance optimization: Lazy load images
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

// Testimonials slider functionality
let currentSlide = 0;
const testimonialCards = document.querySelectorAll('.testimonial__card');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    // Hide all testimonials
    testimonialCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current testimonial
    if (testimonialCards[index]) {
        testimonialCards[index].classList.add('active');
    }
    
    // Activate current dot
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

function nextTestimonial() {
    currentSlide = (currentSlide + 1) % testimonialCards.length;
    showTestimonial(currentSlide);
}

function prevTestimonial() {
    currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentSlide);
}

// Add click handlers to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showTestimonial(currentSlide);
    });
});

// Auto-scroll testimonials every 5 seconds
setInterval(nextTestimonial, 5000);

// Scroll to top button functionality
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add loading state to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animation for visible elements
    const visibleElements = document.querySelectorAll('.service__card, .highlight');
    visibleElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

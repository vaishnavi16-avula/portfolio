// Modern School JavaScript
class ModernSchool {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupSmoothScrolling();
        this.setupNavbarScroll();
        this.animateStats();
        this.setupIntersectionObserver();
    }

    initializeElements() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.admissionForm = document.getElementById('admission-form');
        this.contactForm = document.getElementById('contact-form');
        this.toastContainer = document.getElementById('toast-container');
        this.galleryFilters = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
    }

    bindEvents() {
        // Navigation
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Buttons
        document.getElementById('apply-now').addEventListener('click', () => this.scrollToSection('admission'));
        document.getElementById('learn-more').addEventListener('click', () => this.scrollToSection('about'));

        // Forms
        this.admissionForm.addEventListener('submit', (e) => this.handleAdmissionForm(e));
        this.contactForm.addEventListener('submit', (e) => this.handleContactForm(e));

        // Gallery filters
        this.galleryFilters.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterGallery(e.target.dataset.filter));
        });

        // Academic card buttons
        document.querySelectorAll('.academic-card .btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAcademicCardClick(e));
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

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        const animateValue = (element, start, end, duration) => {
            const range = end - start;
            const current = start;
            const increment = range / (duration / 16);
            
            const timer = setInterval(() => {
                current += increment;
                element.textContent = Math.floor(current);
                
                if (current >= end) {
                    element.textContent = end;
                    clearInterval(timer);
                }
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateValue(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => {
            observer.observe(stat);
        });
    }

    setupIntersectionObserver() {
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

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.academic-card, .feature, .step, .gallery-item');
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    }

    filterGallery(filter) {
        // Update active filter button
        this.galleryFilters.forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filter gallery items
        this.galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });
    }

    handleAcademicCardClick(e) {
        const card = e.target.closest('.academic-card');
        const program = card.querySelector('h3').textContent;
        this.showToast(`Learn more about ${program} program!`, 'info');
        
        // Scroll to admission section
        setTimeout(() => {
            this.scrollToSection('admission');
        }, 1000);
    }

    handleAdmissionForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const studentName = formData.get('studentName');
        const grade = formData.get('grade');
        const email = formData.get('email');

        // Simulate form submission
        this.showToast(`Thank you ${studentName}! Your application for ${grade} has been submitted successfully.`, 'success');
        e.target.reset();
        
        // Scroll to contact section
        setTimeout(() => {
            this.scrollToSection('contact');
        }, 2000);
    }

    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const subject = formData.get('subject');

        // Simulate form submission
        this.showToast(`Thank you ${name}! Your message about "${subject}" has been sent successfully.`, 'success');
        e.target.reset();
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
        }, 4000);
    }
}

// Initialize school when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernSchool();
});

// Add some fun interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add hover effects to academic cards
    document.querySelectorAll('.academic-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    const style = document.createElement('style');
    style.textContent = `
        body:not(.loaded) {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});






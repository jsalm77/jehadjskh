// About page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

function initializeAboutPage() {
    addScrollAnimations();
    addInteractiveEffects();
    addCounterAnimations();
    setupSmoothScrolling();
}

function addScrollAnimations() {
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

    // Observe all content cards and timeline items
    document.querySelectorAll('.content-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function addInteractiveEffects() {
    // Add hover effects to achievement items
    document.querySelectorAll('.achievement-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to philosophy items
    document.querySelectorAll('.philosophy-item').forEach(item => {
        item.addEventListener('click', function() {
            // Add a pulse effect
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });

    // Add timeline item click effects
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            // Highlight the timeline item
            this.style.background = 'rgba(120, 119, 198, 0.1)';
            this.style.borderRadius = '10px';
            this.style.padding = '1rem';
            this.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                this.style.background = '';
                this.style.padding = '';
            }, 2000);
        });
    });
}

function addCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent);
        const increment = target / 50; // Animation duration control
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };

    // Trigger counter animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

function setupSmoothScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight effect to target section
                targetElement.style.boxShadow = '0 0 20px rgba(120, 119, 198, 0.3)';
                setTimeout(() => {
                    targetElement.style.boxShadow = '';
                }, 2000);
            }
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .timeline-item:hover::before {
        background: #ff7730;
        transform: scale(1.2);
        transition: all 0.3s ease;
    }
    
    .achievement-item:hover .achievement-icon {
        transform: scale(1.1) rotate(5deg);
        transition: all 0.3s ease;
    }
    
    .philosophy-item:hover .philosophy-icon {
        transform: scale(1.1);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
function showPageLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'page-loading';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <div class="wolf-icon">🐺</div>
            <h3>FC Wolves</h3>
            <p>Loading our story...</p>
        </div>
    `;
    
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        text-align: center;
    `;
    
    const loadingContent = loadingDiv.querySelector('.loading-content');
    loadingContent.style.cssText = `
        animation: fadeInUp 1s ease;
    `;
    
    const wolfIcon = loadingDiv.querySelector('.wolf-icon');
    wolfIcon.style.cssText = `
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: pulse 2s ease-in-out infinite;
    `;
    
    document.body.appendChild(loadingDiv);
    
    setTimeout(() => {
        loadingDiv.style.opacity = '0';
        loadingDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingDiv.remove();
        }, 500);
    }, 2000);
}

// Initialize page loading
showPageLoading();


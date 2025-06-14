// Gallery page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});

// Sample photo data - in a real application, this would come from a database
const galleryData = {
    teamPhotos: [
        {
            id: 1,
            title: "Team Photo 2025",
            description: "Official team photo for the 2025 season featuring all players and coaching staff.",
            icon: "👥",
            category: "team"
        },
        {
            id: 2,
            title: "Training Session",
            description: "Intense training session preparing for the upcoming championship match.",
            icon: "🏃‍♂️",
            category: "team"
        },
        {
            id: 3,
            title: "Team Celebration",
            description: "Players celebrating after winning the regional championship.",
            icon: "🎉",
            category: "team"
        },
        {
            id: 4,
            title: "Captain's Leadership",
            description: "Our captain motivating the team before a crucial match.",
            icon: "👨‍💼",
            category: "team"
        },
        {
            id: 5,
            title: "Youth Academy",
            description: "Young talents training with the senior team members.",
            icon: "🌟",
            category: "team"
        },
        {
            id: 6,
            title: "Team Meeting",
            description: "Strategic discussion in the locker room before the big game.",
            icon: "💭",
            category: "team"
        }
    ],
    matchPhotos: [
        {
            id: 7,
            title: "Championship Final",
            description: "Decisive moment from the championship final that secured our victory.",
            icon: "🏆",
            category: "match"
        },
        {
            id: 8,
            title: "Goal Celebration",
            description: "Players celebrating a spectacular goal in the derby match.",
            icon: "⚽",
            category: "match"
        },
        {
            id: 9,
            title: "Penalty Save",
            description: "Our goalkeeper making a crucial penalty save in the semi-final.",
            icon: "🥅",
            category: "match"
        },
        {
            id: 10,
            title: "Fan Support",
            description: "Amazing support from our loyal fans during the home match.",
            icon: "📣",
            category: "match"
        },
        {
            id: 11,
            title: "Victory Lap",
            description: "Team taking a victory lap after winning the cup final.",
            icon: "🏃‍♂️",
            category: "match"
        },
        {
            id: 12,
            title: "Derby Intensity",
            description: "High-intensity moment from our rivalry match against Eagles FC.",
            icon: "⚡",
            category: "match"
        }
    ],
    stadiumPhotos: [
        {
            id: 13,
            title: "Wolves Stadium",
            description: "Aerial view of our magnificent home stadium on match day.",
            icon: "🏟️",
            category: "stadium"
        },
        {
            id: 14,
            title: "Training Facilities",
            description: "State-of-the-art training facilities where champions are made.",
            icon: "🏋️‍♂️",
            category: "stadium"
        },
        {
            id: 15,
            title: "Locker Room",
            description: "Modern locker room facilities for player comfort and preparation.",
            icon: "🚿",
            category: "stadium"
        },
        {
            id: 16,
            title: "VIP Section",
            description: "Premium seating area offering the best views of the action.",
            icon: "👑",
            category: "stadium"
        },
        {
            id: 17,
            title: "Trophy Room",
            description: "Display of all our achievements and memorable moments.",
            icon: "🏆",
            category: "stadium"
        },
        {
            id: 18,
            title: "Stadium Lights",
            description: "Spectacular lighting system illuminating night matches.",
            icon: "💡",
            category: "stadium"
        }
    ]
};

let currentPhotoIndex = 0;
let currentCategory = '';

function initializeGallery() {
    loadPhotoGrids();
    setupModalEvents();
    addScrollAnimations();
    addInteractiveEffects();
    setupSmoothScrolling();
}

function loadPhotoGrids() {
    loadPhotoGrid('teamPhotosGrid', galleryData.teamPhotos);
    loadPhotoGrid('matchPhotosGrid', galleryData.matchPhotos);
    loadPhotoGrid('stadiumPhotosGrid', galleryData.stadiumPhotos);
}

function loadPhotoGrid(gridId, photos) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.onclick = () => openPhotoModal(photo, photos, index);
        
        photoItem.innerHTML = `
            <div class="photo-placeholder">
                <div class="photo-icon">${photo.icon}</div>
                <div class="photo-title">${photo.title}</div>
                <div class="photo-description">${photo.description}</div>
            </div>
        `;
        
        // Add hover sound effect
        photoItem.addEventListener('mouseenter', () => {
            playHoverSound();
        });
        
        grid.appendChild(photoItem);
    });
}

function openPhotoModal(photo, photoArray, index) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    // Set current photo data
    currentPhotoIndex = index;
    currentCategory = photoArray;
    
    // Update modal content
    modalImage.innerHTML = photo.icon;
    modalImage.style.fontSize = '8rem';
    modalImage.style.display = 'flex';
    modalImage.style.alignItems = 'center';
    modalImage.style.justifyContent = 'center';
    
    modalTitle.textContent = photo.title;
    modalDescription.textContent = photo.description;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Play modal open sound
    playModalSound();
    
    // Update navigation buttons
    updateNavigationButtons();
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Play modal close sound
    playModalSound();
}

function previousPhoto() {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updateModalContent();
        playNavigationSound();
    }
}

function nextPhoto() {
    if (currentPhotoIndex < currentCategory.length - 1) {
        currentPhotoIndex++;
        updateModalContent();
        playNavigationSound();
    }
}

function updateModalContent() {
    const photo = currentCategory[currentPhotoIndex];
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    modalImage.innerHTML = photo.icon;
    modalTitle.textContent = photo.title;
    modalDescription.textContent = photo.description;
    
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.modal-actions .nav-btn:first-child');
    const nextBtn = document.querySelector('.modal-actions .nav-btn:last-child');
    
    prevBtn.disabled = currentPhotoIndex === 0;
    nextBtn.disabled = currentPhotoIndex === currentCategory.length - 1;
}

function setupModalEvents() {
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('photoModal');
        if (event.target === modal) {
            closePhotoModal();
        }
    };
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        const modal = document.getElementById('photoModal');
        if (modal.style.display === 'block') {
            switch(event.key) {
                case 'Escape':
                    closePhotoModal();
                    break;
                case 'ArrowLeft':
                    previousPhoto();
                    break;
                case 'ArrowRight':
                    nextPhoto();
                    break;
            }
        }
    });
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

    // Observe all gallery sections
    document.querySelectorAll('.gallery-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function addInteractiveEffects() {
    // Add stagger animation to photo items
    document.querySelectorAll('.photo-grid').forEach(grid => {
        const items = grid.querySelectorAll('.photo-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in-up');
        });
    });
    
    // Add trophy floating animation
    document.querySelectorAll('.trophy-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.5}s`;
    });
}

function setupSmoothScrolling() {
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
            }
        });
    });
}

// Sound effects functions
function playHoverSound() {
    // Create a simple hover sound using Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

function playModalSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

function playNavigationSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .photo-item:hover .photo-icon {
        transform: scale(1.2) rotate(5deg);
        transition: all 0.3s ease;
    }
    
    .trophy-item:hover .trophy-icon {
        animation-play-state: paused;
        transform: scale(1.2);
    }
`;
document.head.appendChild(style);

// Initialize gallery with loading animation
function showGalleryLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'gallery-loading';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <div class="wolf-icon">🐺</div>
            <h3>FC Wolves Gallery</h3>
            <p>Loading memories...</p>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
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
    
    const loadingBar = loadingDiv.querySelector('.loading-bar');
    loadingBar.style.cssText = `
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin-top: 1rem;
        overflow: hidden;
    `;
    
    const loadingProgress = loadingDiv.querySelector('.loading-progress');
    loadingProgress.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #7877c6, #ff7730);
        border-radius: 2px;
        animation: loadingProgress 2s ease-in-out;
    `;
    
    const progressAnimation = document.createElement('style');
    progressAnimation.textContent = `
        @keyframes loadingProgress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    document.head.appendChild(progressAnimation);
    
    document.body.appendChild(loadingDiv);
    
    setTimeout(() => {
        loadingDiv.style.opacity = '0';
        loadingDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingDiv.remove();
        }, 500);
    }, 2500);
}

// Initialize gallery loading
showGalleryLoading();


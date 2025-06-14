// Fan page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFanPage();
});

// Use the global data manager
const dataManager = window.fcWolvesDataManager;

function initializeFanPage() {
    loadTeamData();
    loadPlayers();
    loadLineup();
    loadMatchInfo();
    startCountdown();
    updateTeamStatus();
    
    // Listen for data changes
    window.addEventListener('fcWolvesDataChanged', function(e) {
        console.log('Data changed, refreshing fan page...', e.detail);
        refreshPageData();
    });
}

function refreshPageData() {
    loadTeamData();
    loadPlayers();
    loadLineup();
    loadMatchInfo();
    updateTeamStatus();
}

function loadTeamData() {
    // Data is now managed by the data manager
    window.teamData = dataManager.getData();
}

function loadPlayers() {
    const playersGrid = document.getElementById('playersGrid');
    playersGrid.innerHTML = '';
    
    window.teamData.players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
            <div class="player-number">#${player.number}</div>
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.position}</div>
        `;
        
        // Add click animation
        playerCard.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        playersGrid.appendChild(playerCard);
    });
}

function loadLineup() {
    const lineupGrid = document.getElementById('lineupGrid');
    lineupGrid.innerHTML = '';
    
    // Filter out null values from lineup
    const activeLineup = window.teamData.lineup.filter(player => player !== null);
    
    activeLineup.forEach(player => {
        const lineupPlayer = document.createElement('div');
        lineupPlayer.className = 'lineup-player';
        lineupPlayer.innerHTML = `
            <div class="player-number">#${player.number}</div>
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.position}</div>
        `;
        
        lineupGrid.appendChild(lineupPlayer);
    });
    
    // Update formation display
    const formationTitle = document.querySelector('.formation-title');
    if (formationTitle) {
        formationTitle.textContent = `Formation: ${window.teamData.formation || '4-3-3'}`;
    }
}

function loadMatchInfo() {
    const matchDate = document.getElementById('matchDate');
    const matchTime = document.getElementById('matchTime');
    
    const date = new Date(window.teamData.nextMatch.date);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    matchDate.textContent = date.toLocaleDateString('en-US', options);
    matchTime.textContent = window.teamData.nextMatch.time;
    
    // Update opponent name
    const opponentElements = document.querySelectorAll('.team-name');
    if (opponentElements.length > 1) {
        opponentElements[1].textContent = window.teamData.nextMatch.opponent;
    }
    
    // Update venue
    const venueElement = document.querySelector('.match-venue');
    if (venueElement) {
        venueElement.textContent = window.teamData.nextMatch.venue;
    }
}

function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const matchDateTime = new Date(`${window.teamData.nextMatch.date}T${window.teamData.nextMatch.time}`).getTime();
        const distance = matchDateTime - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            
            if (daysElement) daysElement.textContent = days;
            if (hoursElement) hoursElement.textContent = hours;
            if (minutesElement) minutesElement.textContent = minutes;
        } else {
            const countdownElement = document.getElementById('countdown');
            if (countdownElement) {
                countdownElement.innerHTML = '<div class="match-live">MATCH LIVE!</div>';
            }
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

function updateTeamStatus() {
    const statusIndicator = document.getElementById('teamStatus');
    if (!statusIndicator) return;
    
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    
    if (statusText) {
        statusText.textContent = window.teamData.status.message;
    }
    
    if (statusDot) {
        // Update status dot color based on status type
        switch(window.teamData.status.type) {
            case 'training':
                statusDot.style.background = '#2ed573'; // Green
                break;
            case 'match':
                statusDot.style.background = '#ff6b6b'; // Red
                break;
            case 'rest':
                statusDot.style.background = '#ffa726'; // Orange
                break;
            case 'travel':
                statusDot.style.background = '#7877c6'; // Purple
                break;
            default:
                statusDot.style.background = '#7877c6'; // Purple
        }
    }
}

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
        }
    });
});

// Add loading animation
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div class="loading-spinner">
            <div class="wolf-icon">🐺</div>
            <p>Loading...</p>
        </div>
    `;
    
    // Add loading styles
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    `;
    
    const spinner = loadingDiv.querySelector('.loading-spinner');
    spinner.style.cssText = `
        text-align: center;
        color: white;
        font-size: 1.2rem;
    `;
    
    const wolfIcon = loadingDiv.querySelector('.wolf-icon');
    wolfIcon.style.cssText = `
        font-size: 3rem;
        margin-bottom: 1rem;
        animation: pulse 1.5s ease-in-out infinite;
    `;
    
    document.body.appendChild(loadingDiv);
    
    setTimeout(() => {
        loadingDiv.remove();
    }, 1500);
}

// Add some interactive effects
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Initialize page with loading animation
showLoading();


// Enhanced sound effects for better user experience
function playSuccessSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Success sound: ascending notes
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

function playErrorSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Error sound: descending notes
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

function playClickSound() {
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

// Add sound effects to buttons and interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add click sounds to all buttons
    document.querySelectorAll('button, .btn, .nav-link').forEach(element => {
        element.addEventListener('click', playClickSound);
    });
    
    // Add success sound to form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (this.checkValidity()) {
                playSuccessSound();
            } else {
                playErrorSound();
            }
        });
    });
});

// Enhanced countdown with sound alerts
function enhancedCountdown() {
    const now = new Date().getTime();
    const matchDateTime = new Date(`${window.teamData.nextMatch.date}T${window.teamData.nextMatch.time}`).getTime();
    const distance = matchDateTime - now;
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = days;
        if (hoursElement) hoursElement.textContent = hours;
        if (minutesElement) minutesElement.textContent = minutes;
        if (secondsElement) secondsElement.textContent = seconds;
        
        // Play alert sounds at specific intervals
        if (days === 1 && hours === 0 && minutes === 0 && seconds === 0) {
            playMatchAlertSound(); // 1 day before
        } else if (days === 0 && hours === 1 && minutes === 0 && seconds === 0) {
            playMatchAlertSound(); // 1 hour before
        } else if (days === 0 && hours === 0 && minutes === 10 && seconds === 0) {
            playMatchAlertSound(); // 10 minutes before
        }
        
    } else {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.innerHTML = '<div class="match-live">🔴 MATCH LIVE!</div>';
            playMatchLiveSound();
        }
    }
}

function playMatchAlertSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        
        // Create a more complex alert sound
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, i * 300);
        }
    }
}

function playMatchLiveSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        
        // Victory fanfare
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((note, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }, index * 200);
        });
    }
}



function checkAccessCode() {
    const accessCode = document.getElementById('accessCode').value;
    const errorMessage = document.getElementById('errorMessage');

    // Clear previous error
    errorMessage.classList.remove('show');
    
    if (accessCode === 'nmoi557') {
        // Add success animation before redirect
        document.querySelector('.login-btn').style.background = 'linear-gradient(135deg, #2ed573 0%, #1e90ff 100%)';
        document.querySelector('.login-btn span').textContent = 'WELCOME FANS!';
        
        setTimeout(() => {
            window.location.href = 'fan.html';
        }, 1000);
        
    } else if (accessCode === '0011JMFC') {
        // Add success animation before redirect
        document.querySelector('.login-btn').style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)';
        document.querySelector('.login-btn span').textContent = 'ADMIN ACCESS';
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        
    } else {
        errorMessage.textContent = 'Invalid access code. Please try again.';
        errorMessage.classList.add('show');
        
        // Shake animation for error
        document.querySelector('.login-container').style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.querySelector('.login-container').style.animation = '';
        }, 500);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Allow Enter key to submit
document.getElementById('accessCode').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAccessCode();
    }
});

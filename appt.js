// PIN Authentication and Dashboard App
const CORRECT_PIN = '534271'; // Embedded PIN as requested
let currentPin = '';

// DOM Elements
const pinScreen = document.getElementById('pinScreen');
const dashboard = document.getElementById('dashboard');
const errorMessage = document.getElementById('errorMessage');
const pinDots = document.querySelectorAll('.pin-dot');
const keyButtons = document.querySelectorAll('.key-btn');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in (session storage)
    if (sessionStorage.getItem('authenticated') === 'true') {
        showDashboard();
    }
    
    // Setup keypad event listeners
    keyButtons.forEach(button => {
        button.addEventListener('click', handleKeyPress);
    });
    
    // Logout button
    logoutBtn.addEventListener('click', logout);
    
    // Navigation items
    navItems.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
});

// Handle keypad button press
function handleKeyPress(event) {
    const key = event.currentTarget.getAttribute('data-key');
    
    if (key === 'delete') {
        deleteLastDigit();
    } else if (key === 'clear') {
        clearPin();
    } else if (currentPin.length < 6) {
        addDigit(key);
    }
}

// Handle keyboard input
function handleKeyboard(event) {
    // Only handle keyboard when PIN screen is visible
    if (!pinScreen.classList.contains('hidden')) {
        if (event.key >= '0' && event.key <= '9' && currentPin.length < 6) {
            addDigit(event.key);
        } else if (event.key === 'Backspace') {
            event.preventDefault();
            deleteLastDigit();
        } else if (event.key === 'Escape') {
            clearPin();
        } else if (event.key === 'Enter' && currentPin.length === 6) {
            verifyPin();
        }
    }
}

// Add digit to PIN
function addDigit(digit) {
    if (currentPin.length < 6) {
        currentPin += digit;
        updatePinDisplay();
        
        // Auto-verify when 6 digits entered
        if (currentPin.length === 6) {
            setTimeout(verifyPin, 300);
        }
    }
}

// Delete last digit
function deleteLastDigit() {
    if (currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        updatePinDisplay();
        clearError();
    }
}

// Clear entire PIN
function clearPin() {
    currentPin = '';
    updatePinDisplay();
    clearError();
}

// Update PIN display dots
function updatePinDisplay() {
    pinDots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// Verify PIN
function verifyPin() {
    if (currentPin === CORRECT_PIN) {
        // Correct PIN
        clearError();
        sessionStorage.setItem('authenticated', 'true');
        
        // Add success animation
        pinDots.forEach(dot => {
            dot.style.background = '#38a169';
            dot.style.borderColor = '#38a169';
        });
        
        // Show dashboard after short delay
        setTimeout(() => {
            showDashboard();
        }, 500);
    } else {
        // Incorrect PIN
        showError('Incorrect PIN. Please try again.');
        shakeAnimation();
        clearPin();
    }
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Clear error message
function clearError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

// Shake animation for incorrect PIN
function shakeAnimation() {
    const pinDisplay = document.querySelector('.pin-display');
    pinDisplay.style.animation = 'shake 0.5s';
    
    setTimeout(() => {
        pinDisplay.style.animation = '';
    }, 500);
}

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Show dashboard
function showDashboard() {
    pinScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    
    // Reset PIN for next login
    currentPin = '';
    updatePinDisplay();
    clearError();
    
    // Animate balance number
    animateBalance();
}

// Hide dashboard and show PIN screen
function logout() {
    sessionStorage.removeItem('authenticated');
    dashboard.classList.add('hidden');
    pinScreen.classList.remove('hidden');
    currentPin = '';
    updatePinDisplay();
}

// Handle navigation click
function handleNavClick(event) {
    event.preventDefault();
    
    // Remove active class from all items
    navItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    event.currentTarget.classList.add('active');
    
    // Here you would typically load different content
    // For now, just show which section was clicked
    const sectionName = event.currentTarget.querySelector('span').textContent;
    console.log(`Navigated to: ${sectionName}`);
}

// Animate balance number on load  
function animateBalance() {  
    const balanceElement = document.querySelector('.balance-amount');  
    const targetBalance = 4000000;  
    const duration = 1500;  
    const steps = 60;  
    const increment = targetBalance / steps;  
    let current = 0;  
    let step = 0;  
      
    const timer = setInterval(() => {  
        step++;  
        current += increment;  
          
        if (step >= steps) {  
            current = targetBalance;  
            clearInterval(timer);  
        }  

        // Add NT$ manually
        balanceElement.textContent = `NT$ ${formatter.format(Math.round(current))}`;

    }, duration / steps);  

}

// Add hover effects to action cards
const actionCards = document.querySelectorAll('.action-card');
actionCards.forEach(card => {
    card.addEventListener('click', function() {
        const actionName = this.querySelector('p').textContent;
        console.log(`Action clicked: ${actionName}`);
        
        // Add a subtle feedback animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Add click effect to transaction items
const transactionItems = document.querySelectorAll('.transaction-item');
transactionItems.forEach(item => {
    item.addEventListener('click', function() {
        const transactionName = this.querySelector('.transaction-name').textContent;
        console.log(`Transaction clicked: ${transactionName}`);
        
        // Could show transaction details modal here
    });
});

// Prevent context menu on mobile for better app feel
document.addEventListener('contextmenu', event => {
    if (window.innerWidth <= 480) {
        event.preventDefault();
    }
});

// Add pull-to-refresh hint (visual only, not functional)
let touchStartY = 0;
const mainContent = document.querySelector('.main-content');

if (mainContent) {
    mainContent.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    mainContent.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const scrollTop = mainContent.scrollTop;
        
        if (scrollTop === 0 && touchY > touchStartY) {
            // User is pulling down at the top - could implement refresh
            console.log('Pull to refresh detected');
        }
    });
}

// Log app initialization
console.log('SecureBank Banking App Initialized');
console.log('Version: 1.0.0');
console.log('Features: PIN Authentication, Account Overview, Transaction History');

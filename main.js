// Track typed characters
let typedSequence = '';
const targetWord = 'eric';
let resetTimer = null;
const resetDelay = 1000; // 1 second delay before reset

// Function to reset the sequence
function resetSequence() {
    typedSequence = '';
    if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
    }
}

// Function to show full-screen video
function showFullScreenVideo() {
    // Create video background element
    const videoBackground = document.createElement('video');
    videoBackground.id = 'video-background';
    videoBackground.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        z-index: -1;
    `;
    videoBackground.autoplay = true;
    videoBackground.loop = true;
    videoBackground.muted = true; // Needed for autoplay in most browsers
    
    // Add video source
    videoBackground.src = 'assets/eric2.mp4';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
    `;
    
    // Close video when button is clicked
    closeButton.addEventListener('click', function() {
        document.body.removeChild(videoBackground);
        document.body.removeChild(closeButton);
    });
    
    // Close video when escape key is pressed
    function handleEscape(event) {
        if (event.key === 'Escape') {
            document.body.removeChild(videoBackground);
            document.body.removeChild(closeButton);
            document.removeEventListener('keydown', handleEscape);
        }
    }
    document.addEventListener('keydown', handleEscape);
    
    // Add to page
    document.body.appendChild(videoBackground);
    document.body.appendChild(closeButton);
    
    // Try to play the video
    videoBackground.play().catch(function(error) {
        console.log('Video autoplay failed:', error);
    });
}

// Listen for keypress events
document.addEventListener('keydown', function(event) {
    // Get the pressed key (convert to lowercase for case-insensitive matching)
    const key = event.key.toLowerCase();
    
    // Only track letter keys
    if (key.length === 1 && key.match(/[a-z]/)) {
        // Clear any existing timer
        if (resetTimer) {
            clearTimeout(resetTimer);
        }
        
        // Add the key to our sequence
        typedSequence += key;
        
        // Keep only the last characters equal to target word length
        if (typedSequence.length > targetWord.length) {
            typedSequence = typedSequence.slice(-targetWord.length);
        }
        
        // Check if the sequence matches our target word
        if (typedSequence === targetWord) {
            // Show full-screen video
            showFullScreenVideo();
            
            // Reset the sequence
            resetSequence();
            return;
        }
        
        // Set a timer to reset the sequence after delay
        resetTimer = setTimeout(resetSequence, resetDelay);
    }
});

// Reset sequence on non-letter keys (like space, enter, etc.)
document.addEventListener('keydown', function(event) {
    if (event.key === ' ' || event.key === 'Enter' || event.key === 'Escape') {
        resetSequence();
    }
});

const videoContainer = document.getElementById('video-container');
const introVideo = document.getElementById('intro-video');
let userInteracted = false;

// Function to handle actions after user interaction
function handleUserInteraction() {
    if (!userInteracted) {
        // User interaction detected
        userInteracted = true;

        // Play background music
        const backgroundMusic = document.getElementById('backgroundMusic');
        if (backgroundMusic) {
            backgroundMusic.play().catch(error => {
                console.error('Error playing background music:', error);
            });
        }

        // Fade out the video container
        videoContainer.style.animation = 'fadeOut 2s forwards';
        
        // Allow scrolling after the video ends
        document.body.style.overflow = 'auto';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Remove video container from DOM after fade out
        videoContainer.addEventListener('animationend', () => {
            videoContainer.remove();
        });
        
        // Remove click event listener after first interaction
        document.removeEventListener('click', handleUserInteraction);
    }
}

introVideo.addEventListener('ended', () => {
    // Add click event listener to the document for user interaction
    document.addEventListener('click', handleUserInteraction);
});

// Add click event listener to video for skipping
introVideo.addEventListener('click', () => {
	if (!introVideo.paused) {
		introVideo.pause(); // Pause the video if it's playing
		videoContainer.style.animation = 'fadeOut 2s forwards'; // Fade out animation
		
		// Allow scrolling after the video is skipped
		document.body.style.overflow = 'auto';
		
		// Scroll to top
		window.scrollTo(0, 0);
		
		// Play background music
		const backgroundMusic = document.getElementById('backgroundMusic');
		backgroundMusic.play();
		
		// Remove video container from DOM after fade out
		videoContainer.addEventListener('animationend', () => {
			videoContainer.remove();
		});
	}
});

// Smooth scroll functionality
document.addEventListener('DOMContentLoaded', function() {
	const navLinks = document.querySelectorAll('nav ul li a');
	
	navLinks.forEach(link => {
		link.addEventListener('click', function(event) {
			event.preventDefault();
			document.querySelector(this.getAttribute('href')).scrollIntoView({
				behavior: 'smooth'
			});
		});
	});
});



// Animation on scroll
window.addEventListener('scroll', () => {
	const sections = document.querySelectorAll('section');
	const scrollPos = window.scrollY + window.innerHeight;
	
	sections.forEach(section => {
		if (scrollPos > section.offsetTop) {
			section.style.transform = 'translateY(0)';
			section.style.opacity = '1';
		} else {
			section.style.transform = 'translateY(50px)';
			section.style.opacity = '0';
		}
	});
});

let animationFrameId; // Global variable to store the animation frame ID
let isGameRunning = false; // Flag to control game state

function startGame() {
    if (isGameRunning) return; // Prevent starting a new game if one is already running

    const startButton = document.querySelector('button[onclick="startGame()"]');
    const canvasContainer = document.querySelector('.canvas-container');
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    const messageBox = document.querySelector('.message-box');
    let playerScore = 0;
    let aiScore = 0;
    const winningScore = 5; // Win condition

    // Show the canvas container
    canvasContainer.style.display = 'block';
    startButton.style.display = 'none';
    messageBox.style.display = 'none';

    let ballX = gameCanvas.width / 2;
    let ballY = gameCanvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    const ballRadius = 10;

    let paddle1Y = gameCanvas.height / 2 - 50;
    let paddle2Y = gameCanvas.height / 2 - 50;
    const paddleHeight = 100;
    const paddleWidth = 10;
    const paddleSpeed = 5;

    let keys = {};

    // Paddle controls
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Mobile controls
    gameCanvas.addEventListener('touchstart', handleTouchStart);
    gameCanvas.addEventListener('touchmove', handleTouchMove);

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const touchY = touch.clientY - gameCanvas.getBoundingClientRect().top;
        if (touchY < paddle1Y) {
            paddle1Y -= paddleSpeed;
        } else if (touchY > paddle1Y + paddleHeight) {
            paddle1Y += paddleSpeed;
        }
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const touchY = touch.clientY - gameCanvas.getBoundingClientRect().top;
        if (touchY < paddle1Y) {
            paddle1Y -= paddleSpeed;
        } else if (touchY > paddle1Y + paddleHeight) {
            paddle1Y += paddleSpeed;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw court lines
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(gameCanvas.width / 2 - 2, 0, 4, gameCanvas.height);
        ctx.fillRect(0, gameCanvas.height / 2 - 2, gameCanvas.width, 4);

        // Draw ball
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collision with walls
        if (ballX + ballRadius > gameCanvas.width) {
            playerScore++; // Player gets point
            playCheerSound();
            checkWin();
            resetBall();
        }
        if (ballX - ballRadius < 0) {
            aiScore++; // AI gets point
            playCheerSound();
            checkWin();
            resetBall();
        }
        if (ballY + ballRadius > gameCanvas.height || ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Draw paddles
        ctx.fillStyle = 'red';
        ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
        ctx.fillRect(gameCanvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

        // Move player's paddle
        if (keys['w'] && paddle1Y > 0) {
            paddle1Y -= paddleSpeed;
        }
        if (keys['s'] && paddle1Y < gameCanvas.height - paddleHeight) {
            paddle1Y += paddleSpeed;
        }

        // Move AI paddle
        if (paddle2Y + paddleHeight / 2 < ballY) {
            paddle2Y += paddleSpeed;
        } else if (paddle2Y + paddleHeight / 2 > ballY) {
            paddle2Y -= paddleSpeed;
        }

        // Ball collision with paddles
        if (ballX - ballRadius < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            playHitSound();
        }
        if (ballX + ballRadius > gameCanvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            playHitSound();
        }

        // Draw scores
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Player: ' + playerScore, 50, 50);
        ctx.fillText('AI: ' + aiScore, gameCanvas.width - 100, 50);

        if (isGameRunning) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }

    function resetBall() {
        ballX = gameCanvas.width / 2;
        ballY = gameCanvas.height / 2;
        ballSpeedX = 5;
        ballSpeedY = 5;
    }

    function playHitSound() {
        const hitSound = document.getElementById('hit-sound');
        hitSound.currentTime = 0;
        hitSound.play();
    }

    function playCheerSound() {
        const cheerSound = document.getElementById('cheer-sound');
        cheerSound.currentTime = 0;
        cheerSound.play();
    }

    function checkWin() {
        if (playerScore >= winningScore || aiScore >= winningScore) {
            const winner = playerScore >= winningScore ? 'Player' : 'AI';
            displayMessage(`${winner} Wins!`, true);
            isGameRunning = false; // Stop the game
            cancelAnimationFrame(animationFrameId); // Stop the game loop
        }
    }

    function displayMessage(message, showPlayAgain) {
        messageBox.innerHTML = `<p>${message}</p>`;
        if (showPlayAgain) {
            messageBox.innerHTML += '<button onclick="restartGame()">Play Again</button>';
        }
        messageBox.style.display = 'block';
    }

    window.restartGame = function() {
        playerScore = 0;
        aiScore = 0;
        resetBall();
        messageBox.style.display = 'none';
        startButton.style.display = 'none'; // Hide start button when restarting
        isGameRunning = true; // Start the game
        animationFrameId = requestAnimationFrame(draw); // Restart the game loop
    };

    // Start the game
    isGameRunning = true;
    draw();
}

// Slideshow 1 for Equipment
let slideIndex1 = 1;
showSlides1(slideIndex1);

function plusSlides1(n) {
  showSlides1(slideIndex1 += n);
}

function currentSlide1(n) {
  showSlides1(slideIndex1 = n);
}

function showSlides1(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides1");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex1 = 1}
  if (n < 1) {slideIndex1 = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex1-1].style.display = "block";
  dots[slideIndex1-1].className += " active";
}

// Slideshow 2 for Footwork
let slideIndex2 = 1;
showSlides2(slideIndex2);

function plusSlides2(n) {
  showSlides2(slideIndex2 += n);
}

function currentSlide2(n) {
  showSlides2(slideIndex2 = n);
}

function showSlides2(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides2");
  if (n > slides.length) {slideIndex2 = 1}
  if (n < 1) {slideIndex2 = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex2-1].style.display = "block";
}

//Onclickshow - info
function toggleContent(id) {
    var element = document.getElementById(id);
    element.style.display = (element.style.display === 'block') ? 'none' : 'block';
}

document.getElementById('qrCodeButton').addEventListener('click', function() {
    document.getElementById('qrCodeModal').style.display = 'flex';
});

document.querySelector('.qr-modal .close').addEventListener('click', function() {
    document.getElementById('qrCodeModal').style.display = 'none';
});

// Close the modal if the user clicks anywhere outside of the modal content
window.onclick = function(event) {
    if (event.target === document.getElementById('qrCodeModal')) {
        document.getElementById('qrCodeModal').style.display = 'none';
    }
};

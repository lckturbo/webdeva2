const videoContainer = document.getElementById('video-container');
const introVideo = document.getElementById('intro-video');

introVideo.addEventListener('ended', () => {
	videoContainer.style.animation = 'fadeOut 2s forwards';
	
	// Allow scrolling after the video ends
	document.body.style.overflow = 'auto';
	
	// Scroll to top
	window.scrollTo(0, 0);
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
		
		// Remove video container from DOM after fade out
		videoContainer.addEventListener('animationend', () => {
			videoContainer.remove();
		});
	}
});

// Remove video container from DOM after fade out
videoContainer.addEventListener('animationend', () => {
	videoContainer.remove();
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

// Interactive Game
function startGame() {
    const startButton = document.querySelector('button[onclick="startGame()"]');
    const canvasContainer = document.querySelector('.canvas-container');
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    let playerScore = 0;
    let aiScore = 0;

    // Show the canvas container
    canvasContainer.style.display = 'block';
    startButton.style.display = 'none';

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

    function draw() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw court lines
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(gameCanvas.width / 2 - 2, 0, 4, gameCanvas.height);
        ctx.fillRect(0, gameCanvas.height / 2 - 2, gameCanvas.width, 4); // Corrected horizontal line

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
            resetBall();
        }
        if (ballX - ballRadius < 0) {
            aiScore++; // AI gets point
            playCheerSound();
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

        requestAnimationFrame(draw);
    }

    function resetBall() {
        ballX = gameCanvas.width / 2;
        ballY = gameCanvas.height / 2;
        ballSpeedX = -ballSpeedX;
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
  let dots = document.getElementsByClassName("dot1");
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
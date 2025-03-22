// Mobile menu toggle functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
    menuToggle.textContent = isExpanded ? '✕' : '☰';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
    }
});

// Close mobile menu on window resize if above breakpoint
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
    }
});

// Cards background auto

// Particle background animation
const particleContainer = document.querySelector('.background-animation');
function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 20 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    particleContainer.appendChild(particle);
    
    setTimeout(() => particle.remove(), 15000);
}

setInterval(createParticle, 300);
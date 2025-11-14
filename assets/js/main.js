// ===== EmailJS Configuration =====
// Note: Replace YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, and YOUR_PUBLIC_KEY 
// with your actual EmailJS credentials in the contact form handler below

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const projectsGrid = document.getElementById('projectsGrid');

// ===== Sticky Navbar =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Dark/Light Mode Toggle =====
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// ===== Enhanced Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Add staggered animation delay
            entry.target.style.animationDelay = `${index * 0.1}s`;
        }
    });
}, observerOptions);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .about-text p');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// ===== Load Projects from JSON =====
async function loadProjects() {
    try {
        const response = await fetch('assets/data/projects.json');
        const projects = await response.json();
        
        projectsGrid.innerHTML = '';
        
        projects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
            
            // Add fade-in animation
            setTimeout(() => {
                projectCard.classList.add('fade-in');
                observer.observe(projectCard);
            }, index * 100);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Failed to load projects. Please try again later.</p>';
    }
}

function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.15}s`;
    
    // Different icons for different projects
    const icons = ['fa-code', 'fa-server', 'fa-chart-line', 'fa-blog', 'fa-mobile-alt', 'fa-database'];
    const icon = icons[index % icons.length];
    
    const technologies = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="project-image">
            <i class="fas ${icon}"></i>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-technologies">
                ${technologies}
            </div>
            <div class="project-links">
                ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fab fa-github"></i> GitHub</a>` : ''}
                ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
            </div>
        </div>
    `;
    
    // Add mouse move effect for 3D tilt (but not on links)
    card.addEventListener('mousemove', (e) => {
        // Don't apply tilt if hovering over links
        if (e.target.closest('.project-link')) {
            return;
        }
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
    
    // Ensure links are clickable
    const links = card.querySelectorAll('.project-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    return card;
}

// ===== Contact Form with EmailJS =====
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formMessage = document.getElementById('formMessage');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    formMessage.style.display = 'none';
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    try {
        // EmailJS service configuration
        // Replace these with your EmailJS service ID, template ID, and public key
        // Get these from https://www.emailjs.com/
        const serviceID = 'YOUR_SERVICE_ID';
        const templateID = 'YOUR_TEMPLATE_ID';
        const publicKey = 'YOUR_PUBLIC_KEY';
        
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS is not loaded. Please check your EmailJS script tag in index.html.');
        }
        
        // Initialize EmailJS with your public key
        emailjs.init(publicKey);
        
        // Send email
        await emailjs.send(serviceID, templateID, {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message
        });
        
        // Show success message
        formMessage.className = 'form-message success';
        formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        formMessage.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        
        // Show error message
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Failed to send message. Please try again or contact me directly via email.';
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// ===== Resume Download Handler =====
const resumeDownload = document.getElementById('resumeDownload');
if (resumeDownload) {
    resumeDownload.addEventListener('click', (e) => {
        // Check if file exists (this is a simple check, actual file validation would need server-side)
        fetch('assets/resume.pdf', { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    e.preventDefault();
                    alert('Resume file not found. Please add your resume.pdf file to the assets folder.');
                }
            })
            .catch(() => {
                // If fetch fails, allow the download attempt anyway
                console.log('Could not verify resume file existence');
            });
    });
}

// ===== Animate Skill Items on Scroll =====
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 0.5s ease forwards`;
                    entry.target.style.opacity = '1';
                }, index * 50);
            }
        });
    }, { threshold: 0.1 });
    
    skillItems.forEach(item => {
        item.style.opacity = '0';
        skillObserver.observe(item);
    });
}

// ===== Add Floating Animation to Elements =====
function addFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.skill-category, .project-card');
    floatingElements.forEach((el, index) => {
        const delay = index * 0.2;
        el.style.animation = `fadeInUp 0.8s ease ${delay}s forwards, float 6s ease-in-out ${delay + 0.8}s infinite`;
    });
}

// ===== Cursor Trail Effect (Optional - can be disabled for performance) =====
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        if (cursorTrail.length > maxTrailLength) {
            cursorTrail.shift();
        }
    }
});

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    activateNavLink();
    animateSkills();
    addFloatingAnimation();
    
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// ===== Add scroll reveal animation to sections =====
window.addEventListener('scroll', () => {
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        if (scrollY + windowHeight > sectionTop + 100) {
            section.style.opacity = '1';
        }
    });
});

// ===== Console Message =====
console.log('%c👋 Welcome to my Portfolio!', 'color: #00C9A7; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #B0B0B0; font-size: 12px;');


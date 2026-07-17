/* ==========================================================================
   PORTFOLIO INTERACTIVE SCRIPTS
   Student: Manish Prajapati
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular scripts
  initHeaderScroll();
  initMobileMenu();
  initScrollProgress();
  initTypingEffect();
  initParticlesBg();
  initScrollReveal();
  initBackToTop();
  initActiveNavLinkOnScroll();
  initContactFormFeedback();
});

/* ==========================================================================
   HEADER SCROLL EFFECTS
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   MOBILE BURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    // Lock body scroll when mobile menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressWidth = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progress.style.width = `${progressWidth}%`;
  });
}

/* ==========================================================================
   ROLE TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const roles = [
    "Computer Science Engineering Student",
    "AI & Python Developer",
    "Software Developer"
  ];
  
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      // Erase character
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Erase faster
    } else {
      // Type character
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Checking phase transitions
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Move to next role
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Kick off typing loop
  setTimeout(type, 1000);
}

/* ==========================================================================
   INTERACTIVE CANVAS PARTICLES BACKGROUND (AI Nodes feel)
   ========================================================================== */
function initParticlesBg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 80;
  const maxDistance = 140;

  const mouse = {
    x: width / 2,
    y: height / 2,
    active: false
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;

      this.radius = Math.random() * 1.8 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      ctx.shadowBlur = 12;
      ctx.shadowColor = "#00aaff";
      ctx.fillStyle = "#1ea7ff";
      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {

        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {

          const alpha = (1 - dist / maxDistance) * 0.18;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);

          ctx.strokeStyle = `rgba(0,150,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseGlow() {
    if (!mouse.active) return;

    const gradient = ctx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      220
    );

    gradient.addColorStop(0, "rgba(0,170,255,0.18)");
    gradient.addColorStop(0.4, "rgba(0,120,255,0.08)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawMouseGlow();

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    drawConnections();

    requestAnimationFrame(animate);
  }

  animate();
}
/* ==========================================================================
   SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to trigger only once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   ACTIVE NAVIGATION LINK CORRESPONDING TO SCROLL POSITION
   ========================================================================== */
function initActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   CONTACT FORM SUBMIT FEEDBACK (Mock interaction)
   ========================================================================== */
function initContactFormFeedback() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate API request send
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" style="width: 18px; height: 18px; margin-right: 8px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Sending Message...
    `;

    // Spin animation CSS dynamic injection
    if (!document.getElementById('spin-keyframe')) {
      const style = document.createElement('style');
      style.id = 'spin-keyframe';
      style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      // Switch button to Success State
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.5;" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Message Sent Successfully!
      `;
      submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)'; // Emerald Green
      submitBtn.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';

      // Clear Form Fields
      contactForm.reset();
      
      // Revert after 4 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.boxShadow = '';
      }, 4000);

    }, 1500);
  });
}

/* ==========================================================================
   PARTICLE BACKGROUND — EXPAND TO COVER THE WHOLE PAGE
   Paste this block at the very END of script.js (after everything else).
   It is self-contained (own IIFE + try/catch) so it cannot break any
   other script on the page, even if something here fails.
   ========================================================================== */
(function () {
  function expandParticleBackground() {
    try {
      const canvas = document.getElementById('bg-canvas');
      if (!canvas) return;
 
      // 1. Move canvas out of #hero (which clips it via overflow:hidden)
      document.body.insertBefore(canvas, document.body.firstChild);
 
      // 2. Make it a fixed, full-viewport layer sitting behind everything
      Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '-1',
        pointerEvents: 'none',
        opacity: '1',
        filter: 'drop-shadow(0 0 8px rgba(8, 8, 174, 0.9))'
      });
 
      // 3. Let particles show through sections/footer that have solid backgrounds
      const solidBgTargets = [
        { selector: '#skills', color: 'rgba(10, 14, 26, 0.45)' },
{ selector: '#certificates', color: 'rgba(10, 14, 26, 0.45)' },
{ selector: '#education', color: 'rgba(10, 14, 26, 0.45)' },
{ selector: 'footer', color: 'rgba(5, 7, 13, 0.45)' }
      ];
      solidBgTargets.forEach(({ selector, color }) => {
        const el = document.querySelector(selector);
        if (el) el.style.backgroundColor = color;
      });
    } catch (err) {
      // Fails safely — never lets a particle-background issue break the page
      console.error('Particle background expansion skipped:', err);
    }
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', expandParticleBackground);
  } else {
    // DOM already ready (e.g. script pasted/loaded late) — run immediately
    expandParticleBackground();
  }
})();
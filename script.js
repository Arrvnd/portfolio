/* ============================================
   PORTFOLIO — DYNAMIC JAVASCRIPT
   ============================================ */

(function () {
  "use strict";

  // ==========================================
  // 1. PAGE LOADER
  // ==========================================
  window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.style.overflow = "";
      initAnimations();
    }, 800);
  });
  document.body.style.overflow = "hidden";

  // ==========================================
  // 2. PARTICLE SYSTEM (Canvas)
  // ==========================================
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: null, y: null };
  const PARTICLE_COUNT = 80;
  const CONNECTION_DISTANCE = 150;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x += dx / dist * 1.5;
          this.y += dy / dist * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // ==========================================
  // 3. CUSTOM CURSOR
  // ==========================================
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.left = cursorX + "px";
    cursorDot.style.top = cursorY + "px";
  });

  function animateCursorRing() {
    ringX += (cursorX - ringX) * 0.15;
    ringY += (cursorY - ringY) * 0.15;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  // Hover effect on interactive elements
  document.querySelectorAll("a, button, .project-card, .skill-badge, .contact-card").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("hover"));
  });

  // ==========================================
  // 4. TYPEWRITER EFFECT
  // ==========================================
  const typewriterEl = document.getElementById("typewriter");
  const phrases = [
    "AI-Powered Applications",
    "RAG Systems",
    "Azure Cloud Solutions",
    "Intelligent Chatbots",
    "FastAPI Backends",
    "Generative AI Tools",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // ==========================================
  // 5. NAV SCROLL EFFECTS
  // ==========================================
  const nav = document.getElementById("main-nav");
  const scrollTopBtn = document.getElementById("scroll-top");
  const sections = document.querySelectorAll(".section, .hero");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Nav background
    if (scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Scroll-to-top button
    if (scrollY > 500) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }

    // Active nav link
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active");
      }
    });
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ==========================================
  // 6. HAMBURGER MENU
  // ==========================================
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinksContainer.classList.toggle("active");
  });

  // Close menu when a link is clicked
  navLinksContainer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinksContainer.classList.remove("active");
    });
  });

  // ==========================================
  // 7. SCROLL REVEAL ANIMATIONS
  // ==========================================
  function initAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Animate skill badges when skills section is visible
            if (entry.target.closest("#skills")) {
              animateSkillBadges();
            }

            // Count up stats when hero stats are visible
            if (entry.target.classList.contains("hero-stats") ||
                entry.target.closest(".hero-stats")) {
              animateCounters();
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    // Start typewriter after loader
    typeWriter();
  }

  // ==========================================
  // 8. SKILL BADGES ANIMATION
  // ==========================================
  let skillBadgesAnimated = false;

  function animateSkillBadges() {
    if (skillBadgesAnimated) return;
    skillBadgesAnimated = true;

    document.querySelectorAll(".skill-badge").forEach((badge, i) => {
      badge.style.opacity = "0";
      badge.style.transform = "translateY(15px)";
      badge.style.transition = "all 0.4s ease-out";
      setTimeout(() => {
        badge.style.opacity = "1";
        badge.style.transform = "translateY(0)";
      }, i * 35);
    });
  }

  // ==========================================
  // 9. COUNTER ANIMATION
  // ==========================================
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll(".stat-number").forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;

      function updateCounter() {
        current += step;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }
      updateCounter();
    });
  }

  // ==========================================
  // 10. PROJECT CARD GLOW (mouse tracking)
  // ==========================================
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");
    });
  });

  // ==========================================
  // 11. SMOOTH ANCHOR SCROLLING
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ==========================================
  // 12. TILT EFFECT ON PROJECT CARDS
  // ==========================================
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });

  // ==========================================
  // 13. TERMINAL TYPING ANIMATION
  // ==========================================
  const terminalBody = document.getElementById("terminal-body");
  if (terminalBody) {
    const terminalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            terminalBody.style.animation = "none";
            // Add a blinking cursor line at the end
            const cursorLine = document.createElement("div");
            cursorLine.classList.add("terminal-line");
            cursorLine.innerHTML = `<span class="terminal-prompt">$</span><span class="terminal-cursor" style="animation: blink 0.8s step-end infinite; color: #27c93f;">▊</span>`;
            terminalBody.appendChild(cursorLine);
            terminalObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    terminalObserver.observe(terminalBody);
  }
})();

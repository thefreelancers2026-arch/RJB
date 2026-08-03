/* ============================================
   RPG CATERING — Premium Website Scripts
   ============================================ */

/* ============================================
   HERO VIDEO SOUND & SCROLL OBSERVER
   ============================================ */
const heroVideo = document.getElementById('heroVideo');
const videoMuteBtn = document.getElementById('videoMuteBtn');
const iconMuted = document.getElementById('icon-muted');
const iconUnmuted = document.getElementById('icon-unmuted');

if (heroVideo) {
  if (videoMuteBtn) {
    videoMuteBtn.addEventListener('click', () => {
      if (heroVideo.muted) {
        heroVideo.muted = false;
        iconMuted.style.display = 'none';
        iconUnmuted.style.display = 'block';
      } else {
        heroVideo.muted = true;
        iconMuted.style.display = 'block';
        iconUnmuted.style.display = 'none';
      }
    });
  }

  // Auto-mute and pause when scrolling past hero section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // Scrolled out of view
        heroVideo.muted = true;
        heroVideo.pause();
        if (iconMuted && iconUnmuted) {
          iconMuted.style.display = 'block';
          iconUnmuted.style.display = 'none';
        }
      } else {
        // Scrolled back into view
        heroVideo.play().catch(e => console.log("Autoplay blocked:", e));
      }
    });
  }, { threshold: 0.1 });

  observer.observe(heroVideo);
}

/* ============================================
   INTRO ANIMATION CONTROLLER
   ============================================ */
// Force scroll to top on page load to prevent revealing middle of page after intro
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

(function () {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  // Step 1 — Start words sliding from left & right
  setTimeout(() => {
    overlay.classList.add('words-in');
  }, 80);

  // Step 2 — Page swipe UP after 5s slide finishes + 400ms pause
  setTimeout(() => {
    overlay.classList.add('lift');
  }, 5500);

  // Step 3 — Hide overlay + unlock scroll after swipe completes (720ms swipe)
  overlay.addEventListener('transitionend', function handler(e) {
    if (e.propertyName !== 'transform') return;
    overlay.classList.add('done');
    document.body.classList.remove('intro-active');
    overlay.removeEventListener('transitionend', handler);
  });
})();

/* --- Scatter words animate in after intro ends --- */
function revealHeroMin() {
  document.querySelectorAll('.scatter-w').forEach(el => el.classList.add('visible'));
  const tagline = document.querySelector('.hero-min__tagline');
  if (tagline) tagline.classList.add('visible');
}

// Trigger after intro swipes away (~6.3s) OR immediately if no intro
const introEl = document.getElementById('intro-overlay');
if (introEl) {
  introEl.addEventListener('transitionend', function onLift(e) {
    if (e.propertyName !== 'transform') return;
    revealHeroMin();
    introEl.removeEventListener('transitionend', onLift);
  });
} else {
  revealHeroMin();
}

/* --- Navbar Scroll Effect --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* --- Hamburger Menu --- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = hamburgerBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerBtn.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* --- Hero Image Ken-Burns Effect --- */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  if (heroImg.complete) heroImg.classList.add('loaded');
}

/* --- Typewriter Word Wrap for About Us --- */
const aboutParas = document.querySelectorAll('.about-studio__body p');
aboutParas.forEach(p => {
  let delay = 0;
  function wrapWords(node) {
    if (node.nodeType === 3) { // Text node
      const words = node.nodeValue.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      words.forEach(word => {
        if (word.trim() === '') {
          fragment.appendChild(document.createTextNode(word));
        } else {
          const span = document.createElement('span');
          span.className = 'tw-word';
          span.style.transitionDelay = `${delay}s`;
          span.innerText = word;
          fragment.appendChild(span);
          delay += 0.04; // Adjust typing speed here
        }
      });
      node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === 1 && !node.classList.contains('tw-word')) {
      Array.from(node.childNodes).forEach(wrapWords);
    }
  }
  Array.from(p.childNodes).forEach(wrapWords);
});

/* --- Scroll Reveal Animation --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Add reveal class to elements
const revealSelectors = [
  '.service-card',
  '.gallery-item',
  '.about-text',
  '.about-visual',
  '.stat-item',
  '.contact-text',
  '.contact-form',
  '.testi-quote',
  '.about-studio__label',
  '.about-studio__title',
  '.about-studio__frame-wrap',
  '.about-studio__stats',
  '.about-studio__body p',
  '.ss-img',
  '.ss-content'
];

document.querySelectorAll(revealSelectors.join(', ')).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

/* --- Counter Animation --- */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 20);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* --- Testimonial Carousel --- */
const slides = document.querySelectorAll('.testi-slide');
const dots = document.querySelectorAll('.testi-dot');
let currentSlide = 0;
let autoPlay;

function goToSlide(idx) {
  slides[currentSlide].classList.remove('active');
  slides[currentSlide].setAttribute('aria-hidden', 'true');
  dots[currentSlide].classList.remove('active');
  dots[currentSlide].setAttribute('aria-selected', 'false');

  currentSlide = (idx + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  slides[currentSlide].removeAttribute('aria-hidden');
  dots[currentSlide].classList.add('active');
  dots[currentSlide].setAttribute('aria-selected', 'true');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoPlay);
    goToSlide(parseInt(dot.dataset.idx));
    startAutoPlay();
  });
});

function startAutoPlay() {
  autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

startAutoPlay();

/* --- Smooth Anchor Scroll with Offset --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* --- Contact Form Handler --- */
const enquiryForm = document.getElementById('enquiryForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

enquiryForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const phone = document.getElementById('phoneInput').value.trim();
  const event = document.getElementById('eventType').value || 'Not specified';
  const date = document.getElementById('dateInput').value.trim();
  const guests = document.getElementById('guestsInput').value.trim();
  const venue = document.getElementById('venueInput').value.trim();
  const message = document.getElementById('messageInput').value.trim();

  if (!name || !phone || !email || !message) {
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Please fill required fields (*)';
    submitBtn.style.background = '#e07070';
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
    }, 2000);
    return;
  }

  submitBtn.textContent = 'Connecting...';
  submitBtn.disabled = true;

  const waMsg = `Hello RPG Catering Team,

I would like to inquire about your event planning and catering services. Here are my details:

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Event Type:* ${event}
*Event Date:* ${date || 'Not decided'}
*Expected Guests:* ${guests || 'TBD'}
*Venue/Location:* ${venue || 'TBD'}

*My Requirements:*
${message}

Looking forward to discussing further!`;

  // WhatsApp link using the provided number
  const waUrl = `https://wa.me/919600662794?text=${encodeURIComponent(waMsg)}`;

  submitBtn.textContent = 'Redirecting to WhatsApp ✓';
  submitBtn.style.background = '#4a7c59';
  
  // Use location.href instead of window.open to prevent popup blocking
  window.location.href = waUrl;
  
  setTimeout(() => {
    submitBtn.textContent = 'Send Inquiry';
    submitBtn.disabled = false;
    submitBtn.style.background = '';
    enquiryForm.reset();
  }, 3000);
});

/* --- Active Nav Highlight on Scroll --- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a, .mobile-menu a');

window.addEventListener('scroll', () => {
  let currentSection = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) currentSection = sec.id;
  });

  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${currentSection}`) {
      a.style.color = 'var(--c-gold)';
    }
  });
}, { passive: true });

/* --- Auto-scroll for Our Work --- */
const workScroll = document.getElementById('workScroll');
if (workScroll) {
  let isScrolling = true;
  let scrollSpeed = 0.5;

  // Pause on touch or hover
  workScroll.addEventListener('mouseenter', () => isScrolling = false);
  workScroll.addEventListener('mouseleave', () => isScrolling = true);
  workScroll.addEventListener('touchstart', () => isScrolling = false, {passive: true});
  workScroll.addEventListener('touchend', () => {
    // Resume scrolling after a short delay
    setTimeout(() => isScrolling = true, 1000);
  });

  function autoScroll() {
    if (isScrolling) {
      workScroll.scrollLeft += scrollSpeed;
      // Reset if reached middle (due to duplicate items)
      if (workScroll.scrollLeft >= (workScroll.scrollWidth / 2) - 10) {
        workScroll.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }
  
  requestAnimationFrame(autoScroll);
}

/* ============================================
   PARALLAX MASONRY GALLERY (Center Column Slow Scroll)
   ============================================ */
const parallaxContainer = document.getElementById('parallaxContainer');
const parallaxCenter = document.getElementById('parallaxCenter');

if (parallaxContainer && parallaxCenter) {
  window.addEventListener('scroll', () => {
    // Only apply parallax on desktop/tablet where 3 columns exist
    if (window.innerWidth <= 768) {
      parallaxCenter.style.transform = 'none';
      return;
    }

    const containerRect = parallaxContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if container is in viewport
    if (containerRect.top < windowHeight && containerRect.bottom > 0) {
      // Calculate how far we've scrolled past the container
      // Using a multiplier (e.g. 0.15) controls the "speed" of the parallax
      const scrollOffset = (windowHeight - containerRect.top) * 0.15;
      
      parallaxCenter.style.transform = `translateY(${scrollOffset}px)`;
    }
  }, { passive: true });
}

/* ============================================
   LIGHTBOX WITH TOUCH SWIPE (gallery.html)
   ============================================ */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const galleryItems = document.querySelectorAll('.gp-item img');

if (lightbox && galleryItems.length > 0) {
  let currentIndex = 0;
  const images = Array.from(galleryItems).map(img => img.src);

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = images[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lbImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
      lbImg.src = images[currentIndex];
      lbImg.style.transform = 'scale(1)';
    }, 150);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
      lbImg.src = images[currentIndex];
      lbImg.style.transform = 'scale(1)';
    }, 150);
  }

  galleryItems.forEach((img, idx) => {
    img.parentElement.addEventListener('click', () => openLightbox(idx));
  });
  
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbNext) lbNext.addEventListener('click', showNext);
  if (lbPrev) lbPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch Swiping
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) showNext(); 
    if (touchEndX > touchStartX + 50) showPrev(); 
  }, { passive: true });
}

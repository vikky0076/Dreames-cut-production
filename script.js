/* ==========================================================================
   DREAM CUT PRODUCTION PVT. LTD. - JAVASCRIPT
   Vanilla JS logic for animations, filters, lightbox, sliders & validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------
  // 1. Preloader Screen
  // ---------------------------------------------------------
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    // Small delay to ensure the fill bar reaches 100% smoothly
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 600);
  });

  // Fallback in case window load event already fired or delayed
  setTimeout(() => {
    if (preloader.style.visibility !== 'hidden') {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }
  }, 3000);


  // ---------------------------------------------------------
  // 2. Sticky Navbar & Active Section Link Highlighter
  // ---------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Toggle navbar glassmorphism
    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('active');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('active');
    }

    // Highlight current active navigation item
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Back to top button action
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // ---------------------------------------------------------
  // 3. Mobile Navigation Menu
  // ---------------------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when a navigation item is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  // ---------------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // ---------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));


  // ---------------------------------------------------------
  // 5. Dynamic Stats Counter Animation
  // ---------------------------------------------------------
  const stats = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  const animateCounters = () => {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds
      const stepTime = Math.abs(Math.floor(duration / target));
      let current = 0;
      
      const timer = setInterval(() => {
        current += 1;
        stat.textContent = current;
        
        // Append + to specific stats for aesthetics
        if (current >= target) {
          clearInterval(timer);
          stat.textContent = target + '+';
        }
      }, Math.max(stepTime, 15));
    });
  };

  // Trigger counters when the about stats section is in view
  const aboutSection = document.getElementById('about');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  if (aboutSection) {
    statsObserver.observe(aboutSection);
  }


  // ---------------------------------------------------------
  // 6. Portfolio Filter Engine
  // ---------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          // Show item
          item.style.display = 'block';
          // Smooth fade-in
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Hide item
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 350); // Match stylesheet transition timing
        }
      });
    });
  });


  // ---------------------------------------------------------
  // 7. Lightbox Preview Modal
  // ---------------------------------------------------------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const title = item.querySelector('.portfolio-title').textContent;
      const desc = item.getAttribute('data-description') || '';

      lightboxImg.setAttribute('src', src);
      lightboxImg.setAttribute('alt', title);
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Unlock scroll
    // Clear content after animation
    setTimeout(() => {
      lightboxImg.setAttribute('src', '');
      lightboxTitle.textContent = '';
      lightboxDesc.textContent = '';
    }, 400);
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    // Close only if clicking outside the image container
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });


  // ---------------------------------------------------------
  // 8. Testimonials Carousel
  // ---------------------------------------------------------
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  const slideCount = dots.length;
  let autoSlideTimer;

  const updateSlide = (index) => {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots status
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const startAutoSlide = () => {
    autoSlideTimer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slideCount;
      updateSlide(nextIndex);
    }, 5000); // Shift every 5 seconds
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideTimer);
  };

  // Dots click handler
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      updateSlide(targetIndex);
      startAutoSlide(); // Restart countdown
    });
  });

  // Initialize testimonial rotation
  if (track && slideCount > 0) {
    startAutoSlide();
  }


  // ---------------------------------------------------------
  // 9. Premium Form Validation & WhatsApp Redirect
  // ---------------------------------------------------------
  const form = document.getElementById('contact-form');

  if (form) {
    const setError = (element, message) => {
      const parent = element.parentElement;
      parent.classList.add('has-error');
      const errorDiv = parent.querySelector('.form-error');
      if (errorDiv) {
        errorDiv.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
      }
    };

    const clearError = (element) => {
      const parent = element.parentElement;
      parent.classList.remove('has-error');
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
      // Matches simple 10 digit formats
      const re = /^[6-9]\d{9}$/;
      return re.test(phone.replace(/[\s\-]/g, ''));
    };

    // Clear errors dynamically on input focus/edit
    const formInputs = form.querySelectorAll('.form-input');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          clearError(input);
        }
      });
      input.addEventListener('change', () => {
        if (input.value.trim() !== '') {
          clearError(input);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('form-name');
      const messageInput = document.getElementById('form-message');

      // 1. Name Check
      if (nameInput.value.trim() === '') {
        setError(nameInput, 'Name is required.');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      // 2. Message Check
      if (messageInput.value.trim() === '') {
        setError(messageInput, 'Message description is required.');
        isValid = false;
      } else {
        clearError(messageInput);
      }

      if (isValid) {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        // Construct WhatsApp message URL
        const whatsappText = `Hi Sathish, I am *${name}*.\n\nHere is what I need:\n${message}`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=918838303167&text=${encodeURIComponent(whatsappText)}`;

        // Open WhatsApp in a new tab immediately (no alert dialog)
        window.open(whatsappUrl, '_blank');

        // Clear Form fields
        form.reset();
        formInputs.forEach(input => clearError(input));
      }
    });
  }

});

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = mobileToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter animation if hero content is visible
        if (entry.target.classList.contains('hero-content')) {
          animateCounters();
        }

        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
  });

  // Sticky Header Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.style.background = 'rgba(16, 24, 40, 0.95)';
      header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.background = 'rgba(16, 24, 40, 0.9)';
      header.style.boxShadow = 'none';
    }
  });

  // Counter Animation
  const counters = document.querySelectorAll('.counter');

  function animateCounters() {
    const duration = 5000; // 5 seconds
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const current = Math.floor(progress * target);

        // Format large numbers with commas if needed (optional but premium)
        counter.innerText = current;
      });

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counters.forEach(counter => {
          counter.innerText = counter.getAttribute('data-target');
        });
      }
    };

    window.requestAnimationFrame(step);
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button');
      const originalBtnText = submitBtn.innerText;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      formStatus.style.display = 'none';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.style.display = 'block';
          formStatus.style.color = '#10b981'; // Success Green
          formStatus.innerText = 'Thank you! Your message has been sent successfully.';
          contactForm.reset();
        } else {
          const data = await response.json();
          formStatus.style.display = 'block';
          formStatus.style.color = '#ef4444'; // Error Red
          if (data.errors) {
            formStatus.innerText = data.errors.map(error => error.message).join(', ');
          } else {
            formStatus.innerText = 'Oops! There was a problem submitting your form.';
          }
        }
      } catch (error) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#ef4444';
        formStatus.innerText = 'Oops! There was a problem submitting your form.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    });
  }

  // Dynamic Year
  const yearElements = document.querySelectorAll('.year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => el.textContent = currentYear);
});

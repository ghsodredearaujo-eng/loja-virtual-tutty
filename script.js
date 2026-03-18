/* ═══════════════════════════════════════════════════
   TUTTY SUCOS — Site Oficial | Global JavaScript
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initAccordion();
  initDropdowns();
  initParallax();
});

/* ═══════════════════════════════════════════════════
   NAVBAR — Sticky + Transparent → Solid
   ═══════════════════════════════════════════════════ */
function initNavbar() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function checkScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  // Highlight current page in nav
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var links = navbar.querySelectorAll('.nav-links a');
  links.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href === currentPath) {
      link.classList.add('active');
    }
  });
}

/* ═══════════════════════════════════════════════════
   MOBILE MENU — Hamburger + Slide-In
   ═══════════════════════════════════════════════════ */
function initMobileMenu() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  var overlay = document.querySelector('.mobile-menu-overlay');
  var closeBtn = document.querySelector('.mobile-menu-close');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Accordion in mobile menu
  var accordionToggles = menu.querySelectorAll('.mobile-accordion-toggle');
  accordionToggles.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var content = this.nextElementSibling;
      var isOpen = content && content.classList.contains('open');

      // Close all
      menu.querySelectorAll('.mobile-accordion-content').forEach(function(c) {
        c.classList.remove('open');
      });
      menu.querySelectorAll('.mobile-accordion-toggle').forEach(function(t) {
        t.classList.remove('open');
      });

      // Toggle current
      if (!isOpen && content) {
        content.classList.add('open');
        this.classList.add('open');
      }
    });
  });

  // Close menu on link click
  menu.querySelectorAll('a:not(.mobile-accordion-toggle)').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
}

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
   ═══════════════════════════════════════════════════ */
function initScrollReveal() {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function(el) {
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════
   ACCORDION — FAQ Toggle
   ═══════════════════════════════════════════════════ */
function initAccordion() {
  var triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var content = this.nextElementSibling;
      var isActive = this.classList.contains('active');

      // Close all in same accordion
      var accordion = this.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-trigger').forEach(function(t) {
          t.classList.remove('active');
          t.nextElementSibling.style.maxHeight = null;
        });
      }

      // Toggle current
      if (!isActive) {
        this.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   DROPDOWN MENUS — Desktop Hover + Mobile Click
   ═══════════════════════════════════════════════════ */
function initDropdowns() {
  var dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(function(dropdown) {
    var trigger = dropdown.querySelector('a');

    // Touch devices: toggle on click
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   PARALLAX — Lightweight via rAF
   ═══════════════════════════════════════════════════ */
function initParallax() {
  var parallaxElements = document.querySelectorAll('.parallax-bg');
  if (!parallaxElements.length || window.innerWidth <= 900) return;

  var ticking = false;

  function updateParallax() {
    var scrollY = window.scrollY;
    parallaxElements.forEach(function(el) {
      var rect = el.parentElement.getBoundingClientRect();
      var offset = rect.top + scrollY;
      var speed = 0.3;
      var yPos = (scrollY - offset) * speed;
      el.style.transform = 'translate3d(0, ' + yPos + 'px, 0)';
    });
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════
   FORM SUBMISSION — Netlify Forms
   ═══════════════════════════════════════════════════ */
function submitNetlifyForm(formEl, successMsg) {
  var data = new URLSearchParams(new FormData(formEl));

  var btn = formEl.querySelector('button[type="submit"]');
  var originalText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data.toString()
  })
  .then(function(res) {
    if (btn) { btn.disabled = false; btn.textContent = originalText; }
    if (res.ok) {
      showModal('Enviado com Sucesso! ✓', successMsg || 'Recebemos suas informações. Entraremos em contato em breve.');
      formEl.reset();
    } else {
      showModal('Erro ao enviar', 'Tente novamente ou entre em contato pelo WhatsApp: (18) 98154-4334');
    }
  })
  .catch(function() {
    if (btn) { btn.disabled = false; btn.textContent = originalText; }
    showModal('Erro de Conexão', 'Verifique sua internet e tente novamente.');
  });
}

/* ═══════════════════════════════════════════════════
   MODAL — Generic
   ═══════════════════════════════════════════════════ */
function showModal(title, message) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:5000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.3s';
  overlay.innerHTML =
    '<div style="background:#fff;border-radius:18px;padding:40px;max-width:440px;width:100%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.25)">' +
    '<h2 style="font-size:1.3rem;color:#0B5C28;margin-bottom:12px">' + title + '</h2>' +
    '<p style="font-size:0.95rem;color:#555;line-height:1.6;margin-bottom:24px">' + message + '</p>' +
    '<button onclick="this.closest(\'div\').parentElement.remove()" style="background:#f7931d;color:#fff;border:none;padding:12px 32px;border-radius:999px;font-weight:600;font-size:0.95rem;cursor:pointer;font-family:inherit">Entendido</button>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.remove();
  });
}

/* ═══════════════════════════════════════════════════
   TABS — Reusable Tab Switching
   ═══════════════════════════════════════════════════ */
function switchTab(btn, tabId) {
  // Deactivate siblings
  var parent = btn.parentElement;
  parent.querySelectorAll('button, a').forEach(function(el) {
    el.classList.remove('active');
  });
  btn.classList.add('active');

  // Hide all tab panes and show target
  var tabContainer = parent.parentElement;
  tabContainer.querySelectorAll('.tab-pane').forEach(function(pane) {
    pane.style.display = 'none';
  });
  var target = document.getElementById(tabId);
  if (target) target.style.display = 'block';
}

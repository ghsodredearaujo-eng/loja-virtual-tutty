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
   SECURITY — Input Validation
   ═══════════════════════════════════════════════════ */
function validateForm(formEl) {
  var isValid = true;
  var requiredInputs = formEl.querySelectorAll('[required]');
  requiredInputs.forEach(function(input) {
    input.style.borderColor = '';
    if (!input.value.trim()) {
      input.style.borderColor = '#e53e3e';
      isValid = false;
    }
  });

  // Validate email fields
  var emailInputs = formEl.querySelectorAll('input[type="email"]');
  emailInputs.forEach(function(input) {
    if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      input.style.borderColor = '#e53e3e';
      isValid = false;
    }
  });

  // Validate CNPJ fields (basic: 14+ digits)
  var cnpjInputs = formEl.querySelectorAll('input[name*="cnpj"], input[name*="CNPJ"]');
  cnpjInputs.forEach(function(input) {
    if (input.value) {
      var digits = input.value.replace(/\D/g, '');
      if (digits.length < 14) {
        input.style.borderColor = '#e53e3e';
        isValid = false;
      }
    }
  });

  // Validate phone/WhatsApp fields (basic: 10+ digits)
  var phoneInputs = formEl.querySelectorAll('input[name*="whatsapp"], input[name*="telefone"], input[name*="celular"]');
  phoneInputs.forEach(function(input) {
    if (input.value) {
      var digits = input.value.replace(/\D/g, '');
      if (digits.length < 10) {
        input.style.borderColor = '#e53e3e';
        isValid = false;
      }
    }
  });

  // Sanitize all text inputs (strip script tags)
  var textInputs = formEl.querySelectorAll('input[type="text"], textarea');
  textInputs.forEach(function(input) {
    input.value = input.value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    input.value = input.value.replace(/on\w+\s*=/gi, '');
  });

  if (!isValid) {
    showModal('Campos inválidos', 'Por favor, verifique os campos destacados em vermelho e corrija as informações.');
  }
  return isValid;
}

/* ═══════════════════════════════════════════════════
   FORM SUBMISSION — WhatsApp fallback (Netlify removido)
   ═══════════════════════════════════════════════════ */
function submitNetlifyForm(formEl, successMsg) {
  if (!validateForm(formEl)) return;

  // Coleta dados do formulário para montar mensagem de WhatsApp
  var formData = new FormData(formEl);
  var lines = ['Olá! Segue minha solicitação:'];
  formData.forEach(function(value, key) {
    if (key !== 'bot-field' && value) {
      lines.push(key + ': ' + value);
    }
  });
  var whatsappMsg = encodeURIComponent(lines.join('\n'));
  var whatsappUrl = 'https://wa.me/5518981544334?text=' + whatsappMsg;

  // Exibe modal com botão de WhatsApp
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:5000;display:flex;align-items:center;justify-content:center;padding:20px';

  var modal = document.createElement('div');
  modal.style.cssText = 'background:#fff;border-radius:18px;padding:40px;max-width:440px;width:100%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.25)';

  var h2 = document.createElement('h2');
  h2.style.cssText = 'font-size:1.3rem;color:#1a1a1a;margin-bottom:12px';
  h2.textContent = 'Formulário recebido ✓';

  var p = document.createElement('p');
  p.style.cssText = 'font-size:0.95rem;color:#555;line-height:1.6;margin-bottom:24px';
  p.textContent = (successMsg || 'Recebemos suas informações.') + ' Finalize pelo WhatsApp para que nossa equipe receba sua solicitação.';

  var btnWA = document.createElement('a');
  btnWA.href = whatsappUrl;
  btnWA.target = '_blank';
  btnWA.rel = 'noopener';
  btnWA.style.cssText = 'display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:600;font-size:0.95rem;margin-bottom:12px;font-family:inherit';
  btnWA.textContent = 'Abrir WhatsApp';

  var btnClose = document.createElement('button');
  btnClose.style.cssText = 'display:block;margin:0 auto;background:transparent;color:#888;border:none;font-size:0.9rem;cursor:pointer;font-family:inherit;padding:4px 0';
  btnClose.textContent = 'Fechar';
  btnClose.addEventListener('click', function() { overlay.remove(); });

  modal.appendChild(h2);
  modal.appendChild(p);
  modal.appendChild(btnWA);
  modal.appendChild(btnClose);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

  formEl.reset();
}

/* ═══════════════════════════════════════════════════
   SECURITY — Sanitization Helper
   ═══════════════════════════════════════════════════ */
function sanitizeHTML(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ═══════════════════════════════════════════════════
   MODAL — Generic (XSS-safe)
   ═══════════════════════════════════════════════════ */
function showModal(title, message) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:5000;display:flex;align-items:center;justify-content:center;padding:20px';

  var modal = document.createElement('div');
  modal.style.cssText = 'background:#fff;border-radius:18px;padding:40px;max-width:440px;width:100%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.25)';

  var h2 = document.createElement('h2');
  h2.style.cssText = 'font-size:1.3rem;color:#0B5C28;margin-bottom:12px';
  h2.textContent = title;

  var p = document.createElement('p');
  p.style.cssText = 'font-size:0.95rem;color:#555;line-height:1.6;margin-bottom:24px';
  p.textContent = message;

  var btn = document.createElement('button');
  btn.style.cssText = 'background:#f7931d;color:#fff;border:none;padding:12px 32px;border-radius:999px;font-weight:600;font-size:0.95rem;cursor:pointer;font-family:inherit';
  btn.textContent = 'Entendido';
  btn.addEventListener('click', function() { overlay.remove(); });

  modal.appendChild(h2);
  modal.appendChild(p);
  modal.appendChild(btn);
  overlay.appendChild(modal);
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

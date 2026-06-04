/* ========================================
   CONTACT FORM HANDLER
   Uses Web3Forms API to send emails
   to jewelhossain864@gmail.com
   
   HOW TO ACTIVATE:
   1. Go to https://web3forms.com
   2. Enter: jewelhossain864@gmail.com
   3. Check your email for the access key
   4. Replace YOUR_ACCESS_KEY_HERE below
      with your actual key
   ======================================== */
'use strict';

const ContactForm = {

  init() {
    document.querySelectorAll('form.contact-form').forEach(function(form) {
      ContactForm.attachHandler(form);
    });
  },

  attachHandler(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var submitBtn = form.querySelector('.form-submit');
      var originalText = submitBtn.textContent;

      // Validate required fields
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');

      // Clear previous error states
      form.querySelectorAll('.form-input').forEach(function(inp) {
        inp.classList.remove('input-error');
      });

      var hasError = false;

      if (!name || !name.value.trim()) {
        if (name) name.classList.add('input-error');
        hasError = true;
      }
      if (!email || !email.value.trim() || !ContactForm.isValidEmail(email.value)) {
        if (email) email.classList.add('input-error');
        hasError = true;
      }
      if (!message || !message.value.trim()) {
        if (message) message.classList.add('input-error');
        hasError = true;
      }

      if (hasError) {
        ContactForm.showToast('Please fill in all required fields correctly.', 'error');
        return;
      }

      // Check access key
      var accessKeyInput = form.querySelector('[name="access_key"]');
      if (!accessKeyInput || accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE' || !accessKeyInput.value.trim()) {
        ContactForm.showToast('Contact form is not configured yet. Please email me directly at jewelhossain864@gmail.com', 'error');
        return;
      }

      // Set loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83"/></svg> Sending...</span>';
      submitBtn.style.opacity = '0.7';

      // Build JSON payload (more reliable than FormData for Web3Forms)
      var payload = {
        access_key: accessKeyInput.value.trim(),
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        from_name: 'Portfolio Contact Form'
      };

      // Set subject
      var subjectInput = form.querySelector('[name="subject"]');
      if (subjectInput && subjectInput.value.trim()) {
        payload.subject = subjectInput.value.trim();
      }

      // Override subject with topic if user filled it
      var topicInput = form.querySelector('[name="topic"]');
      if (topicInput && topicInput.value.trim()) {
        payload.subject = topicInput.value.trim() + ' — Portfolio Contact';
      }

      // Add honeypot
      var botcheck = form.querySelector('[name="botcheck"]');
      if (botcheck && botcheck.checked) {
        // Bot detected, silently return
        return;
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.success) {
          ContactForm.showToast('Message sent successfully! I\'ll get back to you soon. ✨', 'success');
          form.reset();
        } else {
          ContactForm.showToast('Failed to send: ' + (data.message || 'Unknown error') + '. Please email me directly.', 'error');
          console.error('Web3Forms error:', data);
        }
      })
      .catch(function(error) {
        ContactForm.showToast('Network error. Please check your connection or email me at jewelhossain864@gmail.com', 'error');
        console.error('Fetch error:', error);
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
      });
    });
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  showToast(message, type) {
    // Remove any existing toast
    var existing = document.querySelector('.form-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'form-toast form-toast-' + type;

    var icon = type === 'success' ? '✅' : '⚠️';

    toast.innerHTML =
      '<div class="toast-icon">' + icon + '</div>' +
      '<div class="toast-message">' + message + '</div>' +
      '<button class="toast-close" onclick="this.parentElement.remove()">✕</button>';

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        toast.classList.add('toast-visible');
      });
    });

    // Auto-dismiss after 6 seconds
    setTimeout(function() {
      if (toast.parentElement) {
        toast.classList.remove('toast-visible');
        setTimeout(function() {
          if (toast.parentElement) toast.remove();
        }, 400);
      }
    }, 6000);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  ContactForm.init();
});

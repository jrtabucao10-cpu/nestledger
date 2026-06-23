/* =============================================
   GLAMORPHOSIS STUDIO — script.js
   Handles: navigation, portfolio filter,
   booking form, AI chat assistant
   ============================================= */

/* ── Section Navigation ───────────────────── */
function showSection(id) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update nav link active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
  });
  // Close mobile nav
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('nav-toggle').setAttribute('aria-expanded', 'false');
}

/* ── Mobile Nav Toggle ────────────────────── */
document.getElementById('nav-toggle').addEventListener('click', function () {
  const navLinks = document.getElementById('nav-links');
  const open = navLinks.classList.toggle('open');
  this.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* ── Nav scroll shadow ────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.style.boxShadow = window.scrollY > 10
    ? '0 2px 12px rgba(42,26,34,0.08)'
    : 'none';
}, { passive: true });

/* ── Set min date on booking form ─────────── */
const dateInput = document.getElementById('b-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

/* ── Booking Form ─────────────────────────── */
document.getElementById('booking-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Basic validation
  const name    = document.getElementById('b-name').value.trim();
  const phone   = document.getElementById('b-phone').value.trim();
  const service = document.getElementById('b-service').value;
  const date    = document.getElementById('b-date').value;
  const time    = document.getElementById('b-time').value;

  if (!name || !phone || !service || !date || !time) {
    alert('Please fill in all required fields before submitting.');
    return;
  }

  // Show success state
  document.getElementById('booking-form').hidden = true;
  const success = document.getElementById('booking-success');
  success.hidden = false;
  document.getElementById('success-name').textContent =
    `✦ ${name} — ${service} on ${formatDate(date)} at ${time}`;

  // In production: send to Supabase or your backend here
  // Example:
  // fetch('YOUR_SUPABASE_FUNCTION_URL', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, phone, service, date, time })
  // });
});

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ── Portfolio Filter ─────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.dataset.filter;

    document.querySelectorAll('.portfolio-card').forEach(card => {
      const matches = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !matches);
    });
  });
});

/* ── AI Chat Widget ───────────────────────── */
const chatToggle  = document.getElementById('chat-toggle');
const chatWidget  = document.getElementById('chat-widget');
const chatClose   = document.getElementById('chat-close');
const chatInput   = document.getElementById('chat-input');
const chatSend    = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');
const quickSuggestions = document.getElementById('quick-suggestions');

chatToggle.addEventListener('click', () => {
  const isOpen = chatWidget.classList.toggle('open');
  chatToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  chatWidget.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  if (isOpen) chatInput.focus();
});

chatClose.addEventListener('click', () => {
  chatWidget.classList.remove('open');
  chatToggle.setAttribute('aria-expanded', 'false');
  chatWidget.setAttribute('aria-hidden', 'true');
});

chatSend.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendChat();
});

/* Knowledge base for the AI assistant */
const KB = [
  {
    keys: ['bridal', 'bride', 'wedding', 'kasal'],
    reply: 'Our Bridal Hair & Makeup package starts at ₱3,500. It includes a trial session, airbrush foundation, full glam, lashes, and a touch-up kit. Entourage packages are also available! Would you like to book a slot? 💍'
  },
  {
    keys: ['event', 'debut', 'prom', 'gala', 'pageant', 'party'],
    reply: 'Event Makeup starts at ₱1,500 — perfect for debut, prom, gala, or any special occasion. Full glam that lasts all night and photographs beautifully! 🌟'
  },
  {
    keys: ['hair styling', 'updo', 'blowout', 'waves', 'braid', 'hairstyle'],
    reply: 'Hair Styling starts at ₱800. We do blowouts, updos, braids, beach waves, and more — styled to suit your vibe and event. ✂️'
  },
  {
    keys: ['photoshoot', 'shoot', 'photo', 'editorial', 'commercial'],
    reply: 'Photoshoot Makeup starts at ₱2,000. It\'s HD-ready and camera-proof — designed to look flawless under studio lighting with lens-proof coverage. 📸'
  },
  {
    keys: ['home service', 'home', 'house', 'venue', 'travel', 'labas', 'pumunta'],
    reply: 'Yes, we offer home service! We travel to you for bridal, events, and photoshoots. A travel fee applies based on your location. Just include your address in the booking notes. 🏠'
  },
  {
    keys: ['book', 'appointment', 'reserve', 'schedule', 'how to book', 'mag-book'],
    reply: 'Booking is easy! Just click the "Book Now" button in the menu, fill in your name, mobile number, service, and preferred date and time. We\'ll confirm within 24 hours via Messenger or WhatsApp. 📅'
  },
  {
    keys: ['price', 'cost', 'how much', 'magkano', 'rate', 'package', 'pricing'],
    reply: 'Here\'s a quick pricing overview:\n💍 Bridal Hair & Makeup — from ₱3,500\n✨ Event Makeup — from ₱1,500\n✂️ Hair Styling — from ₱800\n📸 Photoshoot Makeup — from ₱2,000\n🏠 Home Service — + travel fee\n\nWant to book a specific service?'
  },
  {
    keys: ['available', 'availability', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'date', 'slot'],
    reply: 'To check availability for a specific date, please use our booking form or message us directly! We\'ll confirm your preferred slot within 24 hours. 📅'
  },
  {
    keys: ['contact', 'message', 'messenger', 'whatsapp', 'instagram', 'email', 'reach'],
    reply: 'You can reach us on:\n💬 Facebook Messenger: Glamorphosis Studio\n📞 Phone/Text: +63 935 887 1346\n🌐 Facebook Page: facebook.com/people/Glamorphosis-Studio/61586977724505/\n📷 Instagram: @glamorphosis_makeupby_dabica\n✉️ Email: dabsgonzales@yahoo.com\n\nWe\'re usually online during studio hours (Mon–Fri 8AM–7PM, Sat 7AM–8PM).'
  },
  {
    keys: ['hours', 'open', 'schedule', 'time', 'bukas', 'close'],
    reply: 'Our studio hours are:\n🕗 Monday–Friday: 8:00 AM – 7:00 PM\n🕖 Saturday: 7:00 AM – 8:00 PM\n📅 Sunday: By appointment only\n\nHome service slots are available daily upon request!'
  },
  {
    keys: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'kamusta'],
    reply: 'Hello! Welcome to Glamorphosis Studio ✦ How can I help you today? You can ask me about our services, pricing, availability, or how to book an appointment!'
  },
  {
    keys: ['thank', 'thanks', 'salamat'],
    reply: 'You\'re so welcome! ✦ Is there anything else I can help you with? We\'d love to be part of your glam journey!'
  }
];

function getAIReply(userMsg) {
  const msg = userMsg.toLowerCase();
  for (const entry of KB) {
    if (entry.keys.some(k => msg.includes(k))) {
      return entry.reply;
    }
  }
  return null;
}

function addMessage(text, type) {
  const el = document.createElement('div');
  el.className = 'msg ' + type;
  // Support newlines
  el.style.whiteSpace = 'pre-wrap';
  el.textContent = text;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return el;
}

function sendChat() {
  const val = chatInput.value.trim();
  if (!val) return;

  // Hide quick suggestions after first message
  if (quickSuggestions) quickSuggestions.style.display = 'none';

  addMessage(val, 'user');
  chatInput.value = '';

  // Typing indicator
  const typing = addMessage('typing...', 'bot typing');

  setTimeout(() => {
    typing.remove();
    const reply = getAIReply(val);
    if (reply) {
      addMessage(reply, 'bot');
    } else {
      addMessage(
        'That\'s a great question! I\'m not sure about that one — let me connect you with the Glamorphosis team directly. 💬',
        'bot'
      );
      setTimeout(() => {
        const link = document.createElement('div');
        link.className = 'msg bot';
        link.innerHTML = '👉 <a href="https://m.me/61586977724505" target="_blank" rel="noopener" style="color:#c0748a; font-weight:500;">Chat with us on Messenger</a> — we\'ll reply ASAP!';
        chatMessages.appendChild(link);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 700);
    }
  }, 700);
}

function askQuick(question) {
  if (quickSuggestions) quickSuggestions.style.display = 'none';
  addMessage(question, 'user');
  const typing = addMessage('typing...', 'bot typing');
  setTimeout(() => {
    typing.remove();
    const reply = getAIReply(question);
    addMessage(reply || 'Let me connect you with the studio!', 'bot');
  }, 600);
}

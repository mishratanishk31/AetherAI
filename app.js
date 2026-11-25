/**
 * AETHERAI — STUDIO OBSIDIAN & ELECTRIC MINT COGNITIVE ENGINE
 * Pure Vanilla HTML5 / CSS3 / JavaScript (ES6+)
 * Powered by Groq AI API
 * Bespoke, Human-Crafted Architecture & Rich Multi-Layer Animations
 */

// ============================================================================
// CONFIGURATION & STATE MANAGEMENT
// ============================================================================
const CONFIG = {
  defaultApiKey: '',
  groqEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
  defaultModel: 'openai/gpt-oss-120b',
  storageKey: 'aetherai_chat_history_v2',
  settingsKey: 'aetherai_settings_v2'
};

const state = {
  apiKey: localStorage.getItem('aetherai_api_key') || '',
  model: CONFIG.defaultModel,
  mode: 'general', // general | support | faq | creative
  language: 'English',
  guardrailsActive: true,
  piiMaskingActive: true,
  soundActive: true,
  theme: 'dark', // dark | cyber | light
  isGenerating: false,
  isRecording: false,
  messages: [],
  speechSynth: window.speechSynthesis || null,
  activeSpeechUtterance: null
};

// ============================================================================
// WEB AUDIO SYNTHESIZER (No external audio files required!)
// ============================================================================
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSend() {
    if (!state.soundActive) return;
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(960, now + 0.12);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playReceive() {
    if (!state.soundActive) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5

    osc2.frequency.setValueAtTime(783.99, now);
    osc2.frequency.setValueAtTime(1046.50, now + 0.16); // C6

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  playClick() {
    if (!state.soundActive) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playPop() {
    if (!state.soundActive) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.08);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  playHandoffChime() {
    if (!state.soundActive) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + (idx * 0.1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  }
}

const sfx = new SoundEffects();

// ============================================================================
// PARTICLE CANVAS (Interactive Fluid Constellations & Click Shockwaves)
// ============================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const mouse = { x: -1000, y: -1000, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Click shockwave
  window.addEventListener('click', (e) => {
    createShockwave(e.clientX, e.clientY);
  });

  for (let i = 0; i < particleCount; i++) {
    const isMint = Math.random() > 0.4;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.2 + 0.8,
      color: isMint ? 'rgba(5, 223, 114, ' : 'rgba(245, 158, 11, '
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Cursor gravity & repulsion
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x -= (dx / dist) * force * 4;
        p.y -= (dy / dist) * force * 4;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.7)';
      ctx.fill();

      // Connect near particles with illuminated constellation lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pDist < 105) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(5, 223, 114, ${(1 - pDist / 105) * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

function createShockwave(x, y) {
  const ring = document.createElement('div');
  ring.className = 'shockwave-ring';
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  document.body.appendChild(ring);
  setTimeout(() => ring.remove(), 800);
}

// ============================================================================
// INTERACTIVE 3D AVATAR MOUSE EYE-TRACKING
// ============================================================================
function setupAvatarEyeTracking() {
  const avatar = document.getElementById('avatarInteract');
  if (!avatar) return;

  const pupils = avatar.querySelectorAll('.pupil');
  if (!pupils.length) return;

  window.addEventListener('mousemove', (e) => {
    const rect = avatar.getBoundingClientRect();
    const avatarCenterX = rect.left + rect.width / 2;
    const avatarCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - avatarCenterY, e.clientX - avatarCenterX);
    const distance = Math.min(Math.hypot(e.clientX - avatarCenterX, e.clientY - avatarCenterY), 60);
    const maxOffset = 2.2; // max pupil travel distance in pixels
    const offset = (distance / 60) * maxOffset;

    const offsetX = Math.cos(angle) * offset;
    const offsetY = Math.sin(angle) * offset;

    pupils.forEach((p) => {
      p.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    });
  });
}

// ============================================================================
// STICKERS DATABASE & ANIMATIONS
// ============================================================================
const STICKER_DATA = {
  bots: [
    { icon: '🤖', title: 'Hello Bot', caption: 'Online & Ready to Assist!', anim: 'anim-wobble' },
    { icon: '🚀', title: 'Rocket Launch', caption: 'Full speed ahead!', anim: 'anim-float' },
    { icon: '⚡', title: 'Turbo Power', caption: 'High performance compute', anim: 'anim-pulse' },
    { icon: '🧠', title: 'Big Brain', caption: 'Deep neural processing...', anim: 'anim-pulse' },
    { icon: '📡', title: 'Signal Locked', caption: 'Receiving transmission', anim: 'anim-wobble' },
    { icon: '🔋', title: 'Full Charge', caption: '100% clean energy', anim: 'anim-bounce' },
    { icon: '🛡️', title: 'Shield Active', caption: 'Protected by Guardrails', anim: 'anim-pulse' },
    { icon: '⚙️', title: 'In the Works', caption: 'Executing logic...', anim: 'anim-spin-slow' }
  ],
  emotions: [
    { icon: '💖', title: 'Love it!', caption: 'Much appreciated!', anim: 'anim-pulse' },
    { icon: '✨', title: 'Sparkles', caption: 'Pure magic!', anim: 'anim-float' },
    { icon: '🎉', title: 'Party Time', caption: 'Milestone reached!', anim: 'anim-tada' },
    { icon: '🤩', title: 'Star-struck', caption: 'Spectacular result!', anim: 'anim-bounce' },
    { icon: '👏', title: 'Applause', caption: 'Well done indeed', anim: 'anim-wobble' },
    { icon: '🔥', title: 'On Fire!', caption: 'Unstoppable momentum', anim: 'anim-bounce' },
    { icon: '😎', title: 'Cool Vibes', caption: 'Smooth as silk', anim: 'anim-float' },
    { icon: '🙌', title: 'Celebration', caption: 'High five!', anim: 'anim-tada' }
  ],
  work: [
    { icon: '💻', title: 'Coding Time', caption: 'Building architecture', anim: 'anim-wobble' },
    { icon: '📊', title: 'Analytics', caption: 'Data points aligned', anim: 'anim-bounce' },
    { icon: '📝', title: 'Documented', caption: 'Logged in memory', anim: 'anim-float' },
    { icon: '☕', title: 'Coffee Break', caption: 'Refueling creative spark', anim: 'anim-float' },
    { icon: '💡', title: 'Eureka!', caption: 'Brilliant breakthrough', anim: 'anim-pulse' },
    { icon: '🎯', title: 'Bullseye', caption: 'Directly on target', anim: 'anim-bounce' },
    { icon: '🔍', title: 'Deep Audit', caption: 'Inspecting specifics', anim: 'anim-wobble' },
    { icon: '🤝', title: 'Team Sync', caption: 'Collaboration aligned', anim: 'anim-float' }
  ],
  fun: [
    { icon: '🍕', title: 'Pizza Fuel', caption: 'Infinite pizza supply', anim: 'anim-bounce' },
    { icon: '🦄', title: 'Unicorn', caption: 'Rare discovery!', anim: 'anim-float' },
    { icon: '🎮', title: 'Level Up', caption: 'XP points awarded', anim: 'anim-tada' },
    { icon: '🐱', title: 'Code Cat', caption: 'Purr-fect logic', anim: 'anim-wobble' },
    { icon: '🌮', title: 'Taco Tuesday', caption: 'Always a good idea', anim: 'anim-bounce' },
    { icon: '🧘', title: 'Zen State', caption: 'Balanced and calm', anim: 'anim-float' },
    { icon: '🪄', title: 'Magic Wand', caption: 'Abracadabra!', anim: 'anim-wobble' },
    { icon: '🍿', title: 'Grab Popcorn', caption: 'This is getting good', anim: 'anim-bounce' }
  ]
};

function renderStickerTray(category = 'bots') {
  const grid = document.getElementById('stickerGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const list = STICKER_DATA[category] || STICKER_DATA.bots;
  list.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'sticker-item';
    el.title = `${item.title}: ${item.caption}`;
    el.innerHTML = `
      <span class="sticker-icon ${item.anim || 'anim-bounce'}">${item.icon}</span>
      <span class="sticker-label">${item.title}</span>
    `;
    el.addEventListener('click', () => {
      sendStickerMessage(item);
      closeStickerDrawer();
    });
    grid.appendChild(el);
  });
}

function openStickerDrawer() {
  const drawer = document.getElementById('stickerDrawer');
  if (drawer) {
    drawer.style.display = 'flex';
    sfx.playClick();
  }
}

function closeStickerDrawer() {
  const drawer = document.getElementById('stickerDrawer');
  if (drawer) {
    drawer.style.display = 'none';
  }
}

// ============================================================================
// CONFETTI & EMOJI BURST ANIMATION
// ============================================================================
function triggerConfettiBurst(originX, originY, emoji = '✨') {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  const count = 14;
  const emojis = [emoji, '✨', '⚡', '🌟', '💫', '🌿'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'floating-confetti';
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    const xOffset = (Math.random() - 0.5) * 180;
    el.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}px`);

    el.style.left = `${(originX || window.innerWidth / 2) + xOffset}px`;
    el.style.top = `${(originY || window.innerHeight / 2)}px`;
    el.style.animationDelay = `${Math.random() * 0.15}s`;

    container.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1600);
  }
}

// ============================================================================
// DATA PRIVACY: CLIENT-SIDE PII MASKING
// ============================================================================
function applyPiiProtection(inputText) {
  if (!state.piiMaskingActive) return { text: inputText, detected: false };

  let detected = false;
  let masked = inputText;

  // Mask Emails
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  if (emailRegex.test(masked)) {
    detected = true;
    masked = masked.replace(emailRegex, '[EMAIL_REDACTED_FOR_PRIVACY]');
  }

  // Mask 13-19 digit card numbers (hyphen/space-separated)
  const cardRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
  if (cardRegex.test(masked)) {
    detected = true;
    masked = masked.replace(cardRegex, '[CARD_NUMBER_REDACTED]');
  }

  // Mask Phone Numbers (US/International standard)
  const phoneRegex = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  if (phoneRegex.test(masked)) {
    detected = true;
    masked = masked.replace(phoneRegex, '[PHONE_REDACTED]');
  }

  if (detected) {
    showPiiToast();
  }

  return { text: masked, detected };
}

function showPiiToast() {
  const pill = document.getElementById('piiAlertPill');
  if (!pill) return;
  pill.style.display = 'flex';
  setTimeout(() => {
    pill.style.display = 'none';
  }, 4000);
}

// ============================================================================
// MARKDOWN PARSER (Clean, Safe & Fast Vanilla Parser)
// ============================================================================
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseMarkdown(md) {
  if (!md) return '';

  let html = md;

  // Code blocks ```code```
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><div class="code-header"><span class="lang-tag">${escapeHtml(lang || 'code')}</span><button class="copy-code-btn" onclick="copyCodeSnippet(this)">Copy</button></div><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h3>$1</h3>');

  // Bold & Italics
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Unordered list items
  html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Line breaks & paragraphs
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map((p) => {
      p = p.trim();
      if (!p) return '';
      if (
        p.startsWith('<pre') ||
        p.startsWith('<h') ||
        p.startsWith('<ul') ||
        p.startsWith('<blockquote')
      ) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');

  return html;
}

window.copyCodeSnippet = function (btn) {
  const pre = btn.closest('pre');
  if (!pre) return;
  const code = pre.querySelector('code');
  if (!code) return;
  navigator.clipboard.writeText(code.innerText).then(() => {
    const originalText = btn.innerText;
    btn.innerText = 'Copied!';
    sfx.playClick();
    setTimeout(() => {
      btn.innerText = originalText;
    }, 2000);
  });
};

// ============================================================================
// SYSTEM PROMPT ENGINE (Grounding, Modes & Guardrails)
// ============================================================================
function generateSystemPrompt() {
  const language = state.language;
  const mode = state.mode;

  let modeInstruction = '';
  switch (mode) {
    case 'support':
      modeInstruction =
        'Act as an empathetic Senior Customer Support & Technical Specialist. Provide clear, step-by-step diagnostic checklists and solutions. If an issue is beyond automated access or requires confidential billing credentials, proactively suggest transferring to a Human Support Specialist.';
      break;
    case 'faq':
      modeInstruction =
        'Act as a Fast FAQ Engine. Keep replies direct, concise, and structured with clean bullet points. Eliminate filler words.';
      break;
    case 'creative':
      modeInstruction =
        'Act as a creative co-pilot. Use vivid analogies, inspiring ideas, and expressive phrasing while remaining structured and practical.';
      break;
    default:
      modeInstruction =
        'Act as an intelligent, sharp, and helpful engineering and general assistant ready for open-ended queries, clean code, and deep problem-solving.';
      break;
  }

  let guardrailInstruction = '';
  if (state.guardrailsActive) {
    guardrailInstruction = `
GUARDRAIL & FACTUALITY BOUNDARIES (STRICTLY ENFORCED):
- Always provide verifiable, grounded facts.
- Explicitly state when you do not possess real-time information or if an estimate is provided.
- Do NOT hallucinate facts, make up fake citations, or pretend to access private personal databases.
- If a user mentions feelings of extreme frustration or asks to talk with a person, remind them they can click "Human Agent".
- Refuse requests promoting hate speech, self-harm, cyberattacks, or sensitive PII extraction.
`;
  }

  return `You are AetherAI, an enterprise neural AI assistant powered by Groq.
You are communicating with the user in ${language}.

${modeInstruction}

${guardrailInstruction}

FORMATTING GUIDELINES:
- Use clean GitHub-flavored markdown (bolding, lists, code blocks with language identifiers).
- Be crisp, polite, and transparent about being an AI.
`;
}

// ============================================================================
// CHAT RENDERING & MESSAGE FLOW
// ============================================================================
function hideWelcomeHero() {
  const hero = document.getElementById('welcomeHero');
  if (hero) hero.style.display = 'none';
}

function scrollToBottom() {
  const container = document.getElementById('messagesContainer');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function createMessageElement(msg) {
  const row = document.createElement('div');
  row.className = `message-row ${msg.role}`;
  row.dataset.id = msg.id;

  const isUser = msg.role === 'user';
  const isAgent = msg.role === 'agent';

  let avatarText = isUser ? '👤' : isAgent ? '👩‍💼' : '🤖';
  let authorName = isUser ? 'You' : isAgent ? 'Sarah Jenkins (Support)' : 'AetherAI';

  let guardrailBadge = '';
  if (!isUser && !isAgent && state.guardrailsActive) {
    guardrailBadge = '<span class="meta-badge guardrail">🛡️ Grounded Guardrail</span>';
  }

  let contentHtml = '';

  // Sticker Message
  if (msg.isSticker) {
    contentHtml = `
      <div class="sticker-message-card">
        <span class="sticker-emoji-large ${msg.sticker.anim || 'anim-bounce'}">${msg.sticker.icon}</span>
        <span class="sticker-caption">${escapeHtml(msg.sticker.title)}: ${escapeHtml(msg.sticker.caption)}</span>
      </div>
    `;
  } else {
    // Normal / Reasoning Message
    let reasoningBlock = '';
    if (msg.reasoning && msg.reasoning.trim()) {
      reasoningBlock = `
        <div class="reasoning-box">
          <div class="reasoning-toggle" onclick="toggleReasoning(this)">
            <span>🧠 Thought Process & Analysis (${msg.reasoning.length} chars)</span>
            <span>▼</span>
          </div>
          <div class="reasoning-content">${escapeHtml(msg.reasoning)}</div>
        </div>
      `;
    }

    contentHtml = `${reasoningBlock}<div class="bubble-body">${parseMarkdown(msg.content)}</div>`;
  }

  row.innerHTML = `
    <div class="message-avatar">${avatarText}</div>
    <div class="message-content-wrap">
      <div class="message-header-meta">
        <span class="meta-author">${authorName}</span>
        <span class="meta-time">${msg.timestamp || 'Just now'}</span>
        ${guardrailBadge}
      </div>
      <div class="message-bubble">
        ${contentHtml}
      </div>
      ${
        !isUser
          ? `
        <div class="message-action-bar">
          <button class="action-chip-btn" onclick="copyMessageText('${msg.id}')" title="Copy text">📋 Copy</button>
          <button class="action-chip-btn" onclick="speakMessageText('${msg.id}')" title="Read aloud">🔊 Listen</button>
          <div class="reaction-group">
            <button class="reaction-btn" onclick="reactToMessage(event, '👍')" title="Helpful">👍</button>
            <button class="reaction-btn" onclick="reactToMessage(event, '❤️')" title="Love it">❤️</button>
            <button class="reaction-btn" onclick="reactToMessage(event, '💡')" title="Insightful">💡</button>
            <button class="reaction-btn" onclick="triggerHandoffFromFeedback()" title="Not helpful / Needs human agent">👎</button>
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;

  return row;
}

window.toggleReasoning = function (btn) {
  const box = btn.closest('.reasoning-box');
  if (box) {
    box.classList.toggle('open');
    sfx.playClick();
  }
};

window.copyMessageText = function (msgId) {
  const msg = state.messages.find((m) => m.id === msgId);
  if (!msg) return;
  navigator.clipboard.writeText(msg.content).then(() => {
    sfx.playClick();
    triggerConfettiBurst(event.clientX, event.clientY, '📋');
  });
};

window.speakMessageText = function (msgId) {
  const msg = state.messages.find((m) => m.id === msgId);
  if (!msg || !state.speechSynth) return;

  if (state.speechSynth.speaking) {
    state.speechSynth.cancel();
    return;
  }

  const plainText = msg.content.replace(/<[^>]+>/g, '').replace(/[#*`_~]/g, '');
  const utterance = new SpeechSynthesisUtterance(plainText);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  state.activeSpeechUtterance = utterance;
  state.speechSynth.speak(utterance);
  sfx.playClick();
};

window.reactToMessage = function (event, emoji) {
  sfx.playPop();
  triggerConfettiBurst(event.clientX, event.clientY, emoji);
};

window.triggerHandoffFromFeedback = function () {
  sfx.playClick();
  openHandoffModal('User marked response as unhelpful or requires escalation.');
};

// ============================================================================
// STICKER MESSAGE FLOW
// ============================================================================
function sendStickerMessage(sticker) {
  hideWelcomeHero();
  sfx.playPop();

  const userMsg = {
    id: 'msg_' + Date.now(),
    role: 'user',
    isSticker: true,
    sticker: sticker,
    content: `[Sticker: ${sticker.title}]`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  state.messages.push(userMsg);
  const list = document.getElementById('messagesList');
  if (list) {
    list.appendChild(createMessageElement(userMsg));
    scrollToBottom();
  }

  triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7, sticker.icon);

  setTimeout(() => {
    simulateBotStickerReply(sticker);
  }, 750);
}

function simulateBotStickerReply(sticker) {
  const botReplies = [
    { icon: '🤩', text: `Loved the **${sticker.title}** sticker! Vibrations in the workspace are elevated.` },
    { icon: '🚀', text: `Powering forward with that **${sticker.title}** energy!` },
    { icon: '⚡', text: `Synchronized on that **${sticker.title}** vibe. What's next on our agenda?` },
    { icon: '✨', text: `Awesome choice! Ready whenever you are for your next query or prompt.` }
  ];

  const pick = botReplies[Math.floor(Math.random() * botReplies.length)];

  const botMsg = {
    id: 'msg_' + Date.now(),
    role: 'bot',
    isSticker: false,
    content: `${pick.icon} ${pick.text}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  state.messages.push(botMsg);
  const list = document.getElementById('messagesList');
  if (list) {
    list.appendChild(createMessageElement(botMsg));
    scrollToBottom();
    sfx.playReceive();
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.65, pick.icon);
  }
}

// ============================================================================
// GROQ STREAMING API ENGINE
// ============================================================================
async function sendMessage(rawText) {
  if (!rawText || !rawText.trim() || state.isGenerating) return;

  hideWelcomeHero();
  sfx.playSend();

  // 1. Data Privacy & Security Check: Client-side PII Masking
  const { text: cleanText, detected: piiDetected } = applyPiiProtection(rawText.trim());

  // 2. Frustration & Human Escalation Detection Check
  const frustrationKeywords = [
    'talk to human',
    'human agent',
    'real person',
    'frustrated',
    'bad bot',
    'useless',
    'customer service representative',
    'speak with manager',
    'agent please'
  ];
  const containsFrustration = frustrationKeywords.some((keyword) =>
    cleanText.toLowerCase().includes(keyword)
  );

  // 3. Append User Message
  const userMsg = {
    id: 'msg_' + Date.now(),
    role: 'user',
    content: cleanText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  state.messages.push(userMsg);
  const list = document.getElementById('messagesList');
  if (list) {
    list.appendChild(createMessageElement(userMsg));
    scrollToBottom();
  }

  // Clear input textarea
  const textarea = document.getElementById('chatTextarea');
  if (textarea) {
    textarea.value = '';
    textarea.style.height = 'auto';
  }
  updateCharCounter();

  // If user explicitly asks for human, immediately trigger handoff modal flow!
  if (containsFrustration) {
    setTimeout(() => {
      openHandoffModal(`Detected user request: "${cleanText}"`);
    }, 600);
    return;
  }

  // Check if API Key is set
  if (!state.apiKey) {
    const keyPrompt = prompt('Please enter your Groq API Key (starts with gsk_):');
    if (keyPrompt && keyPrompt.trim()) {
      state.apiKey = keyPrompt.trim();
      localStorage.setItem('aetherai_api_key', state.apiKey);
      const keyInput = document.getElementById('apiKeyInput');
      if (keyInput) keyInput.value = state.apiKey;
    } else {
      const errRow = createMessageElement({
        id: 'msg_' + Date.now(),
        role: 'bot',
        content: '⚠️ **API Key Required:** Please configure your Groq API Key in the sidebar settings (🔑 API Key & Config) to chat with AetherAI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      list.appendChild(errRow);
      scrollToBottom();
      return;
    }
  }

  // 4. Prepare Bot Message Placeholder & Show Typing Indicator
  showTypingIndicator();
  state.isGenerating = true;

  const botMsgId = 'msg_' + Date.now();
  const botMsg = {
    id: botMsgId,
    role: 'bot',
    content: '',
    reasoning: '',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Build message history for Groq API
  const apiMessages = [
    { role: 'system', content: generateSystemPrompt() }
  ];

  const recentHistory = state.messages
    .filter((m) => !m.isSticker && (m.role === 'user' || m.role === 'bot'))
    .slice(-8);

  for (const m of recentHistory) {
    apiMessages.push({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    });
  }

  try {
    const response = await fetch(CONFIG.groqEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.apiKey.trim()}`
      },
      body: JSON.stringify({
        model: state.model,
        messages: apiMessages,
        temperature: state.mode === 'creative' ? 0.75 : 0.35,
        stream: true
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `API error (${response.status})`);
    }

    hideTypingIndicator();

    const botRow = createMessageElement(botMsg);
    list.appendChild(botRow);
    state.messages.push(botMsg);

    const bubbleBody = botRow.querySelector('.bubble-body');
    const bubble = botRow.querySelector('.message-bubble');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        if (trimmed === 'data: [DONE]') continue;

        try {
          const json = JSON.parse(trimmed.slice(6));
          const delta = json.choices?.[0]?.delta;

          if (delta) {
            // Deep Reasoning stream
            if (delta.reasoning) {
              botMsg.reasoning += delta.reasoning;
              let rBox = bubble.querySelector('.reasoning-box');
              if (!rBox) {
                rBox = document.createElement('div');
                rBox.className = 'reasoning-box';
                rBox.innerHTML = `
                  <div class="reasoning-toggle" onclick="toggleReasoning(this)">
                    <span>🧠 Thought Process & Analysis</span>
                    <span>▼</span>
                  </div>
                  <div class="reasoning-content"></div>
                `;
                bubble.insertBefore(rBox, bubbleBody);
              }
              const rContent = rBox.querySelector('.reasoning-content');
              if (rContent) rContent.innerText = botMsg.reasoning;
            }

            // Standard Content stream
            if (delta.content) {
              botMsg.content += delta.content;
              bubbleBody.innerHTML = parseMarkdown(botMsg.content);
              scrollToBottom();
            }
          }
        } catch (e) {
          // SSE non-critical JSON line parse
        }
      }
    }

    sfx.playReceive();
    saveChatToStorage();
  } catch (err) {
    console.error('Groq API Error:', err);
    hideTypingIndicator();

    botMsg.content = `⚠️ **Connection Error:** ${err.message}\n\nPlease check your Groq API key in the sidebar settings or switch models. If this issue persists, you can also transfer to a live human agent via the header button.`;
    const errRow = createMessageElement(botMsg);
    list.appendChild(errRow);
    state.messages.push(botMsg);
    scrollToBottom();
  } finally {
    state.isGenerating = false;
  }
}

function showTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.style.display = 'flex';
    scrollToBottom();
  }
}

function hideTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.style.display = 'none';
  }
}

// ============================================================================
// HUMAN HANDOFF ENGINE (Simulation, Ticketing & Context Transfer)
// ============================================================================
function openHandoffModal(reasonSummary = 'User requested specialist support') {
  const modal = document.getElementById('handoffModal');
  if (!modal) return;

  sfx.playHandoffChime();
  modal.style.display = 'flex';

  const connectingState = document.getElementById('handoffConnectingState');
  const connectedState = document.getElementById('handoffConnectedState');
  const ticketMeta = document.getElementById('ticketMetaInfo');
  const progressFill = document.getElementById('handoffProgressFill');
  const summaryBox = document.getElementById('handoffContextSummary');

  if (summaryBox) {
    summaryBox.innerText = `Context: ${reasonSummary}`;
  }

  if (connectingState) connectingState.style.display = 'flex';
  if (connectedState) connectedState.style.display = 'none';
  if (ticketMeta) ticketMeta.style.display = 'none';
  if (progressFill) progressFill.style.width = '0%';

  setTimeout(() => {
    if (progressFill) progressFill.style.width = '100%';
  }, 100);

  setTimeout(() => {
    if (connectingState) connectingState.style.display = 'none';
    if (connectedState) connectedState.style.display = 'flex';
    if (ticketMeta) ticketMeta.style.display = 'flex';
    sfx.playReceive();
  }, 2200);
}

function closeHandoffModal() {
  const modal = document.getElementById('handoffModal');
  if (modal) {
    modal.style.display = 'none';
    sfx.playClick();
  }
}

function confirmHumanTransfer() {
  closeHandoffModal();

  const ticketId = '#TK-' + Math.floor(1000 + Math.random() * 9000) + '-HUMAN';
  const agentMsg = {
    id: 'msg_' + Date.now(),
    role: 'agent',
    content: `👋 **Sarah Jenkins has joined the chat** (Ticket ${ticketId})\n\n"Hi there! I've reviewed your conversation transcript and active context. I am taking over from the automated assistant. How can I assist you with resolving this today?"`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  state.messages.push(agentMsg);
  const list = document.getElementById('messagesList');
  if (list) {
    list.appendChild(createMessageElement(agentMsg));
    scrollToBottom();
    sfx.playReceive();
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, '🤝');
  }
}

// ============================================================================
// VOICE INPUT (SPEECH-TO-TEXT)
// ============================================================================
function setupVoiceInput() {
  const voiceBtn = document.getElementById('voiceInputBtn');
  const textarea = document.getElementById('chatTextarea');
  if (!voiceBtn || !textarea) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    voiceBtn.title = 'Speech recognition not supported in this browser';
    voiceBtn.style.opacity = '0.5';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onstart = () => {
    state.isRecording = true;
    voiceBtn.classList.add('recording');
    sfx.playClick();
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    textarea.value = transcript;
    updateCharCounter();
  };

  recognition.onerror = () => {
    state.isRecording = false;
    voiceBtn.classList.remove('recording');
  };

  recognition.onend = () => {
    state.isRecording = false;
    voiceBtn.classList.remove('recording');
  };

  voiceBtn.addEventListener('click', () => {
    if (state.isRecording) {
      recognition.stop();
    } else {
      recognition.lang = state.language === 'Spanish' ? 'es-ES' : state.language === 'French' ? 'fr-FR' : 'en-US';
      recognition.start();
    }
  });
}

// ============================================================================
// LOCAL STORAGE PERSISTENCE & EXPORT
// ============================================================================
function saveChatToStorage() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.messages));
  } catch (e) {
    console.warn('Storage quota exceeded');
  }
}

function loadChatFromStorage() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.messages = parsed;
        hideWelcomeHero();
        const list = document.getElementById('messagesList');
        if (list) {
          list.innerHTML = '';
          state.messages.forEach((msg) => {
            list.appendChild(createMessageElement(msg));
          });
          scrollToBottom();
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load storage history', e);
  }
}

function clearChatHistory() {
  if (confirm('Are you sure you want to clear your conversation transcript?')) {
    state.messages = [];
    localStorage.removeItem(CONFIG.storageKey);
    const list = document.getElementById('messagesList');
    if (list) list.innerHTML = '';
    const hero = document.getElementById('welcomeHero');
    if (hero) hero.style.display = 'flex';
    sfx.playClick();
  }
}

function exportChatTranscript() {
  if (state.messages.length === 0) {
    alert('No conversation history to export.');
    return;
  }

  let text = `# AetherAI Conversation Transcript\nGenerated: ${new Date().toLocaleString()}\nGuardrails: ${state.guardrailsActive ? 'Active' : 'Disabled'}\nModel: ${state.model}\n\n`;

  state.messages.forEach((m) => {
    text += `### [${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n\n`;
  });

  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AetherAI_Transcript_${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
  sfx.playClick();
}

// ============================================================================
// THEME SWITCHER
// ============================================================================
function cycleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'dark';
  let next = 'dark';
  let icon = '🌙';

  if (current === 'dark') {
    next = 'cyber';
    icon = '⚡';
  } else if (current === 'cyber') {
    next = 'light';
    icon = '☀️';
  } else {
    next = 'dark';
    icon = '🌙';
  }

  html.setAttribute('data-theme', next);
  state.theme = next;
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) themeIcon.innerText = icon;
  sfx.playClick();
}

// ============================================================================
// INPUT AUTO-RESIZE & CHAR COUNTER
// ============================================================================
function updateCharCounter() {
  const textarea = document.getElementById('chatTextarea');
  const counter = document.getElementById('charCounter');
  if (textarea && counter) {
    counter.innerText = `${textarea.value.length}/2000`;
  }
}

function setupInputAutoResize() {
  const textarea = document.getElementById('chatTextarea');
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
    updateCharCounter();
  });

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(textarea.value);
    }
  });
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================
function attachEventListeners() {
  // Sidebar Toggle (Mobile / Tablet)
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sfx.playClick();
    });
  }

  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sfx.playClick();
    });
  }

  // Send Button
  const sendBtn = document.getElementById('sendMessageBtn');
  const textarea = document.getElementById('chatTextarea');
  if (sendBtn && textarea) {
    sendBtn.addEventListener('click', () => {
      sendMessage(textarea.value);
    });
  }

  // Interactive Avatar Poking
  const avatar = document.getElementById('avatarInteract');
  if (avatar) {
    avatar.addEventListener('click', (e) => {
      sfx.playPop();
      triggerConfettiBurst(e.clientX, e.clientY, '🤖');
    });
  }

  // Mode Selection Buttons
  const modeCards = document.querySelectorAll('.mode-card');
  modeCards.forEach((card) => {
    card.addEventListener('click', () => {
      modeCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      state.mode = card.dataset.mode;
      sfx.playClick();
    });
  });

  // Guardrails Toggle
  const guardrailsToggle = document.getElementById('guardrailsToggle');
  if (guardrailsToggle) {
    guardrailsToggle.addEventListener('change', (e) => {
      state.guardrailsActive = e.target.checked;
      sfx.playClick();
    });
  }

  // PII Toggle
  const piiToggle = document.getElementById('piiToggle');
  if (piiToggle) {
    piiToggle.addEventListener('change', (e) => {
      state.piiMaskingActive = e.target.checked;
      sfx.playClick();
    });
  }

  // Sound Toggle
  const soundToggle = document.getElementById('soundToggle');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');

  function updateAudioState(enabled) {
    state.soundActive = enabled;
    if (soundToggle) soundToggle.checked = enabled;
    if (audioIcon) audioIcon.innerText = enabled ? '🔊' : '🔇';
    sfx.playClick();
  }

  if (soundToggle) {
    soundToggle.addEventListener('change', (e) => updateAudioState(e.target.checked));
  }
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => updateAudioState(!state.soundActive));
  }

  // Model & Language Selects
  const modelSelect = document.getElementById('modelSelect');
  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      state.model = e.target.value;
      sfx.playClick();
    });
  }

  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      state.language = e.target.value;
      sfx.playClick();
    });
  }

  // Human Handoff Triggers
  const topHandoffBtn = document.getElementById('topHandoffBtn');
  const sidebarHandoffBtn = document.getElementById('sidebarHandoffBtn');
  const closeHandoffModalBtn = document.getElementById('closeHandoffModalBtn');
  const cancelHandoffBtn = document.getElementById('cancelHandoffBtn');
  const confirmTransferBtn = document.getElementById('confirmTransferBtn');

  if (topHandoffBtn) {
    topHandoffBtn.addEventListener('click', () => openHandoffModal('User clicked header handoff button'));
  }
  if (sidebarHandoffBtn) {
    sidebarHandoffBtn.addEventListener('click', () => openHandoffModal('User clicked sidebar handoff CTA'));
  }
  if (closeHandoffModalBtn) {
    closeHandoffModalBtn.addEventListener('click', closeHandoffModal);
  }
  if (cancelHandoffBtn) {
    cancelHandoffBtn.addEventListener('click', closeHandoffModal);
  }
  if (confirmTransferBtn) {
    confirmTransferBtn.addEventListener('click', confirmHumanTransfer);
  }

  // Stickers Toggle & Tabs
  const stickerToggleBtn = document.getElementById('stickerToggleBtn');
  const inputStickerBtn = document.getElementById('inputStickerBtn');
  const closeStickerDrawerBtn = document.getElementById('closeStickerDrawerBtn');

  if (stickerToggleBtn) stickerToggleBtn.addEventListener('click', openStickerDrawer);
  if (inputStickerBtn) inputStickerBtn.addEventListener('click', openStickerDrawer);
  if (closeStickerDrawerBtn) closeStickerDrawerBtn.addEventListener('click', closeStickerDrawer);

  const stickerTabBtns = document.querySelectorAll('.sticker-tab-btn');
  stickerTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      stickerTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderStickerTray(btn.dataset.tab);
      sfx.playClick();
    });
  });

  // Prompt Chips
  const promptChips = document.querySelectorAll('.chip');
  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      if (prompt) {
        sendMessage(prompt);
      }
    });
  });

  // Dismiss Banner
  const dismissBannerBtn = document.getElementById('dismissBannerBtn');
  const banner = document.getElementById('transparencyBanner');
  if (dismissBannerBtn && banner) {
    dismissBannerBtn.addEventListener('click', () => {
      banner.style.display = 'none';
      sfx.playClick();
    });
  }

  // Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', cycleTheme);
  }

  // API Key Save & Visibility
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveKeyBtn = document.getElementById('saveKeyBtn');
  const toggleKeyVisibility = document.getElementById('toggleKeyVisibility');

  if (saveKeyBtn && apiKeyInput) {
    saveKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        state.apiKey = key;
        localStorage.setItem('aetherai_api_key', key);
        alert('Groq API Key updated successfully!');
        sfx.playClick();
      }
    });
  }

  if (toggleKeyVisibility && apiKeyInput) {
    toggleKeyVisibility.addEventListener('click', () => {
      apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
      sfx.playClick();
    });
  }

  // Clear & Export Chat History
  const clearChatBtn = document.getElementById('clearChatBtn');
  if (clearChatBtn) clearChatBtn.addEventListener('click', clearChatHistory);

  const exportChatBtn = document.getElementById('exportChatBtn');
  if (exportChatBtn) exportChatBtn.addEventListener('click', exportChatTranscript);
}

// ============================================================================
// APP ENTRY POINT
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  setupAvatarEyeTracking();
  renderStickerTray('bots');
  setupInputAutoResize();
  setupVoiceInput();
  attachEventListeners();
  loadChatFromStorage();

  const apiKeyInput = document.getElementById('apiKeyInput');
  if (apiKeyInput && state.apiKey) {
    apiKeyInput.value = state.apiKey;
  }
});

/**
 * ==============================================================================
 * ANTIGRAVITY FULL-STACK CLIENT ENGINE
 * Abinesh S - Data Analyst Portfolio & Telemetry Tracker
 * Academic Mini-Project
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Anonymous Visitor Telemetry & Clickstream Tracker
  initTelemetryTracker();

  // 2. Fetch Dynamic Content from SQLite & Hydrate DOM
  await hydrateDynamicPortfolio();

  // 3. Interactive Typing Animation
  initTypingEffect();

  // 4. Antigravity 3D Tilt for Glass Cards
  initTiltEffect();

  // 5. Scroll Reveal via IntersectionObserver
  initScrollReveal();

  // 6. Language & Skill Progress Bars
  initProgressBars();

  // 7. Modals & Interactive Project Consoles
  initModals();

  // 8. Secure Contact Form Submission
  initContactForm();

  // 9. Navigation & Mobile Menu
  initNavigation();
});

/* --------------------------------------------------------------------------
 * 1. VISITOR TELEMETRY & CLICKSTREAM TRACKER
 * Collects engagement metrics for the Data Analyst Admin Dashboard
 * -------------------------------------------------------------------------- */
let currentSessionId = '';
let sessionStartTime = Date.now();
let maxScrollPercentage = 0;

function initTelemetryTracker() {
  // Generate or retrieve session ID
  currentSessionId = sessionStorage.getItem('orbit_session_id');
  if (!currentSessionId) {
    currentSessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    sessionStorage.setItem('orbit_session_id', currentSessionId);
  }

  // Track max scroll depth
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const scrollPct = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
      if (scrollPct > maxScrollPercentage) {
        maxScrollPercentage = scrollPct;
      }
    }
  }, { passive: true });

  // Initial Beacon / Handshake
  sendTelemetryBeacon();

  // Heartbeat every 15 seconds to update duration and scroll depth
  setInterval(sendTelemetryBeacon, 15000);

  // Send final beacon on page hide / unload
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendTelemetryBeacon();
    }
  });
}

function sendTelemetryBeacon() {
  const timeSpentSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

  const payload = {
    session_id: currentSessionId,
    time_spent_seconds: timeSpentSeconds,
    max_scroll_depth: maxScrollPercentage,
    timezone: timezone,
    referrer: document.referrer || 'Direct',
    city: 'Pollachi/Coimbatore',
    region: 'Tamil Nadu',
    country: 'India'
  };

  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon('/api/analytics/track', blob);
  } else {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }
}

// Log discrete interaction events (e.g. project clicks, modal triggers)
function trackVisitorEvent(eventType, eventTarget, metadata = {}) {
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: currentSessionId,
      event_type: eventType,
      event_target: eventTarget,
      metadata: metadata
    })
  }).catch(() => {});
}

/* --------------------------------------------------------------------------
 * 2. DYNAMIC CONTENT MANAGEMENT (Database-Driven UI)
 * Fetches skills, projects, certificates, education from SQLite Flask API
 * -------------------------------------------------------------------------- */
let portfolioDataStore = null;

async function hydrateDynamicPortfolio() {
  try {
    const response = await fetch('/api/portfolio');
    const result = await response.json();

    if (!result.success || !result.data) {
      console.warn('API returned unexpected format, utilizing fallback.');
      return;
    }

    portfolioDataStore = result.data;

    // Render Skills Galaxy
    renderSkillsGalaxy(result.data.skills);

    // Render Projects Showcase
    renderProjectsShowcase(result.data.projects);

    // Render Certificates
    renderCertificatesGrid(result.data.certificates);

    // Render Education & Languages
    renderEducationTimeline(result.data.education);
    renderLanguages(result.data.languages);

  } catch (err) {
    console.error('Failed to hydrate portfolio from Flask API:', err);
  }
}

function renderSkillsGalaxy(skills) {
  const container = document.getElementById('skills-container');
  if (!container || !skills) return;

  const animationDelays = [100, 200, 300, 400, 500];
  const floatClasses = ['float-element-slow', 'float-element-medium', 'float-element-fast', 'float-element-slow', 'float-element-medium'];

  container.innerHTML = skills.map((skill, idx) => {
    const isWide = idx === 4 ? 'sm:col-span-2 lg:col-span-2' : '';
    const delay = animationDelays[idx % animationDelays.length];
    const floatClass = floatClasses[idx % floatClasses.length];

    // Neon colors based on skill index
    const neonBorders = ['border-cyan-400/30', 'border-purple-400/30', 'border-emerald-400/30', 'border-amber-400/30', 'border-pink-400/30'];
    const neonTexts = ['text-cyan-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400', 'text-pink-400'];
    const neonBorder = neonBorders[idx % neonBorders.length];
    const neonText = neonTexts[idx % neonTexts.length];

    return `
      <div class="glass-panel rounded-2xl p-6 tilt-card reveal-on-scroll delay-${delay} ${floatClass} constellation-node group ${isWide}">
        <div class="tilt-inner space-y-4">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-xl bg-slate-900/80 border ${neonBorder} flex items-center justify-center ${neonText} text-2xl group-hover:scale-110 transition duration-300">
              <i class="${skill.icon}"></i>
            </div>
            <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900/80 ${neonText} border ${neonBorder}">
              ${skill.badge}
            </span>
          </div>
          <div>
            <h3 class="text-xl font-heading font-bold text-white group-hover:${neonText} transition">${skill.name}</h3>
            <p class="text-xs text-slate-400 mt-1">${skill.category}</p>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${skill.description}</p>
          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span class="text-slate-400">${skill.highlight}</span>
            <span class="${neonText} font-bold">${skill.level_percent}%</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderProjectsShowcase(projects) {
  const container = document.getElementById('projects-container');
  if (!container || !projects) return;

  container.innerHTML = projects.map((project, idx) => {
    const isCyanTheme = idx % 2 === 0;
    const accentColor = isCyanTheme ? 'cyan' : 'purple';
    const floatClass = isCyanTheme ? 'float-element-slow' : 'float-element-medium';

    const tagsHtml = project.tags.map(t => 
      `<span class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/80 border border-slate-800 text-${accentColor}-300">${t}</span>`
    ).join('');

    const metricsHtml = Object.entries(project.metrics).map(([key, val]) => `
      <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <span class="text-[10px] text-slate-400 font-mono block uppercase">${key}</span>
        <span class="text-base font-bold text-${accentColor}-400 font-heading">${val}</span>
      </div>
    `).join('');

    return `
      <div class="glass-panel rounded-3xl p-7 sm:p-8 relative tilt-card reveal-on-scroll delay-${(idx + 1) * 100} ${floatClass} flex flex-col justify-between group" data-project-id="${project.id}">
        <div class="tilt-inner space-y-6">
          <div class="flex items-center justify-between gap-2">
            <span class="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-${accentColor}-500/20 text-${accentColor}-300 border border-${accentColor}-400/30">
              ${project.category_badge}
            </span>
            <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>${project.status_label}</span>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-heading font-bold text-white group-hover:text-${accentColor}-400 transition">
              ${project.title}
            </h3>
            <p class="text-xs font-mono text-${accentColor}-400/90 mt-1 uppercase tracking-wider">
              ${project.subtitle}
            </p>
          </div>

          <p class="text-slate-300 text-sm leading-relaxed">${project.description}</p>

          <div class="flex flex-wrap gap-2">${tagsHtml}</div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
            ${metricsHtml}
          </div>
        </div>

        <div class="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
          <button data-project-trigger="${project.id}" class="px-5 py-2.5 rounded-xl text-xs font-semibold ${isCyanTheme ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950' : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'} font-heading hover:shadow-lg transition flex items-center gap-2">
            <i class="fas ${isCyanTheme ? 'fa-play' : 'fa-stethoscope'} text-[10px]"></i>
            <span>${isCyanTheme ? 'Launch Interactive Console' : 'Inspect Architecture'}</span>
          </button>
          <span class="text-xs font-mono text-slate-400 flex items-center gap-1">
            <i class="fas fa-cube text-${accentColor}-400"></i> Zero-G Active
          </span>
        </div>
      </div>
    `;
  }).join('');
}

function renderCertificatesGrid(certificates) {
  const container = document.getElementById('certificates-container');
  if (!container || !certificates) return;

  const floatClasses = ['float-element-slow', 'float-element-medium', 'float-element-fast', 'float-element-slow'];

  container.innerHTML = certificates.map((cert, idx) => {
    const floatClass = floatClasses[idx % floatClasses.length];
    return `
      <div class="certificate-frame rounded-2xl p-6 cursor-pointer reveal-on-scroll delay-${(idx + 1) * 100} ${floatClass} group"
           data-cert-title="${cert.title}"
           data-cert-issuer="${cert.issuer}"
           data-cert-id="${cert.credential_id}"
           data-cert-category="${cert.category}">
        <div class="relative z-10 space-y-4">
          <div class="w-12 h-12 rounded-xl bg-slate-900/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 text-2xl group-hover:scale-110 transition">
            <i class="${cert.icon}"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">${cert.category}</span>
            <h4 class="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition mt-1">
              ${cert.title}
            </h4>
          </div>
          <p class="text-xs text-slate-400">${cert.skills_covered}</p>
          <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>${cert.credential_id}</span>
            <span class="text-cyan-400 group-hover:underline">Verify <i class="fas fa-arrow-up-right-from-square text-[9px]"></i></span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderEducationTimeline(education) {
  const container = document.getElementById('education-container');
  if (!container || !education) return;

  const borderAccents = ['border-l-cyan-400', 'border-l-purple-500', 'border-l-emerald-400'];
  const textAccents = ['text-cyan-300', 'text-purple-300', 'text-emerald-300'];

  container.innerHTML = education.map((edu, idx) => {
    const border = borderAccents[idx % borderAccents.length];
    const text = textAccents[idx % textAccents.length];

    return `
      <div class="glass-panel rounded-2xl p-6 sm:p-7 relative border-l-4 ${border} tilt-card reveal-on-scroll delay-${(idx + 1) * 100} float-element-slow">
        <div class="tilt-inner">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span class="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-900/80 ${text} border border-slate-800">
              ${edu.badge}
            </span>
            <span class="text-xs font-mono text-slate-400 flex items-center gap-1">
              <i class="fas fa-location-dot"></i> ${edu.location}
            </span>
          </div>
          <h4 class="text-xl font-heading font-bold text-white">${edu.degree}</h4>
          <p class="${text} text-sm font-medium mt-1">${edu.institution}</p>
          <p class="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">${edu.highlights}</p>
        </div>
      </div>
    `;
  }).join('');
}

function renderLanguages(languages) {
  const container = document.getElementById('languages-container');
  if (!container || !languages) return;

  container.innerHTML = languages.map(lang => `
    <div class="space-y-2">
      <div class="flex justify-between items-center text-sm">
        <span class="font-semibold text-white flex items-center gap-2">
          <i class="${lang.icon}"></i> ${lang.name}
        </span>
        <span class="text-xs font-mono text-cyan-300 font-bold">${lang.level_label} • ${lang.proficiency_percent}%</span>
      </div>
      <div class="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-[2px] border border-cyan-500/20">
        <div class="progress-bar-fill progress-bar-glow h-full rounded-full bg-gradient-to-r ${lang.color_gradient}" data-width="${lang.proficiency_percent}%" style="width: 0%"></div>
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
 * 3. TYPING ANIMATION EFFECT
 * -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    "Hello, I am Abinesh S. I am a Data Analyst.",
    "Transforming complex data into predictive intelligence.",
    "Specialized in Python, SQL, PowerBI & Business Statistics."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 55;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 28;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      const pauseDuration = phraseIndex === 0 ? 3500 : 2200;
      isDeleting = true;
      setTimeout(type, pauseDuration);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 500);
}

/* --------------------------------------------------------------------------
 * 4. 3D TILT EFFECT
 * -------------------------------------------------------------------------- */
function initTiltEffect() {
  // Delegate event to support dynamic elements
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.tilt-card');
    if (!card) return;

    let glare = card.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);
    }

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;

    const inner = card.querySelector('.tilt-inner');
    if (inner) {
      inner.style.transform = `translateZ(30px)`;
    }

    glare.style.opacity = '0.35';
    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`;
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.tilt-card');
    if (!card) return;

    // Check if moving outside the card
    const rect = card.getBoundingClientRect();
    if (
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top || e.clientY > rect.bottom
    ) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      const inner = card.querySelector('.tilt-inner');
      if (inner) inner.style.transform = 'translateZ(0px)';
      const glare = card.querySelector('.tilt-glare');
      if (glare) glare.style.opacity = '0';
    }
  });
}

/* --------------------------------------------------------------------------
 * 5. SCROLL REVEAL (IntersectionObserver)
 * -------------------------------------------------------------------------- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe current and dynamic nodes
  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

  // MutationObserver to auto-observe dynamically appended elements
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.classList.contains('reveal-on-scroll')) observer.observe(node);
          node.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
        }
      });
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

/* --------------------------------------------------------------------------
 * 6. ANIMATED PROGRESS BARS
 * -------------------------------------------------------------------------- */
function initProgressBars() {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-width') || '100%';
        entry.target.style.width = targetWidth;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  setTimeout(() => {
    document.querySelectorAll('.progress-bar-fill').forEach(bar => barObserver.observe(bar));
  }, 400);
}

/* --------------------------------------------------------------------------
 * 7. MODALS & INTERACTIVE LIVE SIMULATIONS
 * -------------------------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  if (!modalOverlay) return;

  function openModal(title, contentHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
    modalBody.innerHTML = '';
    document.body.style.overflow = 'auto';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Delegated click handler for project buttons & certificates
  document.addEventListener('click', (e) => {
    const projectBtn = e.target.closest('[data-project-trigger]');
    if (projectBtn) {
      const projectId = projectBtn.getAttribute('data-project-trigger');
      trackVisitorEvent('project_click', projectId, { trigger: 'button_click' });

      if (projectId === 'dynamic-pricing-engine') {
        openModal('Dynamic Pricing Engine • Architecture & Simulation', `
          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
              <h4 class="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                <i class="fas fa-microchip"></i> Real-time Elasticity Pipeline
              </h4>
              <p class="text-sm text-slate-300 leading-relaxed">
                Simulates real-time dynamic product pricing based on live inventory levels, competitor pricing, and market demand fluctuations. Built with Python, Scikit-Learn, and Streamlit.
              </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div class="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <span class="text-xs text-slate-400 block">Pricing Latency</span>
                <span class="text-lg font-bold text-cyan-400">&lt; 42ms</span>
              </div>
              <div class="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <span class="text-xs text-slate-400 block">Revenue Uplift</span>
                <span class="text-lg font-bold text-emerald-400">+18.4%</span>
              </div>
              <div class="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <span class="text-xs text-slate-400 block">Model Engine</span>
                <span class="text-lg font-bold text-purple-400">GBDT Regressor</span>
              </div>
              <div class="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <span class="text-xs text-slate-400 block">Inventory State</span>
                <span class="text-lg font-bold text-pink-400">Poisson Burst</span>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <h5 class="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">Live Simulation Console</h5>
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Competitor Benchmark: <span id="comp-price-val" class="text-cyan-400 font-mono">$120</span></span>
                    <span>Inventory Level: <span id="inv-level-val" class="text-cyan-400 font-mono">25 units</span></span>
                  </div>
                  <input type="range" id="sim-inv-slider" min="5" max="100" value="25" class="w-full accent-cyan-400 cursor-pointer">
                </div>
                <div class="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg flex items-center justify-between">
                  <span class="text-xs text-slate-300">Suggested Optimal Price:</span>
                  <span id="opt-price-output" class="text-xl font-bold font-mono text-cyan-300">$138.50</span>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <a href="#contact" onclick="document.getElementById('modal-close').click()" class="px-4 py-2 text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white hover:opacity-90 transition">
                Discuss Project Integration
              </a>
            </div>
          </div>
        `);

        const slider = document.getElementById('sim-inv-slider');
        const invVal = document.getElementById('inv-level-val');
        const optOut = document.getElementById('opt-price-output');
        if (slider && invVal && optOut) {
          slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            invVal.textContent = `${val} units`;
            const calculatedPrice = (120 * (1 + (50 - val) * 0.007)).toFixed(2);
            optOut.textContent = `$${calculatedPrice}`;
          });
        }
      } else if (projectId === 'institutional-health-clinic') {
        openModal('Institutional Health Clinic • Full-Stack Analytics', `
          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30">
              <h4 class="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                <i class="fas fa-hospital-user"></i> Full Lifecycle Clinical Informatics
              </h4>
              <p class="text-sm text-slate-300 leading-relaxed">
                Handles the entire clinical data lifecycle: generating realistic mock data, cleaning inconsistencies with Pandas, structuring a relational SQLite database, building a RESTful API with Flask, and visualizing metrics via an interactive JavaScript/Chart.js frontend.
              </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div class="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <span class="text-xs text-slate-400 block">Cleaned Patients</span>
                <span class="text-lg font-bold text-purple-400">12,500+</span>
              </div>
              <div class="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <span class="text-xs text-slate-400 block">REST Endpoints</span>
                <span class="text-lg font-bold text-cyan-400">8 Endpoints</span>
              </div>
              <div class="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <span class="text-xs text-slate-400 block">Average Latency</span>
                <span class="text-lg font-bold text-emerald-400">18ms</span>
              </div>
              <div class="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <span class="text-xs text-slate-400 block">Data Pipeline</span>
                <span class="text-lg font-bold text-pink-400">Pandas + SQLite</span>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h5 class="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">ETL & Architectural Pipeline</h5>
              <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                <span class="text-slate-300 font-mono">1. Raw Telemetry Generation</span>
                <span class="text-cyan-400">Synthetics / Mock</span>
              </div>
              <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                <span class="text-slate-300 font-mono">2. Cleansing & Imputation</span>
                <span class="text-cyan-400">Pandas Vectorized Ops</span>
              </div>
              <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                <span class="text-slate-300 font-mono">3. Relational Schema Storage</span>
                <span class="text-cyan-400">SQLite 3NF Schema</span>
              </div>
              <div class="flex items-center justify-between text-xs py-1.5">
                <span class="text-slate-300 font-mono">4. Visualization Dashboard</span>
                <span class="text-cyan-400">Flask API + Chart.js</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <a href="#contact" onclick="document.getElementById('modal-close').click()" class="px-4 py-2 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white hover:opacity-90 transition">
                Request Code Walkthrough
              </a>
            </div>
          </div>
        `);
      }
    }

    const certCard = e.target.closest('[data-cert-title]');
    if (certCard) {
      const title = certCard.getAttribute('data-cert-title');
      const issuer = certCard.getAttribute('data-cert-issuer');
      const id = certCard.getAttribute('data-cert-id');
      const category = certCard.getAttribute('data-cert-category');

      trackVisitorEvent('cert_inspect', id, { title: title });

      openModal('Credential Verification • Document Frame', `
        <div class="text-center space-y-4">
          <div class="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-2xl shadow-lg shadow-cyan-500/20">
            <i class="fas fa-certificate"></i>
          </div>
          <div>
            <span class="text-xs font-mono uppercase tracking-widest text-cyan-400 block">${category}</span>
            <h3 class="text-lg font-bold text-white mt-1">${title}</h3>
            <p class="text-sm text-slate-300 mt-1">${issuer}</p>
          </div>
          <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-left space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Verification ID:</span>
              <span class="text-cyan-300 font-mono font-medium">${id}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Status:</span>
              <span class="text-emerald-400 flex items-center gap-1"><i class="fas fa-check-circle"></i> Verified & Active in SQLite</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Recipient:</span>
              <span class="text-white">Abinesh S</span>
            </div>
          </div>
          <div class="pt-2">
            <button onclick="document.getElementById('modal-close').click()" class="px-5 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition">
              Close Preview
            </button>
          </div>
        </div>
      `);
    }
  });
}

/* --------------------------------------------------------------------------
 * 8. SECURE CONTACT FORM AJAX HANDLER (Flask Backend Endpoint)
 * -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required transmission fields.', 'error');
      return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Encrypting & Transmitting...`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, subject, message,
          session_id: currentSessionId
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(result.message || 'Transmission successfully received!', 'success');
        form.reset();
      } else {
        showToast(result.message || 'Error transmitting message. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Contact transmission error:', err);
      showToast('Network error: Could not connect to Flask backend server.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  function showToast(message, type = 'success') {
    feedback.textContent = message;
    feedback.classList.remove('hidden', 'bg-emerald-500/20', 'border-emerald-500/40', 'text-emerald-300', 'bg-rose-500/20', 'border-rose-500/40', 'text-rose-300');

    if (type === 'success') {
      feedback.classList.add('bg-emerald-500/20', 'border-emerald-500/40', 'text-emerald-300');
    } else {
      feedback.classList.add('bg-rose-500/20', 'border-rose-500/40', 'text-rose-300');
    }

    feedback.classList.remove('hidden');

    setTimeout(() => {
      feedback.classList.add('hidden');
    }, 7000);
  }
}

/* --------------------------------------------------------------------------
 * 9. NAVIGATION & MOBILE MENU
 * -------------------------------------------------------------------------- */
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Active section spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-cyan-400');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-cyan-400');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  }, { passive: true });
}

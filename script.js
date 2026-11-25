document.addEventListener("DOMContentLoaded", () => {

      // 1. Preloader
      const preloader = document.getElementById("preloader");
      const hideLoader = () => { if (preloader.dataset.done) return; preloader.dataset.done = 1; preloader.classList.add("done"); document.body.classList.add("loaded"); setTimeout(() => preloader.style.display = "none", 1000); };
      window.addEventListener("load", () => setTimeout(hideLoader, 700));
      setTimeout(hideLoader, 3000);

      // 2. Typing effect (edit the roles here)
      const typingEl = document.getElementById("typing-text");
      const roles = ["Software Engineer", "Frontend Developer", "Cloud & DevOps Learner"];
      let r = 0, c = 0, del = false;
      (function type() {
        const word = roles[r];
        typingEl.textContent = word.substring(0, c);
        let speed = del ? 40 : 80;
        if (!del && c === word.length) { speed = 1800; del = true; }
        else if (del && c === 0) { del = false; r = (r + 1) % roles.length; speed = 400; }
        else { c += del ? -1 : 1; }
        setTimeout(type, speed);
      })();

      // 3. Dark / light theme (saved in localStorage)
      const html = document.documentElement, icon = document.getElementById("themeIcon");
      const setTheme = (t) => {
        html.setAttribute("data-bs-theme", t);
        icon.className = t === "dark" ? "fa-solid fa-sun text-warning" : "fa-solid fa-moon text-primary";
        try { localStorage.setItem("portfolio-theme", t); } catch (e) {}
      };
      try { setTheme(localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light"); } catch (e) { setTheme("light"); }
      document.getElementById("themeToggle").addEventListener("click", () => setTheme(html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark"));

      // 4. Scroll reveal, active nav link, back to top
      const reveals = document.querySelectorAll(".reveal");
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
      const toTop = document.getElementById("backToTop");
      const menu = document.getElementById("navbarNav");

      function onScroll() {
        const y = window.scrollY;
        reveals.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add("active"); });
        let current = "";
        sections.forEach(s => { if (y >= s.offsetTop - 120) current = s.id; });
        navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
        toTop.classList.toggle("show", y > 400);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
      navLinks.forEach(l => l.addEventListener("click", () => { if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide(); }));

      // 5. Animated stat counters (supports decimals and a suffix)
      const start = new Date(2025, 1, 1);
      const years = Math.floor((Date.now() - start.getTime()) / (365.2425 * 86400000) * 10) / 10;
      document.getElementById("experienceCount").dataset.count = years.toFixed(1);
      let counted = false;
      const about = document.getElementById("about");
      new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting || counted) return;
        counted = true;
        document.querySelectorAll(".stat-number[data-count]").forEach(el => {
          const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
          const decimals = String(el.dataset.count).includes(".") ? 1 : 0;
          let n = 0;
          const timer = setInterval(() => {
            n += target / 40;
            if (n >= target) { n = target; clearInterval(timer); }
            el.textContent = n.toFixed(decimals) + suffix;
          }, 30);
        });
      }, { threshold: 0.3 }).observe(about);

      // 6. Skill bars
      const skills = document.getElementById("skills");
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) document.querySelectorAll(".progress-bar").forEach(b => b.style.width = b.dataset.target);
      }, { threshold: 0.2 }).observe(skills);

      // 7. Project details modal
      const modal = new bootstrap.Modal(document.getElementById("demoModal"));
      document.querySelectorAll(".trigger-demo").forEach(btn => btn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("demoModalTitle").textContent = btn.dataset.title;
        document.getElementById("modalProjectDesc").textContent = btn.dataset.desc;
        document.getElementById("modalPrivacy").hidden = btn.dataset.private !== "true";
        modal.show();
      }));

      // 8. Contact form: validates, then sends the message with EmailJS
      const EMAILJS_PUBLIC_KEY = "JrOAAHpENtKozvdJ9";
      const EMAILJS_SERVICE_ID = "service_tg4ys11";
      const EMAILJS_TEMPLATE_ID = "template_5jh3tw3";
      if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

      const form = document.getElementById("contactForm");
      const sendBtn = document.getElementById("sendBtn");
      const statusEl = document.getElementById("formStatus");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.classList.add("was-validated"); return; }

          if (!window.emailjs) { statusEl.textContent = "Contact service unavailable. Please email me directly."; return; }
          const params = {
          user_name: document.getElementById("name").value,
          user_email: document.getElementById("email").value,
          user_mobile: document.getElementById("mobile").value || "Not provided",
          subject: document.getElementById("subject").value,
          message: document.getElementById("message").value,
          time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
        };
        const btnHTML = sendBtn.innerHTML;
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
        statusEl.textContent = "";

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
          .then(() => {
            statusEl.className = "small mt-3 text-center text-success";
            statusEl.textContent = "Thanks! Your message has been sent.";
            form.reset();
            form.classList.remove("was-validated");
          })
          .catch((err) => {
            console.error("EmailJS error:", err);
            statusEl.className = "small mt-3 text-center text-danger";
            statusEl.textContent = "Error " + (err.status || "") + ": " + (err.text || "Something went wrong. Please try again or email me directly.");
          })
          .finally(() => {
            sendBtn.disabled = false;
            sendBtn.innerHTML = btnHTML;
          });
      });

      // ===== ADVANCED FEATURES =====
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

      // 9. Scroll progress bar
      const bar = document.getElementById("scrollBar");
      window.addEventListener("scroll", () => {
        const d = document.documentElement;
        bar.style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + "%";
      }, { passive: true });

      // 10. Accent color switcher (saved in localStorage)
      const accents = [["#7c3aed", "#6d28d9"], ["#0891b2", "#0e7490"], ["#059669", "#047857"], ["#e11d48", "#be123c"]];
      const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
      let ai = 0;
      try { ai = +localStorage.getItem("portfolio-accent") || 0; } catch (e) {}
      const applyAccent = (i) => {
        const [a, b] = accents[i], s = html.style;
        s.setProperty("--primary-color", a); s.setProperty("--primary-hover", b);
        s.setProperty("--primary-glow", rgba(a, .4)); s.setProperty("--accent-soft", rgba(a, .12));
        try { localStorage.setItem("portfolio-accent", i); } catch (e) {}
      };
      if (!Number.isInteger(ai) || ai < 0 || ai >= accents.length) ai = 0;
      applyAccent(ai);
      document.getElementById("accentToggle").addEventListener("click", () => { ai = (ai + 1) % accents.length; applyAccent(ai); });

      // 11. Cursor glow (desktop only)
      if (fine && !reduce) {
        const g = document.getElementById("cursorGlow");
        window.addEventListener("mousemove", (e) => { g.style.opacity = .25; g.style.left = e.clientX + "px"; g.style.top = e.clientY + "px"; });
      }

      // 12. Hero particle network (pauses when hero is off-screen)
      const cv = document.getElementById("particles"), ctx = cv.getContext("2d");
      let pts = [], W = 0, H = 0, running = true;
      function sizeCanvas() {
        W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
        pts = Array.from({ length: Math.min(60, Math.floor(W / 18)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
      }
      function drawParticles() {
        if (running) {
          ctx.clearRect(0, 0, W, H);
          const col = getComputedStyle(html).getPropertyValue("--primary-color").trim();
          ctx.fillStyle = col; ctx.strokeStyle = col;
          pts.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.3); ctx.fill();
            for (let j = i + 1; j < pts.length; j++) {
              const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
              if (d < 120) { ctx.globalAlpha = (1 - d / 120) * .25; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
            }
          });
        }
        requestAnimationFrame(drawParticles);
      }
      if (!reduce) {
        sizeCanvas(); window.addEventListener("resize", sizeCanvas);
        new IntersectionObserver((en) => { running = en[0].isIntersecting; }).observe(document.getElementById("hero"));
        drawParticles();
      }

      // 13. Project filters + 3D tilt on cards
      document.querySelectorAll(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("active"); btn.setAttribute("aria-pressed", "true");
        const f = btn.dataset.filter;
        document.querySelectorAll(".project-item").forEach(it => it.classList.toggle("hide", f !== "all" && !it.dataset.cat.split(" ").includes(f)));
      }));
      if (fine && !reduce) {
        document.querySelectorAll(".project-card").forEach(card => {
          card.addEventListener("mousemove", (e) => {
            const b = card.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
            card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
          });
          card.addEventListener("mouseleave", () => { card.style.transform = ""; });
        });
      }

      // 14. DevOps code showcase with tabs + copy button
      const snippets = {
        docker: `# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
        jenkins: `pipeline {
  agent any
  environment {
    REGISTRY = "<account-id>.dkr.ecr.ap-south-1.amazonaws.com"
    IMAGE    = "$REGISTRY/myapp:$BUILD_NUMBER"
  }
  stages {
    stage('Build') {
      steps { sh 'docker build -t $IMAGE .' }
    }
    stage('Push') {
      steps { sh 'docker push $IMAGE' }
    }
    stage('Deploy') {
      steps { sh 'kubectl set image deployment/myapp myapp=$IMAGE' }
    }
  }
}`,
        tf: `resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = { Name = "practice-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = { Name = "practice-public-subnet" }
}`
      };
      const view = document.getElementById("codeView");
      const copyBtn = document.getElementById("copyCode");
      let curFile = "docker";
      const showFile = (f) => {
        curFile = f; view.textContent = snippets[f];
        document.querySelectorAll(".code-tabs [data-file]").forEach(b => b.classList.toggle("active", b.dataset.file === f));
      };
      document.querySelectorAll(".code-tabs [data-file]").forEach(b => b.addEventListener("click", () => showFile(b.dataset.file)));
      showFile("docker");
      copyBtn.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(snippets[curFile]); copyBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Copied'; }
        catch (e) { copyBtn.textContent = "Select and copy"; }
        setTimeout(() => { copyBtn.innerHTML = '<i class="fa-regular fa-copy me-1"></i>Copy'; }, 1500);
      });

      // 15. Live GitHub stats (silently skipped if the request fails)
      fetch("https://api.github.com/users/abhitha007")
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => document.querySelector("#about .row.g-3").insertAdjacentHTML("afterend",
          `<p class="small text-muted mt-3 mb-0"><i class="fa-brands fa-github me-1"></i>GitHub: <strong>${d.public_repos}</strong> public repos, <strong>${d.followers}</strong> followers</p>`))
        .catch(() => {});

      // ===== ANIMATIONS =====
      // 16. Split the hero headline into letters (animated in CSS once the page has loaded)
      function splitText(el) {
        let i = 0;
        el.setAttribute("aria-label", el.textContent);
        const walk = (node) => [...node.childNodes].forEach(n => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(part => {
              if (part === "" || /^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              const w = document.createElement("span");
              w.className = "word"; w.setAttribute("aria-hidden", "true");
              [...part].forEach(ch => { const s = document.createElement("span"); s.className = "char"; s.style.setProperty("--i", i++); s.textContent = ch; w.appendChild(s); });
              frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) walk(n);
        });
        walk(el);
      }
      splitText(document.querySelector("[data-split]"));
      [...document.querySelectorAll("#hero .col-lg-7 > *:not(h1)")].forEach((el, n) => { el.classList.add("hero-in"); el.style.setProperty("--n", n); });

      // 17. Scroll reveal directions and staggered children
      document.querySelectorAll("#about .col-lg-5, #experience .col-lg-6:first-child").forEach(el => el.dataset.anim = "left");
      document.querySelectorAll("#about .col-lg-7, #experience .col-lg-6:last-child").forEach(el => el.dataset.anim = "right");
      document.querySelectorAll("#projects .row.reveal, #services .row.reveal, #skills .row.reveal, #contact .row.reveal").forEach(row => {
        row.classList.add("stagger");
        [...row.children].forEach((c, i) => c.style.setProperty("--d", i * 90 + "ms"));
      });
      document.querySelectorAll(".filter-btn").forEach(b => b.addEventListener("click", () => {
        document.querySelectorAll(".project-item:not(.hide)").forEach((it, i) => {
          it.classList.remove("pop"); void it.offsetWidth; it.style.setProperty("--d", i * 70 + "ms"); it.classList.add("pop");
        });
      }));

      // 18. Tech marquee strip
      const techs = [["fa-brands fa-aws", "AWS"], ["fa-solid fa-layer-group", "Terraform"], ["fa-brands fa-docker", "Docker"], ["fa-solid fa-dharmachakra", "Kubernetes"], ["fa-brands fa-jenkins", "Jenkins"], ["fa-brands fa-github", "GitHub Actions"], ["fa-brands fa-linux", "Linux"], ["fa-brands fa-git-alt", "Git"], ["fa-solid fa-chart-line", "Prometheus & Grafana"], ["fa-brands fa-angular", "Angular"], ["fa-brands fa-js", "JavaScript"]];
      const row = techs.map(([c, t]) => `<span><i class="${c} text-accent"></i>${t}</span>`).join("");
      document.getElementById("marqueeTrack").innerHTML = row + row;

      // 19. Mouse parallax in the hero (desktop only)
      if (fine && !reduce) {
        const hero = document.getElementById("hero"), av = document.getElementById("avatar"), glow = document.querySelector(".hero-glow");
        hero.addEventListener("mousemove", (e) => {
          const b = hero.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
          av.style.translate = `${x * -18}px ${y * -18}px`;
          glow.style.translate = `${x * 40}px ${y * 40}px`;
        });
      }

      // 20. Button ripple on click, magnetic pull on hover (desktop)
      document.querySelectorAll(".btn-accent, .btn-outline-accent").forEach(b => b.addEventListener("click", (e) => {
        const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement("span");
        sp.className = "ripple";
        sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
        b.appendChild(sp); setTimeout(() => sp.remove(), 600);
      }));
      if (fine && !reduce) {
        document.querySelectorAll(".btn-accent, .btn-outline-accent, .social-btn, .theme-toggle-btn").forEach(b => {
          b.addEventListener("mousemove", (e) => {
            const r = b.getBoundingClientRect();
            b.style.translate = `${(e.clientX - r.left - r.width / 2) * .25}px ${(e.clientY - r.top - r.height / 2) * .35}px`;
          });
          b.addEventListener("mouseleave", () => { b.style.translate = ""; });
        });
      }

      // ===== NEW ANIMATIONS =====
      // 21. Card spotlight: soft glow follows the mouse inside every card
      if (fine && !reduce) {
        document.querySelectorAll(".glass-card").forEach(card => card.addEventListener("mousemove", (e) => {
          const b = card.getBoundingClientRect();
          card.style.setProperty("--mx", (e.clientX - b.left) + "px");
          card.style.setProperty("--my", (e.clientY - b.top) + "px");
        }));
      }

      // 22. Custom cursor: dot + smooth ring that grows over links and buttons
      if (fine && !reduce) {
        const ring = document.getElementById("curRing"), dot = document.getElementById("curDot");
        let mx = 0, my = 0, rx = 0, ry = 0;
        window.addEventListener("mousemove", (e) => {
          mx = e.clientX; my = e.clientY;
          dot.style.opacity = ring.style.opacity = 1;
          dot.style.transform = `translate(${mx}px, ${my}px)`;
        });
        document.addEventListener("mouseleave", () => { dot.style.opacity = ring.style.opacity = 0; });
        (function follow() {
          rx += (mx - rx) * .16; ry += (my - ry) * .16;
          ring.style.transform = `translate(${rx}px, ${ry}px)`;
          requestAnimationFrame(follow);
        })();
        document.addEventListener("mouseover", (e) => ring.classList.toggle("hover", !!e.target.closest("a, button, .skill-badge, input, textarea")));
      }

      // 23. Section titles decode (scramble) into place when they scroll into view
      if (!reduce) {
        const glyphs = "!<>-_\\/[]{}=+*^?#01";
        const scramble = (el) => {
          const final = el.textContent, len = final.length;
          let frame = 0;
          const total = 28;
          const tick = () => {
            const done = Math.floor(frame / total * len);
            el.textContent = [...final].map((ch, i) => i < done || ch === " " ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]).join("");
            if (frame++ < total) requestAnimationFrame(tick); else el.textContent = final;
          };
          tick();
        };
        const so = new IntersectionObserver((entries) => entries.forEach(en => {
          if (en.isIntersecting) { scramble(en.target); so.unobserve(en.target); }
        }), { threshold: 0.6 });
        document.querySelectorAll(".section-title").forEach(t => { t.classList.add("scramble"); so.observe(t); });
      }

      document.getElementById("year").textContent = new Date().getFullYear();
    });
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const petalField = document.querySelector(".petal-field");
const progress = document.querySelector(".progress span");
const cursor = document.querySelector(".cursor-glow");
const backTop = document.querySelector(".back-top");
const sorryText = document.querySelector("#sorryText");
const sorryFullText = sorryText.textContent;
if (!prefersReduced) sorryText.textContent = "";

function createPetals(count = 34) {
  petalField.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 9}s`;
    petal.style.transform = `scale(${0.65 + Math.random() * 0.9})`;
    petalField.appendChild(petal);
    if (!prefersReduced) {
      gsap.to(petal, {
        y: "112vh",
        x: `${-70 + Math.random() * 140}px`,
        rotation: 180 + Math.random() * 260,
        duration: 8 + Math.random() * 8,
        repeat: -1,
        delay: Math.random() * 8,
        ease: "none"
      });
    }
  }
}

function initSmoothScroll() {
  if (prefersReduced || !window.Lenis) return;
  const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function initHero() {
  const lines = gsap.utils.toArray(".hero-line");
  if (prefersReduced) return;
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
  lines.forEach((line, index) => {
    tl.to(lines, { opacity: 0, y: 18, duration: 0.7, ease: "power2.out" }, index === 0 ? 1.1 : "+=1.8")
      .to(line, { opacity: 1, y: 0, duration: 1.05, ease: "power3.out" }, "<");
  });
}

function initScrollAnimations() {
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 36,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 82%" }
    });
  });
  gsap.utils.toArray(".reveal-card").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 42,
      scale: 0.96,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" }
    });
  });
  gsap.to(progress, {
    width: "100%",
    ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.2 }
  });
  gsap.to(sorryText, {
    text: sorryFullText,
    duration: 2.2,
    ease: "none",
    scrollTrigger: { trigger: "#sorryText", start: "top 78%", once: true }
  });
}

function initInteractions() {
  document.addEventListener("mousemove", (event) => {
    if (cursor && !prefersReduced) gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.35 });
  });

  document.querySelectorAll(".promise").forEach((promise) => {
    promise.addEventListener("click", () => promise.classList.toggle("done"));
  });

  const heart = document.querySelector(".heart");
  const heartMessage = document.querySelector(".hidden-heart-message");
  heart.addEventListener("click", () => {
    heart.classList.remove("broken");
    heart.classList.add("repaired");
    gsap.to(heartMessage, { opacity: 1, y: -4, duration: 0.7 });
    burst(heart.getBoundingClientRect().left + heart.offsetWidth / 2, heart.getBoundingClientRect().top + heart.offsetHeight / 2, 34);
  });

  let pressTimer;
  heart.addEventListener("pointerdown", () => {
    pressTimer = setTimeout(() => {
      heartMessage.textContent = "Hidden note: I will choose you with more care, even in small moments.";
      gsap.to(heartMessage, { opacity: 1, scale: 1.04, duration: 0.4, yoyo: true, repeat: 1 });
    }, 900);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => heart.addEventListener(eventName, () => clearTimeout(pressTimer)));

  document.querySelectorAll(".stars button").forEach((star) => {
    star.addEventListener("mouseenter", () => {
      document.querySelector(".star-note").textContent = star.dataset.note;
    });
    star.addEventListener("focus", () => {
      document.querySelector(".star-note").textContent = star.dataset.note;
    });
  });

  const modal = document.querySelector(".answer-modal");
  document.querySelector(".forgive").addEventListener("click", () => modal.showModal());
  document.querySelector(".close-modal").addEventListener("click", () => modal.close());
  document.querySelector(".yes").addEventListener("click", () => {
    document.querySelector(".modal-response").textContent = "Thank you. I promise I'll keep proving it.";
    burst(window.innerWidth / 2, window.innerHeight / 2, 90);
  });
  document.querySelector(".time").addEventListener("click", () => {
    document.querySelector(".modal-response").textContent = "That's okay. I'll wait. Take all the time you need.";
  });

  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));
  window.addEventListener("scroll", () => backTop.classList.toggle("show", window.scrollY > 700), { passive: true });
}

function burst(x, y, count) {
  if (prefersReduced) return;
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("span");
    dot.className = "petal";
    dot.style.position = "fixed";
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.zIndex = 30;
    petalField.appendChild(dot);
    gsap.to(dot, {
      x: -170 + Math.random() * 340,
      y: -190 + Math.random() * 280,
      rotation: Math.random() * 420,
      opacity: 0,
      duration: 1.5 + Math.random(),
      ease: "power3.out",
      onComplete: () => dot.remove()
    });
  }
}

function initEasterEggs() {
  const konami = "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a";
  let keys = [];
  let typed = "";
  document.addEventListener("keydown", (event) => {
    keys.push(event.key);
    keys = keys.slice(-10);
    typed = (typed + event.key).slice(-4).toLowerCase();
    if (keys.join(" ") === konami) burst(window.innerWidth / 2, 120, 180);
    if (typed === "noor") burst(window.innerWidth / 2, window.innerHeight - 120, 45);
  });
}

createPetals();
initSmoothScroll();
initHero();
initScrollAnimations();
initInteractions();
initEasterEggs();

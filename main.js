import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";
import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.13/+esm";

const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");
document.documentElement.classList.add("js");
document.querySelector("#year").textContent = new Date().getFullYear();
if (prefersReducedMotion) document.querySelector(".hero video").pause();

if (!prefersReducedMotion) {
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -88 } });
  const frame = time => {
    lenis.raf(time);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const headline = document.querySelector("#hero-title");
headline.querySelectorAll(".line").forEach(line => {
  const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).filter(Boolean).forEach(part => {
      if (/^\s+$/.test(part)) fragment.append(part);
      else {
        const word = document.createElement("span");
        word.className = "word";
        word.textContent = part;
        fragment.append(word);
      }
    });
    node.replaceWith(fragment);
  });
});

if (!prefersReducedMotion) {
  animate(".hero h1 .word", { opacity: [0, 1], y: [70, 0] }, { delay: stagger(0.1, { start: 0.2 }), duration: 1, ease: [0.22, 1, 0.36, 1] });
}

inView(".rv", ({ target }) => {
  if (prefersReducedMotion) {
    target.style.opacity = "1";
    target.style.transform = "none";
    return;
  }
  animate(target, { opacity: [0, 1], y: [24, 0] }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
}, { amount: 0.16 });

document.querySelectorAll("[data-count]").forEach(counter => {
  inView(counter, () => {
    const end = Number(counter.dataset.count);
    if (prefersReducedMotion) {
      counter.textContent = `${end}+`;
      return;
    }
    animate(0, end, { duration: 1.5, ease: "easeOut", onUpdate: value => { counter.textContent = `${Math.round(value)}+`; } });
  }, { once: true, amount: 0.8 });
});

const menuToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const megaTrigger = document.querySelector(".mega-trigger");
const megaPanel = document.querySelector("#mega-panel");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  menuToggle.querySelector("span").textContent = isOpen ? "☰" : "×";
  navLinks.classList.toggle("is-open", !isOpen);
});
megaTrigger.addEventListener("click", () => {
  const isOpen = megaTrigger.getAttribute("aria-expanded") === "true";
  megaTrigger.setAttribute("aria-expanded", String(!isOpen));
  megaPanel.classList.toggle("is-open", !isOpen);
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("is-open");
  megaPanel.classList.remove("is-open");
  megaTrigger.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.querySelector("span").textContent = "☰";
}));
document.addEventListener("pointerdown", event => {
  if (!event.target.closest(".mega-wrap")) {
    megaPanel.classList.remove("is-open");
    megaTrigger.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    megaPanel.classList.remove("is-open");
    megaTrigger.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.querySelector("span").textContent = "☰";
  }
});

const stoneTrack = document.querySelector(".stone-track");
document.querySelectorAll("[data-scroll]").forEach(button => button.addEventListener("click", () => {
  stoneTrack.scrollBy({ left: Number(button.dataset.scroll) * stoneTrack.clientWidth * 0.72, behavior: prefersReducedMotion ? "auto" : "smooth" });
}));

const quotes = [
  { text: "They listened to how we wanted to live outside, then made a garden that feels as if it has always belonged here.", name: "A. Rao", detail: "Homeowner · testimonial placeholder", initials: "AR" },
  { text: "The stonework is beautifully precise, and the whole process felt clear from the first conversation.", name: "M. Shah", detail: "Residential client · testimonial placeholder", initials: "MS" },
  { text: "Our seed-ball gifts felt personal and thoughtful. Guests still tell us they planted theirs.", name: "N. Mehta", detail: "Event client · testimonial placeholder", initials: "NM" }
];
let quoteIndex = 0;
document.querySelectorAll("[data-testimonial]").forEach(button => button.addEventListener("click", () => {
  quoteIndex = (quoteIndex + Number(button.dataset.testimonial) + quotes.length) % quotes.length;
  const quote = quotes[quoteIndex];
  const text = document.querySelector("#quote-text");
  if (!prefersReducedMotion) animate(text, { opacity: [0, 1], y: [8, 0] }, { duration: 0.35 });
  text.textContent = quote.text;
  document.querySelector("#quote-name").textContent = quote.name;
  document.querySelector("#quote-detail").textContent = quote.detail;
  document.querySelector("#quote-avatar").textContent = quote.initials;
}));

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll("[data-lightbox]").forEach(button => button.addEventListener("click", () => {
  lightboxImage.src = button.dataset.lightbox;
  lightboxImage.alt = button.querySelector("img").alt;
  lightbox.querySelector("figcaption").textContent = button.dataset.caption;
  lightbox.showModal();
}));
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelector("#enquiry-form").addEventListener("submit", event => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const subject = `Laughing Earth enquiry: ${fields.get("type")}`;
  const body = [
    `Name: ${fields.get("name")}`,
    `Phone: ${fields.get("phone")}`,
    `Email: ${fields.get("email")}`,
    `Enquiry: ${fields.get("type")}`,
    `Location: ${fields.get("location") || "Not specified"}`,
    "",
    fields.get("message")
  ].join("\n");
  document.querySelector("#form-status").textContent = "Your email app will open with the enquiry ready to send.";
  window.location.href = `mailto:hello@laughingearth.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const timeline = document.querySelector(".timeline");
const timelineProgress = document.querySelector(".timeline-progress");
if (!prefersReducedMotion) {
  const storyImage = document.querySelector(".story-image img");
  scroll(progress => {
    storyImage.style.transform = `translateY(${(progress - 0.5) * -38}px) scale(1.08)`;
  }, { target: storyImage, offset: ["start end", "end start"] });
  scroll(progress => {
    timelineProgress.style.transform = matchMedia("(max-width: 700px)").matches ? `scaleY(${progress})` : `scaleX(${progress})`;
  }, { target: timeline, offset: ["start 78%", "end 58%"] });
} else {
  timelineProgress.style.transform = "scale(1)";
}

const canvas = document.querySelector("#gl");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const centre = new THREE.Group();
  centre.position.x = 3.5;
  scene.add(centre);
  camera.position.set(3.5, 7.4, 11.5);
  scene.add(new THREE.HemisphereLight(0xf4f0e6, 0x232a1f, 1.2));
  const keyLight = new THREE.DirectionalLight(0xfff1d0, 2.4);
  keyLight.position.set(5, 9, 4);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0x6f8f57, 22, 18);
  fillLight.position.set(1, 3, -3);
  scene.add(fillLight);

  const tones = [0xd8c8a4, 0xc4b48f, 0xb7a784, 0xe3d6b8];
  const slabs = [];
  const slabGeometry = new THREE.BoxGeometry(0.94, 0.16, 0.94);
  for (let x = 0; x < 7; x++) {
    for (let z = 0; z < 7; z++) {
      const slab = new THREE.Mesh(slabGeometry, new THREE.MeshStandardMaterial({ color: tones[(x * 3 + z * 5) % tones.length], roughness: 0.82 }));
      slab.position.set(x - 3, 0, z - 3);
      slab.userData = { x, z };
      centre.add(slab);
      slabs.push(slab);
    }
  }
  const seedMaterial = [0x6f8f57, 0x8a6d4b, 0x9c855b].map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.94 }));
  const seeds = Array.from({ length: 9 }, (_, index) => {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), seedMaterial[index % seedMaterial.length]);
    seed.userData = { angle: index * 0.72, radius: 0.8 + (index % 4) * 0.27 };
    centre.add(seed);
    return seed;
  });

  let pointerX = 0;
  let pointerY = 0;
  let heroProgress = 0;
  hero.addEventListener("pointermove", event => {
    const bounds = hero.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { pointerX = 0; pointerY = 0; });
  scroll(progress => { heroProgress = progress; }, { target: hero, offset: ["start start", "end start"] });

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 700 ? 48 : 38;
    camera.updateProjectionMatrix();
  };
  addEventListener("resize", resize, { passive: true });
  resize();

  const renderFrame = time => {
    if (document.hidden) return;
    const seconds = time / 1000;
    const scrollMotion = prefersReducedMotion ? 0 : heroProgress;
    slabs.forEach(slab => {
      const { x, z } = slab.userData;
      const idle = prefersReducedMotion ? 0 : Math.sin(seconds * 0.85 + x * 0.6 + z * 0.45) * 0.1;
      slab.position.y = idle + scrollMotion * Math.max(0, 1 - Math.hypot(x - 3, z - 3) / 5) * 0.35;
    });
    seeds.forEach(seed => {
      const { angle, radius } = seed.userData;
      const drift = prefersReducedMotion ? 0 : seconds * 0.4;
      seed.position.set(Math.cos(drift + angle) * radius * 1.65, 0.85 + (prefersReducedMotion ? 0 : Math.sin(seconds + angle) * 0.28), Math.sin(drift + angle) * radius * 1.65);
    });
    const parallax = prefersReducedMotion ? 0 : 1;
    camera.position.x += (3.5 + pointerX * 2.2 * parallax - camera.position.x) * 0.035;
    camera.position.y += (7.4 - scrollMotion * 2 + pointerY * 1.1 * parallax - camera.position.y) * 0.035;
    camera.position.z += (11.5 - scrollMotion * 1.5 - camera.position.z) * 0.035;
    camera.lookAt(3.5, 0, 0);
    renderer.render(scene, camera);
  };
  if (prefersReducedMotion) renderFrame(0);
  else renderer.setAnimationLoop(renderFrame);
} catch (error) {
  canvas.hidden = true;
  console.warn("The 3D hero is unavailable in this browser; the photo background remains active.", error);
}

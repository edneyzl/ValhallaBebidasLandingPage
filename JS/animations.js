/* ════════════════════════════════════════════════════════
   animations.js — Valhalla Bebidas
   Lenis | Âncoras | Stats | Category cards | Reveal (batch)
   Uso global: só cria tweens quando os elementos existem na página.
════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─── LENIS ─── */
const lenis = new Lenis({
  duration: 0.8,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
  syncTouch: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ─── Âncoras internas (só quando o alvo existe; ignora href="#" e redes) ─── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    let target;
    try {
      target = document.querySelector(href);
    } catch {
      return;
    }
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, {
      offset: -80,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  });
});

/* ─── STATS (homepage) — fromTo evita conflito com opacity: 0 no CSS ─── */
const statsList = document.querySelector('.stats__list');
const statsItems = gsap.utils.toArray('.stats__item');
if (statsList && statsItems.length) {
  gsap.fromTo(
    statsItems,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: statsList,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/* ─── CATEGORY CARDS (homepage) ─── */
const categoryList = document.querySelector('.category__second');
const categoryCards = gsap.utils.toArray('.category__card');
if (categoryList && categoryCards.length) {
  gsap.fromTo(
    categoryCards,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: categoryList,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/* ─── REVEAL (qualquer página com .reveal) ─── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  ScrollTrigger.batch('.reveal', {
    start: 'top 85%',
    onEnter: (elements) => {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.15,
          overwrite: true,
        }
      );
    },
  });
}

/* Lenis + layout: recalcula triggers após fontes/imagem */
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

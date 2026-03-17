/* ════════════════════════════════════════════════════════
   animations.js — Valhalla Bebidas
   Módulos: Lenis | Âncoras | Stats | Cards | Reveal
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   GSAP — Registro de plugins
════════════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════════════
   LENIS — Scroll suave
════════════════════════════════════════════════════════ */
const lenis = new Lenis({
  duration:    0.8,
  easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth:      true,
  smoothTouch: false,
  syncTouch:   false,
});

/* Integração Lenis + ScrollTrigger */
lenis.on('scroll', () => ScrollTrigger.update());
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
ScrollTrigger.addEventListener('refreshInit', () => lenis.resize());

/* ════════════════════════════════════════════════════════
   LENIS — Scroll suave em links âncora
════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute('href'));

    if (target) {
      lenis.scrollTo(target, {
        offset:   -80,  /* compensa a altura da nav fixa */
        duration: 1.5,
        easing:   (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  });
});

/* ════════════════════════════════════════════════════════
   STATS — Aparece um por um conforme o scroll
════════════════════════════════════════════════════════ */
gsap.utils.toArray('.stats__item').forEach((item, index) => {
  gsap.fromTo(item,
    { opacity: 0, y: 40 },
    {
      opacity:  1,
      y:        0,
      duration: 1.0,
      delay:    index * 0.4, /* 0s → 0.4s → 0.8s */
      ease:     'power2.out',
      scrollTrigger: {
        trigger:       '.stats__list',
        start:         'top 75%',
        toggleActions: 'play none none none',
      },
    }
  );
});

/* ════════════════════════════════════════════════════════
   CATEGORY CARDS — Aparece um por um conforme o scroll
════════════════════════════════════════════════════════ */
gsap.utils.toArray('.category__card').forEach((card, index) => {
  gsap.fromTo(card,
    { opacity: 0, y: 60 },
    {
      opacity:  1,
      y:        0,
      duration: 0.8,
      delay:    index * 0.3, /* 0s → 0.3s → 0.6s */
      ease:     'power2.out',
      scrollTrigger: {
        trigger:       '.category__second',
        start:         'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
});

/* ════════════════════════════════════════════════════════
   REVEAL — Fade + slide up ao entrar na viewport
════════════════════════════════════════════════════════ */
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    {
      opacity:  1,
      y:        0,
      duration: 1.0,
      ease:     'power2.out',
      scrollTrigger: {
        trigger:       el,
        start:         'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
});
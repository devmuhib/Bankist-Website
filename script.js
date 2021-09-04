'use strict';

const ul = document.querySelector('.nav__links');
const scrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// scrolling
scrollTo.addEventListener('click', function (e) {
  // const sCoords = section1.getBoundingClientRect();

  // old way
  // window.scrollTo({
  //   left: sCoords.left + window.pageXOffset,
  //   top: sCoords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// page navigation scroll smoothly with event delegation
ul.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabes component
tabContainer.addEventListener('click', function (e) {
  const clickTab = e.target.closest('.operations__tab');
  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
    clickTab.classList.add('operations__tab--active');
  });

  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );

  if (!clickTab) return;

  document
    .querySelector(`.operations__content--${clickTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

// menu fade animations
const menuFade = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const navLink = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    navLink.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', menuFade.bind(0.5));
nav.addEventListener('mouseout', menuFade.bind(1));

// sticky navigation with intersection observer API for batter performance
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// fading section animation
const allSections = document.querySelectorAll('.section');

const sectionFading = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionFading, {
  root: null,
  threshold: 0.12,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy image loading
const images = document.querySelectorAll('img[data-src]');

const lazyImg = function (entries, observer) {
  const [entry] = entries;
  entry.target.src = entry.target.dataset.src;

  if (!entry.isIntersecting) return;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazyImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

images.forEach(img => imgObserver.observe(img));

// slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  const maxSlide = slides.length;
  let curSlide = 0;

  // create dots function
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide=${i}></button>`
      );
    });
  };
  createDots();

  // activate dot function
  const activateSlideDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  activateSlideDot(0);

  const slideFunction = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  slideFunction(0);

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else curSlide++;

    slideFunction(curSlide);
    activateSlideDot(curSlide);
  };

  // previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else curSlide--;

    slideFunction(curSlide);
    activateSlideDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // dots listener
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      slideFunction(slide);
      activateSlideDot(slide);
    }
  });

  setInterval(nextSlide, 3000);
};

slider();

// //------------------------------------
// //------------------------------------
// //----------------------------------------

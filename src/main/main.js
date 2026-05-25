gsap.registerPlugin(ScrollToPlugin);

document.getElementById("scroll-btn").addEventListener("click", () => {
  gsap.to(window, {
    scrollTo: { y: document.querySelector('.slider').offsetTop },
    duration: 4,
    ease: "power2.inOut"
  });
});




// Load Swiper dynamically then init sliders
const swiperCSS = document.createElement('link');
swiperCSS.rel = 'stylesheet';
swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
document.head.appendChild(swiperCSS);

const swiperJS = document.createElement('script');
swiperJS.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
document.head.appendChild(swiperJS);

swiperJS.onload = () => {
  const quoteSwiper = new Swiper('.quote-slider', {
    direction: "vertical",
    effect: "slide",
    loop: false,
    allowTouchMove: false,
  });

  const $Speed = 1000;

  const imageSwiper = new Swiper('.image-slider', {
    mousewheel: false,
    speed: $Speed,
    loop: false,
    longSwipesRatio: 0.01,
    followFinger: false,
    grabCursor: true,
    watchSlidesProgress: true,
    parallax: true,
    lazy: { loadPrevNext: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  imageSwiper.controller.control = quoteSwiper;
};


// curseur custom

document.addEventListener("DOMContentLoaded", () => {
  // 1. Droite
  // 2. Bas
  // 3. Gauche
  // 4. Haut
  // 5. Face
  // 6. Apparition / disparition

  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );

  if (!isMobile) {

    const sprite = document.querySelector("#fire-cursor");

    const cols = 7;
    const rows = 6;
    let currentFrame = 0;
    let currentRow = 5;
    let lastX = null;
    let lastY = null;
    let lastMove = Date.now();
    let isBlocked = false;
    let timer = null;
    let currentDirection = null;

    // position cible de la souris
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    // position actuelle du sprite
    let currentX = targetX;
    let currentY = targetY;

    function showSprite(row, frame) {

      let x = frame * (100 / (cols - 1));
      let y = (row - 1) * (100 / (rows - 1));

      sprite.style.backgroundPosition = x + "% " + y + "%";
    }

    function startLoop(row) {
      if (isBlocked) return;
      if (currentDirection === row) return;

      currentDirection = row;
      currentRow = row;
      currentFrame = 0;

      clearInterval(timer);

      timer = setInterval(function () {
        showSprite(currentRow, currentFrame);
        currentFrame++;

        if (currentFrame >= cols) {
          currentFrame = 0;
        }
      }, 80);
    }

    function playLineOnce(row, reverse, endFunction) {
      currentDirection = null;
      isBlocked = true;

      clearInterval(timer);

      if (reverse) {
        currentFrame = cols - 1;
      } else {
        currentFrame = 0;
      }

      timer = setInterval(function () {
        showSprite(row, currentFrame);
        if (reverse) {
          currentFrame--;
          if (currentFrame < 0) {
            clearInterval(timer);
            isBlocked = false;
            if (endFunction) {
              endFunction();
            }
          }
        } else {
          currentFrame++;
          if (currentFrame >= cols) {
            clearInterval(timer);
            isBlocked = false;
            if (endFunction) {
              endFunction();
            }
          }
        }
      }, 100);
    }

    let idleTimer = null;

    function startIdleTimer() {
      clearTimeout(idleTimer);
      document.body.classList.remove('cursor-hidden');
      idleTimer = setTimeout(() => {
        document.body.classList.add('cursor-hidden');
      }, 3000);
    }

    startIdleTimer();

    document.addEventListener("mousemove", function (event) {

      startIdleTimer();

      targetX = event.clientX;
      targetY = event.clientY;

      if (isBlocked) return;

      if (lastX !== null && lastY !== null) {
        let diffX = event.clientX - lastX;
        let diffY = event.clientY - lastY;

        // horizontal
        if (Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 2) {
            startLoop(1);
          }
          if (diffX < -2) {
            startLoop(3);
          }
        }
        // vertical
        else {
          if (diffY > 2) {
            startLoop(2);
          }
          if (diffY < -2) {
            startLoop(4);
          }
        }
      }
      lastX = event.clientX;
      lastY = event.clientY;

      lastMove = Date.now();
    });

    document.addEventListener("click", function (event) {
      // event.preventDefault(); // ça empeche le click
      // event.stopPropagation();
      playLineOnce(6, false, function () {
        startLoop(5);
      });
    }, true);

    setInterval(function () {
      if (!isBlocked) {
        let timeWithoutMove = Date.now() - lastMove;
        if (timeWithoutMove > 200) {
          startLoop(5);
        }
      }
    }, 100);

    // animation fluide
    function followCursor() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      sprite.style.left = currentX + "px";
      sprite.style.top = currentY + "px";

      requestAnimationFrame(followCursor);
    }

    followCursor();

    window.addEventListener("load", function () {
      playLineOnce(6, true, function () {
        startLoop(5);
      });
    });
  }
});
let section = document.getElementById('section'),
    title = document.getElementById('title'),
    mark = title.querySelector("span"),
    dot = document.querySelector(".dot");

gsap.set(dot, {
    width: "142vmax", // ensures it fills every part of the screen. 
    height: "142vmax",
    xPercent: -50, // center the dot in the section area
    yPercent: -50,
    top: "50%",
    left: "50%"
});

let tl1 = gsap.timeline({
    scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        // markers: true,
        scrub: 1.5,
        pin: section,
        pinSpacing: true,
        invalidateOnRefresh: true,
    },
    defaults: { ease: "none" }
});

tl1
    .to(title, { opacity: 1 })
    .fromTo(dot, {
        scale: 0,
        x: () => {
            let markBounds = mark.getBoundingClientRect(),
                px = markBounds.left + markBounds.width * 0.54; // dot is about 54% from the left of the bounds of the character
            return px - section.getBoundingClientRect().width / 2;
        },
        y: () => {
            let markBounds = mark.getBoundingClientRect(),
                py = markBounds.top + markBounds.height * 0.73; // dot is about 73% from the top of the bounds of the character
            return py - section.getBoundingClientRect().height / 2;
        }
    }, {
        x: 0,
        y: 0,
        ease: "power3.in",
        scale: 1
    });



gsap.registerPlugin(ScrollTrigger, Observer);

const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

var typed = new Typed('#element', {
    strings: ['MACHINE LEARNING ENGINEER', 'FULL STACK DEVELOPER', 'ARTIFICIAL INTELLIGENCE ENGINEER', 'SOFTWARE ENGINEER', 'DATA SCIENTIST'],
    typeSpeed: 100,
    loop: true,
});

const menu = document.querySelector('.menu');
const pics = document.querySelectorAll('.pic');
const max = pics.length;
let val = 1;

gsap.set(pics, { opacity: (i) => (i > 0 ? 0 : 1) });
gsap.set('.box', { opacity: (i) => [0.3, 1, 0.3, 0][i] });

const thumbsTL = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } })
    .to('.box', { x: -50, opacity: (i) => [0, 0.3, 1, 0.3, 0][i] }, 0)
    .to('.b0', { scale: 0, transformOrigin: '100% 100%' }, 0)
    .from('.b3', { scale: 0, transformOrigin: '0 100%' }, 0);

Observer.create({
    target: 'body',
    tolerance: 3,
    onChangeX: (self) => {
        let p = thumbsTL.progress();
        let mod = self.event.type == 'wheel' ? -725 : -100;

        moveStart();
        if (p === 0 || p > 1) p = 1;

        gsap.set(thumbsTL, { progress: p + self.deltaX / mod, overwrite: true });

        gsap.killTweensOf(boxSnap);
        gsap.delayedCall(0.2, boxSnap);

        val += self.deltaX / mod;
        if (val > max + 0.5) val = 1;
        if (val < 0.5) val = max;

        gsap.set('text', { innerHTML: val, snap: 'innerHTML' });
    },
});

function moveStart() {
    gsap.to('.lock-box', { scale: 0, opacity: 0, transformOrigin: '50%', duration: 0.1, overwrite: 'auto' });
    gsap.to('text', { opacity: 0.3, duration: 0.1, overwrite: 'auto' });
}

function moveEnd() {
    val = Math.round(val);
    gsap.to('text', { duration: 0.2, opacity: 1, ease: 'power3.inOut' });
    gsap.to('.lock-box', { duration: 0.2, scale: 1, opacity: 1, ease: 'power3.inOut' });
    gsap.to(pics, { opacity: (i) => (i === val - 1 ? 1 : 0) });
}

function boxSnap() {
    gsap.to(thumbsTL, {
        duration: 0.4,
        ease: 'power3.inOut',
        progress: Math.round(thumbsTL.progress()),
        onComplete: moveEnd,
    });
}

document.querySelector('.main_manu').ondragstart = function () { return false; };

document.querySelector('#prev').onclick = function () {
    val--;
    if (val < 1) val = pics.length;
    moveStart();
    gsap.set('text', { innerHTML: val });
    gsap.fromTo(thumbsTL, { progress: 1 }, { progress: 0, onComplete: moveEnd });
};

document.querySelector('#next').onclick = function () {
    val++;
    if (val > pics.length) val = 1;
    moveStart();
    gsap.set('text', { innerHTML: val });
    gsap.fromTo(thumbsTL, { progress: 0 }, { progress: 1, onComplete: moveEnd });
};

gsap.set('.main_manu, .menu', { opacity: 1 });

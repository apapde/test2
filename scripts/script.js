const glitchElements = document.querySelectorAll('.glitch-hover');

const glitchMap = {
    B: ['ß', 'β', '8'],
    y: ['¥', 'γ'],
    t: ['†', '+'],
    e: ['3', '€'],
    T: ['7', '†'],
    m: ['₥', 'м'],
    p: ['ρ', '₱'],
    l: ['1', '|'],
    W: ['n', '2'],
    o: ['ø', '0', '¤'],
    r: ['Я', 'ř'],
    k: ['κ', 'ќ'],
    A: ['∆', 'Д'],
    b: ['ß', 'Ь'],
    u: ['µ', 'υ'],
    C: ['¢', '©'],
    c: ['¢', '©'],
    n: ['η', 'и'],
    d: ['ↄ', 'đ']
};

function glitchText(text, map) {
    const chars = text.split('');
    const glitchableIndices = chars
        .map((char, i) => (map[char] ? i : -1))
        .filter(i => i !== -1);

    if (glitchableIndices.length === 0) return text;

    const index = glitchableIndices[Math.floor(Math.random() * glitchableIndices.length)];
    const originalChar = chars[index];
    const replacements = map[originalChar];
    chars[index] = replacements[Math.floor(Math.random() * replacements.length)];

    return chars.join('');
}

glitchElements.forEach(el => {
    const originalText = el.dataset.text || el.textContent;
    let glitchInterval;

    el.addEventListener('mouseenter', () => {
        glitchInterval = setInterval(() => {
            el.textContent = glitchText(originalText, glitchMap);
        }, 100);
    });

    el.addEventListener('mouseleave', () => {
        clearInterval(glitchInterval);
        el.textContent = originalText;
    });
});


(function () {

    let hamburger = {
        menu: document.querySelector('.menu-mobile-container'),
        navToggle: document.querySelector('.nav-toggle'),

        initialize() {
            this.navToggle.addEventListener('click', () => { this.toggle(); });
        },

        toggle() {
            this.navToggle.classList.toggle('expanded');
            this.menu.classList.toggle('expanded');
        },
    };

    hamburger.initialize();

}());

/*CANVAS*/
const canvas = document.getElementById("fractal");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const points = [];
const colors = ['#00ffff', '#ff0099', '#ffff00'];
const totalPoints = 100;
const maxDistance = 140;
let pointer = { x: null, y: null };

for (let i = 0; i < totalPoints; i++) {
    points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

// Обработка мыши и касания
window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
    }
}, { passive: true });

window.addEventListener('touchend', () => {
    pointer.x = null;
    pointer.y = null;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function draw() {
    // Фон — без прозрачности, без "следа"
    ctx.fillStyle = 'rgba(12,15,20,1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        for (let j = i + 1; j < points.length; j++) {
            const p2 = points[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDistance) {
                const alpha = 1 - dist / maxDistance;
                const color = colors[(i + j) % colors.length];
                ctx.strokeStyle = hexToRgba(color, alpha);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        // Линии к курсору
        if (pointer.x !== null && pointer.y !== null) {
            const dx = p1.x - pointer.x;
            const dy = p1.y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDistance) {
                const alpha = 1 - dist / maxDistance;
                const color = colors[i % colors.length];
                ctx.strokeStyle = hexToRgba(color, alpha);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(pointer.x, pointer.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(draw);
}

function hexToRgba(hex, alpha) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
}

draw();
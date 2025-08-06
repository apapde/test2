const glitchElements = document.querySelectorAll('.glitch-hover');

const glitchMap = {
    A: ['À', 'Á', 'Â', 'Ä', 'Ã', 'Å', 'Ā', 'Ă', 'Ą', 'Ǎ'],
    a: ['à', 'á', 'â', 'ä', 'ã', 'å', 'ā', 'ă', 'ą', 'ǎ'],
    c: ['ç', 'ć', 'ĉ', 'č', 'ċ', 'ȼ'],
    C: ['Ç', 'Ć', 'Ĉ', 'Č', 'Ċ'],
    d: ['ď', 'đ', 'ḋ', 'ḑ', 'ḓ', 'ḍ'],
    m: ['ḿ', 'ṁ', 'ṃ'],
    n: ['ñ', 'ń', 'ň', 'ņ', 'ṉ', 'ṅ', 'ṇ'],
    o: ['ò', 'ó', 'ô', 'ö', 'õ', 'ō', 'ő', 'ǒ', 'ø', 'ǿ'],
    p: ['ṕ', 'ṗ'],
    r: ['ŕ', 'ř', 'ṙ', 'ṛ'],
    R: ['Ŕ', 'Ř', 'Ṙ', 'Ṛ'],
    s: ['ś', 'š', 'ş', 'ŝ', 'ṣ', 'ṡ'],
    t: ['ţ', 'ť', 'ṫ', 'ṭ', 'ṯ'],
    u: ['ù', 'ú', 'û', 'ü', 'ũ', 'ū', 'ů', 'ű', 'ų', 'ŭ', 'ǔ'],
    y: ['ý', 'ÿ', 'ŷ', 'ȳ'],

    а: ['а', 'à', 'á', 'â', 'ä', 'ã', 'å', 'ā', 'ă', 'ą', 'ǎ', 'а́'],
    з: ['з', 'ʒ', 'ȥ', 'з́'],
    и: ['и', 'ӣ', 'й', 'ї', 'и́'],
    п: ['п', 'ῤ', 'p', 'þ', 'p̵', 'п́'],
    с: ['с', 'ś', 'ş', 'š', '¢', 'ς', 'c', 'с́'],
    т: ['т', 'ť', 'ṭ', 'τ', 'ŧ', 'т́'],
    я: ['я', 'я́']
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

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Цвета
const COLORS = ['#00ffff', '#ff0099', '#ffff00'];

let numPoints;

function updateNumPoints() {
    const w = window.innerWidth;
    if (w < 576) numPoints = 40;
    else if (w < 768) numPoints = 60;
    else if (w < 992) numPoints = 80;
    else numPoints = 100;
}

updateNumPoints();

const points = [];
// Инициализация точек
for (let i = 0; i < numPoints; i++) {
    points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

let cursor = { x: null, y: null };

// Курсор мыши
document.addEventListener("mousemove", e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

// Сенсорные экраны
document.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
        cursor.x = e.touches[0].clientX;
        cursor.y = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener("touchend", () => {
    cursor.x = null;
    cursor.y = null;
});

function draw() {
    ctx.fillStyle = 'rgba(12,15,20,1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // отражение от границ
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        for (let j = i + 1; j < points.length; j++) {
            const p2 = points[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = 120;
            if (dist < maxDist) {
                const opacity = 1 - dist / maxDist;
                const color = COLORS[(i + j) % COLORS.length];

                ctx.strokeStyle = hexToRgba(color, opacity);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        // связь с курсором
        if (cursor.x !== null && cursor.y !== null) {
            const dx = p1.x - cursor.x;
            const dy = p1.y - cursor.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxCursorDist = 150;
            if (dist < maxCursorDist) {
                const opacity = 1 - dist / maxCursorDist;
                const color = COLORS[i % COLORS.length];

                ctx.strokeStyle = hexToRgba(color, opacity);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(cursor.x, cursor.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(draw);
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

draw();
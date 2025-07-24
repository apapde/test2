const vowelMap = {
    'A': ['4', '∆', 'Λ', 'Ⱥ', 'Â', 'À'],
    'a': ['4', '∆', 'λ', 'ą', 'à', 'ä'],

    'E': ['3', '€', 'Ξ', 'Σ', 'È', 'ξ'],
    'e': ['3', '€', 'ξ', 'є', 'ε', 'ė'],

    'I': ['1', '!', '|', 'Î', 'ɨ'],
    'i': ['1', '!', '|', 'î'],

    'O': ['Ø', '∅', 'Ó', 'Ô', 'Œ'],
    'o': ['ø', '¤', 'º', 'ò', 'ó', 'ô', 'œ',],

    'U': ['µ', 'Û', 'Ü', 'Ù', 'Ú', 'Ū', 'Ʉ'],
    'u': ['µ', 'ʉ', 'ü', 'ù', 'ú', 'û', 'ū'],

    'Y': ['¥', 'Ɏ', 'Ұ', 'Ý', 'Ÿ'],
    'y': ['¥', 'ɏ', 'ұ', 'ý', 'ÿ']
};

function glitchTextRandomVowel(el, original) {
    let iterations = 0;
    const maxIterations = 7;

    el.classList.add('glitch-effect');

    const interval = setInterval(() => {
        const glitched = original
            .split('')
            .map(char => {
                if (vowelMap[char]) {
                    const replacements = vowelMap[char];
                    return replacements[Math.floor(Math.random() * replacements.length)];
                }
                return char;
            })
            .join('');

        el.textContent = glitched;
        iterations++;


        if (iterations >= maxIterations) {
            clearInterval(interval);
            el.textContent = original;
            el.classList.remove('glitch-effect');
        }
    }, 60);
}

document.querySelectorAll('.glitch-text').forEach(el => {
    const originalText = el.textContent;

    const loopGlitch = () => {
        setTimeout(() => {
            glitchTextRandomVowel(el, originalText);
            loopGlitch();
        }, Math.random() * 4000 + 2000);
    };

    loopGlitch();
});


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

const smoothLinks = document.querySelectorAll('a[href^="#"]');
for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault();
        const id = smoothLink.getAttribute('href');
        document.querySelector('.menu-mobile-container').classList.remove('expanded');
        document.querySelector('.nav-toggle').classList.remove('expanded');

        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
};

const introContent = document.querySelector('.intro-wrapper-index');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scale = Math.max(1 - scrollY / 900, 0.1); // Ограничиваем scale
    introContent.style.transform = `scale(${scale})`;
});
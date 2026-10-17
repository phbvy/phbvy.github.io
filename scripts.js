// Reveal bubbles as they scroll into view with a slight offset, like incoming messages.
// The offset carries over between scroll events, but no bubble ever waits longer than revealMaxWait,
// so a fast scroll never leaves bubbles blank while a long queue plays out.
var revealGap = 0.3;      // seconds between consecutive bubbles
var revealMaxWait = 0.3;  // longest any bubble waits before appearing
var nextRevealAt = 0;     // timestamp (s) when the next bubble may start

function slide() {
    var slides = document.querySelectorAll(".animate:not(.slide)");
    var windowHeight = window.innerHeight;
    var elementVisible = 150;
    var now = performance.now() / 1000;

    for (var i = 0; i < slides.length; i++) {
        var el = slides[i];
        if (el.getBoundingClientRect().top < (windowHeight - elementVisible)) {
            // Blue bubbles (sent messages) grow from the bottom-right; everything else from the left
            if (el.classList.contains("border-[#1A2FD6]")) {
                el.classList.add("from-right");
            }
            // Already scrolled past it: show right away, don't hold up the queue
            if (el.getBoundingClientRect().bottom < 0) {
                el.style.animationDelay = "0s";
                el.classList.add("slide");
                continue;
            }
            var start = Math.min(Math.max(now, nextRevealAt), now + revealMaxWait);
            el.style.animationDelay = (start - now) + "s";
            el.classList.add("slide");
            nextRevealAt = start + revealGap;
        }
    }
}

window.addEventListener("scroll", slide);

function createChatBubble(comment) {
    if (comment != "") {
        const messageBubble = document.createElement("div");
        messageBubble.innerHTML += comment;
        messageBubble.classList.add("border", "border-[#1A2FD6]", "rounded-3xl", "text-ellipsis", "break-word", "overflow-hidden", "p-4", "col-span-2", "col-start-3", "md:col-start-1", "md:col-span-full", "md:max-w-[calc(50cqw-8px)]", "text-white", "text-3xl", "font-semibold","animate", "from-right", "slide");
        messageBubble.style.cssText = "background: linear-gradient(to bottom, #1F38FA, #1C33E5); box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.25);";
        return messageBubble;
    }
};

function addChatBubble(chatbubble) {
    const messageContainer = document.querySelector("#displaymessagecontainer");
    chatbubble.classList.remove("slide");
    if (messageContainer.children.length==1) {
        const messageContainer2 = document.querySelector("#displaymessagecontainer2")
        messageContainer2.appendChild(chatbubble)
    } else {
        messageContainer.appendChild(chatbubble);
    }
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            chatbubble.classList.add("slide");
        });
    });
};

function typingEffect() {
    const bubble = document.getElementById('typingBubble');
    if (bubble.classList.contains('hidden')) {
        bubble.classList.remove('hidden');
        bubble.classList.add('show');
    }
}

function scrollTopVisibility() {
    var button = document.getElementById('backToTopBtn');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
};

window.addEventListener("scroll", scrollTopVisibility);

document.addEventListener('DOMContentLoaded', () => {
    scrollTopVisibility();
    slide();

    document.querySelector("#displaymessage")
    const createCommentForm = document.querySelector("#commentform")
      
    const input = document.getElementById('messagecontent');
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            const bubble = document.getElementById('typingBubble');
            bubble.classList.add('hidden');
            bubble.classList.remove('show');
        }
    });

    createCommentForm.addEventListener("submit", (e) => {
      e.preventDefault()
      let comment = e.target.usermesssage.value;
      const chatbubble = createChatBubble(comment);
      addChatBubble(chatbubble);
      const bubble = document.getElementById('typingBubble');
      bubble.classList.add('hidden');
      bubble.classList.remove('show');
      createCommentForm.reset();

      setTimeout(()=> {const warnings = document.querySelectorAll(".sandboxwarning")
      // Vy's replies arrive one by one, like incoming messages
      warnings.forEach((warning, i) => {
        warning.classList.remove('hidden', 'slide');
        warning.style.animationDelay = (i * 0.6) + 's';
        void warning.offsetWidth; // restart the animation
        warning.classList.add('slide');
      }
    )}, 500)
      
    })
  });

  
  
// Case cards: replace the cursor with an arrow + "View Project" label (mouse/trackpad only)
document.addEventListener('DOMContentLoaded', () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cards = document.querySelectorAll('a[href*="vy-for-"]');
    if (!cards.length) return;

    const cursor = document.createElement('div');
    cursor.id = 'cardCursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML =
        '<svg class="cursor-arrow" width="20" height="20" viewBox="0 0 20 20"><path d="M2 2 L18 8.5 L10.5 10.5 L8.5 18 Z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>' +
        '<span class="cursor-label pill-raised">View Project</span>';
    document.body.appendChild(cursor);

    // The arrow is the pointer, so it tracks the mouse exactly
    function moveTo(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }

    // Cursor text is always white. Darken the colour (same hue) until white text reaches WCAG AA 4.5:1
    function lum(r, g, b) {
        const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    }
    function forWhiteText(r, g, b) {
        let [h, sat, l] = toHsl(r, g, b);
        let rgb = [r, g, b];
        while (1.05 / (lum(...rgb) + 0.05) < 4.5 && l > 0) {
            l = Math.max(0, l - 0.01);
            rgb = fromHsl(h, sat, l);
        }
        return { bg: `rgb(${rgb.join(', ')})`, text: '#ffffff' };
    }
    function toHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
        if (max === min) return [0, 0, l];
        const d = max - min, sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        return [h / 6, sat, l];
    }
    function fromHsl(h, sat, l) {
        if (sat === 0) return [l, l, l].map((v) => Math.round(v * 255));
        const q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat, p = 2 * l - q;
        const f = (t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => Math.round(v * 255));
    }

    // Same maths as the CSS saturate() filter
    function saturate([r, g, b], s) {
        const clamp = (v) => Math.round(Math.min(255, Math.max(0, v)));
        return [
            clamp((0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b),
            clamp((0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b),
            clamp((0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b),
        ];
    }

    // Match the cursor to each card's hover colour, with readable text on top
    function cardColour(card) {
        // A card can set its hover colour directly (used where saturation would shift the hue)
        const fixed = card.querySelector('[data-hover-colour]');
        if (fixed) {
            const hex = fixed.dataset.hoverColour;
            const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16));
            return forWhiteText(r, g, b);
        }
        const area = card.querySelector('[style*="background-color"]');
        if (!area) return null;
        const rgb = getComputedStyle(area).backgroundColor.match(/\d+/g);
        if (!rgb) return null;
        // Apply the same saturation boost the card's image area gets on hover
        const tint = card.querySelector('[class*="backdrop-saturate"]');
        const amount = !tint ? 1 : tint.className.includes('saturate-[3]') ? 3 : tint.className.includes('saturate-200') ? 2 : 1;
        const [r, g, b] = saturate(rgb.map(Number), amount);
        return forWhiteText(r, g, b);
    }

    cards.forEach((card) => {
        card.classList.add('card-cursor-target');
        const colour = cardColour(card);
        card.addEventListener('mouseenter', (e) => {
            cursor.style.setProperty('--cursor-bg', colour ? colour.bg : '#27272a');
            cursor.style.setProperty('--cursor-text', colour ? colour.text : '#ffffff');
            moveTo(e);
            cursor.classList.add('visible');
        });
        card.addEventListener('mousemove', moveTo);
        card.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    });
});

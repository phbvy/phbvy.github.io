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
        messageBubble.classList.add("border", "border-[#1A2FD6]", "rounded-3xl", "text-ellipsis", "break-word", "overflow-hidden", "p-4", "col-span-2", "col-start-3", "md:col-start-1", "md:col-span-full", "md:max-w-[calc(50cqw-8px)]", "text-white", "text-4xl", "font-medium","animate", "from-right", "slide");
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

// Group stacked chat bubbles like a messages app: where two bubbles from the same side
// sit right on top of each other, the corners they share on that side get tight.
(function () {
    const TIGHT = '6px';
    const GAP = 20;         // max vertical gap (px) for two bubbles to count as one group

    function pageOffset(el) {
        // offsetTop/Left ignore transforms, so the reveal animation doesn't throw this off
        let top = 0, left = 0, node = el;
        while (node) { top += node.offsetTop; left += node.offsetLeft; node = node.offsetParent; }
        return { top, left, bottom: top + el.offsetHeight, right: left + el.offsetWidth };
    }

    function bubbles() {
        return [...document.querySelectorAll(
            '.rounded-3xl.py-3.px-4, #displaymessagecontainer > *, #displaymessagecontainer2 > *, #bento, a[href*="drive.google"]'
        )].filter((el) => el.offsetWidth > 0 && el.offsetHeight > 0 && !el.closest('nav, form'));
    }

    // Case cards on the home page.
    // Phones (one column): fully rounded, no grouping. Desktop grid: every card gets the same
    // tight top-left "tail" corner, and the first card joins the message above it.
    function caseCards() {
        const cards = [...document.querySelectorAll('#by a[href*="vy-for-"]')].filter((el) => el.offsetWidth > 0);
        if (!cards.length) return [];
        const boxes = cards.map((el) => ({ el, box: pageOffset(el) }));
        const oneColumn = boxes.every((c) => Math.abs(c.box.left - boxes[0].box.left) < 4);
        if (oneColumn) return []; // phones: cards stay fully rounded
        boxes.forEach(({ el }) => { el.style.borderTopLeftRadius = TIGHT; });
        boxes.sort((a, b) => a.box.top - b.box.top || a.box.left - b.box.left);
        return [boxes[0]];
    }

    function group() {
        // Reset every card, including ones that only group on phones
        // Reset first, then set corners (so nothing set below gets wiped)
        const all = [...bubbles(), ...document.querySelectorAll('#by a[href*="vy-for-"]')];
        all.forEach((el) => {
            el.style.borderTopLeftRadius = el.style.borderBottomLeftRadius = '';
            el.style.borderTopRightRadius = el.style.borderBottomRightRadius = '';
        });
        const list = bubbles().map((el) => {
            const sent = el.classList.contains('border-[#1A2FD6]');
            return { el, sent, box: pageOffset(el) };
        }).concat(caseCards().map((c) => ({ ...c, sent: false })))
          .sort((a, b) => a.box.top - b.box.top);

        list.forEach((cur, i) => {
            // The closest bubble above on the same side, aligned to the same edge
            for (let j = i - 1; j >= 0; j--) {
                const prev = list[j];
                if (prev.sent !== cur.sent) continue;
                const aligned = cur.sent
                    ? Math.abs(prev.box.right - cur.box.right) < 4
                    : Math.abs(prev.box.left - cur.box.left) < 4;
                if (!aligned) continue;
                const gap = cur.box.top - prev.box.bottom;
                if (gap >= 0 && gap <= GAP) {
                    if (cur.sent) {
                        prev.el.style.borderBottomRightRadius = TIGHT;
                        cur.el.style.borderTopRightRadius = TIGHT;
                    } else {
                        prev.el.style.borderBottomLeftRadius = TIGHT;
                        cur.el.style.borderTopLeftRadius = TIGHT;
                    }
                }
                break;
            }
        });
    }

    let pending = false;
    function schedule() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => { pending = false; group(); });
    }

    document.addEventListener('DOMContentLoaded', () => {
        schedule();
        // Re-group when bubbles are added or shown (chat replies, typing bubble)
        new MutationObserver(schedule).observe(document.body, {
            childList: true, subtree: true, attributes: true, attributeFilter: ['class']
        });
    });
    window.addEventListener('load', schedule);
    window.addEventListener('resize', schedule);
})();

// Borel text: add a marker-style scribble underline that draws in on hover (see .scribble in main.css).
// Each scribble is drawn at its real pixel size (no stretching), and its measured length drives the
// draw-in animation. That avoids a WebKit bug with scaled strokes, and the hook back stays a
// pen-sized flick on long labels.
(function () {
    // Small seeded random so each label always gets the same scribble (based on its text)
    function seeded(text) {
        let h = 2166136261;
        for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
        return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
    }

    // Two marker styles (sweep + hook back, or a quick zig-zag), each with its own tilt and curve. Shapes are designed on a 12-unit-tall grid.
    function scribblePath(w, h, text) {
        const r = seeded(text);
        const j = (amt) => (r() - 0.5) * 2 * amt;          // jitter in +/- amt
        const y = (v) => (v * h / 12).toFixed(1);
        const x = (v) => v.toFixed(1);
        const tilt = j(1.4);                                  // overall rise or dip across the word
        const style = Math.floor(r() * 2);
        if (style === 0) {
            // Sweep right, then hook back underneath itself
            const hook = Math.min(w * (0.4 + r() * 0.25), 90);
            return `M2 ${y(6.5 + tilt)} C ${x(w * 0.3)} ${y(4.6 + j(0.8))}, ${x(w * 0.65)} ${y(3.4 - tilt * 0.5 + j(0.8))}, ${x(w - 3)} ${y(4.2 - tilt)} ` +
                   `C ${x(w - 1.4)} ${y(4.3 - tilt)}, ${x(w - 1.6)} ${y(5.4 - tilt)}, ${x(w - 3.4)} ${y(5.7 - tilt)} ` +
                   `C ${x(w - hook * 0.35)} ${y(7.2 + j(0.6))}, ${x(w - hook * 0.7)} ${y(8.4 + j(0.6))}, ${x(w - hook)} ${y(9.2 + j(0.5))}`;
        }
        // Quick zig-zag: right, back left a little lower, then right again
        const back = w * (0.55 + r() * 0.25);
        return `M2 ${y(5.2 + tilt)} C ${x(w * 0.4)} ${y(4.2 + j(0.7))}, ${x(w * 0.7)} ${y(3.8 + j(0.7))}, ${x(w - 2)} ${y(4.4 - tilt)} ` +
               `L ${x(w - back)} ${y(8 + j(0.6))} ` +
               `C ${x(w - back * 0.6)} ${y(7.8 + j(0.6))}, ${x(w - back * 0.3)} ${y(7.6 + j(0.6))}, ${x(w - 6)} ${y(8.6 - tilt + j(0.5))}`;
    }

    function draw() {
        // Only on clickable Borel text (inside a link or button), e.g. the case card tags
        document.querySelectorAll('a .font-borel, button .font-borel').forEach((el) => {
            let svg = el.querySelector('.scribble');
            if (!svg) {
                el.insertAdjacentHTML('beforeend', '<svg class="scribble" aria-hidden="true"><path/></svg>');
                svg = el.querySelector('.scribble');
            }
            // offsetWidth ignores transforms, so cards mid pop-in still measure at full size
            const w = Math.max(20, el.offsetWidth * 1.06);
            const h = Math.max(6, parseFloat(getComputedStyle(el).fontSize) * 0.55);
            svg.setAttribute('width', w.toFixed(1));
            svg.setAttribute('height', h.toFixed(1));
            svg.setAttribute('viewBox', `0 0 ${w.toFixed(1)} ${h.toFixed(1)}`);
            const path = svg.querySelector('path');
            path.setAttribute('d', scribblePath(w, h, el.textContent.trim()));
            path.style.setProperty('--len', Math.ceil(path.getTotalLength() + 2));
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
        draw();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    });
    window.addEventListener('resize', draw);
})();

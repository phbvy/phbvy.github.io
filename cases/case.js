// Image cards grow to full window width as they reach the middle of the screen,
// then shrink back to card size once scrolled past
(function () {
    const cards = [...document.querySelectorAll('[data-expand]')];
    if (!cards.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const radius = cards.map(c => [c, c.firstElementChild]);
    // each card's corner radius as styled (it differs between phone and desktop)
    const cornerOf = el => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    let corners = new Map();
    const readCorners = () => radius.forEach(([card, inner]) => {
        card.style.borderRadius = '';
        if (inner) inner.style.borderRadius = '';
        corners.set(card, cornerOf(inner || card));
    });
    readCorners();
    // each card's own background (colour plus any image, such as a gradient), read once before
    // the script ever overrides it; `colour` is the key cards are grouped by
    const backdrop = new Map(radius.map(([card, inner]) => {
        const cs = getComputedStyle(inner || card);
        return [card, card.dataset.expandBg
            ? { color: card.dataset.expandBg, image: 'none' }
            : { color: cs.backgroundColor, image: cs.backgroundImage }];
    }));
    const colour = new Map([...backdrop].map(([card, b]) => [card, `${b.color} ${b.image}`]));
    // cards placed directly after each other in the same colour share one background,
    // so scrolling through them keeps it full screen and only the images change
    const block = el => el.closest('[data-pin]') || el;    // a pinned card sits in its pin block
    // two cards are back to back when nothing visible sits between them (only wrappers or spacing)
    const backToBack = (a, b) => {
        const range = document.createRange();
        range.setStartAfter(block(a));
        range.setEndBefore(block(b));
        const between = range.cloneContents();
        return !between.textContent.trim() && !between.querySelector('img, video, svg, canvas, iframe, picture');
    };
    const groups = [];
    cards.forEach(card => {
        const last = groups[groups.length - 1];
        const prev = last && last[last.length - 1];
        if (prev && backToBack(prev, card) && colour.get(prev) === colour.get(card)) last.push(card);
        else groups.push([card]);
    });
    // inside a run of cards the background never leaves the screen, so snapping each card would only
    // tug the page back and forth between neighbours; only cards that stand alone snap into place
    groups.forEach(g => { if (g.length > 1) g.forEach(card => { card.style.scrollSnapAlign = 'none'; }); });
    // the hero under the intro never snaps, and snapping waits for the reader's first scroll
    cards[0].classList.add('is-first');
    const startSnapping = () => {
        document.documentElement.classList.add('snap-on');
        ['wheel', 'touchmove', 'keydown'].forEach(t => window.removeEventListener(t, startSnapping));
    };
    ['wheel', 'touchmove', 'keydown'].forEach(t => window.addEventListener(t, startSnapping, { passive: true }));
    const bg = document.createElement('div');
    bg.id = 'expand-bg';
    document.body.appendChild(bg);
    let ticking = false;

    // 1 at the middle of the screen, 0 once ~35% of a screen away, so cards rest
    // aligned with the text until they're in focus
    function focus(distance, vh) {
        let p = 1 - Math.min(1, distance / (vh * 0.35));
        p = Math.min(1, p * 1.3);              // hold full size around the middle
        return p * p * (3 - 2 * p);            // smoothstep
    }

    function update() {
        ticking = false;
        const vw = document.documentElement.clientWidth;
        const vh = window.innerHeight;
        const mid = vh / 2;
        const centre = el => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; };

        // the background follows the group: full while the middle of the screen is anywhere
        // between its first and last card, shrinking back only past either end
        const groupState = groups.map(g => {
            const first = centre(g[0]), last = centre(g[g.length - 1]);
            const d = mid < first ? first - mid : mid > last ? mid - last : 0;
            return { g, p: focus(d, vh), edge: mid < first ? g[0] : g[g.length - 1] };
        });
        const active = groupState.reduce((a, b) => (b.p > a.p ? b : a));
        const shared = new Set(active.p ? active.g : []);

        radius.forEach(([card, inner]) => {
            // each image still zooms on its own as it passes the middle
            const p = focus(Math.abs(centre(card) - mid), vh);
            // scale so the image panel spans the window, but on desktop never taller than it:
            // a card taller than the window shrinks to fit, so there's even space above and below
            // (offsetWidth/Height are the layout size, unaffected by the current transform)
            const box = inner || card;
            let full = vw / box.offsetWidth;
            if (vw >= 768) full = Math.min(full, (vh * 0.92) / box.offsetHeight);
            const s = 1 + (full - 1) * p;
            card.style.transform = p ? `scale(${s})` : '';
            card.style.borderRadius = `${corners.get(card) * (1 - p)}px`;
            if (inner) inner.style.borderRadius = `${corners.get(card) * (1 - p)}px`;
            // cards of the active group hand their background to the full-screen layer and sit
            // above it, so only one coloured surface is drawn and no frame shows as a ring
            const handOff = shared.has(card);
            card.style.zIndex = handOff || p ? 10 : '';
            card.style.backgroundColor = handOff ? 'transparent' : '';
            card.style.borderColor = handOff ? 'transparent' : '';
            if (inner) {
                inner.style.backgroundColor = handOff ? 'transparent' : '';
                inner.style.backgroundImage = handOff ? 'none' : '';
            }
        });

        // grow the background from the nearest card's coloured area out to the whole screen
        if (!active.p) { bg.style.visibility = 'hidden'; return; }
        const el = active.edge.firstElementChild || active.edge;
        const r = el.getBoundingClientRect();
        const k = 1 - active.p;
        // the coloured area's on-screen corner radius (its radius times the card's scale)
        const corner = corners.get(active.edge) * k * (r.width / el.offsetWidth);
        // the card's colour and image, spread over the whole screen like the card's own cover background
        const b = backdrop.get(active.edge);
        bg.style.backgroundColor = b.color;
        bg.style.backgroundImage = b.image;
        bg.style.backgroundSize = 'cover';
        bg.style.backgroundPosition = 'center';
        bg.style.clipPath = `inset(${Math.max(0, r.top) * k}px ${Math.max(0, vw - r.right) * k}px ${Math.max(0, vh - r.bottom) * k}px ${Math.max(0, r.left) * k}px round ${corner}px)`;
        bg.style.visibility = 'visible';
    }

    function request() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', () => { readCorners(); request(); });
    update();
})();

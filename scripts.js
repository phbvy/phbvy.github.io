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

  
  
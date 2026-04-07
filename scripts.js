function slide() {
    var slides = document.querySelectorAll(".animate");

    for (var i=0; i < slides.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = slides[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < (windowHeight - elementVisible)) {
            slides[i].classList.add("slide");
        }
    }
}

window.addEventListener("scroll", slide);

function createChatBubble(comment) {
    if (comment != "") {
        const messageBubble = document.createElement("div");
        messageBubble.innerHTML += comment;
        messageBubble.classList.add("bg-blue-800", "rounded-3xl", "text-ellipsis", "break-word", "overflow-hidden", "p-4", "col-span-2", "col-start-3", "text-white", "text-3xl", "font-semibold","animate", "slide");
        messageBubble.style.backgroundColor = "#1F38FA";
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
      warnings.forEach(warning => {
        warning.classList.remove('hidden');
      }
    )}, 500)
      
    })
  });

  
  
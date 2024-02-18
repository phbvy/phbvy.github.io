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
        messageBubble.classList.add("bg-blue-800", "rounded-xl", "text-ellipsis", "break-word", "overflow-hidden", "p-4", "col-span-2", "col-start-3",  "border", "border-slate-100", "text-slate-100", "text-3xl", "font-bold","animate", "slide");
        return messageBubble;
    }
};

function addChatBubble(chatbubble) {
    const messageContainer = document.querySelector("#displaymessagecontainer");
    if (messageContainer.children.length==1) {
        const messageContainer2 = document.querySelector("#displaymessagecontainer2")
        messageContainer2.appendChild(chatbubble)
    } else {
        messageContainer.appendChild(chatbubble);
    }
};

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#displaymessage")
    const createCommentForm = document.querySelector("#commentform")
      
    createCommentForm.addEventListener("submit", (e) => {
      e.preventDefault()
      let comment = e.target.usermesssage.value;
      const chatbubble = createChatBubble(comment);
      addChatBubble(chatbubble);
      createCommentForm.reset();

      setTimeout(()=> {const warnings = document.querySelectorAll(".sandboxwarning")
      warnings.forEach(warning => {
        warning.classList.remove('hidden');
      }
    )}, 500)
      
    })
  });
  
  

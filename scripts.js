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
        messageBubble.classList.add("bg-blue-800", "rounded-xl", "overflow-hidden", "p-4", "col-start-3", "col-span-2",  "border", "border-slate-100", "text-slate-100", "text-3xl", "font-bold","animate", "slide", "italic");
        return messageBubble;
    }
}

function addChatBubble(chatbubble) {
    const messageContainer = document.querySelector("#displaymessagecontainer");
    messageContainer.appendChild(chatbubble);
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#displaymessage")
    const createCommentForm = document.querySelector("#commentform")
      
    createCommentForm.addEventListener("submit", (e) => {
      e.preventDefault()
      let comment = e.target.usermesssage.value;
      const chatbubble = createChatBubble(comment);
      addChatBubble(chatbubble);
      createCommentForm.reset();
      document.querySelector("#sandboxwarning").classList.remove('hidden');
    })
  })   
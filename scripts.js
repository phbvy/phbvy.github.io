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
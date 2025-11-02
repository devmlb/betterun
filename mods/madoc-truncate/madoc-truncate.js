(function () {
    function setCourseItemsTitles() {
        const courseItems = document.querySelectorAll(".courseindex-item>.courseindex-link.text-truncate");
        courseItems.forEach((courseItem) => {
            courseItem.setAttribute("title", courseItem.innerText)
        });
    }

    function setCourseIndexObserver() {
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!mutation.addedNodes) return;
                setCourseItemsTitles();
                observer.disconnect();
            });
        });

        observer.observe(document.querySelector("#courseindex-content"), {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    if (document.querySelector("#courseindex-content")) {
        setCourseIndexObserver();
    }
})();
(function () {
    function setCourseItemsTitles() {
        const courseItems = document.querySelectorAll<HTMLElement>(
            ".courseindex-item>.courseindex-link.text-truncate",
        );
        courseItems.forEach((courseItem) => {
            courseItem.setAttribute("title", courseItem.innerText);
        });
    }

    function setCourseIndexObserver() {
        const content = document.querySelector("#courseindex-content");
        if (!content) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!mutation.addedNodes) return;
                setCourseItemsTitles();
                observer.disconnect();
            });
        });

        observer.observe(content, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });
    }

    if (document.querySelector("#courseindex-content")) {
        setCourseIndexObserver();
    }
})();

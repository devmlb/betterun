(function () {
    function getElementByTextContent(selector, searchText) {
        const elements = document.querySelectorAll(selector);
        let found;
        elements.forEach(element => {
            if (element.textContent.includes(searchText)) {
                found = element;
            }
        });
        return found;
    }
})();
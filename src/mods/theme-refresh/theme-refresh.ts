(function () {
    function getElementByTextContent(
        selector: string,
        searchText: string,
    ): Element | undefined {
        const elements = document.querySelectorAll(selector);
        let found: Element | undefined;
        elements.forEach((element) => {
            if (element.textContent?.includes(searchText)) {
                found = element;
            }
        });
        return found;
    }
})();

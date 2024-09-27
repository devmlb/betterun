class ItsbetterAPI {
    async apiCall(endpoint, method="GET", headers=undefined) {
        if (headers === undefined) headers = {};
        const response = await fetch("https://elyco.itslearning.com/restapi/" + endpoint, { method: method, headers: { ...headers, Cookie: document.cookie } });
        return await response.json();
    }
}
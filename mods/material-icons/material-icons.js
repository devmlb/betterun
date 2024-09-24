(function() {
    try {
        const instantMsgSVGIcon = document.querySelector("#im2-open-button>svg");
        let instantMsgImgIcon = document.createElement("img");
        instantMsgImgIcon.setAttribute("class", "h-va-middle l-menu-icons l-personal-menu-icon-instantmessage");
        instantMsgImgIcon.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCB1jYAAAAAIAAc/INeUAAAAASUVORK5CYII=")
        instantMsgSVGIcon.replaceWith(instantMsgImgIcon);
    } catch (e) {
        console.log("Error when replacing the chat icon: "+e+" You can ignore this error as long as it does not affect your use of Itslearning.");
    }
})();
(function () {
    console.log("content script");

    browser.runtime.onMessage.addListener((message) => {
        document.getElementsByClassName("gLFyf gsfi")[0].value = message["message"];
    })
})();
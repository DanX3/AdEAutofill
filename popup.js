function listenForClicks() {
    var email = "";

    function sendMessage(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            message: `${email}`
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target.id == "btn-autofill") {
            email = document.getElementById("email").value;
            browser.tabs.query({active: true, currentWindow: true})
                .then(sendMessage);
        }
    });

    document.addEventListener("input", (e) => {
        if (e.target.id == "email") {
            browser.storage.local.set({ "email": e.target.value });
        }

        if (e.target.id == "password") {
            browser.storage.local.set({ "password": e.target.value });
        }

        if (e.target.id == "pin") {
            browser.storage.local.set({ "pin": e.target.value });
        }
    });

    ["email", "password", "pin"].forEach((dom, _) => {
        browser.storage.local.get(dom)
        .then((element) => {
            var value = element[Object.keys(element)[0]];
            document.getElementById(dom).value = value;
        });
    });
}

browser.tabs.executeScript({ file: "/content_script.js" })
    .then(listenForClicks);

console.log("popup.js executed");

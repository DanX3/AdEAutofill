var data = {};

function extractValue(data) {
    return data[Object.keys(data)[0]]
}

function listenForClicks() {

    function sendMessage(tabs) {
        browser.tabs.sendMessage(tabs[0].id, data);
        console.log(data);
    }

    document.addEventListener("click", (e) => {
        if (e.target.id == "btn-autofill") {
            email = document.getElementById("email").value;
            browser.tabs.query({ active: true, currentWindow: true })
                .then(sendMessage);
        }
    });

    document.addEventListener("input", (e) => {
        console.log("received input event");
        if (e.target.id == "email") {
            browser.storage.local.set({ "email": e.target.value });
        }

        if (e.target.id == "password") {
            browser.storage.local.set({ "password": e.target.value });
        }

        if (e.target.id == "pin") {
            browser.storage.local.set({ "pin": e.target.value });
        }

        if (e.target.id == "activated") {
            console.log(`Set activated to ${e.target.checked}`);
            browser.storage.local.set({ "activated": e.target.checked });
        }

    });
}

["email", "password", "pin"].forEach((dom, _) => {
    browser.storage.local.get(dom)
        .then((element) => {
            var value = element[Object.keys(element)[0]];
            data[`${dom}`] = value;
            document.getElementById(dom).value = value;
        });
});

browser.storage.local.get(("activated"))
    .then((isActive) => {
        var value = extractValue(isActive);
        data['activated'] = value;
        document.getElementById("activated").checked = value;

    });


document.getElementById('btn-go').addEventListener('click', () => {
    console.log("Hello Go To AdE")
    browser.tabs.create({
        active: true,
        url: "https://telematici.agenziaentrate.gov.it/Main/login.jsp"
    });
});


browser.tabs.executeScript({ file: "/content_script.js" })
    .then(listenForClicks);



fetch("http://localhost:3000/api/readjson")
    .then((response) => {
        return response.json();
    }).then((myJson) => {
        console.log(myJson);
    });
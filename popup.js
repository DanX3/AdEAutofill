var data = {};

function extractValue(data) {
    return data[Object.keys(data)[0]]
}

function sendMessage(message) {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then((tabs) => {
        console.log(data);
        browser.tabs.sendMessage(tabs[0].id, message);
    });
}

function listenForClicks() {


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
            if (value === undefined)
                return;
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
    browser.tabs.create({
        active: true,
        url: "https://telematici.agenziaentrate.gov.it/Main/login.jsp"
    });
});

document.getElementById('btn-go-form').addEventListener('click', () => {
    browser.storage.local.set({'go-form': true}, () => {
        console.log("Set go-form to true");
        
        browser.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {action: "automate"});
        });
        // browser.tabs.query({
        //     active: true,
        //     url: "https://telematici.agenziaentrate.gov.it/Main/login.jsp"
        // });
    });
})

document.getElementById('btn-fill').addEventListener('click', () => {
    console.log(document.URL);
    sendMessage({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        pin: document.getElementById('pin').value,
    })
});

browser.tabs.executeScript({ file: "/content_script.js" })
    .then(listenForClicks);



fetch("http://localhost:3000/api/readjson")
    .then((response) => {
        return response.json();
    }).then((myJson) => {
        console.log(myJson);
    });
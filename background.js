function openPage() {
    browser.tabs.create({
        url: "https://developer.mozilla.org"
    });
}

// browser.runtime.onMessage.addListener((message) => {
//     console.log("Called onMessage");
    
//     if (message["message"] == "fetch") {
//         fetchData();
//     }
// });

browser.browserAction.onClicked.addListener(openPage);


function printCurrentURL() {
    browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => {
            console.log(`Active tab has URL ${tabs[0].url}`)
        });
}


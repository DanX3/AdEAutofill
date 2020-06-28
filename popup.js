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


function go_form() {
  browser.storage.local.set({ 'go-form': true }, () => {
    console.log("Set go-form to true");

    browser.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs => {
      console.log(tabs[0].url);

      if (tabs[0].url.includes("agenziaentrate.gov.it")) {
        browser.tabs.sendMessage(tabs[0].id, { action: "automate" });
      } else {
        browser.tabs.create({
          active: true,
          url: "https://ivaservizi.agenziaentrate.gov.it/portale/home"
          // url: "https://telematici.agenziaentrate.gov.it/Main/login.jsp"
        });
      }
    }));
  });
}

document.getElementById('btn-go-form').addEventListener('click', go_form);

document.getElementById('btn-fill-form').addEventListener('click', () => {
  go_form();
  browser.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    if (tabs[0].url.includes("generazione/wizard")) {
      sendMessage({
        "action": "fill-form"
      });
    } else {
      browser.storage.local.set({"fill-form": true});
    }
  });
});

// document.getElementById('btn-clear-form').addEventListener('click', () => {
//   sendMessage({
//     "action": "clear-form"
//   });
// });


// document.getElementById('btn-go').addEventListener('click', () => {
//   browser.tabs.create({
//     active: true,
//     url: "https://telematici.agenziaentrate.gov.it/Main/login.jsp"
//   });
// });

// document.getElementById('btn-fill-login').addEventListener('click', () => {
//   console.log(document.URL);
//   sendMessage({
//     email: document.getElementById('email').value,
//     password: document.getElementById('password').value,
//     pin: document.getElementById('pin').value,
//   })
// });

function _fillLogin() {
  sendMessage({
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    pin: document.getElementById('pin').value,
  });
}

document.getElementById('btn-login').addEventListener('click', () => {
  console.log("Accedi");
  
  browser.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    if (tabs[0].url.includes("agenziaentrate.gov") && tabs[0].url.includes("login")) {
      _fillLogin();
    } else {
      browser.storage.local.set({"login": true}, () => {
        browser.tabs.create({
          active: true,
          url: "https://ivaservizi.agenziaentrate.gov.it/portale/home"
          // url: "https://telematici.agenziaentrate.gov.it/Main/login.jsp"
        });
      })
    }
  });

  browser.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    if (tabs[0].url.includes("agenziaentrate.gov") && tabs[0].url.includes("portale")) {
      _fillLogin();
    } else {
      browser.storage.local.set({"login": true}, () => {
        browser.tabs.create({
          active: true,
          url: "https://telematici.agenziaentrate.gov.it/Main/login.jsp"
        });
      })
    }
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

fetch("http://localhost:3000/api/credentials")
  .then((response) => {
    if (!response.ok) {
      return;
    }

    response.json().then((creds) => {

      console.log(JSON.stringify(creds));

      browser.storage.local.set({ "email": creds.taxcode });
      document.getElementById('email').value = creds.taxcode;
      browser.storage.local.set({ "password": creds.password });
      document.getElementById('password').value = creds.password;
      browser.storage.local.set({ "pin": creds.pin });
      document.getElementById('pin').value = creds.pin;
    });
  });
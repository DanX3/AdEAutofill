(

  function () {

    const ie = new InputEvent("input");

    function extractValue(data) {
      return data[Object.keys(data)[0]]
    }

    // The form requires a comma to separate the integer part and the mantissa
    // JSON requires a dot
    function commify(num) {
      return num.toString().replace(".", ",");
    }

    function clearForm() {
      console.log("Clearing form");

      document.getElementById("i2_4_1").value = "";
      document.getElementById("i2_4_1").dispatchEvent(ie);
      document.getElementById("i2_4_2").value = "";
      document.getElementById("i2_4_2").dispatchEvent(ie);

      console.log("hello");
      for (var i = 0; i < 9; i++) {
        document.getElementById(`i2_2_1_r${i}`).value = '';
        document.getElementById(`i2_2_1_r${i}`).dispatchEvent(ie);
        document.getElementById(`i2_2_2_r${i}`).value = '';
        document.getElementById(`i2_2_2_r${i}`).dispatchEvent(ie);
        document.getElementById(`i2_2_3_r${i}`).value = '';
        document.getElementById(`i2_2_3_r${i}`).dispatchEvent(ie);
        document.getElementById(`i2_2_4_r${i}`).value = '';
        document.getElementById(`i2_2_4_r${i}`).dispatchEvent(ie);

      }
    }

    async function fillData() {
      var email = await browser.storage.local.get("email");
      document.getElementById("username").value = extractValue(email);

      var password = await browser.storage.local.get("password");
      document.getElementById("password").value = extractValue(password);

      var pin = await browser.storage.local.get("pin");
      document.getElementById("pin").value = extractValue(pin);

      document.getElementById("login-button").click();
    }

    async function fillData_ar() {
      var email = await browser.storage.local.get("email");
      document.getElementById("nome_utente_ar").value = extractValue(email);

      var password = await browser.storage.local.get("password");
      document.getElementById("password_ar").value = extractValue(password);

      var pin = await browser.storage.local.get("pin");
      document.getElementById("codicepin").value = extractValue(pin);

      document.getElementsByClassName("conferma").item(0).click();
    }

    async function fillWizard(cb) {
      $.get('http://localhost:3000/api/readjson').done(async (jsonData) => {
        var data = JSON.parse(jsonData);
        console.log(data);

        var discount = data["sconto"];

        await new Promise(r => setTimeout(r, 1000));

        // Cash
        document.getElementById("i2_4_1").value = commify(data["pagamento in contanti"]);
        document.getElementById("i2_4_1").dispatchEvent(ie);

        // Card
        document.getElementById("i2_4_2").value = commify(data["pagamento elettronico"]);
        document.getElementById("i2_4_2").dispatchEvent(ie);

        for (var i = 0; i < data["voci"].length; i++) {
          console.log(`i = ${i}`);

          // Quantity
          document.getElementById(`i2_2_1_r${i}`).value = commify(1);
          document.getElementById(`i2_2_1_r${i}`).dispatchEvent(ie);

          // console.log(`${data["voci"][i]["nome"].toLowerCase()} - $${data["voci"][i]["prezzo"]}`)
          // Price
          document.getElementById(`i2_2_3_r${i}`).value = `${commify(data["voci"][i]["prezzo"])}`;
          document.getElementById(`i2_2_3_r${i}`).dispatchEvent(ie);

          // Discount
          document.getElementById(`i2_2_4_r${i}`).value = commify(discount);
          document.getElementById(`i2_2_4_r${i}`).dispatchEvent(ie);
        }

        await new Promise(r => setTimeout(r, 1000));

        // btn-info in [4, 11]

        for (var i = 0; i < data["voci"].length; i++) {
          console.log(`i = ${i}, typeof(i) = ${typeof (i)}`);

          console.log(document.getElementsByTagName("button").length);
          var filterButton = document.getElementsByTagName("button")[3 + i];
          console.log(filterButton == null);
          filterButton.click();
          // document.getElementsByClassName("btn-info").item(i).click();
          var name = data["voci"][i]["nome"].toLowerCase();
          await new Promise(r => setTimeout(r, 1500));
          document.getElementById('filtro').value = name;
          document.getElementById('filtro').dispatchEvent(ie);
          var scopes = document.getElementsByClassName("ng-scope");
          for (let j = 0; j < scopes.length; j++) {
            if (scopes.item(j).innerHTML.toLowerCase().substr(3) == data["voci"][i]["nome"].toLowerCase()) {
              console.log(`Found ${name}!`);
              scopes.item(j).click();
              break;
            }
          }
          document.getElementsByClassName("btn-default").item(0).click();
          await new Promise(r => setTimeout(r, 500));
        }

        for (var i = 0; i < data["voci"].length; i++) {
          document.getElementById(`i2_2_3_r${i}`).value = `${commify(data["voci"][i]["prezzo"])}`;
          document.getElementById(`i2_2_3_r${i}`).dispatchEvent(ie);
        }

        cb(true);
      }, "json");
    }

    function isLoginURL() {
      return document.URL.endsWith("login.jsp") || document.URL.endsWith("portale/");
    }

    function automate() {
      var URL = document.URL;

      console.log(`Page has URL ${URL}`);
      if (URL.endsWith("Messaggi.jsp")) {
        document.getElementById("boxfatturazione").children[0].click();
      } else if (URL.endsWith("FatturazioneElettronica.jsp")) {
        document.getElementsByClassName("panel-footer").item(1).children[0].click();
      } else if (URL.endsWith("informativa")) {
        document.getElementsByClassName("prosegui").item(0).children[0].click();
        // } else if (URL.includes("documenticommercialionline")) {
        //     // Genera il mio documento
        //     document.getElementsByClassName("mylist").item(0).children[0].children[0].click()
      } else if (URL.endsWith("login.jsp")) {
        fillData_ar();
        // } else if (URL.includes("generazione/wizard")) {
        //   fillWizard();
      }

      if (URL.endsWith("portale/")) {
        if (document.getElementById("username") != undefined) {
          fillData();
        }
        document.getElementsByClassName("link_spa").item(3).click();
      }

      if (URL.endsWith("home")) {
        if (URL.endsWith("portale/web/guest/home")) {
          document.getElementsByClassName("link_spa").item(3).click();
        } else if (document.getElementById("chiudi_informativa") != undefined) {
          document.getElementById("chiudi_informativa").click();
        } else if (URL.includes("documenticommercialionline")) {
          new Promise(r => setTimeout(r, 500)).then(() => {
            var maybelist = document.getElementsByClassName("mylist").item(0);
            if (maybelist !== null) {
              console.log("maybe list != null");
              maybelist.children[0].children[0].click();
              browser.storage.local.set({ "go-form": false });
              checkForAutomation();
            }
          });
        }
      }

    }

    browser.runtime.onMessage.addListener((message) => {
      console.log(`Received ${message}`);
      if (Object.keys(message).includes("action")) {
        if (message['action'] == 'automate') {
          return checkForAutomation();
        }

        if (message['action'] == 'fill-form') {
          console.log("Filling wizard");
          return fillWizard(() => {});
        }

        if (message['action'] == 'clear-form') {
          return clearForm();
        }

        console.log("Error: action not 'automate' nor 'fill-form' nor 'clear-form'");

      }

      if (document.getElementById("nome_utente_ar") !== null) {
        fillData_ar();
      }

      if (document.getElementById("username") !== null) {
        fillData();
      }
    });

    browser.storage.local.get(("go-form"), (goform) => {
      console.log(`go-form: ${extractValue(goform)}`);

    })

    function checkForAutomation() {
      if (document.URL.includes("generazione/wizard")) {
        browser.storage.local.set({ "go-form": false });
        browser.storage.local.get(("fill-form"), (fillform) => {
          console.log(`storage fill-form: ${extractValue(fillform)}`);

          if (extractValue(fillform)) {
            fillWizard((success) => {
              if (success)
                browser.storage.local.set({ "fill-form": false });
            });
          }
        });
        return;
      }

      browser.storage.local.get(("go-form"), (go_form) => {
        if (!extractValue(go_form))
          return;
        console.log("Automating anyway");
        automate();
      });
    }

    function checkForLogin() {
      browser.storage.local.get(("login"), (loginUnextracted) => {
        var login = extractValue(loginUnextracted);
        if (!login)
          return;

        console.log(`Logging in ${login}`);

        if (document.getElementById("nome_utente_ar") !== null) {
          browser.storage.local.set({ "login": false }, () => {
            fillData_ar();
          })
        }

        if (document.getElementById("username") !== null) {
          browser.storage.local.set({ "login": false }, () => {
            fillData();
          });
        }
      });
    }

    checkForLogin();

    checkForAutomation();



    // browser.tabs.query({ active: true, currentWindow: true })
    //     .then((tab) => {
    //         console.log(`Loaded page with URL ${tab.url}`);
    //     })
  }


)();
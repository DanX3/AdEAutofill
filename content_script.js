(

    function () {

        function extractValue(data) {
            return data[Object.keys(data)[0]]
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
                    var maybelist = document.getElementsByClassName("mylist").item(0);
                    if (maybelist !== null) {
                        maybelist.children[0].children[0].click();

                    }
                }
            }
        }

        browser.runtime.onMessage.addListener((message) => {
            document.getElementById('nome_utente_ar').value = message['email'];
            document.getElementById('password_ar').value = message['password'];
            document.getElementById('codicepin').value = message['pin'];
            document.getElementById('bottoni_form').children[0].click();
            background.printCurrentURL();
        });

        browser.storage.local.get("activated")
            .then((value) => {
                var activated = extractValue(value);
                if (activated) {
                    console.log("automating...")
                    automate();
                }
            });

        // browser.tabs.query({ active: true, currentWindow: true })
        //     .then((tab) => {
        //         console.log(`Loaded page with URL ${tab.url}`);
        //     })
    }


)();
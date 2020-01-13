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

        async function fillWizard() {
            $.get('http://localhost:3000/api/readjson').done(async (jsonData) => {
                var data = JSON.parse(jsonData);
                var discount = data["sconto"];

                await new Promise(r => setTimeout(r, 1000));

                const ie = new InputEvent("input");
                document.getElementById("i2_4_1").value = data["pagamento in contanti"];
                document.getElementById("i2_4_1").dispatchEvent(ie);
                document.getElementById("i2_4_2").value = data["pagamento elettronico"];
                document.getElementById("i2_4_2").dispatchEvent(ie);

                for (var i = 0; i < data["voci"].length; i++) {
                    console.log(`i = ${i}`);
                    
                    document.getElementById(`i2_2_1_r${i}`).value = '1,00';
                    document.getElementById(`i2_2_1_r${i}`).dispatchEvent(ie);
                    console.log(`${data["voci"][i]["nome"].toLowerCase()} - $${data["voci"][i]["prezzo"]}`)
                    document.getElementById(`i2_2_3_r${i}`).value = `${data["voci"][i]["prezzo"]}`;
                    document.getElementById(`i2_2_3_r${i}`).dispatchEvent(ie);
                    document.getElementById(`i2_2_4_r${i}`).value = discount;
                    document.getElementById(`i2_2_4_r${i}`).dispatchEvent(ie);
                }

                await new Promise(r => setTimeout(r, 1000));

                for (var i = 0; i < data["voci"].length; i++) {
                    console.log(`i = ${i}`);
                    
                    document.getElementsByClassName("btn-info").item(i).click();
                    var name = data["voci"][i]["nome"].toLowerCase();
                    await new Promise(r => setTimeout(r, 500));
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

            }, "json");
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
            } else if (URL.includes("generazione/wizard")) {
                fillWizard();
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
                    console.log("Here");
                    document.getElementById("chiudi_informativa").click();
                } else if (URL.includes("documenticommercialionline")) {
                    console.log("Here instead");
                    new Promise(r => setTimeout(r, 500)).then(() => {
                        var maybelist = document.getElementsByClassName("mylist").item(0);
                        if (maybelist !== null) {
                            console.log("maybe list != null");
                            maybelist.children[0].children[0].click();
                        }
                    });
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
                    automate();
                }
            });

        // browser.tabs.query({ active: true, currentWindow: true })
        //     .then((tab) => {
        //         console.log(`Loaded page with URL ${tab.url}`);
        //     })
    }


)();
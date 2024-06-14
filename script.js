class formHandler {
    constructor(formId) {
        this.formElement = document.getElementById(formId);
        if (this.formElement == null) {
            throw error('pas de formulaire');
        }
        assignElement(formId);
        assignEvent(formId);

        assignElement(formId);
        {
            switch (formId) {
                case 'formLogin':
                    this.userNameElement =
                        this.formElement.querySelector('UserName');
                    this.passwordElement =
                        this.formElement.querySelector('PassWord');
                    this.submitElement = this.formElement.querySelector('');
                case 'formInscription':
                    this.emailElement = this.formElement.querySelector('email');
                    this.lastNameElement =
                        this.formElement.querySelector('Nom');
                    this.nameElement = this.formElement.querySelector('Prenom');
                    this.secretQuestionElement =
                        this.formElement.querySelector('Question_Secrete');
                    this.secretQuestionAnswerElement =
                        this.formElement.querySelector(
                            'Reponse_a_la_question_Secrete'
                        );
                    break;
                default:
                    throw error('pas de formulaire');
            }
        }
    }
    getValue(element) {
        return element.value;
    }
    async setValue(field, value) {
        domXML = await loadXMLDoc('./Utilisateur.xml');
        setValueToDOM(getFieldFromUser(domXML, field), value);
    }

    getFieldFromUser(domElement) {
        const user = findUser(getValue(this.userNameElement));
        return user.querySelector(domElement);
    }
    setValueToDOM(domElement, value) {
        domElement.value = value;
    }
    handdleSubmitLogin(e) {
        e.preventDefault(); // Prevent default form submission behavior
        if (connectionIsCorrect) {
            redirect();
        } else {
            error();
        }
    }
    handdleSubmitInscription(e) {
        e.preventDefault(); // Prevent default form submission behavior
        if (connectionIsCorrect) {
            redirect();
        } else {
            error();
        }
    }
}

window.addEventListener('load', () => {
    // const formLogin = new formHandler('formLogin');
    // const formInscription = new formHandler('formInscription');
});

async function loadXMLDoc(filename) {
    try {
        let response = await fetch(filename);
        let data = await response.text();
        let parser = new DOMParser();

        return parser.parseFromString(data, 'text/xml');
    } catch (error) {
        console.error(error);
    }
}

function findUser(xml, username) {
    console.log("test 2: "+username);
    const allUsers = xml.querySelectorAll('Utilisateur');
    for (let index = 0; index < allUsers.length; index++) {
        const user = allUsers[index];
        usernameInXML = user.querySelector('UserName').textContent;
        usernameIsGood = usernameInXML === username;

        if (usernameIsGood) {
            return user;
        }
    }

    return null;
}

function connectionIsCorrect(xml, username, password) {
    const user = findUser(xml, username);
    console.log('user : ', user);
    console.log('username : ', username);
    console.log('password : ', password);
    if (user && user.querySelector('Password').textContent === password) {
        console.log('true');

        return true;
    }
    return false;
}

function connectUser(xml, username, password) {
    console.log('username : ', username);
    console.log('password : ', password);

    if (connectionIsCorrect(xml, username, password)) {
        //redirect
        console.log('redirect');
        return;
    }
    //error
    console.log('error');
    return;
}

function redirect(href) {
    window.location.replace(href);
}

function getInputConnection(params) {
    const formLogin = document.querySelector('#formLogin');
    if (formLogin) {
        console.log('formLogin : ', formLogin);
        username = formLogin.querySelector("input[name='Username']");
        password = formLogin.querySelector("input[name='Password']");
    } else {
        username = 'PasBenjamin';
        password = 'mdp123!';

        username = 'JeanMichel';
        // password = 'passw0rd!';
    }

    return { username: username, password: password };
}

window.addEventListener('load', () => {
    const userInput = getInputConnection();

    generateHeader();

    loadXMLDoc('./Utilisateurs.xml')
        .then((xml) => connectUser(xml, userInput.username, userInput.password))
        .catch(function (error) {
            console.error(error);
        });
});

function generictruc(xmlPRosmise, fonctin) {
    xmlPRosmise.then(fonction);
}
//chercher si l'tilisateur exist
//on la trouvé (si pas trouvé erreur, sino redirigé)
//si ok, deuxieme page on récupére ce qu'on sait de lui et on repli les value des fields. il faudra vérifié si tout les champ son rempli (en bonus).

function getConnectedUser(){
    const text = fetch("data/currentUser.txt").then((res) => res.text()).then((text) => {
        console.log("text : "+text);
        return text;
    })
    return text;
}

function findNom(userXML) {
    const nom = userXML.querySelector("Nom").textContent;
    return nom;
}

function findPrenom(userXML) {
    const prenom = userXML.querySelector("Prenom").textContent;
    return prenom;
}

function generateHeader() {
    const body = document.querySelector("body");

    const header = document.createElement("header");
    

    const divNom = document.createElement("div");
    header.appendChild(divNom);

    const labelNom = document.createElement("label");
    labelNom.id = "labelNom";
    divNom.appendChild(labelNom);

    const divPrenom = document.createElement("div");
    header.appendChild(divPrenom);

    const labelPrenom = document.createElement("label");
    labelPrenom.id = "labelPrenom";
    
    divPrenom.appendChild(labelPrenom);

    loadXMLDoc("./Utilisateurs.xml").then((xml) => {
        getConnectedUser().then((username) => {
            const labelPrenom = document.querySelector("#labelPrenom");
            const labelNom = document.querySelector("#labelNom");
            const userXML = findUser(xml,username);
            labelPrenom.innerHTML = findPrenom(userXML);
            labelNom.innerHTML = findNom(userXML);
        });
    });

    const divDeconnexion = document.createElement("div");
    header.appendChild(divDeconnexion);

    const boutonDeconnexion = document.createElement("button");
    boutonDeconnexion.id = "btnDeco";
    boutonDeconnexion.innerHTML = "Déconnexion";    
    divDeconnexion.appendChild(boutonDeconnexion);

    body.innerHTML = header.outerHTML + body.innerHTML;
}
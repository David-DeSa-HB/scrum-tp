class formHandler {
    constructor(formId) {
        console.log(formId);
        this.formElement = document.getElementById(formId);
        if (this.formElement == null) {
            throw new Error ('pas de formulaire');
        }
        this.assignElement(formId);
        this.assignEvent(this.formElement);
        
    }
    assignElement(formId)
        {
            switch (formId) {
                case 'formLogin':
                    this.userNameElement =
                        document.getElementById('UserName');
                    this.passwordElement =
                    document.getElementById('PassWord');
                    this.submitElement = document.getElementById('');
                case 'formInscription':
                    this.emailElement = document.getElementById('email');
                    this.lastNameElement =
                    document.getElementById('Nom');
                    this.nameElement = document.getElementById('Prenom');
                    this.secretQuestionElement =
                    document.getElementById('Question_Secrete');
                    this.secretQuestionAnswerElement =
                    document.getElementById(
                            'Reponse_a_la_question_Secrete'
                        );
                    break;
                default:
                    throw error('pas de formulaire');
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

    assignEvent(element) {
        this.formId === 'formLogin' ? element.addEventListener('click', (e) => {handdleSubmitLogin(e)}) : element.addEventListener('click', () => {this.handdleSubmitInscription(e)});
    }

    handdleSubmitLogin(e) {
        e.preventDefault(); // Prevent default form submission behavior
       if(connectionIsCorrect())
        {
            redirect('inscription.html');
        }
        else
        {
            error();
        }
    }
    handdleSubmitInscription(e) {
        e.preventDefault(); // Prevent default form submission behavior
        if (connectionIsCorrect()) {
            redirect("connexion.html");
        } else {
            error(errors);
        }
    }
    error()
    {
        alert('il y a un problème');
    }
}

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

function redirect(url) {
    window.location.replace(url);
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
    if (connectionIsCorrect(xml, username, password)) {
        //redirect
        console.log('redirect');

        var fs = require('fs');
        // fs.writeFile('./data/currentuser.txt', username, function (err, data) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     console.log('Data read : ' + data.toString());
        // });
        redirect('index.html');
        return;
    }
    //error
    console.log('error');
    window.location.reload();
    // redirect(window.location.href);
    return;
}

function loadPartenaires(xml) {
    const list = document.querySelector('#partenaires');

    const partenaires = xml.querySelectorAll('Partenaire');

    partenaires.forEach((partenaire) => {
        var element = document.createElement('article');

        var title = document.createElement('h3');
        var description = document.createElement('p');
        var logo = document.createElement('img');
        var button = document.createElement('button');

        title.textContent = partenaire.querySelector('Nom').textContent;
        description.textContent =
            partenaire.querySelector('Preview').textContent;

        logo.src = partenaire.querySelector('Logo').textContent;

        button.textContent = 'Afficher la suite';

        element.append(title);
        element.append(logo);
        element.append(description);
        element.append(button);

        list.append(element);
    });
}

function redirect(href) {
    window.location.replace(href);
}

function getInputConnection(params) {
    const formLogin = document.querySelector('#formLogin');
    if (formLogin) {
        username = formLogin.querySelector("input[name='Username']").value;
        password = formLogin.querySelector("input[name='Password']").value;
    }
    // else {
    //     username = 'PasBenjamin';
    //     password = 'mdp123!';

    //     username = 'JeanMichel';
    //     // password = 'passw0rd!';
    // }

    return { username: username, password: password };
}
function getIdFromForm()
{
    return document.getElementsByTagName("form")[0].id; 
}


window.addEventListener('load', () => {
    generateHeader();
    const submitLogin = document.querySelector('#submitLogin');
    submitLogin.addEventListener('click', (event) => {
        event.preventDefault();
        const userInput = getInputConnection();

    
        loadXMLDoc('./data/Utilisateurs.xml')
            .then((xml) =>
                connectUser(xml, userInput.username, userInput.password)
            )
            .catch(function (error) {
                console.error(error);
            });
    });

    // loadXMLDoc('./data/Utilisateurs.xml')
    //     .then((xml) => connectUser(xml, username, password))
    //     .catch(function (error) {
    //         console.error(error);
    //     });

    if (document.querySelector('#partenaires') != null) {
        loadXMLDoc('./data/Partenaires.xml')
            .then((xml) => loadPartenaires(xml))
            .catch(function (error) {
                console.error(error);
            });
    }
    const formLogin = new formHandler(getIdFromForm());
    const buttonDeco = document.getElementById('btnDeco');

    buttonDeco.addEventListener('click', () =>{

        try {
            let file;
            // Create an instance of the FileSystemObject
            file = new ActiveXObject("Scripting.FileSystemObject");
          
            let f = file.GetFile("data/currentUser.txt");
            f.Delete();
        
            file = new File("", "data/currentUser.txt", {
                type: "text/plain",
            });
        
        
            redirect("index.html");
        }
        catch{
            alert("Problème de déconnexion");
        }
    
    });
    
});



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
class formHandler {
    constructor(formId) {
        this.formElement = document.getElementById(formId);
        if (this.formElement == null) {
            throw error('pas de formulaire');
        }
        this.assignElement(formId);
        this.assignEvent(formId);
    }
    assignElement(formId) {
        switch (formId) {
            case 'formLogin':
                this.userNameElement =
                    this.formElement.getElementById('UserName');
                this.passwordElement =
                    this.formElement.getElementById('PassWord');
                this.submitElement = this.formElement.getElementById('');
            case 'formInscription':
                this.emailElement = this.formElement.getElementById('email');
                this.lastNameElement = this.formElement.getElementById('Nom');
                this.nameElement = this.formElement.getElementById('Prenom');
                this.secretQuestionElement =
                    this.formElement.getElementById('Question_Secrete');
                this.secretQuestionAnswerElement =
                    this.formElement.getElementById(
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
        formId === 'formLogin'
            ? element.addEventListener('click', handdleSubmitLogin(e))
            : element.addEventListener(
                  'click',
                  this.handdleSubmitInscription(e)
              );
    }

    handdleSubmitLogin(e) {
        e.preventDefault(); // Prevent default form submission behavior
        if (connectionIsCorrect) {
            redirect('inscription.html');
        } else {
            error(errors);
        }
    }
    handdleSubmitInscription(e) {
        e.preventDefault(); // Prevent default form submission behavior
        if (connectionIsCorrect) {
            redirect('connection.html');
        } else {
            error(errors);
        }
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

window.addEventListener('load', () => {
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
    const formLogin = new formHandler('formLogin');
    const formInscription = new formHandler('formInscription');
});
//chercher si l'tilisateur exist
//on la trouvé (si pas trouvé erreur, sino redirigé)
//si ok, deuxieme page on récupére ce qu'on sait de lui et on repli les value des fields. il faudra vérifié si tout les champ son rempli (en bonus).

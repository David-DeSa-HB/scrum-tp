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
        domXML = await loadXMLDoc('Utilisateur.xml');
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
    const allUsers = xml.querySelectorAll('Utilisateur');
    for (let index = 0; index < allUsers.length; index++) {
        const user = allUsers[index];
        usernameInXML = user.querySelector('UserName').textContent;
        usernameIsGood = usernameInXML === username;

        if (usernameIsGood) {
            return user;
        }
    }
    // allUsers.forEach((user) => {
    //     usernameInXML = user.querySelector('UserName').textContent;
    //     usernameIsGood = usernameInXML === username;
    //     console.log(usernameInXML);
    //     console.log(username);
    //     console.log(usernameIsGood);

    //     if (usernameIsGood) {
    //         console.log('redirect');
    //         console.log('user : ', user);

    //         return user;
    //     }
    // });

    return null;
}

function connectionIsCorrect(xml, username, password) {
    const user = findUser(xml, username);
    if (user?.querySelector('Password').textContent === password) {
        return true;
    }
    return false;
}

function connectUser(xml, username, password) {
    if (connectionIsCorrect(xml, username, password)) {
        //redirect
        console.log('redirect');
        return;
    }
    //error
    console.log('error');
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

window.addEventListener('load', () => {
    username = 'PasBenjamin';
    password = 'mdp123!';

    loadXMLDoc('./data/Utilisateurs.xml')
        .then((xml) => connectUser(xml, username, password))
        .catch(function (error) {
            console.error(error);
        });

    if (document.querySelector('#partenaires') != null) {
        loadXMLDoc('./data/Partenaires.xml')
            .then((xml) => loadPartenaires(xml))
            .catch(function (error) {
                console.error(error);
            });
    }
});

function generictruc(xmlPRosmise, fonctin) {
    xmlPRosmise.then(fonction);
}
//chercher si l'tilisateur exist
//on la trouvé (si pas trouvé erreur, sino redirigé)
//si ok, deuxieme page on récupére ce qu'on sait de lui et on repli les value des fields. il faudra vérifié si tout les champ son rempli (en bonus).

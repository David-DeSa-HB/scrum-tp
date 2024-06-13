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
        return this.element.value;
    }
    async setValue(xml, field, value) {
        domXML = await loadXMLDoc('Utilisateur.xml');
        setValueToDOM(getFieldFromDom(domXML, field), value);
    }

    getFieldFromDom(domXML, domElement) {
        const user = findUser(getValue(this.userNameElement));
    }

    handdleSubmit(e) {
        e.preventDefault(); // Prevent default form submission behavior
    }
}

window.addEventListener('load', () => {
    const formLogin = new formHandler('formLogin');
    const formInscription = new formHandler('formInscription');
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
    allUsers.forEach((user) => {
        usernameIsGood = user.querySelector('UserName') === username;
        if (usernameIsGood) {
            return user;
        }
    });
    return null;
}

function connectionIsCorrect(xml, username, password) {
    const user = findUser(xml, username);
    if (user && user.querySelector('Password') === password) {
        return true;
    }
    return false;
}

function connectUser(xml, username, password) {
    if (connectionIsCorrect(xml, username, password)) {
        //redirect
        console.log('redirect');
    }
    //error
    console.log('error');
}

window.addEventListener('load', () => {
    username = 'username';
    password = 'password';

    loadXMLDoc('./Utilisateurs.xml')
        .then((xml) => connectUser(xml, username, password))
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

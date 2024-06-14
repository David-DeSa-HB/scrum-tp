class formHandler {
    constructor(formId) {
        this.formElement = document.getElementById(formId);
        if (this.formElement == null) {
            throw error('pas de formulaire');
        }
        this.assignElement(formId);
        this.assignEvent(formId);
        
    }
    assignElement(formId)
        {
            switch (formId) {
                case 'formLogin':
                    this.userNameElement =
                        this.formElement.getElementById('UserName');
                    this.passwordElement =
                        this.formElement.getElementById('PassWord');
                    this.submitElement = this.formElement.getElementById('');
                case 'formInscription':
                    this.emailElement = this.formElement.getElementById('email');
                    this.lastNameElement =
                        this.formElement.getElementById('Nom');
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

    assignEvent(element)
    {

        formId === 'formLogin' ? element.addEventListener('click', handdleSubmitLogin(e)) : element.addEventListener('click', this.handdleSubmitInscription(e)) ;

    }

    handdleSubmitLogin(e) {
        e.preventDefault(); // Prevent default form submission behavior
       if(connectionIsCorrect)
        {
            redirect('inscription.html');
        }
        else
        {
            error(errors);
        }
    }
    handdleSubmitInscription(e) {
        e.preventDefault(); // Prevent default form submission behavior
        if (connectionIsCorrect) {
            redirect("connection.html");
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


function redirect(url)
{
    window.location.replace(url);
}

function findUser(xml, username) {
    const allUsers = xml.querySelectorAll('Utilisateur');
    allUsers.forEach((user) => {
        usernameIsGood =
            user.querySelector('UserName').textcontent === username;
        console.log(user.querySelector('UserName').textContent);
        console.log(username);
        console.log(usernameIsGood);

        if (usernameIsGood) {
            return user;
        }
    });
    return null;
}

function connectionIsCorrect(xml, username, password) {
    const user = findUser(xml, username);
    console.log(user);
    console.log(user?.querySelector('Password').textContent);
    if (user?.querySelector('Password').textContent === password) {
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

function redirect(href) {
    window.location.replace(href);
}


window.addEventListener('load', () => {
    const username = 'PasBenjamin';
    const password = 'mdp123';
    loadXMLDoc('./Utilisateurs.xml')
        .then((xml) => connectUser(xml, username, password))
        .catch(function (error) {
            console.error(error);
        });
    const formLogin = new formHandler('formLogin');
    const formInscription = new formHandler('formInscription');


    
});
//chercher si l'tilisateur exist
//on la trouvé (si pas trouvé erreur, sino redirigé)
//si ok, deuxieme page on récupére ce qu'on sait de lui et on repli les value des fields. il faudra vérifié si tout les champ son rempli (en bonus).

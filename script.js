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

    assignEvent(element)
    {

        this.formId === 'formLogin' ? element.addEventListener('submit', (e) => {handdleSubmitLogin(e)}) : element.addEventListener('submit', (e) =>{ this.handdleSubmitInscription(e)}) ;

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


function redirect(url)
{
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
function getIdFromForm()
{
    return document.getElementsByTagName("form")[0].id; 
}


window.addEventListener('load', () => {
    const userInput = getInputConnection();

    loadXMLDoc('./Utilisateurs.xml')
        .then((xml) => connectUser(xml, userInput.username, userInput.password))
        .catch(function (error) {
            console.error(error);
        });
    const formLogin = new formHandler(getIdFromForm());



    
});
//chercher si l'tilisateur exist
//on la trouvé (si pas trouvé erreur, sino redirigé)
//si ok, deuxieme page on récupére ce qu'on sait de lui et on repli les value des fields. il faudra vérifié si tout les champ son rempli (en bonus).

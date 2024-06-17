// import * as fs from 'fs';
class formHandler {
    constructor(formId) {
        console.log(formId);
        this.formElement = document.getElementById(formId);
        if (this.formElement == null) {
            throw new Error('pas de formulaire');
        }
        this.assignElement(formId);
        this.assignEvent(this.formElement);
    }
    assignElement(formId) {
        switch (formId) {
            case 'formLogin':
                this.userNameElement = document.getElementById('UserName');
                this.passwordElement = document.getElementById('PassWord');
                this.submitElement = document.getElementById('');
            case 'formInscription':
                this.emailElement = document.getElementById('email');
                this.lastNameElement = document.getElementById('Nom');
                this.nameElement = document.getElementById('Prenom');
                this.secretQuestionElement =
                    document.getElementById('Question_Secrete');
                this.secretQuestionAnswerElement = document.getElementById(
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
        domXML = await loadXMLDoc('./data/Utilisateur.xml');
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
        this.formId === 'formLogin'
            ? element.addEventListener('click', (e) => {
                  handdleSubmitLogin(e);
              })
            : element.addEventListener('click', () => {
                  this.handdleSubmitInscription(e);
              });
    }

    handdleSubmitLogin(e) {
        e.preventDefault(); // Prevent default form submission behavior
        if (connectionIsCorrect()) {
            redirect('inscription.html');
        } else {
            error();
        }
    }
    handdleSubmitInscription(e) {
        e.preventDefault(); // Prevent default form submission behavior
        if (connectionIsCorrect()) {
            redirect('connexion.html');
        } else {
            error(errors);
        }
    }
    error() {
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
    console.log('test 2: ' + username);
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

function writeFile(content) {
    // Créer un Blob avec le contenu de la textarea
    const blob = new Blob([content], { type: 'text/plain' });

    // Créer une URL pour le Blob
    const url = URL.createObjectURL(blob);

    // Créer un élément de lien temporaire pour le téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = './data/monFichier.txt'; // Nom par défaut du fichier à télécharger

    // Ajouter le lien au document
    document.body.appendChild(a);

    // Simuler un clic sur le lien pour démarrer le téléchargement
    a.click();

    // Supprimer le lien temporaire du document
    document.body.removeChild(a);

    // Libérer l'URL Blob
    URL.revokeObjectURL(url);
}

function connectUser(xml, username, password) {
    if (connectionIsCorrect(xml, username, password)) {
        //redirect
        console.log('redirect');
        // writeFile('test');
        // const userJSON = JSON.stringify(username);
        // fs.writeFile('data.json', userJSON, (error) => {
        //     if (error) {
        //         console.error(error);

        //         throw error;
        //     }

        //     console.log('data.json written correctly');
        // });
        // console.log('userJSON : ', userJSON);
        localStorage.name = username;
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
    return { username: username, password: password };
}
function getIdFromForm() {
    return document.getElementsByTagName('form')[0].id;
}

function loadXMLPartenaires() {
    if (document.querySelector('#partenaires') != null) {
        loadXMLDoc('./data/Partenaires.xml')
            .then((xml) => loadPartenaires(xml))
            .catch(function (error) {
                console.error(error);
            });
    }
}

function buttonConnection() {
    try {
        const submitLogin = document.querySelector('#submitLogin');
        submitLogin.addEventListener('click', (event) => {
            console.log('click');

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
    } catch (error) {}
}

function makeDeconnection() {
    try {
        const formLogin = new formHandler(getIdFromForm());
        const buttonDeco = document.getElementById('btnDeco');
        buttonDeco.addEventListener('click', () => {
            try {
                var file;
                // Create an instance of the FileSystemObject
                file = new ActiveXObject('Scripting.FileSystemObject');

                var f = file.GetFile('data/currentUser.txt');
                f.Delete();

                file = new File('', 'data/currentUser.txt', {
                    type: 'text/plain',
                });

                redirect('index.html');
            } catch {
                alert('Problème de déconnexion');
            }
        });
    } catch (error) {}
}

window.addEventListener('load', () => {
    console.log('local1 : ', localStorage.name);
    generateHeader();
    loadXMLPartenaires();
    makeDeconnection();
    buttonConnection();
    const boutonProfil = document.getElementById('btnProfil');
    boutonProfil.addEventListener('click', () => {
        redirect('profil.php');
    });

    //chercher si l'tilisateur exist
    //on la trouvé (si pas trouvé erreur, sino redirigé)
    //si ok, deuxieme page on récupére ce qu'on sait de lui et on repli les value des fields. il faudra vérifié si tout les champ son rempli (en bonus).
});

function getConnectedUser() {
    return localStorage.name;
}

function findNom(userXML) {
    const nom = userXML.querySelector('Nom').textContent;
    return nom;
}

function findPrenom(userXML) {
    const prenom = userXML.querySelector('Prenom').textContent;
    return prenom;
}

function generateHeader() {
    const body = document.querySelector('body');

    const header = document.createElement('header');
    if (!window.location.pathname.includes('connexion.html')) {
        const divNom = document.createElement('div');
        header.appendChild(divNom);

        const labelNom = document.createElement('label');
        labelNom.id = 'labelNom';
        divNom.appendChild(labelNom);

        const divPrenom = document.createElement('div');
        header.appendChild(divPrenom);

        const labelPrenom = document.createElement('label');
        labelPrenom.id = 'labelPrenom';

        divPrenom.appendChild(labelPrenom);

        loadXMLDoc('./data/Utilisateurs.xml').then((xml) => {
            const labelPrenom = document.querySelector('#labelPrenom');
            const labelNom = document.querySelector('#labelNom');
            const userXML = findUser(xml, getConnectedUser());
            labelPrenom.innerHTML = findPrenom(userXML);
            labelNom.innerHTML = findNom(userXML);
        });

        const divDeconnexion = document.createElement('div');
        header.appendChild(divDeconnexion);

        const boutonDeconnexion = document.createElement('button');
        boutonDeconnexion.id = 'btnDeco';
        boutonDeconnexion.innerHTML = 'Déconnexion';
        divDeconnexion.appendChild(boutonDeconnexion);

        const divProfil = document.createElement('div');
        header.appendChild(divProfil);

        const boutonProfil = document.createElement('button');
        boutonProfil.id = 'btnProfil';
        boutonProfil.innerHTML = 'Profil';
        divProfil.appendChild(boutonProfil);
        
    }

    body.innerHTML = header.outerHTML + body.innerHTML;
}
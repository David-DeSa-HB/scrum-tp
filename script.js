window.addEventListener('load', () => {
    console.log('local : ', localStorage.name);
    generateHeader();
    loadXMLPartenaires();
    buttonConnection();
    generateFooter();
});
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
    if (user && user.querySelector('Password').textContent === password) {
        return true;
    }
    return false;
}

function connectUser(xml, username, password) {
    if (connectionIsCorrect(xml, username, password)) {
        localStorage.name = username;
        redirect('index.html');
        return;
    }
    const formLogin = document.querySelector('#formLogin');
    formLogin.reset();
    window.alert('Bad input for connection');
    return;
}

function loadPartenaires(xml) {
    const list = document.querySelector('#partenaires');

    const partenaires = xml.querySelectorAll('Partenaire');

    partenaires.forEach((partenaire) => {
        var article = createTagWithParent('article', list);

        var title = createTagFromXML('h3', article, partenaire, 'Nom');
        var logo = createTagWithParent('img', article);
        logo.src = partenaire.querySelector('Logo').textContent;
        var description = createTagFromXML('p', article, partenaire, 'Preview');
        var button = createTagWithParent('button', article, {
            content: 'Afficher la suite',
        });
        button.addEventListener('click', () => {
            localStorage.setItem(
                'partenaire',
                partenaire.querySelector('Nom').textContent
            );
            redirect('partenaire.html');
        });
    });
}

function showPartenaire(xml) {
    const section = document.querySelector('#partenaire');
    const like = document.querySelector('#like');
    const dislike = document.querySelector('#dislike');
    const comSection = document.querySelector('#commentaires');

    const partenaires = xml.querySelectorAll('Partenaire');

    let partenaire;

    partenaires.forEach((p) => {
        if (
            p.querySelector('Nom').textContent ==
            localStorage.getItem('partenaire')
        ) {
            partenaire = p;
        }
    });

    var element = document.createElement('article');

    var title = document.createElement('h1');
    var description = document.createElement('p');
    var logo = document.createElement('img');

    title.textContent = partenaire.querySelector('Nom').textContent;
    description.textContent =
        partenaire.querySelector('Description').textContent;

    logo.src = partenaire.querySelector('Logo').textContent;

    like.textContent = 'Like : ' + partenaire.querySelectorAll('Like').length;
    dislike.textContent =
        'Dislike : ' + partenaire.querySelectorAll('Dislike').length;

    element.append(title);
    element.append(logo);
    element.append(description);

    section.append(element);

    const commentaires = partenaire.querySelectorAll('Commentaire');

    commentaires.forEach((c) => {
        var element = document.createElement('article');

        var title = document.createElement('h3');
        var description = document.createElement('p');
        var date = document.createElement('p');

        title.textContent = c.querySelector('UserName').textContent;
        description.textContent = c.querySelector('Texte').textContent;
        date.textContent = c.querySelector('Date').textContent;

        element.append(title);
        element.append(description);
        element.append(date);

        comSection.append(element);
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
    if (document.querySelector('#partenaire') != null) {
        loadXMLDoc('./data/Partenaires.xml')
            .then((xml) => showPartenaire(xml))
            .catch(function (error) {
                console.error(error);
            });
    }
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
        const buttonDeco = document.getElementById('btnDeco');
        console.log('buttonDeco', buttonDeco);

        buttonDeco.addEventListener('click', () => {
            console.log('clique');

            try {
                delete localStorage.name;
                redirect('connexion.html');
                alert('Déconnexion réussie');
            } catch {
                alert('Problème de déconnexion');
            }
        });
    } catch (error) {}
}

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
    if (!window.location.pathname.includes('connexion.html')) {
        loadXMLDoc('./data/Utilisateurs.xml').then((xml) => {
            const body = document.querySelector('body');
            const header = createTagWithParent('header');

            const username = getConnectedUser();
            const userXML = findUser(xml, username);

            const divNom = createTagWithParent('div', header);
            const labelNom = createTagWithParent('label', divNom, {
                id: 'labelNom',
                content: findPrenom(userXML),
            });

            const divPrenom = createTagWithParent('div', header);
            const labelPrenom = createTagWithParent('label', divPrenom, {
                id: 'labelPrenom',
                content: findNom(userXML),
            });

            const divDeconnexion = createTagWithParent('div', header);

            const boutonDeconnexion = createTagWithParent(
                'button',
                divDeconnexion,
                {
                    id: 'btnDeco',
                    content: 'Déconnexion',
                }
            );
            body.innerHTML = header.outerHTML + body.innerHTML;
            makeDeconnection();
        });
    }
}

function createTagWithParent(
    name_tag,
    tag_parent,
    { class_tag, content, id } = {}
) {
    const tag = document.createElement(name_tag);
    if (tag_parent) {
        tag_parent.appendChild(tag);
    }
    if (class_tag) {
        tag.className = class_tag;
    }
    if (content) {
        tag.textContent = content;
    }
    if (id) {
        tag.id = id;
    }
    return tag;
}
function createTagFromXML(
    name_tag,
    tag_parent,
    xml,
    selector,
    { class_tag, id } = {}
) {
    return createTagWithParent(name_tag, tag_parent, {
        class_tag: class_tag,
        content: xml.querySelector(selector).textContent,
        id: id,
    });
}

function generateFooter() {
    const body = document.querySelector('body');

    const footer = createTagWithParent('footer', body);
}

function generictruc(xmlPRosmise, fonctin) {
    xmlPRosmise.then(fonction);
}
//chercher si l'tilisateur exist
//on la trouvé (si pas trouvé erreur, sino redirigé)
//si ok, deuxieme page on récupére ce qu'on sait de lui et on repli les value des fields. il faudra vérifié si tout les champ son rempli (en bonus).

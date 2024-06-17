<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve form data
    $username = $_POST['UserName'];
    $password = $_POST['Password'];
    $nom = $_POST['Nom'];
    $prenom = $_POST['Prenom'];
    $questionSecrete = $_POST['Question_secrete'];
    $reponseSecrete = $_POST['Reponse_a_la_question_secrete'];

    // Load the XML file
    $xmlFile = 'data/Utilisateurs.xml';
    $xml = new DOMDocument();
    $xml->load($xmlFile);

    // Find the Utilisateur element with the given username
    $xpath = new DOMXPath($xml);
    $query = "//Utilisateur[UserName='$username']";
    $existingUser = $xpath->query($query)->item(0);

    if ($existingUser) {
        // Update existing user
        $existingUser->getElementsByTagName('Password')->item(0)->nodeValue = htmlspecialchars($password);
        $existingUser->getElementsByTagName('Nom')->item(0)->nodeValue = htmlspecialchars($nom);
        $existingUser->getElementsByTagName('Prenom')->item(0)->nodeValue = htmlspecialchars($prenom);
        $existingUser->getElementsByTagName('Question_Secrete')->item(0)->nodeValue = htmlspecialchars($questionSecrete);
        $existingUser->getElementsByTagName('Reponse_a_la_question_Secrete')->item(0)->nodeValue = htmlspecialchars($reponseSecrete);
    } else {
        // Create a new Utilisateur element
        echo "L'utilisateur n'éxiste pas !";
        die();
    }

    // Save the modified XML back to the file
    $xml->save($xmlFile);

    echo "Inscription mise à jour réussie!";
} else {
    echo "Aucune donnée soumise!";
}

function makeNewUser($username,$password,$nom,$prenom,$questionSecrete,$reponseSecrete)
{
    $utilisateur = $xml->createElement('Utilisateur');

        $userNameElement = $xml->createElement('UserName', htmlspecialchars($username));
        $passwordElement = $xml->createElement('Password', htmlspecialchars($password));
        $nomElement = $xml->createElement('Nom', htmlspecialchars($nom));
        $prenomElement = $xml->createElement('Prenom', htmlspecialchars($prenom));
        $questionSecreteElement = $xml->createElement('Question_Secrete', htmlspecialchars($questionSecrete));
        $reponseSecreteElement = $xml->createElement('Reponse_a_la_question_Secrete', htmlspecialchars($reponseSecrete));

        // Append the child elements to the Utilisateur element
        $utilisateur->appendChild($userNameElement);
        $utilisateur->appendChild($passwordElement);
        $utilisateur->appendChild($nomElement);
        $utilisateur->appendChild($prenomElement);
        $utilisateur->appendChild($questionSecreteElement);
        $utilisateur->appendChild($reponseSecreteElement);

        // Append the new Utilisateur element to the root element
        $xml->documentElement->appendChild($utilisateur);
}
?>

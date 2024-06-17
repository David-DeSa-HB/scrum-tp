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
        // Helper function to update or create an element
        function updateOrCreateElement($xml, $parent, $tag, $value) {
            $element = $parent->getElementsByTagName($tag)->item(0);
            if ($element) {
                $element->nodeValue = htmlspecialchars($value);
            } else {
                $newElement = $xml->createElement($tag, htmlspecialchars($value));
                $parent->appendChild($newElement);
            }
        }

        // Update or create elements
        updateOrCreateElement($xml, $existingUser, 'Password', $password);
        updateOrCreateElement($xml, $existingUser, 'Nom', $nom);
        updateOrCreateElement($xml, $existingUser, 'Prenom', $prenom);
        updateOrCreateElement($xml, $existingUser, 'Question_Secrete', $questionSecrete);
        updateOrCreateElement($xml, $existingUser, 'Reponse_a_la_question_Secrete', $reponseSecrete);
    } else {
        // Create a new Utilisateur element
        echo "L'utilisateur n'existe pas !";
        die();
    }

    // Save the modified XML back to the file
    $xml->save($xmlFile);

    echo "Inscription mise à jour réussie!";

    // Redirect to index.html
    header("Location: index.html");
    exit();
} else {
    echo "Aucune donnée soumise!";
}
?>


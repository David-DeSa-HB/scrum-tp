<?php

    $username = $_POST["username"];
    $texte = $_POST["username"];
    $date = $_POST["username"];


    if(class_exists('DOMDocument')) { 
        echo "Class name exists"; 
    } 
    else { 
        echo "Class name does not exist"; 
    } 

    $dom = new DOMDocument();
    $dom->load('data/Utilisateurs.xml')


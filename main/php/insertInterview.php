<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();

if (isset($_REQUEST["nome"])) {
    $nome = $connection->real_escape_string($_REQUEST["nome"]);
} else {
    http_response_code(400);
    die("Nome mancante");
}

if (isset($_REQUEST["cognome"])) {
    $cognome = $connection->real_escape_string($_REQUEST["cognome"]);
} else {
    http_response_code(400);
    die("Cognome mancante");
}

if (isset($_REQUEST["matricola"])) {
    $matricola = $connection->real_escape_string($_REQUEST["matricola"]);
} else {
    http_response_code(400);
    die("Matricola mancante");
}

if (isset($_REQUEST["data"])) {
    $data = $connection->real_escape_string($_REQUEST["data"]);
} else {
    http_response_code(400);
    die("Data mancante");
}

if (isset($_REQUEST["docente"])) {
    $docente = $connection->real_escape_string($_REQUEST["docente"]);
} else {
    http_response_code(400);
    die("Docente mancante");
}

$sql = "INSERT INTO colloqui (nome, cognome, matricola, ora, docente) VALUES ('$nome', '$cognome', $matricola, '$data', '$docente')";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
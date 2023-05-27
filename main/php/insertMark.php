<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();

if (isset($_REQUEST["matricola"])) {
    $matricola = $connection->real_escape_string($_REQUEST["matricola"]);
} else {
    http_response_code(400);
    die("Manca parametro matricola");
}

if (isset($_REQUEST["subject"])) {
    $subject = $connection->real_escape_string($_REQUEST["subject"]);
} else {
    http_response_code(400);
    die("Manca parametro materia");
}

if (isset($_REQUEST["mark"])) {
    $mark = $connection->real_escape_string($_REQUEST["mark"]);
} else {
    http_response_code(400);
    die("Manca parametro voto");
}

if (isset($_REQUEST["teacher"])) {
    $teacher = $connection->real_escape_string($_REQUEST["teacher"]);
} else {
    http_response_code(400);
    die("Manca parametro docente");
}

$sql = "INSERT INTO voti (matricola, materia, voto, docente) VALUES ($matricola, '$subject', $mark, '$teacher')";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();

if (isset($_REQUEST["topic"])) {
    $topic = $connection->real_escape_string($_REQUEST["topic"]);
} else {
    http_response_code(400);
    die("Parametro mancante argomento");
}

if (isset($_REQUEST["date"])) {
    $date = $connection->real_escape_string($_REQUEST["date"]);
} else {
    http_response_code(400);
    die("Parametro mancante data");
}

if (isset($_REQUEST["class"])) {
    $class = $connection->real_escape_string($_REQUEST["class"]);
} else {
    http_response_code(400);
    die("Parametro mancante classe");
}

if (isset($_REQUEST["subject"])) {
    $subject = $connection->real_escape_string($_REQUEST["subject"]);
} else {
    http_response_code(400);
    die("Parametro mancante materia");
}

$sql = "INSERT INTO argomenti (argomento, data, classe, materia) VALUES ('$topic', '$date', '$class', $subject)";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
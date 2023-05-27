<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();

if (isset($_REQUEST["receiver"])) {
    $receiver = $connection->real_escape_string($_REQUEST["receiver"]);
} else {
    http_response_code(400);
    die("Manca parametro receiver");
}

if (isset($_REQUEST["sender"])) {
    $sender = $connection->real_escape_string($_REQUEST["sender"]);
} else {
    http_response_code(400);
    die("Manca parametro sender");
}

if (isset($_REQUEST["oggetto"])) {
    $oggetto = $connection->real_escape_string($_REQUEST["oggetto"]);
} else {
    http_response_code(400);
    die("Manca parametro oggetto");
}

if (isset($_REQUEST["text"])) {
    $text = $connection->real_escape_string($_REQUEST["text"]);
} else {
    http_response_code(400);
    die("Manca parametro messaggio");
}

$sql = "INSERT INTO messaggi (oggetto, testo, mittente, destinatario) VALUES ('$oggetto', '$text', '$sender', '$receiver')";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
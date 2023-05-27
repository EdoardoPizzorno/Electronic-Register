<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["user"])) {
    $user = $_GET["user"];
} else {
    http_response_code(400);
    die("Manca parametro utente");
}

if (isset($_GET["current_receiver"])) {
    $current_receiver = $_GET["current_receiver"];
} else {
    http_response_code(400);
    die("Manca parametro destinatario");
}

$connection = openConnection();
$sql = "SELECT destinatario,mittente,oggetto,orario,testo from messaggi WHERE mittente='$user' AND destinatario='$current_receiver'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo(json_encode($data));

$connection->close();

?>
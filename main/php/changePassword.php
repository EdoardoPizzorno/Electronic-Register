<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();

if (isset($_REQUEST["newPassword"])) {
    $newPassword = $connection->real_escape_string($_REQUEST["newPassword"]);
} else {
    http_response_code(400);
    echo ("Parametro mancante nuova password");
}

if (isset($_REQUEST["user"])) {
    $user = $connection->real_escape_string($_REQUEST["user"]);
} else {
    http_response_code(400);
    echo ("Parametro mancante utente");
}

$sql = "UPDATE studenti SET pass='$newPassword' WHERE user='$user'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
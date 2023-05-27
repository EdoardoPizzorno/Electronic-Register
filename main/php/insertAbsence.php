<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();

if (isset($_REQUEST["student"])) {
    $student = $connection->real_escape_string($_REQUEST["student"]);
} else {
    http_response_code(400);
    die("Manca parametro studente");
}

$sql = "INSERT INTO assenze (matricola) VALUES ($student)";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
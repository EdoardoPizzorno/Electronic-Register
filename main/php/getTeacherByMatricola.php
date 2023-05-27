<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["teacher"])) {
    $teacher = $_GET["teacher"];
} else {
    http_response_code(400);
    die("Manca parametro professore");
}

$connection = openConnection();
$sql = "SELECT cognome,nome from studenti WHERE matricola='$teacher'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data[0]));

$connection->close();

?>
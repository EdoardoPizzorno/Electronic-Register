<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["class"])) {
    $class = $_GET["class"];
} else {
    http_response_code(400);
    die("Manca parametro classe");
}

$connection = openConnection("registro");
$sql = "SELECT immagine,user,cognome,nome from studenti WHERE classe='$class'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

$connection->close();

?>
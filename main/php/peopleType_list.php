<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["type"])) {
    $type = $_GET["type"];
} else {
    http_response_code(400);
    die("Manca parametro utente");
}

$connection = openConnection();
$sql = "SELECT cognome,nome,matricola,user,docente from studenti WHERE docente='$type'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

?>
<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["user"])) {
    $user = $_GET["user"];
} else {
    http_response_code(400);
    die("Manca parametro utente");
}

$connection = openConnection();
$sql = "SELECT materia,data,voto,docente from voti WHERE matricola='$user' ORDER BY data DESC";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo(json_encode($data));

?>
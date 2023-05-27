<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["user"])) {
    $user = $_GET["user"];
} else {
    http_response_code(400);
    die("Manca parametro utente");
}
if (isset($_GET["subjectId"])) {
    $subject = $_GET["subjectId"];
} else {
    http_response_code(400);
    die("Manca parametro materia");
}

$connection = openConnection();
$sql = "SELECT voto from voti WHERE matricola='$user' AND materia='$subject'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo(json_encode($data[0]));

?>
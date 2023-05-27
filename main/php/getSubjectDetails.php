<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["matricola"])) {
    $matricola = $_GET["matricola"];
} else {
    http_response_code(400);
    die("Manca parametro matricola");
}

if (isset($_GET["subjectId"])) {
    $subjectId = $_GET["subjectId"];
} else {
    http_response_code(400);
    die("Manca parametro Id materia");
}

$connection = openConnection();
$sql = "SELECT data,voto FROM voti WHERE materia=$subjectId AND matricola=$matricola";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

$connection->close();

?>
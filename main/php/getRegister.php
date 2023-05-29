<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["class"])) {
    $class = $_GET["class"];
} else {
    http_response_code(400);
    die("Manca parametro classe");
}

if (isset($_GET["sunday"])) {
    $sunday = $_GET["sunday"];
} else {
    http_response_code(400);
    die("Manca parametro inizio settimana");
}

if (isset($_GET["saturday"])) {
    $saturday = $_GET["saturday"];
} else {
    http_response_code(400);
    die("Manca parametro fine settimana");
}

$connection = openConnection();
#$sql = "SELECT data,materia,argomento FROM argomenti WHERE classe='$class' ORDER BY data ASC";
$sql = "SELECT data,materia,argomento from argomenti WHERE classe='$class' AND data BETWEEN '$sunday' AND '$saturday' ORDER BY data ASC";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

$connection->close();

?>
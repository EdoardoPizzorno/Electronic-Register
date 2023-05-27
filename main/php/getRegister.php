<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["class"])) {
    $class = $_GET["class"];
} else {
    http_response_code(400);
    die("Manca parametro classe");
}

$connection = openConnection();
$sql = "SELECT data,materia,argomento FROM argomenti WHERE classe='$class' ORDER BY data ASC";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

$connection->close();

?>
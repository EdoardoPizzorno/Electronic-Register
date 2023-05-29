<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["teacher"])) {
    $teacher = $_GET["teacher"];
} else {
    http_response_code(400);
    die("Manca parametro docente");
}

$connection = openConnection();
$sql = "SELECT * from colloqui WHERE docente='$teacher' ORDER BY ora ASC";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

?>
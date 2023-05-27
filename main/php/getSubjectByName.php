<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["subjectName"])) {
    $subjectName = $_GET["subjectName"];
} else {
    http_response_code(400);
    die("Manca parametro nome materia");
}

$connection = openConnection();
$sql = "SELECT id FROM materie WHERE materia='$subjectName'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data[0]));

$connection->close();

?>
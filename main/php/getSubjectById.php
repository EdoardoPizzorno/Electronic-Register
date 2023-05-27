<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["subjectId"])) {
    $subjectId = $_GET["subjectId"];
} else {
    http_response_code(400);
    die("Manca parametro materia");
}

$connection = openConnection();
$sql = "SELECT materia FROM materie WHERE id='$subjectId'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data[0]));

$connection->close();

?>
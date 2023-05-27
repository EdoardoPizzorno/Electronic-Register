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
$sql = "SELECT materie from classi WHERE nome='$class'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo(json_encode($data[0]));

?>
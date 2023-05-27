<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["current_class"])) {
    $current_class = $_GET["current_class"];
} else {
    http_response_code(400);
    die("Manca parametro classe");
}

$connection = openConnection();
$sql = "SELECT materie FROM classi WHERE nome='$current_class'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data[0]));

$connection->close();

?>
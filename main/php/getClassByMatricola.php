<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["matricola"])) {
    $matricola = $_GET["matricola"];
} else {
    http_response_code(400);
    die("Manca parametro matricola");
}

$connection = openConnection();
$sql = "SELECT classe from studenti WHERE matricola=$matricola";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data[0]));

$connection->close();

?>
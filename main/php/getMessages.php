<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["user"])) {
    $user = $_GET["user"];
} else {
    http_response_code(400);
    die("Manca parametro utente");
}

if(isset($_GET["class"])) {
    $class = $_GET["class"];
} else {
    http_response_code(400);
    die("Manca parametro classe");
}

$connection = openConnection();
$sql = "SELECT * from messaggi WHERE destinatario='$user' OR destinatario='$class' ORDER BY orario DESC";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo(json_encode($data));

$connection->close();

?>
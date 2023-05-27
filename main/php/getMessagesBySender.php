<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["sender"])) {
    $sender = $_GET["sender"];
} else {
    http_response_code(400);
    die("Manca parametro mittente");
}

if (isset($_GET["class"])) {
    $class = $_GET["class"];
} else {
    http_response_code(400);
    die("Manca parametro classe");
}

if (isset($_GET["user"])) {
    $user = $_GET["user"];
} else {
    http_response_code(400);
    die("Manca parametro user");
}

$connection = openConnection();
$sql = "SELECT * from messaggi WHERE (destinatario='$class' OR destinatario='$user') AND mittente='$sender' ORDER BY orario DESC";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

$connection->close();

?>
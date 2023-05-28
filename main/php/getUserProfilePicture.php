<?php
header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["user"]))
    $user = $_GET["user"];
else {
    http_response_code(400);
    die("Manca parametro utente");
}

// Query
$connection = openConnection();

$sql = "SELECT immagine from studenti where user='$user'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

echo (json_encode($data[0]));

$connection->close();
?>
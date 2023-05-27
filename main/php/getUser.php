<?php
header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

// Parametri di sessione
checkSession();
if (isset($_SESSION["user"]))
    $user = $_SESSION["user"];
else {
    http_response_code(403);
    die("Manca parametro utente");
}

// Query
$connection = openConnection();

$sql = "SELECT * from studenti where user='$user'";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

echo (json_encode($data[0]));

$connection->close();
?>
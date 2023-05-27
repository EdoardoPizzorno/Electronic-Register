<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();

if (isset($_REQUEST["matricola"])) {
    $matricola = $connection->real_escape_string($_REQUEST["matricola"]);
} else {
    http_response_code(400);
    die("Manca parametro matricola");
}

if (isset($_REQUEST["residence"])) {
    $residence = $connection->real_escape_string($_REQUEST["residence"]);
} else {
    http_response_code(400);
    die("Manca parametro residenza");
}

if (isset($_REQUEST["address"])) {
    $address = $connection->real_escape_string($_REQUEST["address"]);
} else {
    http_response_code(400);
    die("Manca parametro indirizzo");
}

$sql = "UPDATE studenti SET indrizzo='$address', residenza='$residence' WHERE matricola=$matricola";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

?>
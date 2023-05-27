<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();

if (isset($_REQUEST["id"])) {
    $id = $connection->real_escape_string($_REQUEST["id"]);
} else {
    http_response_code(400);
    die("Manca parametro id");
}

if (isset($_REQUEST["newMark"])) {
    $newMark = $connection->real_escape_string($_REQUEST["newMark"]);
} else {
    http_response_code(400);
    die("Manca parametro nuovo voto");
}

$sql = "UPDATE voti SET voto='$newMark' WHERE id=$id";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo (json_encode($data));

?>
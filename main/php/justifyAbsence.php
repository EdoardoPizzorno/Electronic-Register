<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_REQUEST["id"])) {
    $id = $_REQUEST["id"];
} else {
    http_response_code(400);
    die("Manca parametro id");
}

if (isset($_REQUEST["reason"])) {
    $reason = $_REQUEST["reason"];
} else {
    http_response_code(400);
    die("Manca parametro motivazione");
}

$connection = openConnection("registro");
$sql = "UPDATE assenze SET motivazione='$reason',giustificato=1 WHERE id=$id";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
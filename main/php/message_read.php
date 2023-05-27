<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_REQUEST["messageId"])) {
    $messageId = $_REQUEST["messageId"];
} else {
    http_response_code(400);
    die("Manca parametro id");
}

$connection = openConnection();
$sql = "UPDATE messaggi SET visualizzato=1 WHERE id=$messageId";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
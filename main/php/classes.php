<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection("registro");
$sql = "SELECT nome from classi";
$data = eseguiQuery($connection, $sql);

http_response_code(200);
echo(json_encode($data));

$connection->close();

?>
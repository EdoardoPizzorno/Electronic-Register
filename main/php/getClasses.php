<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();
$sql = "SELECT nome from classi";
$data = eseguiQuery($connection, $sql);

$i = 0;
foreach($data as $item) {
    $sql = "SELECT * from studenti WHERE classe='$item[nome]'";
    $data[$i++]["numStudents"] = count(eseguiQuery($connection, $sql));
}

http_response_code(200);
echo(json_encode($data));

$connection->close();

?>
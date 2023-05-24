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

if (isset($_REQUEST["sign"])) {
    $sign = $_REQUEST["sign"];
} else {
    http_response_code(400);
    die("Manca parametro firma");
}

$binary_data = base64_decode($sign);

$connection = openConnection("registro");
$sql = "UPDATE assenze SET motivazione='$reason',firma='$binary_data' WHERE id=$id";
$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
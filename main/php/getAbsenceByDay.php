<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (isset($_GET["today"])) {
    $today = $_GET["today"];
} else {
    http_response_code(400);
    die("Manca parametro giorno");
}

if (isset($_GET["student"])) {
    $student = $_GET["student"];
} else {
    http_response_code(400);
    die("Manca parametro studente");
}

$connection = openConnection();
$sql = "SELECT * from assenze WHERE data='$today' AND matricola=$student";
$data = eseguiQuery($connection, $sql);

if (count($data) == 0) {
    http_response_code(200);
} else {
    http_response_code(408); # Student already signed absent
}

?>
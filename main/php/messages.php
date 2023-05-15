<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection("registro");



$connection->close();

?>
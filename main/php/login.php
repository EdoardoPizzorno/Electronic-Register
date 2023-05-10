<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

define("TIMEOUT", 30); # 30sec Timeout

$connection = openConnection("registro");

if (isset($_REQUEST["user"])) {
    $user = $connection->real_escape_string($_REQUEST["user"]);
} else {
    http_response_code(400);
    die("Username mancante");
}

if (isset($_REQUEST["pass"])) {
    $pass = $connection->real_escape_string($_REQUEST["pass"]);
} else {
    http_response_code(400);
    die("Password mancante");
}

$sql = "SELECT * from studenti where user='$user' OR matricola='$user'";
$data = eseguiQuery($connection, $sql);

if (count($data) != 0) {
    if ($data[0]["pass"] == $pass) {
        http_response_code(200);
        #echo (json_encode("OK"));

        session_start();
        $_SESSION["user"] = $data[0]["user"];
        $_SESSION["timeout"] = time() + TIMEOUT;

        setcookie(session_name(), session_id(), $_SESSION["timeout"], "/"); # cookie's name; cookie's value (session id); timeout
    } else {
        http_response_code(401);
        die("Password errata");
    }
} else {
    http_response_code(401);
    die("Username non esistente");
}

#echo (json_encode($data));

$connection->close();

?>
<?php

header("content-type:application/json; charset=utf-8");

session_start();

if (isset($_SESSION["user"])) {
    $user = $_SESSION["user"];
} else {
    http_response_code(404);
    die("Non ci sono sessioni attive");
}

http_response_code(200);
echo (json_encode($user));

?>
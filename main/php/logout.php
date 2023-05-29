<?php
header("content-type:application/json; charset=utf-8");

session_start();
session_unset();
if (isset($_COOKIE[session_name()]))
	setcookie(session_name(), '', time() - 42000, '/');
session_destroy();

http_response_code(200);
?>
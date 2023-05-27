<?php
	header("content-type:application/json; charset=utf-8");

	session_start();
	session_unset();
	session_destroy();

	http_response_code(200);
	echo(json_encode("OK"));
?>
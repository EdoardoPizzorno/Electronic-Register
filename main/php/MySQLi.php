<?php

define("TIMEOUT", 600); # 10min Timeout

function openConnection()
{
	
	define("DB_NAME", "registro");
	define("DB_HOST", "localhost");
	define("DB_USER", "root");
	define("DB_PASSWORD", "");

	// Fa si che in caso di errore venga generata un'eccezione
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

	try {
		$connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
		// Fa si che eventuali caratteri speciali vengano gestiti correttamente
		$connection->set_charset("utf8");
		return $connection;
	} catch (exception $ex) {
		die("Errore connesione database. " . $ex->getMessage());
	}
}

function eseguiQuery($connection, $sql)
{
	try {
		$rs = $connection->query($sql);
		if (!is_bool($rs)) {
			// Converte il rs (record set), restituito dal metodo query(), in un vettore enumerativo di oggetti
			$data = $rs->fetch_all(MYSQLI_ASSOC);
		} else {
			$data = $rs;
		}
		return $data;
	} catch (exception $ex) {
		$connection->close();
		die("Errore esecuzione query. " . $ex->getMessage());
	}
}

function checkSession()
{
	session_start();
	if (isset($_SESSION["timeout"]) && $_SESSION["timeout"] > time()) {
		$_SESSION["timeout"] = time() + TIMEOUT;
		setcookie(session_name(), session_id(), $_SESSION["timeout"], "/");
	} else {
		session_unset();
		session_destroy();
		http_response_code(403);
		die("Sessione scaduta.");
	}
}
?>
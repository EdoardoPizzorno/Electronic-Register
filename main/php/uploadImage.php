<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

if (!isset($_REQUEST["user"])) {
	http_response_code(400);
	die("Parametro mancante user");
}
$user = $_POST["user"];

if (!isset($_FILES["txtFiles"])) {
	http_response_code(400);
	die("Parametro mancante txtFiles");
}
$filesRicevuti = $_FILES["txtFiles"];

$overwrite = true;

$response = array(); //array enumerativo con i LOG da inviare al client

for ($i = 0; $i < count($filesRicevuti["name"]); $i++) {
	$item = array();

	$filename = basename($filesRicevuti["name"][$i]);
	$size = $filesRicevuti["size"][$i];
	if ($size > 2000000) { // max 2MB
		$item["ris"] = "NOK";
		$item["msg"] = "Il file $filename eccede i 2MB per cui NON viene salvato";
		array_push($response, $item);
		continue;
	}
	$mimeType = $filesRicevuti["type"][$i];
	$ext = pathinfo($filename, PATHINFO_EXTENSION);

	$source_file = $filesRicevuti["tmp_name"][$i];
	$target_file = "uploads/$filename";
	if (file_exists($target_file)) {
		if ($overwrite == false) {
			$item["ris"] = "NOK";
			$item["msg"] = "Il file $filename esiste già e non può essere sovrascritto";
			array_push($response, $item);
			continue;
		}
	}

	if (move_uploaded_file($source_file, $target_file)) {
		$item["ris"] = "ok";
		$item["msg"] = "Il file $filename è stato caricato correttamente : SIZE: $size, MIME TYPE: $mimeType";
	} else {
		$item["ris"] = "NOK";
		$item["msg"] = "Il file $filename ha generato un errore";
	}
	array_push($response, $item);
}

$connection = openConnection();
$sql = "UPDATE studenti SET immagine='$filename' WHERE matricola='$user'";
$data = eseguiQuery($connection, $sql);

echo json_encode($filename);
?>
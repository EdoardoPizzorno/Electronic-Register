<?php

header("content-type:application/json; charset=utf-8");
require("MySQLi.php");

$connection = openConnection();
$sql = "SELECT user from studenti";
$previous_data = eseguiQuery($connection, $sql);

if (isset($_REQUEST["surname"])) {
    $surname = $connection->real_escape_string($_REQUEST["surname"]);
} else {
    http_response_code(400);
    die("Manca parametro cognome");
}

if (isset($_REQUEST["name"])) {
    $name = $connection->real_escape_string($_REQUEST["name"]);
} else {
    http_response_code(400);
    die("Manca parametro nome");
}

if (isset($_REQUEST["username"])) {
    $username = $connection->real_escape_string($_REQUEST["username"]);
} else {
    http_response_code(400);
    die("Manca parametro username");
}

if (isset($_REQUEST["residence"])) {
    $residence = $connection->real_escape_string($_REQUEST["residence"]);
} else {
    http_response_code(400);
    die("Manca parametro residenza");
}

if (isset($_REQUEST["address"])) {
    $address = $connection->real_escape_string($_REQUEST["address"]);
} else {
    http_response_code(400);
    die("Manca parametro indirizzo");
}

if (isset($_REQUEST["password"])) {
    $password = $connection->real_escape_string($_REQUEST["password"]);
} else {
    http_response_code(400);
    die("Manca parametro password");
}

if (isset($_REQUEST["role"])) {
    $role = $connection->real_escape_string($_REQUEST["role"]);
} else {
    http_response_code(400);
    die("Manca parametro professione");
}

if ($role == 0) {
    if (isset($_REQUEST["classroom"])) { # if student --> REQUEST classroom
        $classroom = $connection->real_escape_string($_REQUEST["classroom"]);
    } else {
        http_response_code(400);
        die("Manca parametro classe");
    }
}


# Check if there's the username in the database
$flag = false;
foreach ($previous_data as $item)
    if ($item['user'] == $username)
        $flag = true;

if (!$flag) {
    if ($role == 1) { # TEACHER
        $sql = "INSERT INTO studenti (cognome, nome, user, pass, residenza, indrizzo, docente) VALUES ('$surname', '$name', '$username', '$password', '$residence', '$address', $role)";
    } else { # STUDENT
        $classroom = $connection->real_escape_string($_REQUEST["classroom"]);
        $sql = "INSERT INTO studenti (cognome, nome, user, pass, classe, residenza, indrizzo, docente) VALUES ('$surname', '$name', '$username', '$password', '$classroom', '$residence', '$address', $role)";
    }
} else {
    http_response_code(404);
    die("Username già presente nel database");
}

$data = eseguiQuery($connection, $sql);

http_response_code(200);

$connection->close();

?>
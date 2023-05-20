<?php

header("content-type:application/json; charset=utf-8");
require("PHPMailer.php");
require("SMTP.php");
require("environment.php");

if (isset($_REQUEST["receiver"])) {
    $receiver = $_REQUEST["receiver"];
} else {
    http_response_code(400);
    die("Parametro mancante destinatario");
}

$newPassword = rand(10000000, 999999999); # New password (random)

$mailer = new PHPMailer\PHPMailer\PHPMailer();
$mailer->isSMTP(); # Enable SMTP Protocol
$mailer->SMTPDebug = 0;
$mailer->Host = "smtp.gmail.com"; # Host name
$mailer->SMTPSecure = "tls";
$mailer->Port = 587;
$mailer->SMTPAuth = true; # Username and Password based
$mailer->Username = MAIL_ADDRESS;
$mailer->Password = MAIL_PASSWORD;
$mailer->setFrom(MAIL_ADDRESS); # Set sender
$mailer->addAddress($receiver); # Set receiver
$mailer->addBCC("");
$mailer->Subject = $newPassword; # Email subject

$body = "";
$fileName = "./passwordLostMessage.html";
$fh = fopen($fileName, "r");

if ($fh) {
    $body .= fread($fh, filesize($fileName));
    $body = str_replace("__password", $newPassword, $body);
    fclose($fh);
}
$mailer->Body = $body;
$mailer->isHTML(true);
#$mailer->addAttachment("../img/logo.png");

if ($mailer->send()) { # True if email has been sent successfully
    http_response_code(200);
    echo (json_encode($newPassword));
} else {
    http_response_code(550);
    die("Errore durante l'invio della mail " . $mailer->ErrorInfo);
}

?>
<?php

try {
	$user_input = file_get_contents('php://input');
	$user_input = json_decode($user_input, true);
	if (!key_exists("text", $user_input)) die();
	if (!key_exists("email", $user_input)) die();
	if (!key_exists("dump", $user_input)) die();
} catch (Exception $e) {
	die();
}


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once 'Config.php';
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$mail = new PHPMailer(true);

try {
	$mail->isSMTP();
	$mail->Host = Config::SMTP_SERVER;
	$mail->SMTPAuth = true;
	$mail->Username = Config::SMTP_USER;
	$mail->Password = Config::SMTP_PASS;
	$mail->SMTPSecure = 'tls';
	$mail->Port = 587;
	$mail->setFrom(Config::SMTP_USER, 'Super Clever Plan - Bug Reporter');
} catch (Exception $e) {
	die();
}


$mail->addAddress(Config::MAIL_TARGET); 
$mail->Subject = 'Super Clever Plan - Bug Reporter';
$mail->Body = "Email:" . substr($user_input["email"], 0, 256) . "\n";
$mail->Body .= "Text:" . substr($user_input["text"], 0, 10240) . "\n";
$mail->Body .= "\n--cut here--\n" . substr(json_encode($user_input["dump"]), 0, 65536) . "\n--cut here--";
$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';

$mail->send();

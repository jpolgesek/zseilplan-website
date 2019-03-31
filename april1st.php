<?php

$filename = "3b5cf5e6-78ca-481e-8d90-030806541783-3b5cf5e6-78ca-481e-8d90-030806541783" . DIRECTORY_SEPARATOR . date("Y-m-d-H-i-s") . "_" . $_SERVER['REMOTE_ADDR'] . ".json";

try {
	$inputJSON = file_get_contents('php://input');
	if (json_decode($inputJSON) == NULL) die();
	file_put_contents($filename, $inputJSON);
} catch (Exception $e) {
	die();
}
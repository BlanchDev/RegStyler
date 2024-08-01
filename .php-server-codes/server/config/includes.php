<?php 

session_start();
ob_start();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

date_default_timezone_set('Europe/Istanbul');
$bugun = date("H:i:s d.m.Y");
$currentDate = time();
$ip = $_SERVER['REMOTE_ADDR'];
$url = $_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];

require($_SERVER['DOCUMENT_ROOT']."/server/config/database.php"); 


?>
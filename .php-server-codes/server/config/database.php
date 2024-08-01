<?php

if (strstr($url, "regstyler.blanch.dev")) {

  $dbuser = "user";
  $dbpass = "password";

  try {
    $db = new PDO('mysql:host=localhost;dbname=DBNAME', $dbuser, $dbpass);
    $db -> exec("set names utf8");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  } catch (PDOException $e) {
    echo "Error!: " . $e->getMessage();
  }


}

?>
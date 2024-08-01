<?php

require($_SERVER['DOCUMENT_ROOT'] . "/server/config/includes.php");

$reactJson = json_decode(file_get_contents("php://input"), true);

$packageTitle = $reactJson['packageTitle'];
$checkedRegsID = $reactJson['checkedRegsID'];

$type = $reactJson['type'];
$uid = $reactJson['uid'];
$token = $reactJson['token'];
$browser = $reactJson['browser'];
$checkToken = $db->prepare("SELECT * FROM tokens WHERE uid=? AND token=? AND connectedBrowser=?");
$checkToken->execute(array($uid, $token, $browser));
$checkedToken = $checkToken->fetch(PDO::FETCH_ASSOC);

$checkUser = $db->prepare("SELECT * FROM users WHERE uid=?");
$checkUser->execute(array($uid));
$checkedUser = $checkUser->fetch(PDO::FETCH_ASSOC);

if ($type == "getPackageStore") {

    $getPackages = $db->prepare("SELECT * FROM packages WHERE isPublic=? AND isDeleted=? ORDER BY id ASC");
    $getPackages->execute( array(1, 0) );

    $packageArray = [];
    while ($packageData = $getPackages->fetch(PDO::FETCH_ASSOC)) {
        $getUser = $db->prepare("SELECT * FROM users WHERE uid=? ORDER BY id ASC");
        $getUser->execute( array($packageData["uid"]) );

        while ($userData = $getUser->fetch(PDO::FETCH_ASSOC)) {
            $packageArray[] = [
                "id" => $packageData["id"],
                "urlParam" => $packageData["urlParam"],
                "title" => $packageData["title"],
                "description" => $packageData["description"],
                "optimizations" => $packageData["optimizations"],
                "isPublic" => $packageData["isPublic"],
                "owner" => $packageData["owner"],
                "createdAt" => $packageData["createdAt"],
                "nickname" => $userData["nickname"],
                "photo" => $userData["photo"],
                "role" => $userData["role"],
            ];
        }
    }

    echo json_encode($packageArray);
    exit();
}

if ($checkedToken AND $checkedUser) {

    if ($type == "getPackages") {

        $getPackages = $db->prepare("SELECT * FROM packages WHERE uid=? AND isDeleted=? ORDER BY id ASC");
        $getPackages->execute( array($uid, 0) );

        $packageArray = [];
        while ($packageData = $getPackages->fetch(PDO::FETCH_ASSOC)) {
            $getUser = $db->prepare("SELECT * FROM users WHERE uid=? ORDER BY id ASC");
            $getUser->execute( array($packageData["uid"]) );

            while ($userData = $getUser->fetch(PDO::FETCH_ASSOC)) {
                $packageArray[] = [
                    "id" => $packageData["id"],
                    "urlParam" => $packageData["urlParam"],
                    "title" => $packageData["title"],
                    "description" => $packageData["description"],
                    "optimizations" => $packageData["optimizations"],
                    "isPublic" => $packageData["isPublic"],
                    "owner" => $packageData["owner"],
                    "createdAt" => $packageData["createdAt"],
                    "nickname" => $userData["nickname"],
                    "photo" => $userData["photo"],
                    "role" => $userData["role"],
                ];
            }
        }

        echo json_encode($packageArray);
        exit();
    }

    if ($type == "createPackage" AND !empty($uid) AND !empty($packageTitle) AND !empty($checkedRegsID)) {

        $randomNumberForParam = rand(0, 999999999);
        $urlParam = strtolower($randomNumberForParam.$checkedUser["id"]);

        $register_request = $db->prepare("INSERT INTO packages SET urlParam=?, uid=?, title=?, description=?, optimizations=?, isPublic=?, owner=?, createdAt=?, isDeleted=?");
        $register_success = $register_request->execute(array($urlParam, $uid, $packageTitle, "No Desc...", json_encode($checkedRegsID), 0, $checkedUser["role"], $currentDate, 0));

        if ($register_success) {
            $response = ["success" => true, "type" => "createPackage", "urlParam" => $urlParam];
        } else {
            $response = ["success" => false, "type" => "createPackage"];
        }

        echo json_encode($response);
        exit();
    }
}

?>
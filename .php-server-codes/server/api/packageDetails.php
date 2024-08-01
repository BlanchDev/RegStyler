<?php 

require($_SERVER['DOCUMENT_ROOT'] . "/server/config/includes.php");

$reactJson = json_decode(file_get_contents("php://input"), true);

$packageID = $reactJson['packageID'];
$packageTitle = $reactJson['packageTitle'];
$packageDescription = $reactJson['packageDescription'];
$optimizationsID = $reactJson['optimizationsID'];
$isPublic = $reactJson['isPublic'];

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

if ($type == "getPackageDetails") {

        //get package details
    $getPackageDetails = $db->prepare("SELECT * FROM packages WHERE urlParam=? AND isDeleted=? ORDER BY id ASC");
    $getPackageDetails->execute(array($packageID, 0));
    $packageDetail = $getPackageDetails->fetch(PDO::FETCH_ASSOC);

    if ($packageDetail["isPublic"] == 1 || ($packageDetail && $packageDetail["uid"] == $checkedToken["uid"] && $packageDetail["uid"] == $checkedUser["uid"])) {
        $getUser = $db->prepare("SELECT * FROM users WHERE uid=? ORDER BY id ASC");
        $getUser->execute(array($packageDetail["uid"]));
        $userData = $getUser->fetch(PDO::FETCH_ASSOC);

        //get optimizations
        $optimizationIds = json_decode($packageDetail["optimizations"], true);
        $optimizations = [];

        foreach ($optimizationIds as $optimizationId) {
            $getOptimization = $db->prepare("SELECT * FROM optimizations WHERE id=? AND (uid=? OR owner=?) AND isDeleted=?");
            $getOptimization->execute(array($optimizationId, $packageDetail["uid"], "admin", 0));
            $optimization = $getOptimization->fetch(PDO::FETCH_ASSOC);

            if ($optimization) {
                $optimizations[] = [
                    "id" => $optimization["id"],
                    "title" => $optimization["title"],
                    "description" => $optimization["description"],
                    "code" => $optimization["code"],
                    "category" => $optimization["category"],
                    "owner" => $optimization["owner"],
                    "createdAt" => $optimization["createdAt"]
                ];
            }
        }

        $packageDetailArray = [
            "id" => $packageDetail["id"],
            "urlParam" => $packageDetail["urlParam"],
            "uid" => $userData["uid"],
            "title" => $packageDetail["title"],
            "description" => $packageDetail["description"],
            "optimizations" => $optimizations,
            "isPublic" => $packageDetail["isPublic"],
            "owner" => $packageDetail["owner"],
            "createdAt" => $packageDetail["createdAt"],
            "nickname" => $userData["nickname"],
            "photo" => $userData["photo"],
            "role" => $userData["role"],
        ];

        echo json_encode($packageDetailArray);
    } else {
        echo json_encode(["success" => false, "error" => "Package not found"]);
    }
    exit();
}

if ($checkedToken AND $checkedUser) {

    if ($type == "editPackage" && (strlen($packageTitle) >= 5 && strlen($packageTitle) <= 50) && (strlen($packageDescription) >= 60 && strlen($packageDescription) <= 265) && count($optimizationsID) >= 1) {
        //update package details
        $updatePackage = $db->prepare("UPDATE packages SET title=?, description=?, optimizations=? WHERE uid=? AND urlParam=? AND isDeleted=? AND isPublic=?");
        $updatePackage->execute(array($packageTitle, $packageDescription, json_encode($optimizationsID), $uid, $packageID, 0, 0));

        if ($updatePackage->rowCount() > 0) {
            $updatePackageArray = [
                "success" => true,
                "type" => "editPackage"
            ];
        } else {
            $updatePackageArray = [
                "success" => false,
                "type" => "editPackage"
            ];
        }

        echo json_encode($updatePackageArray);
        exit();
    }

    if ($type == "sharePackage" && (strlen($packageTitle) >= 5 && strlen($packageTitle) <= 50) && (strlen($packageDescription) >= 60 && strlen($packageDescription) <= 265) && !empty($packageID)) {

        $sharePackage = $db->prepare("UPDATE packages SET isPublic=? WHERE uid=? AND urlParam=? AND isDeleted=?");
        $sharePackage->execute(array($isPublic, $uid, $packageID, 0));

        if ($sharePackage->rowCount() > 0) {
            $sharePackageArray = [
                "success" => true,
                "type" => "sharePackage"
            ];
        } else {
            $sharePackageArray = [
                "success" => false,
                "type" => "sharePackage"
            ];
        }

        echo json_encode($sharePackageArray);
        exit();
    }

    if ($type == "deletePackage" && !empty($packageID)) {

        $deletePackage = $db->prepare("UPDATE packages SET isDeleted=? WHERE uid=? AND urlParam=?");
        $deletePackage->execute(array(1, $uid, $packageID));

        if ($deletePackage->rowCount() > 0) {
            $deletePackageArray = [
                "success" => true,
                "type" => "deletePackage"
            ];
        } else {
            $deletePackageArray = [
                "success" => false,
                "type" => "deletePackage"
            ];
        }

        echo json_encode($deletePackageArray);
        exit();
    }

}

?>
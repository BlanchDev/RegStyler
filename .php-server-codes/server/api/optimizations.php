<?php

require($_SERVER['DOCUMENT_ROOT'] . "/server/config/includes.php");

$reactJson = json_decode(file_get_contents("php://input"), true);

$title = $reactJson['title'];
$description = $reactJson['description'];
$code = $reactJson['code'];
$category = $reactJson['category'];

$optimizationData = $reactJson['optimizationData'];

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

if ($checkedToken AND $checkedUser) {

    if ($type == "getOptimizations") {

        $getOptimizations = $db->prepare("SELECT * FROM optimizations WHERE (uid=? OR owner=?) AND isDeleted=? ORDER BY title ASC");
        $getOptimizations->execute(array($uid, "admin", 0));

        $optimizationsArray = [];
        while ($optimization = $getOptimizations->fetch(PDO::FETCH_ASSOC)) {
            $optimizationsArray[] = [
                "id" => $optimization["id"],
                "title" => $optimization["title"],
                "description" => $optimization["description"],
                "code" => $optimization["code"],
                "category" => $optimization["category"],
                "owner" => $optimization["owner"],
                "createdAt" => $optimization["createdAt"]
            ];
        }

        echo json_encode($optimizationsArray);
        exit();
    }

    if ($type == "createOptimization" && !empty($uid) && (strlen($title) >= 5 && strlen($title) <= 50) && (strlen($description) >= 5 && strlen($description) <= 250) && (strlen($code) >= 5 && strlen($code) <= 250) && ($category == "system" || $category == "graphic" || $category == "internet" || $category == "privacy" || $category == "other")) {

        $register_request = $db->prepare("INSERT INTO optimizations SET uid=?, title=?, description=?, code=?, category=?, owner=?, createdAt=?, isDeleted=?");
        $register_success = $register_request->execute(array($uid, $title, $description, $code, $category, $checkedUser["role"], $currentDate, 0));

        if ($register_success) {
            $response = [
                "success" => true,
                "type" => "createOptimization",
                "notification" => [
                    "type" => "success",
                    "text" => $title . " created successfully!"
                ]
            ];
        } else {
            $response = ["success" => false, "type" => "createOptimization"];
        }

        echo json_encode($response);
        exit();
    }

    if ($type == "editOptimization" && !empty($uid) && !empty($optimizationData["optimizationId"]) && (strlen($optimizationData["title"]) >= 5 && strlen($optimizationData["title"]) <= 50) && (strlen($optimizationData["description"]) >= 5 && strlen($optimizationData["description"]) <= 250) && (strlen($optimizationData["code"]) >= 5 && strlen($optimizationData["code"]) <= 250) && ($optimizationData["category"] == "system" || $optimizationData["category"] == "graphic" || $optimizationData["category"] == "internet" || $optimizationData["category"] == "privacy" || $optimizationData["category"] == "other")) {

        $updateOptimization = $db->prepare("UPDATE optimizations SET title=?, description=?, code=?, category=? WHERE uid=? AND id=?");
        $updateOptimization->execute(array($optimizationData["title"], $optimizationData["description"], $optimizationData["code"], $optimizationData["category"], $uid, $optimizationData["optimizationId"]));

        if ($updateOptimization->rowCount() > 0) {
            $updateOptimizationArray = [
                "success" => true,
                "type" => "editOptimization"
            ];
        } else {
            $updateOptimizationArray = [
                "success" => false,
                "type" => "editOptimization"
            ];
        }

        echo json_encode($updateOptimizationArray);
        exit();
    }

    if ($type == "deleteOptimization" && !empty($uid) && !empty($optimizationData["optimizationId"])) {

        $checkOptimization = $db->prepare("SELECT * FROM packages WHERE uid=? AND JSON_CONTAINS(optimizations, ?)");
        $checkOptimization->execute(array($uid, json_encode($optimizationData["optimizationId"])));
        $checkedOptimizations = $checkOptimization->fetchAll(PDO::FETCH_ASSOC);

        foreach ($checkedOptimizations as $checkedOptimization) {
            $optimizations = json_decode($checkedOptimization['optimizations'], true);
            $optimizationId = $optimizationData["optimizationId"];

            if (($key = array_search($optimizationId, $optimizations)) !== false) {
                unset($optimizations[$key]);
            }

            $updatedOptimizations = json_encode(array_values($optimizations));

            $updateOptimization = $db->prepare("UPDATE packages SET optimizations=? WHERE uid=? AND id=?");
            $updateOptimization->execute(array($updatedOptimizations, $uid, $checkedOptimization['id']));

            if (empty($optimizations)) {
                $markAsDeleted = $db->prepare("UPDATE packages SET isPublic=?, isDeleted=? WHERE uid=? AND id=?");
                $markAsDeleted->execute(array(0, 1, $uid, $checkedOptimization['id']));
            }
        }



        $deleteOptimization = $db->prepare("UPDATE optimizations SET isDeleted=? WHERE uid=? AND id=?");
        $deleteOptimization->execute(array(1, $uid, $optimizationData["optimizationId"]));

        if ($deleteOptimization->rowCount() > 0) {
            $deleteOptimizationArray = [
                "success" => true,
                "type" => "deleteOptimization"
            ];
        } else {
            $deleteOptimizationArray = [
                "success" => false,
                "type" => "deleteOptimization"
            ];
        }

        echo json_encode($deleteOptimizationArray);
        exit();
    }
}

?>
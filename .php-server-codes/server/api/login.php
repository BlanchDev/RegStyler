<?php

require($_SERVER['DOCUMENT_ROOT'] . "/server/config/includes.php");

$reactJson = json_decode(file_get_contents("php://input"), true);

$nickname = $reactJson['nickname'];
$email = $reactJson['email'];
$photoURL = $reactJson['photoURL'];

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

if ($type == "login") {

    $checkUser = $db->prepare("SELECT * FROM users WHERE uid=?");
    $checkUser->execute( array($uid) );
    $isUser = $checkUser->fetch(PDO::FETCH_ASSOC);

    if ($isUser) {

        if (strlen($browser) == 64) {
            $checkToken = $db->prepare("SELECT * FROM tokens WHERE uid=? AND connectedBrowser=?");
            $checkToken->execute( array($uid, $browser) );
            $isToken = $checkToken->fetch(PDO::FETCH_ASSOC);

            if ($isToken) {
                $response = ["type" => "login", "uid" => $uid, "token" => $isToken["token"], "browser" => $isToken["connectedBrowser"] ];
            }else{
                $token = bin2hex(random_bytes(32));
                $cooldown = $currentDate + 3600;
                $connectedBrowser = $browser;

                $tokenRegister_request = $db->prepare("INSERT INTO tokens SET uid=?, token=?, cooldown=?, tokenCreatedAt=?, connectedBrowser=?");
                $tokenRegister_request = $tokenRegister_request->execute(array($uid, $token, $cooldown, $currentDate, $connectedBrowser));

                if($tokenRegister_request) {
                    $response = ["type" => "login", "uid" => $uid, "token" => $token, "browser" => $connectedBrowser ];
                }
            }
        }else{
            $token = bin2hex(random_bytes(32));
            $cooldown = $currentDate + 3600;
            $connectedBrowser = bin2hex(random_bytes(32));
            
            $tokenRegister_request = $db->prepare("INSERT INTO tokens SET uid=?, token=?, cooldown=?, tokenCreatedAt=?, connectedBrowser=?");
            $tokenRegister_request = $tokenRegister_request->execute(array($uid, $token, $cooldown, $currentDate, $connectedBrowser));

            if($tokenRegister_request) {
                $response = ["type" => "login", "uid" => $uid, "token" => $token, "browser" => $connectedBrowser ];
            }
        }
    } else {
        $response = ["type" => "login"];
    }

    echo json_encode($response);
    exit();
}

if ($type == "register" && (!empty($nickname) && strlen($nickname) <= 30)) {

    $checkUser = $db->prepare("SELECT * FROM users WHERE uid=?");
    $checkUser->execute( array($uid) );
    $checkedUser = $checkUser->fetch(PDO::FETCH_ASSOC);

    if ($checkedUser) {
        $response = ["type" => "register"];
    } else {
        $checkNickname = $db->prepare("SELECT * FROM users WHERE nickname=?");
        $checkNickname->execute( array(strtolower($nickname)) );
        $checkedNickname = $checkNickname->fetch(PDO::FETCH_ASSOC);

        if (!$checkedNickname) {

            $register_request = $db->prepare("INSERT INTO users SET uid=?, nickname=?, email=?, photo=?, role=?, createdAt=?");
            $register_success = $register_request->execute(array($uid, strtolower($nickname), $email, $photoURL, "user", $currentDate));

            if ($register_success) {

                $token = bin2hex(random_bytes(32));
                $cooldown = $currentDate + 3600;
                if (strlen($browser) == 64) {
                    $connectedBrowser = $browser;
                }else{
                    $connectedBrowser = bin2hex(random_bytes(32));
                }

                $tokenRegister_request = $db->prepare("INSERT INTO tokens SET uid=?, token=?, cooldown=?, tokenCreatedAt=?, connectedBrowser=?");
                $tokenRegister_request = $tokenRegister_request->execute(array($uid, $token, $cooldown, $currentDate, $connectedBrowser));

                if($tokenRegister_request) {
                    $response = ["success" => true, "type" => "register", "uid" => $uid, "token" => $token, "browser" => $connectedBrowser ];
                }

            } else {
                $response = ["success" => false, "type" => "register"];
            }

        }else{
         $response = [
            "success" => false,
            "type" => "register",
            "notification" => [
                "type" => "error",
                "text" => $nickname . " already exists!"
            ]
        ]; 
    }

}

echo json_encode($response);
exit();
}

if ($type == "check") {

    $checkUser = $db->prepare("SELECT * FROM users WHERE uid=?");
    $checkUser->execute( array($uid) );
    $checkedUser = $checkUser->fetch(PDO::FETCH_ASSOC);

    if ($checkedUser) {
        $response = [
            "type" => "check",
            "isNew" => false,
            "nickname" => $checkedUser["nickname"],
            "photo" => $checkedUser["photo"],
            "role" => $checkedUser["role"]
        ];
    } else {
        $response = [
            "type" => "check",
            "isNew" => true,             
            "nickname" => $checkedUser["nickname"],
            "photo" => $checkedUser["photo"],
            "role" => $checkedUser["role"]];
        }

        echo json_encode($response);
        exit();
    }

    if ($checkedToken AND $checkedUser) {

        if ($type == "userDataUpdate" && (!empty($nickname) && strlen($nickname) <= 30)) {

            $checkNickname = $db->prepare("SELECT * FROM users WHERE nickname=?");
            $checkNickname->execute( array(strtolower($nickname)) );
            $checkedNickname = $checkNickname->fetch(PDO::FETCH_ASSOC);

            if (!$checkedNickname) {

                $changeNickname = $db->prepare("UPDATE users SET nickname=? WHERE uid=?");
                $changeNickname->execute(array($nickname, $uid));

                if ($changeNickname->rowCount() > 0) {
                    $response = [
                        "success" => true,
                        "type" => "userDataUpdate",
                        "notification" => [
                            "type" => "success",
                            "text" => $nickname . " changed successfully!"
                        ]
                    ];
                } else {
                    $response = [
                        "success" => false,
                        "type" => "userDataUpdate",
                        "notification" => [
                            "type" => "warning",
                            "text" => "Please change nickname."
                        ]
                    ];
                }
            }else{

                if($checkedNickname["nickname"] == strtolower($nickname) && $checkedNickname["uid"] == $uid){
                    $response = [
                        "success" => false,
                        "type" => "userDataUpdate",
                        "notification" => [
                            "type" => "warning",
                            "text" => "Please change nickname."
                        ]
                    ];
                }else{
                 $response = [
                    "success" => false,
                    "type" => "userDataUpdate",
                    "notification" => [
                        "type" => "error",
                        "text" => $nickname . " already exists!"
                    ]
                ]; 
            }
        }

        echo json_encode($response);
        exit();

    }

}

?>
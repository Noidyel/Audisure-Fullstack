<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents("php://input"));
$email = $data->email ?? '';
$password = $data->password ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Email and password are required"]);
    exit;
}

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // DEBUG: show what password you typed and what's in DB
    $debug = [
        "typed_password" => $password,
        "stored_password_hash" => $user['password']
    ];

    if (password_verify($password, $user['password'])) {
        unset($user['password']);
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => $user,
            "debug" => $debug // this will be shown in response
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid password",
            "debug" => $debug
        ]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email not found"]);
}
?>

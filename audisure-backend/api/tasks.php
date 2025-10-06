<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include_once("../db.php");

$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode(["success" => false, "message" => "Missing email"]);
    exit;
}

$query = "SELECT * FROM tasks WHERE assigned_to = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$tasks = [];
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode([
    "success" => true,
    "tasks" => $tasks
]);
?>

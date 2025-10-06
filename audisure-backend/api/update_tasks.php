<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include_once("../db.php");

$data = json_decode(file_get_contents("php://input"), true);
$task_id = $data['task_id'] ?? null;
$status = $data['status'] ?? '';

if (!$task_id || !$status) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$query = $conn->prepare("UPDATE tasks SET status = ? WHERE task_id = ?");
$query->bind_param("si", $status, $task_id);
if ($query->execute()) {
    echo json_encode(["success" => true, "message" => "Task updated"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update"]);
}
?>

<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include_once("../db.php");

$data = json_decode(file_get_contents("php://input"), true);
$task_id = $data['task_id'] ?? null;

if (!$task_id) {
    echo json_encode(["success" => false, "message" => "Missing task ID"]);
    exit;
}

// Get task data first
$getTask = $conn->prepare("SELECT * FROM tasks WHERE task_id = ?");
$getTask->bind_param("i", $task_id);
$getTask->execute();
$result = $getTask->get_result();
$task = $result->fetch_assoc();

if (!$task) {
    echo json_encode(["success" => false, "message" => "Task not found"]);
    exit;
}

// Insert to archive table
$insert = $conn->prepare("INSERT INTO archived_tasks (task_description, status, assigned_to, archived_at)
                          VALUES (?, ?, ?, NOW())");
$insert->bind_param("sss", $task['task_description'], $task['status'], $task['assigned_to']);
$insert->execute();

// Delete from active
$delete = $conn->prepare("DELETE FROM tasks WHERE task_id = ?");
$delete->bind_param("i", $task_id);
$delete->execute();

echo json_encode(["success" => true, "message" => "Task archived successfully"]);
?>

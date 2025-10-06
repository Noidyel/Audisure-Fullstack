<?php
header('Content-Type: application/json');
include '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT task_id, task_name, assigned_to, due_date, status, created_at 
            FROM tasks 
            ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'Database query failed']);
        exit;
    }

    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }

    echo json_encode(['success' => true, 'tasks' => $tasks]);
    exit;
}
?>

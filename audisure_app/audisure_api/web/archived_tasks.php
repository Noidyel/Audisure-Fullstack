<?php
header('Content-Type: application/json');
include '../db.php';

$email = $_GET['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Missing user email']);
    exit;
}

// Fetch all archived tasks for the logged-in user
$query = "SELECT task_id, task_description, status, assigned_to, created_at, archived_at
          FROM archived_tasks
          WHERE assigned_to = ?
          ORDER BY archived_at DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$archivedTasks = [];
while ($row = $result->fetch_assoc()) {
    $archivedTasks[] = $row;
}

echo json_encode(['success' => true, 'archivedTasks' => $archivedTasks]);
?>

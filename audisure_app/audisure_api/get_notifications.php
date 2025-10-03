<?php
error_reporting(0);  // disable warnings/notices from being printed
ini_set('display_errors', 0);
header('Content-Type: application/json');
include '../includes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';

    if (empty($email)) {
        echo json_encode(['error' => 'Email is required']);
        exit;
    }

    $stmt = $conn->prepare("SELECT title, message, created_at FROM notifications WHERE user_email = ? ORDER BY created_at DESC LIMIT 20");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    $notifications = [];
    while ($row = $result->fetch_assoc()) {
        $notifications[] = [
            'title' => $row['title'],
            'message' => $row['message'],
            'created_at' => date('F j, Y g:i A', strtotime($row['created_at']))  // e.g., June 11, 2025 4:15 PM
        ];
    }

    echo json_encode(['notifications' => $notifications]);
}
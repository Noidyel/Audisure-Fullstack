<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
include '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';

    if (empty($email)) {
        echo json_encode(['error' => 'Email is required']);
        exit;
    }

    // Get user role (to check if admin)
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE email = ?");
    $roleStmt->bind_param('s', $email);
    $roleStmt->execute();
    $roleResult = $roleStmt->get_result();
    $user = $roleResult->fetch_assoc();
    $role = $user['role'] ?? 'user'; // default to user

    // Fetch notifications intended for this user or their role
    $stmt = $conn->prepare("
        SELECT title, message_en AS message, created_at 
        FROM notifications 
        WHERE user_email = ? OR recipient = ?
        ORDER BY created_at DESC 
        LIMIT 20
    ");
    $stmt->bind_param('ss', $email, $role);
    $stmt->execute();
    $result = $stmt->get_result();

    $notifications = [];
    while ($row = $result->fetch_assoc()) {
        $notifications[] = [
            'title' => $row['title'] ?: 'Notification',
            'message' => $row['message'],
            'created_at' => date('F j, Y g:i A', strtotime($row['created_at']))
        ];
    }

    echo json_encode(['notifications' => $notifications]);
}
?>

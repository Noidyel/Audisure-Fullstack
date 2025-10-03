<?php
include '../includes/db.php';

header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $document_uid = $_POST['document_uid'] ?? '';

    if (empty($email) || empty($document_uid)) {
        echo json_encode(['error' => 'Email and document UID are required']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO searched_documents (user_email, document_uid) VALUES (?, ?)");
    $stmt->bind_param('ss', $email, $document_uid);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to log search']);
    }
}
?>

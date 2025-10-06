<?php
include '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $document_uid = $_POST['document_uid'] ?? '';
    $searched_at = $_POST['searched_at'] ?? date('Y-m-d H:i:s');

    if (!empty($document_uid)) {
        $stmt = $conn->prepare("INSERT INTO searched_documents (document_uid, searched_at) VALUES (?, ?)");
        $stmt->bind_param('ss', $document_uid, $searched_at);
        $stmt->execute();
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Missing document_uid']);
    }
}
?>

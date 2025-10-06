<?php
include '../includes/db.php';

header('Content-Type: application/json');

$user_email = $_POST['email'] ?? null;

if (!$user_email) {
    echo json_encode(["success" => false, "message" => "Missing email."]);
    exit;
}

$sql = "
    SELECT n.message_en, n.created_at 
    FROM notifications n
    JOIN user_notifications un ON n.id = un.notification_id
    WHERE un.user_email = ? AND n.role = 'applicant'
    ORDER BY n.created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];

while ($row = $result->fetch_assoc()) {
    $notifications[] = [
        'message' => $row['message_en'],
        'created_at' => $row['created_at']
    ];
}

echo json_encode(["success" => true, "notifications" => $notifications]);

$stmt->close();
$conn->close();
?>

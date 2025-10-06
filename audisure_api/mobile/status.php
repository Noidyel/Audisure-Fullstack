<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$password = "";
$database = "audisure_db";

// Connect to database
$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$document_uid = $_GET['document_uid'] ?? '';
$user_email = $_GET['user_email'] ?? '';  // <-- Get user_email from query string or change to POST if needed

if (empty($document_uid)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing document_uid parameter."]);
    exit;
}

if (empty($user_email)) {
    // Optional: You can choose to make user_email required or not
    // For now, just skip inserting tracking if no user_email provided
    $user_email = null;
}

// Prepare the statement to get the latest status
$stmt = $conn->prepare("
    SELECT status_id, status, updated_at 
    FROM documents_statuses
    WHERE document_uid = ? 
    ORDER BY updated_at DESC 
    LIMIT 1
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $document_uid);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Execute failed: " . $stmt->error]);
    exit;
}

$stmt->bind_result($status_id, $status, $updated_at);

if ($stmt->fetch()) {
    // Return the status info as before
    echo json_encode([
        "status_id" => $status_id,
        "status" => $status,
        "updated_at" => $updated_at
    ]);

    $stmt->close();

    // Now insert into searched_documents if user_email exists
    if ($user_email) {
        $insertTrack = $conn->prepare("INSERT INTO searched_documents (user_email, document_uid) VALUES (?, ?)");
        if ($insertTrack) {
            $insertTrack->bind_param("ss", $user_email, $document_uid);
            $insertTrack->execute();
            $insertTrack->close();
        }
        // You can add error handling/logging here if you want
    }

} else {
    $stmt->close();
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Document not found or no statuses available."]);
}

$conn->close();
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Aiven MySQL credentials
$host = 'audisure-mysql-audisure-mysql.l.aivencloud.com';
$port = 14810;
$db = 'defaultdb';
$user = 'avnadmin';
$pass = 'AVNS_ttIZtUIdda1nMHncSIt';

// Create connection
$conn = new mysqli($host, $user, $pass, $db, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Optional: set charset
$conn->set_charset("utf8mb4");
?>

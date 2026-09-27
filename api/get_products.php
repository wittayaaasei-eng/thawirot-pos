<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$user = 'root';
$pass = ''; // ใส่รหัสผ่าน phpMyAdmin ของคุณ
$dbname = 'thawirot_pos';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
$conn->set_charset('utf8mb4'); // ให้ภาษาไทยรับ-ส่งถูกต้อง

$sql = "SELECT barcode, name, price, stock FROM products";
$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['price'] = (float)$row['price'];
        $row['stock'] = (int)$row['stock'];
        $products[] = $row;
    }
}

echo json_encode($products);
$conn->close();
?>
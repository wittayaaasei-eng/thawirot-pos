<?php
header('Content-Type: application/json; charset=utf-8');

// รับข้อมูล JSON ที่ส่งมาจากหน้าบ้าน (JavaScript)
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (!isset($data['cart']) || empty($data['cart'])) {
    echo json_encode(["success" => false, "message" => "ไม่มีรายการสินค้าในตะกร้า"]);
    exit;
}

$host = 'localhost';
$user = 'root';
$pass = ''; 
$dbname = 'thawirot_pos';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}
$conn->set_charset('utf8mb4'); // ให้ภาษาไทยรับ-ส่งถูกต้อง

// เริ่ม Transaction เพื่อความปลอดภัยของข้อมูลสต็อก
$conn->begin_transaction();

try {
    // คำสั่ง SQL ตัดสต็อกตามจำนวนที่ซื้อในตะกร้า
    // เงื่อนไข stock >= ? ป้องกันสต็อกติดลบ (เช่น เปิด 2 เครื่องขายสินค้าชิ้นสุดท้ายพร้อมกัน)
    // ใช้ Prepared Statement (?) ป้องกัน SQL Injection จึงไม่ต้อง escape เอง
    $sql = "UPDATE products SET stock = stock - ? WHERE barcode = ? AND stock >= ?";
    $stmt = $conn->prepare($sql);

    foreach ($data['cart'] as $item) {
        $barcode = (string)$item['barcode'];
        $quantity = (int)$item['quantity'];

        if ($quantity <= 0) {
            throw new Exception("จำนวนสินค้าต้องมากกว่า 0 (บาร์โค้ด: " . $barcode . ")");
        }

        $stmt->bind_param("isi", $quantity, $barcode, $quantity);

        if (!$stmt->execute()) {
            throw new Exception("ไม่สามารถอัปเดตสต็อกของสินค้าบาร์โค้ด: " . $barcode);
        }
        // ไม่มีแถวถูกอัปเดต = ไม่พบบาร์โค้ด หรือสต็อกไม่พอ -> ยกเลิกทั้งบิล
        if ($stmt->affected_rows === 0) {
            throw new Exception("สต็อกไม่พอหรือไม่พบสินค้าบาร์โค้ด: " . $barcode);
        }
    }
    $stmt->close();

    // บันทึกการเปลี่ยนแปลงทั้งหมด
    $conn->commit();
    echo json_encode(["success" => true, "message" => "อัปเดตสต็อกในฐานข้อมูลสำเร็จ"]);

} catch (Exception $e) {
    // หากเกิดข้อผิดพลาด ให้ยกเลิกการเปลี่ยนแปลงทั้งหมด
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
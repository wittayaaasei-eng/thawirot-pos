-- ฐานข้อมูลระบบขายหน้าร้าน ตลาดสดทวีโรจน์ (Thawi-rot POS)
-- วิธีใช้: เปิด phpMyAdmin > แท็บ Import > เลือกไฟล์นี้ > Go
--        หรือคัดลอกทั้งหมดไปวางในแท็บ SQL แล้วกด Go

CREATE DATABASE IF NOT EXISTS thawirot_pos
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE thawirot_pos;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    barcode VARCHAR(13)    NOT NULL PRIMARY KEY,  -- รหัสบาร์โค้ด EAN-13
    name    VARCHAR(100)   NOT NULL,              -- ชื่อสินค้า
    price   DECIMAL(10, 2) NOT NULL,              -- ราคาต่อหน่วย (บาท)
    stock   INT            NOT NULL DEFAULT 0,    -- จำนวนคงเหลือ
    CONSTRAINT chk_price CHECK (price >= 0),
    CONSTRAINT chk_stock CHECK (stock >= 0)       -- กันสต็อกติดลบอีกชั้นที่ระดับฐานข้อมูล
) ENGINE = InnoDB;                                -- InnoDB รองรับ Transaction

INSERT INTO products (barcode, name, price, stock) VALUES
('8850001000011', 'ผักกาดขาว',            25.00, 20),
('8850001000028', 'คะน้า',                20.00, 15),
('8850001000035', 'มะเขือเทศ',            35.00, 12),
('8850001000042', 'ไข่ไก่ (แผง 10 ฟอง)',  45.00, 10),
('8850001000059', 'หมูสับ (500 กรัม)',    80.00,  8),
('8850001000066', 'ไก่สด (1 กก.)',        85.00,  6),
('8850001000073', 'ปลาทูนึ่ง',             60.00,  3),
('8850001000080', 'กล้วยน้ำว้า (หวี)',     30.00,  2),
('8850001000097', 'มะนาว (กก.)',          70.00,  0);

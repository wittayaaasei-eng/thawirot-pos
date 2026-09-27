# ระบบขายหน้าร้าน (POS) ตลาดสดทวีโรจน์

โครงงานวิชา BBAIS219 หัวข้อพิเศษในการพัฒนาซอฟต์แวร์ (กลุ่ม 1: AI Coding Assistant)

ระบบช่วยพ่อค้าแม่ค้าคำนวณราคาสินค้า ออกใบเสร็จ และตัดสต็อกอัตโนมัติ แทนการคิดเลขด้วยมือ
พัฒนาโดยใช้ AI Coding Assistant (ChatGPT) ช่วยเขียนและตรวจสอบโค้ด

## เทคโนโลยี
- Frontend: HTML, CSS, JavaScript (ES Modules)
- Backend: PHP (mysqli + Prepared Statement + Transaction)
- Database: MySQL / MariaDB (จัดการผ่าน phpMyAdmin)
- Web Server: Apache (XAMPP)

## วิธีติดตั้งและรัน (XAMPP)
1. ติดตั้ง [XAMPP](https://www.apachefriends.org/) แล้วเปิด **XAMPP Control Panel** กด **Start** ที่ `Apache` และ `MySQL`
2. คัดลอกโฟลเดอร์โปรเจกต์นี้ไปไว้ที่ `C:\xampp\htdocs\thawirot-pos`
   (แนะนำให้ตั้งชื่อโฟลเดอร์เป็นภาษาอังกฤษ)
3. เปิด `http://localhost/phpmyadmin` > แท็บ **Import** > เลือกไฟล์ `database.sql` > กด **Go**
4. เปิด `http://localhost/thawirot-pos/`
5. ถ้าตั้งรหัสผ่าน MySQL ไว้ ให้แก้ `$pass` ใน `api/get_products.php` และ `api/update_stock.php`

> ถ้า MySQL ไม่ทำงาน หน้าเว็บจะเข้า **โหมดสาธิต** อัตโนมัติ (มีแถบสีเหลืองแจ้ง) ใช้ข้อมูลตัวอย่างแทน
> เพื่อให้ยังสาธิตการทำงานได้

## ทดสอบตรรกะการคำนวณ
ต้องมี Node.js
```
node tests/test_logic.mjs
```

## โครงสร้างไฟล์
```
index.php              หน้าจอ POS + ใบเสร็จ (Modal)
css/style.css          หน้าตาและการจัดวาง รวมถึงสไตล์ตอนพิมพ์ใบเสร็จ
js/main.js             POSApp: ตัวควบคุมหลัก รับ event แล้วสั่งโมดูลอื่น
js/cart.js             CartSystem: เพิ่ม/ลบสินค้าในตะกร้า คำนวณยอด
js/ui.js               UIManager: วาดการ์ดสินค้า ตะกร้า ใบเสร็จ
js/api.js              เรียก PHP ด้วย fetch() + โหมดสาธิต
js/utils.js            จัดรูปแบบเงินบาท + แปลงตัวเลขเป็นคำอ่านไทย
api/get_products.php   ดึงรายการสินค้า (JSON)
api/update_stock.php   ตัดสต็อกทั้งบิลใน Transaction
database.sql           สร้างฐานข้อมูล + ข้อมูลตัวอย่าง
tests/test_logic.mjs   ชุดทดสอบตรรกะ
backup/                วิดีโอสาธิตสำรอง (Fallback Video) และรูปประกอบ
```

// ทดสอบตรรกะการคำนวณ (ไม่ต้องใช้เบราว์เซอร์/ฐานข้อมูล)
// วิธีรัน: เปิด Terminal ที่โฟลเดอร์โปรเจกต์ แล้วพิมพ์  node tests/test_logic.mjs
import { ThaiBahtText } from '../js/utils.js';
import { CartSystem } from '../js/cart.js';

let pass = 0;
let total = 0;
function check(name, actual, expected) {
    total++;
    const ok = actual === expected;
    if (ok) pass++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  ->  ${actual}${ok ? '' : `  (ควรได้ ${expected})`}`);
}

console.log('--- 1) ตะกร้าสินค้า (cart.js) ---');
const db = [
    { barcode: 'A', name: 'ผัก', price: 30, stock: 2 },
    { barcode: 'B', name: 'ผลไม้', price: 45, stock: 1 }
];
const cart = new CartSystem();
cart.addItem(db[0]);
cart.addItem(db[0]);
cart.addItem(db[1]);
check('ยอดรวม (30x2)+(45x1)', cart.getTotal(), 105);
check('สแกนสินค้าชนิดเดิมซ้ำ รวมเป็นบรรทัดเดียว', cart.getItems().length, 2);
check('สต็อกบนหน้าจอลดลงตามที่สแกน', db[0].stock, 0);
check('สแกนเกินสต็อกต้องไม่สำเร็จ', cart.addItem(db[0]), false);
cart.removeItem('A', db);
check('ลบรายการแล้วยอดรวมลดลง', cart.getTotal(), 45);
check('ลบรายการแล้วคืนสต็อก', db[0].stock, 2);

console.log('--- 2) แปลงจำนวนเงินเป็นคำอ่านภาษาไทย (utils.js) ---');
const cases = [
    [0, 'ศูนย์บาทถ้วน'],
    [21, 'ยี่สิบเอ็ดบาทถ้วน'],
    [101, 'หนึ่งร้อยเอ็ดบาทถ้วน'],
    [215, 'สองร้อยสิบห้าบาทถ้วน'],
    [1250.5, 'หนึ่งพันสองร้อยห้าสิบบาทห้าสิบสตางค์'],
    [0.01, 'ศูนย์บาทหนึ่งสตางค์'],
    [1000000, 'หนึ่งล้านบาทถ้วน'],
    [2500000, 'สองล้านห้าแสนบาทถ้วน']
];
for (const [amount, words] of cases) {
    check(`ThaiBahtText(${amount})`, ThaiBahtText(amount), `(${words})`);
}

console.log(`\nผลรวม: ผ่าน ${pass}/${total} กรณี`);
process.exit(pass === total ? 0 : 1);

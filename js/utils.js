// ฟังก์ชันแปลงตัวเลขเป็นตัวอักษรไทย (Thai Baht Text)
export function ThaiBahtText(amount) {
    const [baht, satang] = Math.abs(amount).toFixed(2).split('.');
    let text = baht === '0' ? 'ศูนย์บาท' : readThaiNumber(baht) + 'บาท';
    text += satang === '00' ? 'ถ้วน' : readThaiNumber(satang) + 'สตางค์';
    return `(${text})`;
}

// อ่านตัวเลขจำนวนเต็ม (สตริง) เป็นคำไทย รองรับหลักล้านขึ้นไป (วนหน่วยทุก 6 หลัก)
function readThaiNumber(digits) {
    const data = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const unit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];
    let text = '';
    let hasHigherDigit = false; // มีหลักที่ไม่ใช่ 0 อยู่ข้างหน้าแล้วหรือยัง (ใช้ตัดสิน "เอ็ด")

    for (let i = 0; i < digits.length; i++) {
        const n = Number(digits[i]);
        const place = digits.length - i - 1;
        const pos = place % 6; // ตำแหน่งภายในกลุ่ม 6 หลัก

        if (n !== 0) {
            if (pos === 1 && n === 1) text += 'สิบ';
            else if (pos === 1 && n === 2) text += 'ยี่สิบ';
            else if (pos === 0 && n === 1 && hasHigherDigit) text += 'เอ็ด';
            else text += data[n] + unit[pos];
            hasHigherDigit = true;
        }
        // จบกลุ่ม 6 หลัก (ที่ไม่ใช่กลุ่มสุดท้าย) ให้เติม "ล้าน"
        if (pos === 0 && place > 0 && hasHigherDigit) text += 'ล้าน';
    }
    return text;
}

// ตัวจัดรูปแบบเงินบาท
export const currencyFormatter = new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: 'THB' 
});
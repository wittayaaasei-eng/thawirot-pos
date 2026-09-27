// ข้อมูลสำรองสำหรับ "โหมดสาธิต" ใช้เมื่อเชื่อมต่อ PHP/MySQL ไม่ได้ (เช่น ยังไม่เปิด XAMPP)
// ข้อมูลชุดเดียวกับใน database.sql
const DEMO_PRODUCTS = [
    { barcode: '8850001000011', name: 'ผักกาดขาว', price: 25, stock: 20 },
    { barcode: '8850001000028', name: 'คะน้า', price: 20, stock: 15 },
    { barcode: '8850001000035', name: 'มะเขือเทศ', price: 35, stock: 12 },
    { barcode: '8850001000042', name: 'ไข่ไก่ (แผง 10 ฟอง)', price: 45, stock: 10 },
    { barcode: '8850001000059', name: 'หมูสับ (500 กรัม)', price: 80, stock: 8 },
    { barcode: '8850001000066', name: 'ไก่สด (1 กก.)', price: 85, stock: 6 },
    { barcode: '8850001000073', name: 'ปลาทูนึ่ง', price: 60, stock: 3 },
    { barcode: '8850001000080', name: 'กล้วยน้ำว้า (หวี)', price: 30, stock: 2 },
    { barcode: '8850001000097', name: 'มะนาว (กก.)', price: 70, stock: 0 }
];

let demoMode = false;

export function isDemoMode() {
    return demoMode;
}

export async function fetchProductsFromDB() {
    if (!demoMode) {
        try {
            const response = await fetch('api/get_products.php');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json(); // ถ้าไม่มี PHP จะได้ซอร์สโค้ดกลับมา -> parse ไม่ผ่าน
            if (!Array.isArray(data)) throw new Error(data.error || 'Invalid data');
            return data;
        } catch (error) {
            console.warn('เชื่อมต่อฐานข้อมูลไม่ได้ สลับเป็นโหมดสาธิต:', error);
            demoMode = true;
        }
    }
    // คืนสำเนา เพื่อให้การแก้ไขฝั่งตะกร้าไม่ไปเปลี่ยนข้อมูลต้นฉบับโดยตรง (เหมือนการดึงจาก DB ใหม่)
    return DEMO_PRODUCTS.map(p => ({ ...p }));
}

export async function updateStockInDB(cartItems) {
    if (demoMode) {
        // จำลองการตัดสต็อกด้วยกติกาเดียวกับ update_stock.php (ทั้งบิลสำเร็จ หรือไม่สำเร็จเลย)
        for (const item of cartItems) {
            const product = DEMO_PRODUCTS.find(p => p.barcode === item.barcode);
            if (!product || product.stock < item.quantity) {
                return { success: false, message: 'สต็อกไม่พอหรือไม่พบสินค้าบาร์โค้ด: ' + item.barcode };
            }
        }
        cartItems.forEach(item => {
            DEMO_PRODUCTS.find(p => p.barcode === item.barcode).stock -= item.quantity;
        });
        return { success: true, message: 'อัปเดตสต็อก (โหมดสาธิต) สำเร็จ' };
    }

    try {
        const response = await fetch('api/update_stock.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: cartItems })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Update stock error:', error);
        throw error;
    }
}

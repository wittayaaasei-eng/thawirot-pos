import { fetchProductsFromDB, updateStockInDB, isDemoMode } from './api.js';
import { CartSystem } from './cart.js';
import { UIManager } from './ui.js';

class POSApp {
    constructor() {
        this.database = [];
        this.cart = new CartSystem();
        this.ui = new UIManager();

        this.init();
    }

    async init() {
        // ผูก Event ปุ่มต่างๆ
        document.getElementById('btnCheckout').addEventListener('click', () => this.handleCheckout());
        document.getElementById('btnCloseModal').addEventListener('click', () => this.handleCloseModal());

        // โหลดข้อมูลสินค้าเริ่มต้น
        try {
            this.database = await fetchProductsFromDB();
            this.ui.renderProducts(this.database, (barcode) => this.handleScanBarcode(barcode));
            if (isDemoMode()) this.ui.showDemoBanner();
        } catch (error) {
            this.ui.showAlert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์เพื่อดึงข้อมูลสินค้าได้');
        }
    }

    handleScanBarcode(barcode) {
        this.ui.hideAlert();
        const product = this.database.find(p => p.barcode === barcode);

        if (!product) return;

        if (product.stock <= 0) {
            this.ui.showAlert(`เกิดข้อผิดพลาด: ${product.name} หมดสต็อกแล้ว!`);
            return;
        }

        const success = this.cart.addItem(product);
        if (success) {
            this.ui.renderProducts(this.database, (bc) => this.handleScanBarcode(bc));
            this.ui.renderCart(this.cart.getItems(), (bc) => this.handleRemoveItem(bc));
        }
    }

    handleRemoveItem(barcode) {
        this.cart.removeItem(barcode, this.database);
        this.ui.renderProducts(this.database, (bc) => this.handleScanBarcode(bc));
        this.ui.renderCart(this.cart.getItems(), (bc) => this.handleRemoveItem(bc));
    }

    handleCheckout() {
        if (this.cart.getItems().length === 0) return;
        this.ui.showCheckoutModal(this.cart.getItems());
    }

    async handleCloseModal() {
        // ดึงรายการสินค้าในตะกร้าก่อนที่จะเคลียร์ทิ้ง
        const currentCart = this.cart.getItems();

        if (currentCart.length > 0) {
            try {
                // ส่งข้อมูลตะกร้าไปตัดสต็อกในฐานข้อมูล MySQL จริง
                const result = await updateStockInDB(currentCart);
                
                if (!result.success) {
                    // ปิดใบเสร็จก่อน ไม่งั้นข้อความแจ้งเตือนจะถูกบังอยู่ด้านหลัง (ตะกร้ายังอยู่ให้แก้ไขได้)
                    this.ui.closeModal();
                    this.ui.showAlert('ข้อผิดพลาดในการตัดสต็อก: ' + result.message);
                    return;
                }
            } catch (error) {
                this.ui.closeModal();
                this.ui.showAlert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์เพื่อบันทึกสต็อกได้');
                return;
            }
        }

        // ปิด Modal และเคลียร์ตะกร้าตามปกติ
        this.ui.closeModal();
        this.cart.clear();
        this.ui.renderCart(this.cart.getItems(), (bc) => this.handleRemoveItem(bc));
        
        // โหลดข้อมูลสินค้าใหม่จาก Database เพื่อให้หน้าจอแสดงสต็อกปัจจุบันที่อัปเดตแล้ว
        this.database = await fetchProductsFromDB();
        this.ui.renderProducts(this.database, (barcode) => this.handleScanBarcode(barcode));
    }
}

// เริ่มต้นรันแอปพลิเคชัน
window.addEventListener('DOMContentLoaded', () => {
    window.posApp = new POSApp();
});
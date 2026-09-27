import { currencyFormatter, ThaiBahtText } from './utils.js';

export class UIManager {
    constructor() {
        this.productGrid = document.getElementById('productGrid');
        this.alertBox = document.getElementById('alertBox');
        this.receiptBody = document.getElementById('receiptBody');
        this.grandTotalEl = document.getElementById('grandTotal');
        this.btnCheckout = document.getElementById('btnCheckout');
        this.receiptModal = document.getElementById('receiptModal');
    }

    renderProducts(database, onScanCallback) {
        this.productGrid.innerHTML = '';
        database.forEach(product => {
            const isOutOfStock = product.stock <= 0;
            const stockClass = product.stock <= 3 && !isOutOfStock ? 'low' : '';

            const card = document.createElement('div');
            card.className = `product-card ${isOutOfStock ? 'disabled' : ''}`;

            if (!isOutOfStock) {
                card.onclick = () => onScanCallback(product.barcode);
            }

            card.innerHTML = `
                <div class="product-name">${product.name}</div>
                <div class="product-price">${currencyFormatter.format(product.price)}</div>
                <div class="product-stock ${stockClass}">คงเหลือ: ${product.stock} ชิ้น</div>
            `;
            this.productGrid.appendChild(card);
        });
    }

    renderCart(cart, onRemoveCallback) {
        this.receiptBody.innerHTML = '';
        let grandTotal = 0;

        cart.forEach(item => {
            grandTotal += item.totalPrice;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong>${item.name}</strong><br>
                    <small style="color: #6b7280;">@${currencyFormatter.format(item.price)}</small>
                </td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${currencyFormatter.format(item.totalPrice)}</td>
                <td class="text-right">
                    <button class="btn-icon" data-barcode="${item.barcode}">×</button>
                </td>
            `;
            
            // ผูก Event ปุ่มลบ
            tr.querySelector('button').onclick = () => onRemoveCallback(item.barcode);
            this.receiptBody.appendChild(tr);
        });

        this.grandTotalEl.textContent = currencyFormatter.format(grandTotal);
        this.btnCheckout.disabled = cart.length === 0;
    }

    showCheckoutModal(cart) {
        const modalReceiptBody = document.getElementById('modalReceiptBody');
        modalReceiptBody.innerHTML = '';
        let subTotal = 0;

        cart.forEach((item, index) => {
            subTotal += item.totalPrice;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td class="text-left">${item.name}</td>
                <td>${item.quantity}</td>
                <td class="text-right">${currencyFormatter.format(item.price).replace('฿', '')}</td>
                <td class="text-right">${currencyFormatter.format(item.totalPrice).replace('฿', '')}</td>
            `;
            modalReceiptBody.appendChild(tr);
        });

        const discount = 0;
        const grandTotal = subTotal - discount;

        document.getElementById('modalSubTotal').textContent = currencyFormatter.format(subTotal).replace('฿', '');
        document.getElementById('modalDiscount').textContent = currencyFormatter.format(discount).replace('฿', '');
        document.getElementById('modalGrandTotal').textContent = currencyFormatter.format(grandTotal).replace('฿', '');
        document.getElementById('modalBahtText').textContent = ThaiBahtText(grandTotal);

        const now = new Date();
        const dateString = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        const receiptNo = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;

        document.getElementById('receiptNo').textContent = receiptNo;
        document.getElementById('receiptDate').textContent = dateString;

        this.receiptModal.classList.remove('hidden');
    }

    closeModal() {
        this.receiptModal.classList.add('hidden');
    }

    showAlert(message) {
        this.alertBox.textContent = message;
        this.alertBox.classList.remove('hidden');
    }

    showDemoBanner() {
        const banner = document.createElement('div');
        banner.className = 'alert info';
        banner.textContent = 'โหมดสาธิต: ไม่ได้เชื่อมต่อฐานข้อมูล MySQL จึงใช้ข้อมูลตัวอย่าง (สต็อกจะรีเซ็ตเมื่อรีเฟรชหน้า)';
        this.alertBox.before(banner);
    }

    hideAlert() {
        this.alertBox.classList.add('hidden');
        this.alertBox.textContent = '';
    }
}
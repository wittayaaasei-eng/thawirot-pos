<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thawi-rot POS System - Checkout</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div class="pos-container">
        <!-- ฝั่งจำลองการสแกนบาร์โค้ด (Barcode Scanner Simulation) -->
        <main class="scanner-section">
            <header class="sys-header">
                <h1>ตลาดสดทวีโรจน์</h1>
                <p>ระบบจัดการการขาย (จำลองการสแกนบาร์โค้ด)</p>
            </header>

            <div class="card">
                <h2>จำลองการสแกนสินค้า (คลิกการ์ดเพื่อสแกน)</h2>
                <div id="alertBox" class="alert hidden"></div>

                <div id="productGrid" class="product-grid">
                    <!-- สินค้าจะถูก Render ที่นี่ด้วย JavaScript -->
                </div>
            </div>
        </main>

        <!-- ฝั่งใบเสร็จ (Receipt Section) -->
        <aside class="receipt-section">
            <h2>ตะกร้าสินค้า</h2>
            <div class="receipt-paper">
                <table class="receipt-table">
                    <thead>
                        <tr>
                            <th>รายการ</th>
                            <th class="text-right">จำนวน</th>
                            <th class="text-right">รวม (฿)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="receiptBody">
                        <!-- รายการที่สแกนจะถูกเพิ่มที่นี่ -->
                    </tbody>
                </table>

                <div class="receipt-summary">
                    <div class="summary-row grand-total">
                        <span>ยอดชำระสุทธิ</span>
                        <span id="grandTotal">฿0.00</span>
                    </div>
                    <!-- เพิ่มปุ่มชำระเงินตรงนี้ -->
                    <button id="btnCheckout" class="btn btn-primary btn-checkout" disabled>ชำระเงิน</button>
                </div>
            </div>
        </aside>
    </div>

    <!-- Modal สำหรับแสดงใบเสร็จแบบ Pop-up (A4 Style) -->
    <!-- Modal สำหรับแสดงใบเสร็จแบบ Pop-up (Compact Style) -->
    <div id="receiptModal" class="modal hidden">
        <div class="modal-content a4-receipt">
            <div class="a4-header">
                <div class="a4-title">
                    <h1>ใบเสร็จรับเงิน</h1>
                    <h2>Receipt</h2>
                </div>
                <div class="a4-logo">
                    <div class="logo-placeholder">
                        <span style="font-size: 28px;">🥬</span>
                        <div style="color: #4da69c; font-weight: bold; font-size: 12px; margin-top: 5px;">
                            ตลาดสดทวีโรจน์<br>CHIANG MAI
                        </div>
                    </div>
                </div>
            </div>

            <hr class="teal-line">

            <div class="info-grid">
                <div class="info-col">
                    <div class="info-row"><span class="label">ชื่อลูกค้า</span> <span class="value">ลูกค้าทั่วไป
                            (General Customer)</span></div>
                    <div class="info-row"><span class="label">ที่อยู่</span> <span class="value">-</span></div>
                    <div class="info-row"><span class="label">เลขผู้เสียภาษี</span> <span class="value">-</span></div>
                    <div class="info-row"><span class="label">ผู้ติดต่อ</span> <span class="value">-</span></div>
                </div>
                <div class="info-col">
                    <div class="info-row"><span class="label">เลขที่</span> <span class="value font-bold"
                            id="receiptNo">INV-00000</span></div>
                    <div class="info-row"><span class="label">วันที่</span> <span class="value" id="receiptDate"></span>
                    </div>
                    <div class="info-row"><span class="label">ครบกำหนด</span> <span class="value">-</span></div>
                    <div class="info-row"><span class="label">อ้างอิง</span> <span class="value">-</span></div>
                </div>
            </div>

            <hr class="teal-line">

            <div class="info-grid">
                <div class="info-col">
                    <div class="info-row"><span class="label">ผู้ออก</span> <span class="value font-bold">ตลาดสดทวีโรจน์
                            (Thawi-rot Market)</span></div>
                    <div class="info-row"><span class="label">ที่อยู่</span> <span class="value">อ.เมือง จ.เชียงใหม่
                            50000</span></div>
                </div>
                <div class="info-col">
                    <div class="info-row"><span class="label">เลขประจำตัวผู้เสียภาษี</span> <span
                            class="value font-bold">1234567890123</span></div>
                    <div class="info-row"><span class="label">เบอร์โทร</span> <span class="value">053-123-456</span>
                    </div>
                    <div class="info-row"><span class="label">อีเมล</span> <span
                            class="value">contact@thawirot.com</span></div>
                </div>
            </div>

            <div class="table-wrapper">
                <table class="a4-table">
                    <thead>
                        <tr>
                            <th width="10%">ลำดับ</th>
                            <th width="45%" class="text-left">รายการสินค้า</th>
                            <th width="15%">จำนวน</th>
                            <th width="15%" class="text-right">ราคา/หน่วย</th>
                            <th width="15%" class="text-right">ราคารวม</th>
                        </tr>
                    </thead>
                    <tbody id="modalReceiptBody">
                        <!-- รายการสินค้า -->
                    </tbody>
                </table>

                <div class="summary-wrapper">
                    <div class="remark-section">
                        <strong>หมายเหตุ</strong>
                        <p style="color: #666; font-size: 12px; margin-top: 5px;">ขอบคุณที่อุดหนุนสินค้าในตลาดสดทวีโรจน์
                        </p>
                    </div>
                    <div class="calc-section">
                        <div class="calc-row"><span>ราคารวม</span> <span id="modalSubTotal">0.00</span></div>
                        <!-- ลบบรรทัดภาษีมูลค่าเพิ่ม (7%) ออกไปแล้ว -->
                        <div class="calc-row"><span>ส่วนลด</span> <span id="modalDiscount">0.00</span></div>
                    </div>
                </div>

                <div class="grand-total-wrapper">
                    <div class="grand-title">จำนวนเงินรวมทั้งสิ้น</div>
                    <div class="grand-amount">
                        <div class="number" id="modalGrandTotal">0.00</div>
                        <div class="text" id="modalBahtText">(ศูนย์บาทถ้วน)</div>
                    </div>
                </div>
            </div>

            <div class="footer-grid">
                <div class="payment-methods">
                    <strong>การชำระเงิน</strong>
                    <div class="payment-options">
                        <label class="radio-label"><input type="radio" name="payment" checked>
                            <span>เงินสด</span></label>
                        <label class="radio-label"><input type="radio" name="payment"> <span>บัตรเดบิต /
                                บัตรเครดิต</span></label>
                        <label class="radio-label"><input type="radio" name="payment"> <span>โอนผ่านบัญชี</span></label>
                    </div>
                </div>
                <!-- ลบส่วนลายเซ็น (signatures) ออกไปแล้ว -->
            </div>

            <div class="modal-actions hide-on-print">
                <button class="btn btn-primary" onclick="window.print()">พิมพ์ใบเสร็จ (Print)</button>
                <button id="btnCloseModal" class="btn btn-secondary">ปิดหน้าต่าง / เริ่มบิลใหม่</button>
            </div>
        </div>
    </div>

    <script type="module" src="js/main.js"></script>
</body>

</html>
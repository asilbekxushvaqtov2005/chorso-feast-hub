import { Order } from "@/types/admin";

export const printReceipt = (order: Order) => {
    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow) return;

    const date = new Date(order.date).toLocaleString('uz-UZ');

    // Delivery info logic
    let deliveryInfo = '';
    if (order.deliveryType === 'delivery') {
        deliveryInfo = `
            <div class="section">
                <p><strong>Yetkazib berish</strong></p>
                <p>${order.location ? 'Lokatsiya orqali' : 'Manzil ko\'rsatilmagan'}</p>
                ${order.location ? `<p class="small">Lat: ${order.location.lat}<br>Lng: ${order.location.lng}</p>` : ''}
            </div>
        `;
    } else {
        deliveryInfo = `
            <div class="section">
                <p><strong>Olib ketish</strong></p>
            </div>
        `;
    }

    const html = `
        <html>
        <head>
            <title>Chek #${order.id.slice(-4)}</title>
            <style>
                body { font-family: 'Courier New', monospace; padding: 10px; max-width: 300px; margin: 0 auto; color: #000; }
                .header { text-align: center; margin-bottom: 10px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
                .title { font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase; }
                .subtitle { font-size: 14px; margin: 5px 0; }
                .section { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
                .info p { margin: 2px 0; font-size: 14px; }
                .items { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 14px; }
                .items th { text-align: left; border-bottom: 1px solid #000; }
                .items td { padding: 5px 0; vertical-align: top; }
                .total { text-align: right; font-size: 20px; font-weight: bold; border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; }
                .small { font-size: 11px; color: #333; }
                @media print {
                    @page { margin: 0; }
                    body { padding: 5px; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 class="title">CHORSU</h1>
                <p class="subtitle">Milliy Taomlar</p>
                <p class="subtitle">+998 90 123 45 67</p>
            </div>
            
            <div class="section info">
                <p><strong>Chek:</strong> #${order.id.slice(-4)}</p>
                <p><strong>Sana:</strong> ${date}</p>
                <p><strong>Mijoz:</strong> ${order.customerName}</p>
                <p><strong>Tel:</strong> ${order.phone}</p>
                <p><strong>To'lov:</strong> ${order.paymentMethod === 'card' ? 'Karta' : order.paymentMethod === 'online' ? 'Click/Payme' : 'Naqd'}</p>
            </div>

            ${deliveryInfo}

            <table class="items">
                <thead>
                    <tr>
                        <th width="50%">Nomi</th>
                        <th width="20%">Soni</th>
                        <th width="30%" style="text-align: right;">Narx</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map((item) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}x</td>
                            <td style="text-align: right;">${(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total">
                Jami: ${order.total.toLocaleString()} so'm
            </div>

            <div class="footer">
                <p>Xaridingiz uchun rahmat!</p>
                <p>Yoqimli ishtaha!</p>
            </div>

            <script>
                window.onload = function() { 
                    window.print(); 
                    // Optional: window.close(); 
                    // Keeping it open might be better if print fails or user cancels
                }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
};

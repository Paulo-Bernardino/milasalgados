// ============================================
// MILLA SALGADOS - Integração WhatsApp
// ============================================

import { STORE_CONFIG } from "./products.js";
import { getNextOrderNumber, clearCart } from "./cart.js";

function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function buildWhatsAppMessage(cartItems, customerData, total) {
    const orderNumber = getNextOrderNumber();
    const now = new Date();
    const date = now.toLocaleDateString("pt-BR");
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    let msg = `🍔 *NOVO PEDIDO*\n\n`;
    msg += `📋 Pedido: #${orderNumber}\n`;
    msg += `📅 ${date} às ${time}\n\n`;
    msg += `👤 Cliente: ${customerData.name}\n`;

    if (customerData.orderType === "mesa") {
        msg += `🪑 Mesa: ${customerData.tableNumber}\n`;
    } else if (customerData.orderType === "retirada") {
        msg += `🏪 Retirada: ${customerData.name}\n`;
    } else if (customerData.orderType === "entrega") {
        msg += `🚗 Entrega\n`;
    }

    msg += `\n--------------------------------\n\n`;

    cartItems.forEach(item => {
        const additionsTotal = item.additions.reduce((sum, add) => sum + add.price, 0);
        const itemTotal = (item.price + additionsTotal) * item.quantity;

        msg += `${item.quantity}x ${item.name}\n`;
        if (item.additions.length > 0) {
            item.additions.forEach(add => {
                msg += `   + ${add.name}\n`;
            });
        }
        if (item.observation) {
            msg += `   Obs: ${item.observation}\n`;
        }
        msg += `   ${formatCurrency(itemTotal)}\n\n`;
    });

    msg += `--------------------------------\n\n`;
    msg += `💰 *TOTAL: ${formatCurrency(total)}*\n\n`;
    msg += `💳 Pagamento: ${customerData.payment}\n`;

    if (customerData.payment === "Dinheiro" && customerData.change) {
        msg += `💵 Troco para: ${formatCurrency(parseFloat(customerData.change))}\n`;
    }

    if (customerData.observation) {
        msg += `\n📝 Observação: ${customerData.observation}\n`;
    }

    msg += `\n--------------------------------\n`;
    msg += `Obrigado! 🙏`;

    return { message: msg, orderNumber };
}

function sendToWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
}

function finishOrder(cartItems, customerData, total) {
    const { message, orderNumber } = buildWhatsAppMessage(cartItems, customerData, total);

    // Salvar dados do pedido para comanda
    const orderData = {
        orderNumber,
        cartItems,
        customerData,
        total,
        date: new Date().toLocaleDateString("pt-BR"),
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
    localStorage.setItem("milla_last_order", JSON.stringify(orderData));

    sendToWhatsApp(message);
    clearCart();

    return orderData;
}

export { buildWhatsAppMessage, sendToWhatsApp, finishOrder, formatCurrency };
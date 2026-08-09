// ============================================
// MILLA SALGADOS - Carrinho de Compras
// ============================================

const CART_KEY = "milla_cart";
const ORDER_KEY = "milla_order_count";

let cart = [];

function loadCart() {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
        cart = JSON.parse(saved);
    }
    return cart;
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product, quantity, additions, observation) {
    const item = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        additions: additions || [],
        observation: observation || ""
    };
    cart.push(item);
    saveCart();
    return cart;
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    return cart;
}

function updateQuantity(itemId, newQuantity) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            return removeFromCart(itemId);
        }
        item.quantity = newQuantity;
        saveCart();
    }
    return cart;
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        const additionsTotal = item.additions.reduce((sum, add) => sum + add.price, 0);
        return total + (item.price + additionsTotal) * item.quantity;
    }, 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function clearCart() {
    cart = [];
    saveCart();
}

function getNextOrderNumber() {
    let count = parseInt(localStorage.getItem(ORDER_KEY) || "0");
    count++;
    localStorage.setItem(ORDER_KEY, count.toString());
    return count.toString().padStart(4, "0");
}

export {
    cart,
    loadCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
    getNextOrderNumber
};
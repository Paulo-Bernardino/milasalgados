// ============================================
// MILLA SALGADOS - Aplicação Principal
// ============================================

import { STORE_CONFIG, categories, products } from "./products.js";
import { loadCart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, cart } from "./cart.js";
import { finishOrder, formatCurrency } from "./whatsapp.js";

// Estado da aplicação
let currentCategory = "destaques";
let selectedProduct = null;

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    checkMesaFromURL();
    renderCategories();
    renderProducts();
    updateCartBadge();
    setupEventListeners();
});

// Verificar mesa pela URL
function checkMesaFromURL() {
    const params = new URLSearchParams(window.location.search);
    const mesa = params.get("mesa");
    if (mesa) {
        localStorage.setItem("milla_mesa", mesa);
    }
}

// Renderizar categorias
function renderCategories() {
    const container = document.getElementById("categories");
    if (!container) return;

    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat.id === currentCategory ? 'active' : ''}" 
                data-category="${cat.id}">
            <span class="category-icon">${cat.icon}</span>
            <span class="category-name">${cat.name}</span>
        </button>
    `).join("");
}

// Renderizar produtos
function renderProducts() {
    const container = document.getElementById("products-grid");
    if (!container) return;

    let filtered;
    if (currentCategory === "destaques") {
        filtered = products.filter(p => p.featured);
    } else {
        filtered = products.filter(p => p.category === currentCategory);
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image || getDefaultImage(product.category)}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatCurrency(product.price)}</span>
                    <button class="btn-add" data-id="${product.id}">
                        <span>+</span>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function getDefaultImage(category) {
    const defaults = {
        combos: "",
        batatas: "",
        churros: ""
    };
    return defaults[category] || "";
}

// Abrir modal do produto
function openProductModal(productId) {
    selectedProduct = products.find(p => p.id === productId);
    if (!selectedProduct) return;

    const modal = document.getElementById("product-modal");
    const content = document.getElementById("modal-content");

    content.innerHTML = `
        <div class="modal-header">
            <button class="modal-close" id="close-modal">&times;</button>
        </div>
        <div class="modal-image">
            <img src="${selectedProduct.image || getDefaultImage(selectedProduct.category)}" alt="${selectedProduct.name}">
        </div>
        <div class="modal-body">
            <h2 class="modal-title">${selectedProduct.name}</h2>
            <p class="modal-desc">${selectedProduct.description}</p>
            <p class="modal-price">${formatCurrency(selectedProduct.price)}</p>
            
            ${selectedProduct.additions.length > 0 ? `
                <div class="modal-additions">
                    <h4>Adicionais</h4>
                    ${selectedProduct.additions.map(add => `
                        <label class="addition-item">
                            <input type="checkbox" value="${add.id}" data-name="${add.name}" data-price="${add.price}">
                            <span class="addition-name">${add.name}</span>
                            <span class="addition-price">+ ${formatCurrency(add.price)}</span>
                        </label>
                    `).join("")}
                </div>
            ` : ""}
            
            <div class="modal-observation">
                <h4>Observação</h4>
                <textarea id="product-observation" placeholder="Ex: sem cebola, pouco molho..."></textarea>
            </div>
            
            <div class="modal-quantity">
                <button class="qty-btn" id="qty-minus">−</button>
                <span class="qty-value" id="qty-value">1</span>
                <button class="qty-btn" id="qty-plus">+</button>
            </div>
            
            <button class="btn-add-cart" id="btn-add-to-cart">
                ADICIONAR AO PEDIDO
            </button>
        </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Eventos do modal
    document.getElementById("close-modal").addEventListener("click", closeModal);
    document.getElementById("qty-minus").addEventListener("click", () => {
        const el = document.getElementById("qty-value");
        let val = parseInt(el.textContent);
        if (val > 1) el.textContent = val - 1;
    });
    document.getElementById("qty-plus").addEventListener("click", () => {
        const el = document.getElementById("qty-value");
        let val = parseInt(el.textContent);
        el.textContent = val + 1;
    });
    document.getElementById("btn-add-to-cart").addEventListener("click", handleAddToCart);
}

function closeModal() {
    const modal = document.getElementById("product-modal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
    selectedProduct = null;
}

// Adicionar ao carrinho
function handleAddToCart() {
    if (!selectedProduct) return;

    const quantity = parseInt(document.getElementById("qty-value").textContent);
    const observation = document.getElementById("product-observation").value.trim();
    const checkboxes = document.querySelectorAll(".addition-item input:checked");
    const additions = Array.from(checkboxes).map(cb => ({
        id: parseInt(cb.value),
        name: cb.dataset.name,
        price: parseFloat(cb.dataset.price)
    }));

    addToCart(selectedProduct, quantity, additions, observation);
    closeModal();
    updateCartBadge();
    showToast("✓ Adicionado ao pedido!");
}

// Atualizar badge do carrinho
function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const count = getCartCount();
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// Abrir carrinho
function openCart() {
    const panel = document.getElementById("cart-panel");
    if (!panel) return;

    renderCartItems();
    panel.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    const panel = document.getElementById("cart-panel");
    if (panel) {
        panel.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function renderCartItems() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const emptyEl = document.getElementById("cart-empty");
    const cartContent = document.getElementById("cart-content");

    if (!container) return;

    if (cart.length === 0) {
        if (emptyEl) emptyEl.style.display = "block";
        if (cartContent) cartContent.style.display = "none";
        return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    if (cartContent) cartContent.style.display = "block";

    container.innerHTML = cart.map(item => {
        const additionsTotal = item.additions.reduce((sum, add) => sum + add.price, 0);
        const itemTotal = (item.price + additionsTotal) * item.quantity;

        return `
            <div class="cart-item">
                <div class="cart-item-header">
                    <span class="cart-item-qty">${item.quantity}x</span>
                    <span class="cart-item-name">${item.name}</span>
                    <button class="cart-item-remove" data-id="${item.id}">&times;</button>
                </div>
                ${item.additions.length > 0 ? `
                    <div class="cart-item-additions">
                        ${item.additions.map(a => `<span>+ ${a.name}</span>`).join("")}
                    </div>
                ` : ""}
                ${item.observation ? `<div class="cart-item-obs">Obs: ${item.observation}</div>` : ""}
                <div class="cart-item-footer">
                    <div class="cart-item-qty-controls">
                        <button class="qty-sm" data-id="${item.id}" data-action="minus">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-sm" data-id="${item.id}" data-action="plus">+</button>
                    </div>
                    <span class="cart-item-total">${formatCurrency(itemTotal)}</span>
                </div>
            </div>
        `;
    }).join("");

    if (totalEl) {
        totalEl.textContent = formatCurrency(getCartTotal());
    }
}

// Abrir checkout
function openCheckout() {
    if (cart.length === 0) {
        showToast("⚠️ Carrinho vazio!");
        return;
    }

    const panel = document.getElementById("checkout-panel");
    if (!panel) return;

    const mesa = localStorage.getItem("milla_mesa") || "";

    panel.innerHTML = `
        <div class="checkout-container">
            <div class="checkout-header">
                <button class="back-btn" id="checkout-back">← Voltar</button>
                <h2>Finalizar Pedido</h2>
            </div>
            <div class="checkout-form">
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" id="customer-name" placeholder="Seu nome" required>
                </div>
                <div class="form-group">
                    <label>Tipo do pedido</label>
                    <div class="radio-group">
                        <label class="radio-item">
                            <input type="radio" name="order-type" value="mesa" ${mesa ? "checked" : ""}>
                            <span>Mesa</span>
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="order-type" value="retirada" ${!mesa ? "checked" : ""}>
                            <span>Retirada</span>
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="order-type" value="entrega">
                            <span>Entrega</span>
                        </label>
                    </div>
                </div>
                <div class="form-group" id="mesa-group" style="display:${mesa ? 'block' : 'none'}">
                    <label>Número da mesa</label>
                    <input type="text" id="table-number" placeholder="Ex: 08" value="${mesa}">
                </div>
                <div class="form-group">
                    <label>Forma de pagamento</label>
                    <div class="radio-group">
                        <label class="radio-item">
                            <input type="radio" name="payment" value="Pix" checked>
                            <span>Pix</span>
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="payment" value="Cartão">
                            <span>Cartão</span>
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="payment" value="Dinheiro">
                            <span>Dinheiro</span>
                        </label>
                    </div>
                </div>
                <div class="form-group" id="change-group" style="display:none">
                    <label>Troco para quanto?</label>
                    <input type="number" id="change-value" placeholder="Ex: 100">
                </div>
                <div class="form-group">
                    <label>Observação do pedido</label>
                    <textarea id="order-observation" placeholder="Ex: entregar na mesa 08 / cliente com pressa"></textarea>
                </div>
                <div class="checkout-summary">
                    <h3>Resumo</h3>
                    <div class="summary-items">
                        ${cart.map(item => {
                            const additionsTotal = item.additions.reduce((sum, a) => sum + a.price, 0);
                            const itemTotal = (item.price + additionsTotal) * item.quantity;
                            return `
                                <div class="summary-item">
                                    <span>${item.quantity}x ${item.name}</span>
                                    <span>${formatCurrency(itemTotal)}</span>
                                </div>
                            `;
                        }).join("")}
                    </div>
                    <div class="summary-total">
                        <strong>TOTAL</strong>
                        <strong>${formatCurrency(getCartTotal())}</strong>
                    </div>
                </div>
                <button class="btn-send-order" id="btn-send-order">
                    📱 ENVIAR PEDIDO NO WHATSAPP
                </button>
            </div>
        </div>
    `;

    panel.classList.add("active");
    document.body.style.overflow = "hidden";

    // Eventos do checkout
    document.getElementById("checkout-back").addEventListener("click", closeCheckout);

    document.querySelectorAll('input[name="order-type"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            const mesaGroup = document.getElementById("mesa-group");
            mesaGroup.style.display = e.target.value === "mesa" ? "block" : "none";
        });
    });

    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            const changeGroup = document.getElementById("change-group");
            changeGroup.style.display = e.target.value === "Dinheiro" ? "block" : "none";
        });
    });

    document.getElementById("btn-send-order").addEventListener("click", handleSendOrder);
}

function closeCheckout() {
    const panel = document.getElementById("checkout-panel");
    if (panel) {
        panel.classList.remove("active");
        document.body.style.overflow = "";
    }
}

// Enviar pedido
function handleSendOrder() {
    const name = document.getElementById("customer-name").value.trim();
    const orderType = document.querySelector('input[name="order-type"]:checked')?.value;
    const payment = document.querySelector('input[name="payment"]:checked')?.value;
    const tableNumber = document.getElementById("table-number")?.value.trim() || "";
    const change = document.getElementById("change-value")?.value || "";
    const observation = document.getElementById("order-observation")?.value.trim() || "";

    // Validações
    if (!name) {
        showToast("⚠️ Informe seu nome!");
        return;
    }
    if (orderType === "mesa" && !tableNumber) {
        showToast("⚠️ Informe o número da mesa!");
        return;
    }
    if (!payment) {
        showToast("⚠️ Selecione a forma de pagamento!");
        return;
    }

    const customerData = {
        name,
        orderType,
        tableNumber,
        payment,
        change,
        observation
    };

    const total = getCartTotal();
    finishOrder(cart, customerData, total);

    closeCheckout();
    closeCart();
    updateCartBadge();
    showToast("✓ Pedido enviado!");
}

// Event Listeners
function setupEventListeners() {
    // Categorias
    document.getElementById("categories")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-btn");
        if (btn) {
            currentCategory = btn.dataset.category;
            renderCategories();
            renderProducts();
        }
    });

    // Produtos - abrir modal
    document.getElementById("products-grid")?.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card");
        const addBtn = e.target.closest(".btn-add");

        if (addBtn) {
            e.stopPropagation();
            const id = parseInt(addBtn.dataset.id);
            openProductModal(id);
        } else if (card) {
            const id = parseInt(card.dataset.id);
            openProductModal(id);
        }
    });

    // Fechar modal clicando fora
    document.getElementById("product-modal")?.addEventListener("click", (e) => {
        if (e.target.id === "product-modal") {
            closeModal();
        }
    });

    // Botão do carrinho
    document.getElementById("cart-btn")?.addEventListener("click", openCart);

    // Fechar carrinho
    document.getElementById("close-cart")?.addEventListener("click", closeCart);

    // Eventos do carrinho (delegação)
    document.getElementById("cart-items")?.addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".cart-item-remove");
        const qtyBtn = e.target.closest(".qty-sm");

        if (removeBtn) {
            removeFromCart(parseInt(removeBtn.dataset.id));
            renderCartItems();
            updateCartBadge();
        } else if (qtyBtn) {
            const id = parseInt(qtyBtn.dataset.id);
            const action = qtyBtn.dataset.action;
            const item = cart.find(i => i.id === id);
            if (item) {
                const newQty = action === "plus" ? item.quantity + 1 : item.quantity - 1;
                updateQuantity(id, newQty);
                renderCartItems();
                updateCartBadge();
            }
        }
    });

    // Botão finalizar pedido
    document.getElementById("btn-checkout")?.addEventListener("click", () => {
        closeCart();
        openCheckout();
    });

    // Botão continuar comprando
    document.getElementById("btn-continue")?.addEventListener("click", closeCart);
}
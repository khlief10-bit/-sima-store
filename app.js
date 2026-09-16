"use strict";
/* =========================================================
   SIMA 1.0
   Main application file
   ========================================================= */
/* ================= PRODUCTS ================= */
const products = [
    {
        id: 1,
        name: "سِمة الأصلية",
        category: "تيشيرتات",
        price: 79,
        color: "#171717",
        description: "تيشيرت بتصميم سِمة البسيط."
    },
    {
        id: 2,
        name: "دفعة 2026",
        category: "تخرج",
        price: 89,
        color: "#242424",
        description: "تصميم مناسب لحفلات التخرج والذكريات."
    },
    {
        id: 3,
        name: "لحظتنا",
        category: "مناسبات",
        price: 85,
        color: "#6f6f6f",
        description: "تصميم للمناسبات واللحظات الخاصة."
    },
    {
        id: 4,
        name: "مع بعض",
        category: "مجموعات",
        price: 89,
        color: "#343434",
        description: "تصميم مناسب للمجموعات والأصدقاء."
    },
    {
        id: 5,
        name: "Minimal",
        category: "تيشيرتات",
        price: 75,
        color: "#111111",
        description: "تصميم بسيط وأنيق للاستخدام اليومي."
    },
    {
        id: 6,
        name: "Class of 2026",
        category: "تخرج",
        price: 95,
        color: "#555555",
        description: "تصميم تخرج عصري."
    },
    {
        id: 7,
        name: "يومنا",
        category: "مناسبات",
        price: 85,
        color: "#222222",
        description: "تصميم خاص بالمناسبات."
    },
    {
        id: 8,
        name: "Squad",
        category: "مجموعات",
        price: 89,
        color: "#444444",
        description: "تصميم للمجموعات والفعاليات."
    }
];
/* ================= STATE ================= */
let cart = [];
let currentPage = "home";
let currentProduct = null;
/* ================= LOCAL STORAGE ================= */
function saveCart() {
    try {
        localStorage.setItem(
            "sima_cart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn("Could not save cart.", error);
    }
}
function loadCart() {
    try {
        const savedCart =
            localStorage.getItem("sima_cart");
        if (!savedCart) {
            cart = [];
            return;
        }
        const parsed =
            JSON.parse(savedCart);
        cart = Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        cart = [];
        console.warn(
            "Could not load cart.",
            error
        );
    }
}
/* ================= PAGE NAVIGATION ================= */
function showPage(pageName) {
    const pages =
        document.querySelectorAll(".page");
    pages.forEach(page => {
        page.classList.remove("active");
    });
    const target =
        document.getElementById(
            `${pageName}-page`
        );
    if (!target) {
        console.warn(
            `Page "${pageName}" does not exist.`
        );
        return;
    }
    target.classList.add("active");
    currentPage = pageName;
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    if (pageName === "shop") {
        renderShopProducts();
    }
    if (pageName === "cart") {
        renderCart();
    }
    if (pageName === "checkout") {
        renderCheckout();
    }
    if (pageName === "home") {
        renderFeaturedProducts();
    }
}
/* ================= PRODUCT CARD ================= */
function createProductCard(product) {
    return `
        <article class="product-card">
            <button
                class="product-image"
                onclick="openProduct(${product.id})"
                aria-label="${product.name}"
            >
                <div
                    class="product-shirt"
                    style="background:${product.color}"
                >
                    <span>
                        سِمة
                    </span>
                </div>
            </button>
            <div class="product-info">
                <h3>
                    ${escapeHTML(product.name)}
                </h3>
                <p>
                    ${escapeHTML(product.category)}
                </p>
                <div class="product-price">
                    <strong>
                        ${formatPrice(product.price)}
                    </strong>
                    <button
                        onclick="addToCart(${product.id})"
                    >
                        أضف للسلة
                    </button>
                </div>
            </div>
        </article>
    `;
}
/* ================= FEATURED PRODUCTS ================= */
function renderFeaturedProducts() {
    const container =
        document.getElementById(
            "featured-products"
        );
    if (!container) return;
    const featured =
        products.slice(0, 4);
    container.innerHTML =
        featured
            .map(createProductCard)
            .join("");
}
/* ================= SHOP PRODUCTS ================= */
function renderShopProducts(
    list = products
) {
    const container =
        document.getElementById(
            "shop-products"
        );
    if (!container) return;
    if (!list.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>
                    ما لقينا تصميم بهذا البحث
                </h3>
                <p>
                    جرّب كلمة بحث مختلفة أو تصنيف آخر.
                </p>
            </div>
        `;
        return;
    }
    container.innerHTML =
        list
            .map(createProductCard)
            .join("");
}
/* ================= PRODUCT DETAILS ================= */
function openProduct(productId) {
    const product =
        products.find(
            item => item.id === productId
        );
    if (!product) return;
    currentProduct = product;
    const container =
        document.getElementById(
            "product-details"
        );
    if (!container) return;
    container.innerHTML = `
        <div class="product-detail-layout">
            <div class="product-detail-image">
                <div
                    class="product-shirt"
                    style="
                        background:${product.color};
                        width:230px;
                        height:280px;
                    "
                >
                    <span>
                        سِمة
                    </span>
                </div>
            </div>
            <div class="product-detail-info">
                <span class="section-label">
                    ${escapeHTML(product.category)}
                </span>
                <h1>
                    ${escapeHTML(product.name)}
                </h1>
                <p class="description">
                    ${escapeHTML(product.description)}
                </p>
                <div class="detail-price">
                    ${formatPrice(product.price)}
                </div>
                <div class="control-group">
                    <label for="detail-size">
                        المقاس
                    </label>
                    <select id="detail-size">
                        <option value="S">S</option>
                        <option value="M" selected>M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>
                <button
                    class="primary-button full-button"
                    onclick="addProductFromDetails()"
                >
                    أضف للسلة
                </button>
            </div>
        </div>
    `;
    showPage("product");
}
function addProductFromDetails() {
    if (!currentProduct) return;
    const sizeElement =
        document.getElementById(
            "detail-size"
        );
    const size =
        sizeElement
            ? sizeElement.value
            : "M";
    addToCart(
        currentProduct.id,
        size
    );
}
/* ================= CART ================= */
function addToCart(
    productId,
    size = "M"
) {
    const product =
        products.find(
            item => item.id === productId
        );
    if (!product) return;
    const existing =
        cart.find(
            item =>
                item.productId === productId &&
                item.size === size
        );
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            cartId:
                `${productId}-${size}-${Date.now()}`,
            productId:
                productId,
            name:
                product.name,
            price:
                product.price,
            color:
                product.color,
            size:
                size,
            quantity:
                1
        });
    }
    saveCart();
    updateCartCount();
    showToast(
        "تمت إضافة المنتج للسلة"
    );
}
/* ================= CUSTOM DESIGN ================= */
function addCustomDesignToCart() {
    const sizeElement =
        document.getElementById(
            "size-select"
        );
    const textElement =
        document.getElementById(
            "custom-text"
        );
    const shirtElement =
        document.getElementById(
            "design-shirt"
        );
    const size =
        sizeElement
            ? sizeElement.value
            : "M";
    const text =
        textElement
            ? textElement.value.trim()
            : "";
    const background =
        shirtElement
            ? getComputedStyle(
                shirtElement
            ).backgroundColor
            : "#f5f5f5";
    cart.push({
        cartId:
            `custom-${Date.now()}`,
        productId:
            "custom",
        name:
            text
                ? `تصميم مخصص: ${text}`
                : "تصميم مخصص",
        price:
            99,
        color:
            background,
        size:
            size,
        quantity:
            1,
        custom:
            true,
        customText:
            text
    });
    saveCart();
    updateCartCount();
    showToast(
        "تمت إضافة تصميمك للسلة"
    );
}
/* ================= CART RENDER ================= */
function renderCart() {
    const container =
        document.getElementById(
            "cart-items"
        );
    if (!container) return;
    if (!cart.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>
                    السلة فاضية
                </h3>
                <p>
                    أضف أول تصميم لك وابدأ طلبك.
                </p>
                <br>
                <button
                    class="primary-button"
                    onclick="showPage('shop')"
                >
                    تصفح المتجر
                </button>
            </div>
        `;
        updateCartTotals();
        return;
    }
    container.innerHTML =
        cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <div
                        class="product-shirt"
                        style="
                            background:${item.color};
                        "
                    >
                        <span>
                            سِمة
                        </span>
                    </div>
                </div>
                <div class="cart-item-info">
                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>
                    <p>
                        المقاس: ${escapeHTML(item.size)}
                    </p>
                    <p>
                        الكمية: ${item.quantity}
                    </p>
                </div>
                <div class="cart-item-price">
                    ${formatPrice(
                        item.price *
                        item.quantity
                    )}
                </div>
                <button
                    class="remove-button"
                    onclick="removeFromCart('${item.cartId}')"
                    aria-label="حذف"
                >
                    حذف
                </button>
            </div>
        `).join("");
    updateCartTotals();
}
/* ================= REMOVE CART ITEM ================= */
function removeFromCart(cartId) {
    cart =
        cart.filter(
            item =>
                item.cartId !== cartId
        );
    saveCart();
    updateCartCount();
    renderCart();
    showToast(
        "تم حذف المنتج"
    );
}
/* ================= TOTALS ================= */
function calculateSubtotal() {
    return cart.reduce(
        (total, item) =>
            total +
            (
                Number(item.price) *
                Number(item.quantity)
            ),
        0
    );
}
function updateCartTotals() {
    const subtotal =
        calculateSubtotal();
    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );
    const totalElement =
        document.getElementById(
            "cart-total"
        );
    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(subtotal);
    }
    if (totalElement) {
        totalElement.textContent =
            formatPrice(subtotal);
    }
}
/* ================= CART COUNT ================= */
function updateCartCount() {
    const count =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity),
            0
        );
    const element =
        document.getElementById(
            "cart-count"
        );
    if (element) {
        element.textContent =
            count;
    }
}
/* ================= CHECKOUT ================= */
function goToCheckout() {
    if (!cart.length) {
        showToast(
            "السلة فارغة"
        );
        return;
    }
    showPage("checkout");
}
function renderCheckout() {
    const itemsContainer =
        document.getElementById(
            "checkout-items"
        );
    const totalElement =
        document.getElementById(
            "checkout-total"
        );
    if (!itemsContainer) return;
    itemsContainer.innerHTML =
        cart.map(item => `
            <div
                class="summary-row"
            >
                <span>
                    ${escapeHTML(item.name)}
                    × ${item.quantity}
                </span>
                <strong>
                    ${formatPrice(
                        item.price *
                        item.quantity
                    )}
                </strong>
            </div>
        `).join("");
    if (totalElement) {
        totalElement.textContent =
            formatPrice(
                calculateSubtotal()
            );
    }
}
/* ================= ORDER ================= */
function submitOrder(event) {
    event.preventDefault();
    if (!cart.length) {
        showToast(
            "السلة فارغة"
        );
        return;
    }
    const name =
        document.getElementById(
            "customer-name"
        ).value.trim();
    const phone =
        document.getElementById(
            "customer-phone"
        ).value.trim();
    const city =
        document.getElementById(
            "customer-city"
        ).value.trim();
    const address =
        document.getElementById(
            "customer-address"
        ).value.trim();
    if (
        !name ||
        !phone ||
        !city ||
        !address
    ) {
        showToast(
            "فضلاً أكمل بيانات الطلب"
        );
        return;
    }
    /*
       PAYMENT PLACEHOLDER
       هنا سيتم ربط Paylink لاحقًا.
       لن نضع مفاتيح API أو بيانات
       سرية داخل GitHub.
       عند تجهيز Backend سنرسل
       بيانات الطلب إلى الخادم،
       والخادم ينشئ رابط الدفع.
    */
    showToast(
        "بيانات الطلب جاهزة. سنربط Paylink في الخطوة القادمة."
    );
}
/* ================= DESIGNER ================= */
function updateDesignText(value) {
    const element =
        document.getElementById(
            "shirt-text"
        );
    if (!element) return;
    element.textContent =
        value.trim() || "سِمة";
}
function changeShirtColor(color) {
    const element =
        document.getElementById(
            "design-shirt"
        );
    if (!element) return;
    element.style.background =
        color;
    const textElement =
        document.getElementById(
            "shirt-text"
        );
    if (!textElement) return;
    if (
        color === "#151515" ||
        color === "#777"
    ) {
        textElement.style.color =
            "#ffffff";
    } else {
        textElement.style.color =
            "#171717";
    }
}
/* ================= SEARCH ================= */
function searchProducts() {
    const input =
        document.getElementById(
            "search-input"
        );
    if (!input) return;
    const search =
        input.value
            .trim()
            .toLowerCase();
    const filtered =
        products.filter(product => {
            return (
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search) ||
                product.description
                    .toLowerCase()
                    .includes(search)
            );
        });
    renderShopProducts(
        filtered
    );
}
/* ================= FILTER ================= */
function filterProducts() {
    const filter =
        document.getElementById(
            "category-filter"
        );
    if (!filter) return;
    const value =
        filter.value;
    if (value === "all") {
        renderShopProducts(
            products
        );
        return;
    }
    const filtered =
        products.filter(
            product =>
                product.category === value
        );
    renderShopProducts(
        filtered
    );
}
/* ================= CATEGORY ================= */
function openCategory(category) {
    showPage("shop");
    const filter =
        document.getElementById(
            "category-filter"
        );
    if (!filter) return;
    filter.value =
        category;
    filterProducts();
}
/* ================= TOAST ================= */
function showToast(message) {
    const existing =
        document.querySelector(
            ".sima-toast"
        );
    if (existing) {
        existing.remove();
    }
    const toast =
        document.createElement(
            "div"
        );
    toast.className =
        "sima-toast";
    toast.textContent =
        message;
    Object.assign(
        toast.style,
        {
            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: "99999",
            background: "#171717",
            color: "#ffffff",
            padding: "14px 20px",
            borderRadius: "12px",
            boxShadow:
                "0 10px 30px rgba(0,0,0,.18)",
            fontSize: "14px",
            fontWeight: "700",
            maxWidth: "calc(100% - 50px)"
        }
    );
    document.body.appendChild(
        toast
    );
    setTimeout(() => {
        toast.remove();
    }, 2500);
}
/* ================= HELPERS ================= */
function formatPrice(price) {
    return (
        Number(price)
            .toLocaleString(
                "ar-SA"
            ) +
        " ر.س"
    );
}
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
/* ================= INITIALIZATION ================= */
function initializeSima() {
    loadCart();
    updateCartCount();
    renderFeaturedProducts();
    renderShopProducts();
    renderCart();
    renderCheckout();
    showPage("home");
}
document.addEventListener(
    "DOMContentLoaded",
    initializeSima
);

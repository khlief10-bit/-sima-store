"use strict";

/* =========================================================
   SIMA 3.0
   Main Application
   ========================================================= */

/* ================= PRODUCTS ================= */

const products = [
    {
        id: 1,
        name: "سِمة الأصلية",
        category: "تيشيرتات",
        price: 79,
        color: "#171717",
        description: "تيشيرت سِمة بتصميم بسيط وعصري.",
        featured: true
    },
    {
        id: 2,
        name: "دفعة 2026",
        category: "تخرج",
        price: 89,
        color: "#242424",
        description: "تصميم خاص بالتخرج والذكريات.",
        featured: true
    },
    {
        id: 3,
        name: "لحظتنا",
        category: "مناسبات",
        price: 85,
        color: "#777777",
        description: "تصميم مناسب للمناسبات واللحظات الخاصة.",
        featured: true
    },
    {
        id: 4,
        name: "مع بعض",
        category: "مجموعات",
        price: 89,
        color: "#343434",
        description: "تصميم للمجموعات والأصدقاء.",
        featured: true
    },
    {
        id: 5,
        name: "Minimal",
        category: "تيشيرتات",
        price: 75,
        color: "#111111"
    },
    {
        id: 6,
        name: "Class of 2026",
        category: "تخرج",
        price: 95,
        color: "#555555"
    },
    {
        id: 7,
        name: "يومنا",
        category: "مناسبات",
        price: 85,
        color: "#222222"
    },
    {
        id: 8,
        name: "Squad",
        category: "مجموعات",
        price: 89,
        color: "#444444"
    }
];

/* ================= STATE ================= */

let cart = [];
let currentPage = "home";
let currentProduct = null;

let designerState = {
    productType: "تيشيرت",
    color: "#f5f5f5",
    size: "M",
    text: "",
    textSize: 28,
    uploadedImage: null
};

/* ================= STORAGE ================= */

function saveCart() {
    try {
        localStorage.setItem(
            "sima_cart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn("Unable to save cart:", error);
    }
}

function loadCart() {
    try {
        const saved = localStorage.getItem("sima_cart");

        if (!saved) {
            cart = [];
            return;
        }

        const parsed = JSON.parse(saved);

        cart = Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        cart = [];
        console.warn("Unable to load cart:", error);
    }
}

function saveDesignerState() {
    try {
        const stateToSave = {
            productType: designerState.productType,
            color: designerState.color,
            size: designerState.size,
            text: designerState.text,
            textSize: designerState.textSize
        };

        localStorage.setItem(
            "sima_designer",
            JSON.stringify(stateToSave)
        );
    } catch (error) {
        console.warn("Unable to save designer:", error);
    }
}

function loadDesignerState() {
    try {
        const saved =
            localStorage.getItem("sima_designer");

        if (!saved) return;

        const parsed = JSON.parse(saved);

        if (parsed && typeof parsed === "object") {
            designerState = {
                ...designerState,
                ...parsed
            };
        }
    } catch (error) {
        console.warn(
            "Unable to load designer:",
            error
        );
    }
}

/* ================= NAVIGATION ================= */

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

    if (pageName === "home") {
        renderFeaturedProducts();
    }

    if (pageName === "shop") {
        renderShopProducts();
    }

    if (pageName === "cart") {
        renderCart();
    }

    if (pageName === "checkout") {
        renderCheckout();
    }

    if (pageName === "designer") {
        updateDesignerPreview();
    }
}

/* ================= PRODUCT CARD ================= */

function createProductCard(product) {
    return `
        <article class="product-card">

            <button
                class="product-image"
                onclick="openProduct(${product.id})"
                aria-label="${escapeHTML(product.name)}"
            >

                <div
                    class="product-shirt"
                    style="background:${product.color};"
                >
                    <span>سِمة</span>
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

/* ================= HOME PRODUCTS ================= */

function renderFeaturedProducts() {
    const container =
        document.getElementById(
            "featured-products"
        );

    if (!container) return;

    const featured =
        products.filter(
            product => product.featured
        );

    container.innerHTML =
        featured
            .map(createProductCard)
            .join("");
}

/* ================= SHOP ================= */

function renderShopProducts(list = products) {
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

            const name =
                product.name
                    .toLowerCase();

            const category =
                product.category
                    .toLowerCase();

            const description =
                product.description
                    .toLowerCase();

            return (
                name.includes(search) ||
                category.includes(search) ||
                description.includes(search)
            );
        });

    renderShopProducts(filtered);
}

function clearSearch() {
    const input =
        document.getElementById(
            "search-input"
        );

    if (input) {
        input.value = "";
    }

    renderShopProducts(products);
}

/* ================= CATEGORY ================= */

function filterCategory(category) {
    let filtered = products;

    if (
        category &&
        category !== "all" &&
        category !== "الكل"
    ) {
        filtered =
            products.filter(
                product =>
                    product.category === category
            );
    }

    renderShopProducts(filtered);
}

function filterProducts() {
    const filter =
        document.getElementById(
            "category-filter"
        );

    if (!filter) {
        renderShopProducts(products);
        return;
    }

    filterCategory(filter.value);
}

function openCategory(category) {
    showPage("shop");

    filterCategory(category);
}

/* ================= SORT ================= */

function sortProducts() {
    const select =
        document.getElementById(
            "sort-select"
        );

    if (!select) return;

    const value = select.value;

    let sorted =
        [...products];

    if (value === "price-low") {
        sorted.sort(
            (a, b) =>
                a.price - b.price
        );
    }

    if (value === "price-high") {
        sorted.sort(
            (a, b) =>
                b.price - a.price
        );
    }

    if (value === "name") {
        sorted.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name,
                    "ar"
                )
        );
    }

    renderShopProducts(sorted);
}

/* ================= CATEGORY BUTTONS ================= */

function setupCategoryButtons() {
    const buttons =
        document.querySelectorAll(
            "[data-category]"
        );

    buttons.forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const category =
                    button.dataset.category;

                filterCategory(category);

                showPage("shop");
            }
        );
    });
}

/* ================= PRODUCT DETAILS ================= */

function openProduct(productId) {
    const product =
        products.find(
            item =>
                item.id === Number(productId)
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
                    <span>سِمة</span>
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

                        <option value="XS">
                            XS
                        </option>

                        <option value="S">
                            S
                        </option>

                        <option value="M" selected>
                            M
                        </option>

                        <option value="L">
                            L
                        </option>

                        <option value="XL">
                            XL
                        </option>

                        <option value="XXL">
                            XXL
                        </option>

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
            item =>
                item.id === Number(productId)
        );

    if (!product) return;

    const existing =
        cart.find(
            item =>
                item.productId === product.id &&
                item.size === size
        );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            cartId:
                `${product.id}-${size}-${Date.now()}`,
            productId:
                product.id,
            name:
                product.name,
            price:
                product.price,
            color:
                product.color,
            size:
                size,
            quantity:
                1,
            custom:
                false
        });
    }

    saveCart();
    updateCartCount();

    showToast(
        "تمت إضافة المنتج للسلة"
    );
}

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
        "تم حذف المنتج من السلة"
    );
}

function increaseCartItem(cartId) {
    const item =
        cart.find(
            product =>
                product.cartId === cartId
        );

    if (!item) return;

    item.quantity += 1;

    saveCart();
    updateCartCount();
    renderCart();
}

function decreaseCartItem(cartId) {
    const item =
        cart.find(
            product =>
                product.cartId === cartId
        );

    if (!item) return;

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart =
            cart.filter(
                product =>
                    product.cartId !== cartId
            );
    }

    saveCart();
    updateCartCount();
    renderCart();
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
        cart
            .map(item => {

                const imageColor =
                    item.color ||
                    "#171717";

                return `
                    <div class="cart-item">

                        <div class="cart-item-image">

                            <div
                                class="product-shirt"
                                style="
                                    background:${imageColor};
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
                                المقاس:
                                ${escapeHTML(item.size)}
                            </p>

                            <div
                                class="cart-quantity"
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:8px;
                                    margin-top:8px;
                                "
                            >

                                <button
                                    type="button"
                                    onclick="decreaseCartItem('${item.cartId}')"
                                    style="
                                        width:32px;
                                        height:32px;
                                        border-radius:8px;
                                        background:#f1f1f1;
                                    "
                                >
                                    −
                                </button>

                                <strong>
                                    ${item.quantity}
                                </strong>

                                <button
                                    type="button"
                                    onclick="increaseCartItem('${item.cartId}')"
                                    style="
                                        width:32px;
                                        height:32px;
                                        border-radius:8px;
                                        background:#f1f1f1;
                                    "
                                >
                                    +
                                </button>

                            </div>

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
                        >
                            حذف
                        </button>

                    </div>
                `;
            })
            .join("");

    updateCartTotals();
}

/* ================= CART TOTALS ================= */

function calculateSubtotal() {
    return cart.reduce(
        (total, item) => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;

            return (
                total +
                price * quantity
            );
        },
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
                Number(item.quantity || 0),
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

/* ================= CUSTOM DESIGNER ================= */

function selectProductType(type) {
    designerState.productType =
        type;

    const buttons =
        document.querySelectorAll(
            "[data-product-type]"
        );

    buttons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.productType === type
        );

    });

    saveDesignerState();

    updateDesignerPreview();

    showToast(
        `تم اختيار ${type}`
    );
}

function selectShirtColor(color) {

    const colors = {
        white: "#f5f5f5",
        black: "#151515",
        gray: "#777777",
        green: "#183c32",
        beige: "#d9cbb8",
        navy: "#1d2c46"
    };

    const selected =
        colors[color] ||
        color ||
        "#f5f5f5";

    designerState.color =
        selected;

    saveDesignerState();

    updateDesignerPreview();
}

function changeShirtColor(color) {
    selectShirtColor(color);
}

function selectSize(size) {
    designerState.size =
        size;

    const buttons =
        document.querySelectorAll(
            "[data-size]"
        );

    buttons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.size === size
        );
    });

    saveDesignerState();

    updateDesignerPreview();
}

function updateDesignText(value) {
    designerState.text =
        value.trim();

    const textElement =
        document.getElementById(
            "shirt-text"
        );

    if (textElement) {
        textElement.textContent =
            designerState.text ||
            "سِمة";
    }

    saveDesignerState();
}

function updateTextSize(value) {
    const size =
        Number(value);

    if (
        Number.isFinite(size) &&
        size >= 12 &&
        size <= 80
    ) {
        designerState.textSize =
            size;
    }

    updateDesignerPreview();
    saveDesignerState();
}

/* ================= DESIGNER PREVIEW ================= */

function updateDesignerPreview() {
    const shirt =
        document.getElementById(
            "design-shirt"
        );

    if (!shirt) return;

    shirt.style.background =
        designerState.color;

    const text =
        document.getElementById(
            "shirt-text"
        );

    if (text) {

        text.textContent =
            designerState.text ||
            "سِمة";

        text.style.fontSize =
            `${designerState.textSize}px`;

        text.style.color =
            getContrastColor(
                designerState.color
            );
    }

    const sizeLabel =
        document.getElementById(
            "selected-size"
        );

    if (sizeLabel) {
        sizeLabel.textContent =
            designerState.size;
    }

    const productLabel =
        document.getElementById(
            "selected-product-type"
        );

    if (productLabel) {
        productLabel.textContent =
            designerState.productType;
    }
}

/* ================= DESIGN IMAGE UPLOAD ================= */

function handleDesignUpload(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showToast(
            "فضلاً اختر صورة صحيحة"
        );

        event.target.value = "";
        return;
    }

    const maxSize =
        5 * 1024 * 1024;

    if (file.size > maxSize) {
        showToast(
            "حجم الصورة يجب أن يكون أقل من 5MB"
        );

        event.target.value = "";
        return;
    }

    const reader =
        new FileReader();

    reader.onload = function () {

        designerState.uploadedImage =
            reader.result;

        const preview =
            document.getElementById(
                "design-image"
            );

        if (preview) {

            preview.src =
                reader.result;

            preview.style.display =
                "block";
        }

        updateDesignerPreview();

        showToast(
            "تم رفع التصميم"
        );
    };

    reader.readAsDataURL(file);
}

function removeUploadedDesign() {

    designerState.uploadedImage =
        null;

    const preview =
        document.getElementById(
            "design-image"
        );

    if (preview) {
        preview.src = "";
        preview.style.display =
            "none";
    }

    const input =
        document.getElementById(
            "design-upload"
        );

    if (input) {
        input.value = "";
    }

    updateDesignerPreview();

    showToast(
        "تم حذف التصميم"
    );
}

/* ================= CUSTOM DESIGN CART ================= */

function addCustomDesignToCart() {

    const text =
        designerState.text.trim();

    cart.push({

        cartId:
            `custom-${Date.now()}`,

        productId:
            "custom",

        name:
            text
                ? `تصميم مخصص: ${text}`
                : `تصميم مخصص ${designerState.productType}`,

        price:
            designerState.productType === "هودي"
                ? 139
                : 99,

        color:
            designerState.color,

        size:
            designerState.size,

        quantity:
            1,

        custom:
            true,

        customText:
            text,

        productType:
            designerState.productType,

        uploadedImage:
            designerState.uploadedImage
    });

    saveCart();

    updateCartCount();

    showToast(
        "تمت إضافة تصميمك للسلة"
    );
}

/* ================= DESIGN SAVE ================= */

function saveDesign() {

    const savedDesigns =
        getSavedDesigns();

    const design = {

        id:
            `design-${Date.now()}`,

        productType:
            designerState.productType,

        color:
            designerState.color,

        size:
            designerState.size,

        text:
            designerState.text,

        textSize:
            designerState.textSize,

        uploadedImage:
            designerState.uploadedImage,

        createdAt:
            new Date().toISOString()
    };

    savedDesigns.push(design);

    try {
        localStorage.setItem(
            "sima_saved_designs",
            JSON.stringify(savedDesigns)
        );

        showToast(
            "تم حفظ التصميم"
        );
    } catch (error) {

        console.warn(
            "Unable to save design:",
            error
        );

        showToast(
            "تعذر حفظ التصميم"
        );
    }
}

function getSavedDesigns() {

    try {

        const saved =
            localStorage.getItem(
                "sima_saved_designs"
            );

        if (!saved) return [];

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];
    }
}

/* ================= SELL DESIGN ================= */

function submitDesignForSale() {

    const design = {

        id:
            `submission-${Date.now()}`,

        productType:
            designerState.productType,

        color:
            designerState.color,

        size:
            designerState.size,

        text:
            designerState.text,

        uploadedImage:
            designerState.uploadedImage,

        status:
            "pending",

        createdAt:
            new Date().toISOString()
    };

    try {

        const submissions =
            JSON.parse(
                localStorage.getItem(
                    "sima_submissions"
                ) || "[]"
            );

        submissions.push(design);

        localStorage.setItem(
            "sima_submissions",
            JSON.stringify(submissions)
        );

        showToast(
            "تم إرسال التصميم للمراجعة"
        );

    } catch (error) {

        console.warn(
            "Unable to submit design:",
            error
        );

        showToast(
            "تعذر إرسال التصميم"
        );
    }
}

/* ================= AI DESIGN ================= */

function openAIDesigner() {

    const message =
        prompt(
            "اكتب وصف التصميم الذي تريده، مثال: تيشيرت أسود بتصميم تخرج 2026 باللون الأخضر"
        );

    if (!message) return;

    designerState.text =
        message.trim();

    const input =
        document.getElementById(
            "custom-text"
        );

    if (input) {
        input.value =
            message.trim();
    }

    updateDesignText(
        message.trim()
    );

    showToast(
        "تم تجهيز فكرتك داخل المصمم"
    );
}

/* ================= CHECKOUT ================= */

function goToCheckout() {

    if (!cart.length) {

        showToast(
            "السلة فاضية"
        );

        return;
    }

    showPage("checkout");
}

function renderCheckout() {

    const itemsContainer =
        document.getElementById(
            "checkout-summary-items"
        ) ||
        document.getElementById(
            "checkout-items"
        );

    const totalElement =
        document.getElementById(
            "checkout-total"
        );

    if (!itemsContainer) return;

    itemsContainer.innerHTML =
        cart
            .map(item => `
                <div class="summary-row">

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
            `)
            .join("");

    if (totalElement) {

        totalElement.textContent =
            formatPrice(
                calculateSubtotal()
            );
    }
}

/* ================= ORDER ================= */

function submitOrder(event) {

    if (event) {
        event.preventDefault();
    }

    if (!cart.length) {

        showToast(
            "السلة فاضية"
        );

        return;
    }

    const name =
        getInputValue(
            "customer-name"
        );

    const phone =
        getInputValue(
            "customer-phone"
        );

    const city =
        getInputValue(
            "customer-city"
        );

    const address =
        getInputValue(
            "customer-address"
        );

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

    const order = {

        id:
            `SIMA-${Date.now()}`,

        customer: {

            name:
                name,

            phone:
                phone,

            city:
                city,

            address:
                address
        },

        items:
            [...cart],

        total:
            calculateSubtotal(),

        status:
            "pending",

        createdAt:
            new Date().toISOString()
    };

    try {

        const orders =
            JSON.parse(
                localStorage.getItem(
                    "sima_orders"
                ) || "[]"
            );

        orders.push(order);

        localStorage.setItem(
            "sima_orders",
            JSON.stringify(orders)
        );

        showToast(
            "تم تجهيز الطلب بنجاح"
        );

        /*
            Paylink سيتم ربطه هنا لاحقًا
            عن طريق Backend آمن.
        */

    } catch (error) {

        console.warn(
            "Unable to save order:",
            error
        );

        showToast(
            "تعذر حفظ الطلب"
        );
    }
}

/* ================= ACCOUNT ================= */

function showLoginMessage() {

    showModal(
        "تسجيل الدخول",
        `
            <p>
                تسجيل الدخول بالحساب الحقيقي سيتم ربطه
                مع Supabase في المرحلة القادمة.
            </p>

            <button
                class="primary-button full-button"
                onclick="closeModal()"
            >
                فهمت
            </button>
        `
    );
}

function showOrdersMessage() {

    const orders =
        getOrders();

    if (!orders.length) {

        showModal(
            "طلباتي",
            `
                <p>
                    ما عندك طلبات حالياً.
                </p>

                <button
                    class="primary-button full-button"
                    onclick="closeModal()"
                >
                    إغلاق
                </button>
            `
        );

        return;
    }

    const html =
        orders
            .map(
                order => `
                    <div
                        style="
                            padding:15px 0;
                            border-bottom:1px solid #eee;
                        "
                    >
                        <strong>
                            ${escapeHTML(order.id)}
                        </strong>

                        <p>
                            ${formatPrice(order.total)}
                        </p>

                        <small>
                            ${escapeHTML(order.status)}
                        </small>
                    </div>
                `
            )
            .join("");

    showModal(
        "طلباتي",
        html
    );
}

function showSavedDesigns() {

    const designs =
        getSavedDesigns();

    if (!designs.length) {

        showModal(
            "تصاميمي المحفوظة",
            `
                <p>
                    ما عندك تصاميم محفوظة حالياً.
                </p>

                <button
                    class="primary-button full-button"
                    onclick="closeModal()"
                >
                    إغلاق
                </button>
            `
        );

        return;
    }

    const html =
        designs
            .map(
                design => `
                    <div
                        style="
                            padding:15px 0;
                            border-bottom:1px solid #eee;
                        "
                    >
                        <strong>
                            ${escapeHTML(
                                design.productType
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                design.text ||
                                "بدون نص"
                            )}
                        </p>
                    </div>
                `
            )
            .join("");

    showModal(
        "تصاميمي المحفوظة",
        html
    );
}

function getOrders() {

    try {

        const saved =
            localStorage.getItem(
                "sima_orders"
            );

        if (!saved) return [];

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];
    }
}

/* ================= MODAL ================= */

function showModal(title, content) {

    closeModal();

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "sima-modal";

    Object.assign(
        modal.style,
        {
            position: "fixed",
            inset: "0",
            zIndex: "100000",
            background:
                "rgba(0,0,0,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        }
    );

    modal.innerHTML = `
        <div
            style="
                width:min(100%,500px);
                max-height:90vh;
                overflow:auto;
                background:#fff;
                border-radius:22px;
                padding:30px;
                direction:rtl;
                position:relative;
            "
        >

            <button
                onclick="closeModal()"
                style="
                    position:absolute;
                    top:15px;
                    left:15px;
                    width:36px;
                    height:36px;
                    border-radius:50%;
                    background:#f1f1f1;
                    font-size:20px;
                "
                aria-label="إغلاق"
            >
                ×
            </button>

            <h2
                style="
                    margin-bottom:20px;
                "
            >
                ${escapeHTML(title)}
            </h2>

            <div>
                ${content}
            </div>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {
                closeModal();
            }

        }
    );
}

function closeModal() {

    const modal =
        document.getElementById(
            "sima-modal"
        );

    if (modal) {
        modal.remove();
    }
}

/* ================= SOCIAL ================= */

function openSocial(platform) {

    const links = {

        instagram:
            "https://www.instagram.com/",

        tiktok:
            "https://www.tiktok.com/",

        x:
            "https://x.com/"
    };

    const url =
        links[platform];

    if (!url) return;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}

/* ================= MOBILE MENU ================= */

function toggleMobileMenu() {

    const nav =
        document.querySelector(
            ".navigation"
        ) ||
        document.querySelector(
            ".main-nav"
        );

    if (!nav) return;

    nav.classList.toggle(
        "mobile-open"
    );
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
            maxWidth:
                "calc(100% - 50px)",
            direction: "rtl"
        }
    );

    document.body.appendChild(
        toast
    );

    setTimeout(
        () => {

            if (toast) {
                toast.remove();
            }

        },
        2500
    );
}

/* ================= HELPERS ================= */

function formatPrice(price) {

    return (
        Number(price || 0)
            .toLocaleString("ar-SA") +
        " ر.س"
    );
}

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

function getInputValue(id) {

    const element =
        document.getElementById(id);

    if (!element) return "";

    return element.value.trim();
}

function getContrastColor(hex) {

    if (!hex) {
        return "#171717";
    }

    let color =
        hex.replace("#", "");

    if (color.length === 3) {
        color =
            color
                .split("")
                .map(char => char + char)
                .join("");
    }

    if (color.length !== 6) {
        return "#171717";
    }

    const r =
        parseInt(
            color.substring(0, 2),
            16
        );

    const g =
        parseInt(
            color.substring(2, 4),
            16
        );

    const b =
        parseInt(
            color.substring(4, 6),
            16
        );

    const brightness =
        (
            r * 299 +
            g * 587 +
            b * 114
        ) / 1000;

    return brightness > 155
        ? "#171717"
        : "#ffffff";
}

/* ================= YEAR ================= */

function updateCurrentYear() {

    const elements =
        document.querySelectorAll(
            "[data-current-year]"
        );

    elements.forEach(
        element => {
            element.textContent =
                new Date().getFullYear();
        }
    );

    const year =
        document.getElementById(
            "current-year"
        );

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }
}

/* ================= LOADING ================= */

function hideLoadingScreen() {

    const loading =
        document.getElementById(
            "loading-screen"
        );

    if (!loading) return;

    loading.style.opacity =
        "0";

    loading.style.pointerEvents =
        "none";

    setTimeout(
        () => {
            loading.remove();
        },
        400
    );
}

/* ================= DESIGNER RESET ================= */

function resetDesigner() {

    designerState = {

        productType:
            "تيشيرت",

        color:
            "#f5f5f5",

        size:
            "M",

        text:
            "",

        textSize:
            28,

        uploadedImage:
            null
    };

    try {
        localStorage.removeItem(
            "sima_designer"
        );
    } catch (error) {}

    const input =
        document.getElementById(
            "custom-text"
        );

    if (input) {
        input.value = "";
    }

    removeUploadedDesign();

    updateDesignerPreview();

    showToast(
        "تم إعادة التصميم للوضع الأساسي"
    );
}

/* ================= KEYBOARD ================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {
            closeModal();
        }

    }
);

/* ================= INITIALIZATION ================= */

function initializeSima() {

    loadCart();

    loadDesignerState();

    updateCartCount();

    renderFeaturedProducts();

    renderShopProducts();

    renderCart();

    renderCheckout();

    updateCurrentYear();

    setupCategoryButtons();

    updateDesignerPreview();

    hideLoadingScreen();

    showPage("home");

    console.log(
        "SIMA 3.0 initialized successfully."
    );
}

/* ================= DOM READY ================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeSima
);

"use strict";

/* =========================================================
   SIMA 3.0
   MAIN APPLICATION
   ========================================================= */

/* =========================================================
   PRODUCTS
========================================================= */

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
        color: "#111111",
        description: "تصميم بسيط وأنيق للاستخدام اليومي."
    },
    {
        id: 6,
        name: "Class of 2026",
        category: "تخرج",
        price: 95,
        color: "#555555",
        description: "تصميم تخرج عصري لدفعة 2026."
    },
    {
        id: 7,
        name: "يومنا",
        category: "مناسبات",
        price: 85,
        color: "#222222",
        description: "تصميم للمناسبات والذكريات الخاصة."
    },
    {
        id: 8,
        name: "Squad",
        category: "مجموعات",
        price: 89,
        color: "#444444",
        description: "تصميم مناسب للأصدقاء والمجموعات."
    }
];

/* =========================================================
   STATE
========================================================= */

let cart = [];
let currentPage = "home";
let currentProduct = null;

let designerState = {
    productType: "تيشيرت",
    color: "#151515",
    size: "S",
    text: "",
    textSize: 28,
    uploadedImage: null
};

/* =========================================================
   STORAGE
========================================================= */

function saveCart() {
    try {
        localStorage.setItem(
            "sima_cart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn("Cart save error:", error);
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
        console.warn("Cart load error:", error);
    }
}

function saveDesignerState() {
    try {
        localStorage.setItem(
            "sima_designer",
            JSON.stringify({
                productType: designerState.productType,
                color: designerState.color,
                size: designerState.size,
                text: designerState.text,
                textSize: designerState.textSize
            })
        );
    } catch (error) {
        console.warn("Designer save error:", error);
    }
}

function loadDesignerState() {
    try {
        const saved =
            localStorage.getItem("sima_designer");

        if (!saved) return;

        const parsed = JSON.parse(saved);

        if (
            parsed &&
            typeof parsed === "object"
        ) {
            designerState = {
                ...designerState,
                ...parsed
            };
        }
    } catch (error) {
        console.warn("Designer load error:", error);
    }
}

/* =========================================================
   NAVIGATION
========================================================= */

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
            "Page not found:",
            pageName
        );
        return;
    }

    target.classList.add("active");

    currentPage = pageName;

    document
        .querySelectorAll(".nav-link")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === pageName
            );
        });

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

    if (pageName === "product") {
        updateProductPage();
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

/* =========================================================
   PRODUCT CARDS
========================================================= */

function createProductCard(product) {
    return `
        <article class="product-card">

            <button
                type="button"
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
                        type="button"
                        onclick="event.stopPropagation(); addToCart(${product.id}, 'M')"
                    >
                        أضف للسلة
                    </button>

                </div>

            </div>

        </article>
    `;
}

/* =========================================================
   HOME
========================================================= */

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

/* =========================================================
   SHOP
========================================================= */

function renderShopProducts(list = products) {
    const container =
        document.getElementById(
            "shop-products"
        );

    if (!container) return;

    const empty =
        document.getElementById(
            "shop-empty"
        );

    if (!list.length) {
        container.innerHTML = "";

        if (empty) {
            empty.classList.remove("hidden");
        }

        return;
    }

    if (empty) {
        empty.classList.add("hidden");
    }

    container.innerHTML =
        list
            .map(createProductCard)
            .join("");
}

/* =========================================================
   SEARCH
========================================================= */

function searchProducts(value) {
    const input =
        document.getElementById(
            "search-input"
        );

    const search =
        String(
            value !== undefined
                ? value
                : input
                    ? input.value
                    : ""
        )
            .trim()
            .toLowerCase();

    if (!search) {
        renderShopProducts(products);
        return;
    }

    const filtered =
        products.filter(product => {

            const name =
                String(product.name || "")
                    .toLowerCase();

            const category =
                String(product.category || "")
                    .toLowerCase();

            const description =
                String(product.description || "")
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

/* =========================================================
   CATEGORY
========================================================= */

function filterCategory(category) {

    showPage("shop");

    let filtered = products;

    if (
        category &&
        category !== "الكل" &&
        category !== "all"
    ) {
        filtered =
            products.filter(
                product =>
                    product.category === category
            );
    }

    document
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.category === category ||
                (
                    category === "الكل" &&
                    button.dataset.category === "الكل"
                )
            );
        });

    renderShopProducts(filtered);
}

/* =========================================================
   SORT
========================================================= */

function sortProducts(value) {

    const select =
        document.getElementById(
            "sort-products"
        );

    const selected =
        value ||
        (select ? select.value : "default");

    let sorted =
        [...products];

    if (selected === "price-low") {
        sorted.sort(
            (a, b) =>
                a.price - b.price
        );
    }

    if (selected === "price-high") {
        sorted.sort(
            (a, b) =>
                b.price - a.price
        );
    }

    if (selected === "name") {
        sorted.sort(
            (a, b) =>
                String(a.name).localeCompare(
                    String(b.name),
                    "ar"
                )
        );
    }

    renderShopProducts(sorted);
}

/* =========================================================
   PRODUCT DETAILS
========================================================= */

function openProduct(productId) {

    const product =
        products.find(
            item =>
                item.id === Number(productId)
        );

    if (!product) {
        showToast("المنتج غير موجود");
        return;
    }

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

                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M" selected>M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>

                    </select>

                </div>

                <button
                    type="button"
                    class="primary-button full-button"
                    onclick="addProductFromDetails()"
                >
                    🛒 أضف للسلة
                </button>

            </div>

        </div>
    `;

    showPage("product");
}

function updateProductPage() {
    if (currentProduct) {
        openProduct(currentProduct.id);
    }
}

function addProductFromDetails() {

    if (!currentProduct) {
        showToast("اختر منتج أولًا");
        return;
    }

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

/* =========================================================
   CART - ADD
========================================================= */

function addToCart(
    productId,
    size = "M"
) {

    const product =
        products.find(
            item =>
                item.id === Number(productId)
        );

    if (!product) {
        showToast("المنتج غير موجود");
        return;
    }

    const existing =
        cart.find(
            item =>
                item.productId === product.id &&
                item.size === size &&
                item.custom !== true
        );

    if (existing) {

        existing.quantity =
            Number(existing.quantity || 0) + 1;

    } else {

        cart.push({

            cartId:
                `product-${product.id}-${size}-${Date.now()}`,

            productId:
                product.id,

            name:
                product.name,

            price:
                Number(product.price),

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
        "تمت إضافة المنتج للسلة ✓"
    );
}

/* =========================================================
   CART - CUSTOM DESIGN
========================================================= */

function addCustomDesignToCart() {

    const price =
        designerState.productType === "هودي"
            ? 139
            : 99;

    const text =
        String(
            designerState.text || ""
        ).trim();

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
            price,

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
        "تمت إضافة تصميمك للسلة ✓"
    );
}

/* =========================================================
   CART - REMOVE
========================================================= */

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

/* =========================================================
   CART - INCREASE
========================================================= */

function increaseCartItem(cartId) {

    const item =
        cart.find(
            product =>
                product.cartId === cartId
        );

    if (!item) return;

    item.quantity =
        Number(item.quantity || 0) + 1;

    saveCart();
    updateCartCount();
    renderCart();
}

/* =========================================================
   CART - DECREASE
========================================================= */

function decreaseCartItem(cartId) {

    const item =
        cart.find(
            product =>
                product.cartId === cartId
        );

    if (!item) return;

    if (Number(item.quantity) > 1) {

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

/* =========================================================
   CART RENDER
========================================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cart-items"
        );

    const empty =
        document.getElementById(
            "cart-empty"
        );

    if (!container) return;

    if (!cart.length) {

        container.innerHTML = "";

        if (empty) {
            empty.classList.remove("hidden");
        }

        updateCartTotals();
        updateCartCount();

        return;
    }

    if (empty) {
        empty.classList.add("hidden");
    }

    container.innerHTML =
        cart.map(item => {

            const color =
                item.color || "#171717";

            const itemTotal =
                Number(item.price || 0) *
                Number(item.quantity || 0);

            return `
                <div class="cart-item">

                    <div class="cart-item-image">

                        <div
                            class="product-shirt"
                            style="
                                background:${color};
                            "
                        >
                            <span>سِمة</span>
                        </div>

                    </div>

                    <div class="cart-item-info">

                        <h3>
                            ${escapeHTML(item.name)}
                        </h3>

                        <p>
                            المقاس:
                            ${escapeHTML(item.size || "M")}
                        </p>

                        ${
                            item.custom
                                ? `
                                    <p>
                                        تصميم مخصص
                                        ${
                                            item.productType
                                                ? `· ${escapeHTML(item.productType)}`
                                                : ""
                                        }
                                    </p>
                                `
                                : ""
                        }

                        <div class="cart-quantity">

                            <button
                                type="button"
                                onclick="decreaseCartItem('${escapeHTML(item.cartId)}')"
                            >
                                −
                            </button>

                            <strong>
                                ${item.quantity}
                            </strong>

                            <button
                                type="button"
                                onclick="increaseCartItem('${escapeHTML(item.cartId)}')"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <div class="cart-item-price">
                        ${formatPrice(itemTotal)}
                    </div>

                    <button
                        type="button"
                        class="remove-button"
                        onclick="removeFromCart('${escapeHTML(item.cartId)}')"
                    >
                        حذف
                    </button>

                </div>
            `;

        }).join("");

    updateCartTotals();
    updateCartCount();
}

/* =========================================================
   CART TOTALS
========================================================= */

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

/* =========================================================
   CART COUNT
========================================================= */

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
            String(count);
    }
}

/* =========================================================
   DESIGNER
========================================================= */

function selectProductType(type) {

    designerState.productType =
        type;

    document
        .querySelectorAll(
            "[data-product-type]"
        )
        .forEach(button => {

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
        beige: "#d9cbb8",
        green: "#183c32",
        blue: "#1d2c46"
    };

    designerState.color =
        colors[color] ||
        color ||
        "#151515";

    document
        .querySelectorAll(
            "[data-color]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.color === color
            );

        });

    saveDesignerState();
    updateDesignerPreview();
}

function changeShirtColor(color) {
    selectShirtColor(color);
}

function selectSize(size) {

    designerState.size =
        size;

    document
        .querySelectorAll(
            "[data-size]"
        )
        .forEach(button => {

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
        String(value || "").trim();

    const text =
        document.getElementById(
            "shirt-text"
        );

    if (text) {

        text.textContent =
            designerState.text ||
            "سِمة";
    }

    const counter =
        document.getElementById(
            "text-counter"
        );

    if (counter) {

        counter.textContent =
            `${designerState.text.length}/35`;
    }

    saveDesignerState();
    updateDesignerPreview();
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

    saveDesignerState();
    updateDesignerPreview();
}

/* =========================================================
   DESIGNER PREVIEW
========================================================= */

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

    document
        .querySelectorAll(
            "[data-product-type]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.productType ===
                designerState.productType
            );

        });

    document
        .querySelectorAll(
            "[data-size]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.size ===
                designerState.size
            );

        });

    document
        .querySelectorAll(
            "[data-color]"
        )
        .forEach(button => {

            const map = {
                black: "#151515",
                white: "#f5f5f5",
                gray: "#777777",
                beige: "#d9cbb8",
                green: "#183c32",
                blue: "#1d2c46"
            };

            button.classList.toggle(
                "active",
                map[button.dataset.color] ===
                designerState.color
            );

        });

    const sizeLabel =
        document.getElementById(
            "selected-size"
        );

    if (sizeLabel) {
        sizeLabel.textContent =
            designerState.size;
    }

    const typeLabel =
        document.getElementById(
            "selected-product-type"
        );

    if (typeLabel) {
        typeLabel.textContent =
            designerState.productType;
    }

    const price =
        document.getElementById(
            "designer-price"
        );

    if (price) {

        price.textContent =
            designerState.productType === "هودي"
                ? "139"
                : "99";
    }

    const image =
        document.getElementById(
            "design-image"
        );

    if (image) {

        if (designerState.uploadedImage) {

            image.src =
                designerState.uploadedImage;

            image.style.display =
                "block";

        } else {

            image.src = "";

            image.style.display =
                "none";
        }
    }
}

/* =========================================================
   IMAGE UPLOAD
========================================================= */

function handleDesignUpload(event) {

    const file =
        event &&
        event.target &&
        event.target.files
            ? event.target.files[0]
            : null;

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        showToast(
            "فضلاً اختر صورة صحيحة"
        );

        event.target.value = "";
        return;
    }

    if (
        file.size >
        5 * 1024 * 1024
    ) {

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

        updateDesignerPreview();

        showToast(
            "تم رفع التصميم ✓"
        );
    };

    reader.onerror = function () {

        showToast(
            "تعذر قراءة الصورة"
        );
    };

    reader.readAsDataURL(file);
}

function removeUploadedDesign() {

    designerState.uploadedImage =
        null;

    const image =
        document.getElementById(
            "design-image"
        );

    if (image) {

        image.src = "";

        image.style.display =
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
}

/* =========================================================
   SAVE DESIGN
========================================================= */

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

function saveDesign() {

    const designs =
        getSavedDesigns();

    designs.push({

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
    });

    try {

        localStorage.setItem(
            "sima_saved_designs",
            JSON.stringify(designs)
        );

        showToast(
            "تم حفظ التصميم ✓"
        );

    } catch (error) {

        showToast(
            "تعذر حفظ التصميم"
        );
    }
}

/* =========================================================
   SELL DESIGN
========================================================= */

function submitDesignForSaleFromApp() {

    const submissions =
        JSON.parse(
            localStorage.getItem(
                "sima_submissions"
            ) || "[]"
        );

    submissions.push({

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
    });

    localStorage.setItem(
        "sima_submissions",
        JSON.stringify(submissions)
    );

    showToast(
        "تم إرسال التصميم للمراجعة ✓"
    );
}

/* =========================================================
   AI DESIGN
========================================================= */

function openAIDesigner() {

    const idea =
        prompt(
            "اكتب وصف التصميم الذي تريده"
        );

    if (!idea) return;

    const input =
        document.getElementById(
            "custom-text"
        );

    if (input) {
        input.value =
            idea;
    }

    updateDesignText(idea);

    showToast(
        "تم تجهيز فكرتك داخل المصمم ✓"
    );
}

/* =========================================================
   RESET DESIGNER
========================================================= */

function resetDesigner() {

    designerState = {

        productType:
            "تيشيرت",

        color:
            "#151515",

        size:
            "S",

        text:
            "",

        textSize:
            28,

        uploadedImage:
            null
    };

    localStorage.removeItem(
        "sima_designer"
    );

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
        "تم إعادة ضبط التصميم"
    );
}

/* =========================================================
   CHECKOUT
========================================================= */

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

    const container =
        document.getElementById(
            "checkout-summary-items"
        );

    if (!container) return;

    if (!cart.length) {

        container.innerHTML = `
            <p>
                السلة فاضية.
            </p>
        `;

        updateCheckoutTotals();
        return;
    }

    container.innerHTML =
        cart.map(item => {

            const total =
                Number(item.price || 0) *
                Number(item.quantity || 0);

            return `
                <div class="summary-row">

                    <span>
                        ${escapeHTML(item.name)}
                        × ${item.quantity}
                    </span>

                    <strong>
                        ${formatPrice(total)}
                    </strong>

                </div>
            `;

        }).join("");

    updateCheckoutTotals();
}

function updateCheckoutTotals() {

    const total =
        calculateSubtotal();

    const subtotal =
        document.getElementById(
            "checkout-subtotal"
        );

    const totalElement =
        document.getElementById(
            "checkout-total"
        );

    if (subtotal) {
        subtotal.textContent =
            formatPrice(total);
    }

    if (totalElement) {
        totalElement.textContent =
            formatPrice(total);
    }
}

/* =========================================================
   ORDER
========================================================= */

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

            name,
            phone,
            city,
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
            getOrders();

        orders.push(order);

        localStorage.setItem(
            "sima_orders",
            JSON.stringify(orders)
        );

        showToast(
            "تم تجهيز الطلب بنجاح ✓"
        );

        /*
          Paylink سيتم ربطه لاحقًا
          عبر Backend آمن.
        */

    } catch (error) {

        showToast(
            "تعذر حفظ الطلب"
        );
    }
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

/* =========================================================
   MODAL
========================================================= */

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
            background: "rgba(0,0,0,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            direction: "rtl"
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
                position:relative;
            "
        >

            <button
                type="button"
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
            >
                ×
            </button>

            <h2>
                ${escapeHTML(title)}
            </h2>

            <div style="margin-top:20px;">
                ${content}
            </div>

        </div>
    `;

    document.body.appendChild(modal);

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

/* =========================================================
   ACCOUNT
========================================================= */

function showLoginMessage() {

    showModal(
        "تسجيل الدخول",
        `
            <p>
                نظام الحسابات سيتم ربطه مع Supabase
                في المرحلة التالية.
            </p>

            <button
                type="button"
                class="primary-button full-width"
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
                    type="button"
                    class="primary-button full-width"
                    onclick="closeModal()"
                >
                    إغلاق
                </button>
            `
        );

        return;
    }

    const content =
        orders.map(order => `
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
        `).join("");

    showModal(
        "طلباتي",
        content
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
                    type="button"
                    class="primary-button full-width"
                    onclick="closeModal()"
                >
                    إغلاق
                </button>
            `
        );

        return;
    }

    const content =
        designs.map(design => `
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
        `).join("");

    showModal(
        "تصاميمي المحفوظة",
        content
    );
}

/* =========================================================
   SOCIAL
========================================================= */

function openSocial(platform) {

    const links = {

        instagram:
            "https://www.instagram.com/",

        tiktok:
            "https://www.tiktok.com/",

        x:
            "https://x.com/"
    };

    if (!links[platform]) return;

    window.open(
        links[platform],
        "_blank",
        "noopener,noreferrer"
    );
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const old =
        document.querySelector(
            ".sima-toast"
        );

    if (old) {
        old.remove();
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
            zIndex: "999999",
            background: "#171717",
            color: "#fff",
            padding: "14px 20px",
            borderRadius: "12px",
            boxShadow:
                "0 10px 30px rgba(0,0,0,.18)",
            fontSize: "14px",
            fontWeight: "700",
            direction: "rtl"
        }
    );

    document.body.appendChild(toast);

    setTimeout(
        () => {

            if (toast) {
                toast.remove();
            }

        },
        2500
    );
}

/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    const menu =
        document.getElementById(
            "mobile-menu"
        );

    if (!menu) return;

    menu.classList.toggle("open");
}

function closeMobileMenu() {

    const menu =
        document.getElementById(
            "mobile-menu"
        );

    if (!menu) return;

    menu.classList.remove("open");
}

/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {

    return (
        Number(price || 0)
            .toLocaleString("ar-SA") +
        " ر.س"
    );
}

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getInputValue(id) {

    const element =
        document.getElementById(id);

    if (!element) return "";

    return String(
        element.value || ""
    ).trim();
}

function getContrastColor(hex) {

    if (!hex) {
        return "#171717";
    }

    let color =
        String(hex)
            .replace("#", "");

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

/* =========================================================
   LOADING
========================================================= */

function hideLoadingScreen() {

    const loading =
        document.getElementById(
            "loading-screen"
        );

    if (!loading) return;

    loading.classList.add("loaded");

    setTimeout(
        () => {
            if (loading) {
                loading.remove();
            }
        },
        500
    );
}

/* =========================================================
   YEAR
========================================================= */

function updateCurrentYear() {

    const year =
        document.getElementById(
            "current-year"
        );

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }
}

/* =========================================================
   INITIALIZATION
========================================================= */

function initializeSima() {

    try {

        loadCart();

        loadDesignerState();

        updateCartCount();

        renderFeaturedProducts();

        renderShopProducts();

        renderCart();

        renderCheckout();

        updateCurrentYear();

        updateDesignerPreview();

        hideLoadingScreen();

        showPage("home");

        console.log(
            "SIMA 3.0 initialized successfully."
        );

    } catch (error) {

        console.error(
            "SIMA initialization error:",
            error
        );

        hideLoadingScreen();
    }
}

/* =========================================================
   KEYBOARD
========================================================= */

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

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeSima
);

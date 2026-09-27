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
        description: "تصميم بسيط للاستخدام اليومي."
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
        description: "تصميم خاص للمناسبات والذكريات."
    },
    {
        id: 8,
        name: "Squad",
        category: "مجموعات",
        price: 89,
        color: "#444444",
        description: "تصميم للمجموعات والأصدقاء."
    }
];

let cart = [];
let currentProduct = null;
let currentShopList = [...products];

let designerState = {
    productType: "تيشيرت",
    color: "#f5f5f5",
    size: "M",
    text: "",
    textSize: 28,
    uploadedImage: null
};


/* ================= STORAGE ================= */

function safeParse(value, fallback) {
    try {
        const parsed = JSON.parse(value);
        return parsed;
    } catch {
        return fallback;
    }
}

function saveCart() {
    try {
        localStorage.setItem(
            "sima_cart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("saveCart:", error);
    }
}

function loadCart() {
    const parsed = safeParse(
        localStorage.getItem("sima_cart") || "",
        []
    );

    cart = Array.isArray(parsed) ? parsed : [];
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
        console.error("saveDesignerState:", error);
    }
}

function loadDesignerState() {
    const parsed = safeParse(
        localStorage.getItem("sima_designer") || "",
        null
    );

    if (!parsed || typeof parsed !== "object") {
        return;
    }

    designerState = {
        ...designerState,

        productType:
            typeof parsed.productType === "string"
                ? parsed.productType
                : "تيشيرت",

        color:
            typeof parsed.color === "string"
                ? parsed.color
                : "#f5f5f5",

        size:
            typeof parsed.size === "string"
                ? parsed.size
                : "M",

        text:
            typeof parsed.text === "string"
                ? parsed.text
                : "",

        textSize:
            Number.isFinite(Number(parsed.textSize))
                ? Number(parsed.textSize)
                : 28
    };
}


/* ================= NAVIGATION ================= */

function showPage(pageName) {
    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });

    const target = document.getElementById(
        `${pageName}-page`
    );

    if (!target) {
        console.error(
            `Page not found: ${pageName}`
        );
        return;
    }

    target.classList.add("active");

    const nav =
        document.getElementById("main-nav");

    if (nav) {
        nav.classList.remove("mobile-open");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageName === "home") {
        renderFeaturedProducts();
    }

    if (pageName === "shop") {
        renderShopProducts(currentShopList);
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


/* ================= PRODUCTS ================= */

function createProductCard(product) {
    return `
        <article class="product-card">

            <button
                type="button"
                class="product-image"
                onclick="openProduct(${Number(product.id)})"
                aria-label="${escapeHTML(product.name)}"
            >

                <div
                    class="product-shirt"
                    style="background:${escapeHTML(product.color)};"
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
                        onclick="addToCart(${Number(product.id)})"
                    >
                        أضف للسلة
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* ================= HOME ================= */

function renderFeaturedProducts() {
    const container =
        document.getElementById(
            "featured-products"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        products
            .filter(product => product.featured)
            .map(createProductCard)
            .join("");
}


/* ================= SHOP ================= */

function getFilteredShopProducts() {
    let list = [...products];

    const categoryElement =
        document.getElementById(
            "category-filter"
        );

    const searchElement =
        document.getElementById(
            "search-input"
        );

    const category =
        categoryElement
            ? categoryElement.value
            : "الكل";

    const search =
        searchElement
            ? searchElement.value
                .trim()
                .toLowerCase()
            : "";


    if (
        category &&
        category !== "الكل" &&
        category !== "all"
    ) {
        list =
            list.filter(
                product =>
                    product.category === category
            );
    }


    if (search) {
        list =
            list.filter(product => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();

                const productCategory =
                    String(
                        product.category || ""
                    ).toLowerCase();

                const description =
                    String(
                        product.description || ""
                    ).toLowerCase();

                return (
                    name.includes(search) ||
                    productCategory.includes(search) ||
                    description.includes(search)
                );
            });
    }


    return list;
}


function renderShopProducts(
    list = products
) {
    const container =
        document.getElementById(
            "shop-products"
        );

    if (!container) {
        return;
    }

    currentShopList =
        Array.isArray(list)
            ? list
            : [];


    if (!currentShopList.length) {

        container.innerHTML = `
            <div class="empty-state">

                <h3>
                    ما لقينا تصميم
                </h3>

                <p>
                    جرّب كلمة بحث أو تصنيف مختلف.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        currentShopList
            .map(createProductCard)
            .join("");
}


function searchProducts() {
    renderShopProducts(
        getFilteredShopProducts()
    );
}


function clearSearch() {
    const input =
        document.getElementById(
            "search-input"
        );

    if (input) {
        input.value = "";
    }

    renderShopProducts(
        getFilteredShopProducts()
    );
}


function filterProducts() {
    renderShopProducts(
        getFilteredShopProducts()
    );
}


function filterCategory(category) {
    const select =
        document.getElementById(
            "category-filter"
        );

    if (select) {
        select.value =
            category || "الكل";
    }

    renderShopProducts(
        getFilteredShopProducts()
    );
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

    if (!select) {
        return;
    }

    let list =
        getFilteredShopProducts();


    if (select.value === "price-low") {

        list.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    } else if (
        select.value === "price-high"
    ) {

        list.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    } else if (
        select.value === "name"
    ) {

        list.sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name),
                        "ar"
                    )
        );

    }


    renderShopProducts(list);
}


/* ================= PRODUCT DETAILS ================= */

function openProduct(productId) {
    const product =
        products.find(
            item =>
                item.id === Number(productId)
        );

    if (!product) {
        showToast(
            "المنتج غير موجود"
        );
        return;
    }

    currentProduct = product;

    const container =
        document.getElementById(
            "product-details"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="product-detail-layout">

            <div class="product-detail-image">

                <div
                    class="product-shirt"
                    style="
                        background:${escapeHTML(product.color)};
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
                    ${escapeHTML(
                        product.description ||
                        "تصميم من سِمة."
                    )}
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
                    type="button"
                    class="primary-button full-button"
                    onclick="addProductFromDetails()"
                >
                    أضف للسلة
                </button>


                <button
                    type="button"
                    class="secondary-button full-button"
                    onclick="showPage('shop')"
                >
                    العودة للمتجر
                </button>

            </div>

        </div>
    `;


    showPage("product");
}


function addProductFromDetails() {
    if (!currentProduct) {
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

    if (!product) {
        showToast(
            "المنتج غير موجود"
        );
        return;
    }


    const existing =
        cart.find(
            item =>
                item.productId === product.id &&
                item.size === size &&
                !item.custom
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            cartId:
                `${product.id}-${size}-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 7)}`,

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
        "تم حذف المنتج"
    );
}


function increaseCartItem(cartId) {
    const item =
        cart.find(
            product =>
                product.cartId === cartId
        );

    if (!item) {
        return;
    }

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

    if (!item) {
        return;
    }


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

    if (!container) {
        return;
    }


    if (!cart.length) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    السلة فاضية
                </h3>

                <p>
                    أضف أول تصميم لك.
                </p>

                <button
                    type="button"
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

                const color =
                    item.color ||
                    "#171717";


                const image =
                    item.uploadedImage

                        ? `
                            <img
                                src="${item.uploadedImage}"
                                alt="التصميم"
                                style="
                                    max-width:80px;
                                    max-height:100px;
                                    object-fit:contain;
                                "
                            >
                        `

                        : `
                            <div
                                class="product-shirt"
                                style="
                                    background:${escapeHTML(color)};
                                "
                            >
                                <span>
                                    سِمة
                                </span>
                            </div>
                        `;


                return `

                    <div class="cart-item">

                        <div class="cart-item-image">
                            ${image}
                        </div>


                        <div class="cart-item-info">

                            <h3>
                                ${escapeHTML(item.name)}
                            </h3>

                            <p>
                                المقاس:
                                ${escapeHTML(item.size)}
                            </p>


                            <div class="cart-quantity">

                                <button
                                    type="button"
                                    onclick="decreaseCartItem('${escapeJSString(item.cartId)}')"
                                >
                                    −
                                </button>


                                <strong>
                                    ${Number(item.quantity) || 0}
                                </strong>


                                <button
                                    type="button"
                                    onclick="increaseCartItem('${escapeJSString(item.cartId)}')"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <div class="cart-item-price">

                            ${formatPrice(
                                Number(item.price) *
                                Number(item.quantity)
                            )}

                        </div>


                        <button
                            type="button"
                            class="remove-button"
                            onclick="removeFromCart('${escapeJSString(item.cartId)}')"
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
    const total =
        calculateSubtotal();

    const subtotal =
        document.getElementById(
            "cart-subtotal"
        );

    const totalElement =
        document.getElementById(
            "cart-total"
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


function updateCartCount() {
    const count =
        cart.reduce(
            (total, item) =>
                total +
                (Number(item.quantity) || 0),
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


/* ================= DESIGNER ================= */

function selectProductType(type) {

    if (
        type !== "تيشيرت" &&
        type !== "هودي"
    ) {
        return;
    }


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
        green: "#183c32",
        beige: "#d9cbb8",
        navy: "#1d2c46"

    };


    if (!colors[color]) {
        return;
    }


    designerState.color =
        colors[color];


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

    const sizes = [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
    ];


    if (!sizes.includes(size)) {
        return;
    }


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


    if (shirt) {

        shirt.style.background =
            designerState.color;

    }


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


    const typeLabel =
        document.getElementById(
            "selected-product-type"
        );


    if (typeLabel) {

        typeLabel.textContent =
            designerState.productType;

    }


    const image =
        document.getElementById(
            "design-image"
        );


    if (image) {

        if (
            designerState.uploadedImage
        ) {

            image.src =
                designerState.uploadedImage;

            image.style.display =
                "block";

        } else {

            image.removeAttribute(
                "src"
            );

            image.style.display =
                "none";

        }

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


    const colorMap = {

        "#f5f5f5": "white",
        "#151515": "black",
        "#777777": "gray",
        "#183c32": "green",
        "#d9cbb8": "beige",
        "#1d2c46": "navy"

    };


    const colorName =
        colorMap[
            designerState.color
        ];


    document
        .querySelectorAll(
            "[data-color]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.color ===
                colorName
            );

        });

}


/* ================= UPLOAD ================= */

function handleDesignUpload(event) {

    const file =
        event &&
        event.target &&
        event.target.files
            ? event.target.files[0]
            : null;


    if (!file) {
        return;
    }


    if (
        !file.type.startsWith("image/")
    ) {

        showToast(
            "اختر ملف صورة صحيح"
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


    reader.onload = () => {

        designerState.uploadedImage =
            String(reader.result);

        updateDesignerPreview();

        showToast(
            "تم رفع الصورة"
        );

    };


    reader.onerror = () => {

        showToast(
            "تعذر قراءة الصورة"
        );

    };


    reader.readAsDataURL(file);
}


function removeUploadedDesign(
    silent = false
) {

    designerState.uploadedImage =
        null;


    const preview =
        document.getElementById(
            "design-image"
        );


    if (preview) {

        preview.removeAttribute(
            "src"
        );

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


    if (!silent) {

        showToast(
            "تم حذف الصورة"
        );

    }
}


/* ================= CUSTOM DESIGN ================= */

function addCustomDesignToCart() {

    const price =
        designerState.productType ===
        "هودي"
            ? 139
            : 99;


    cart.push({

        cartId:
            `custom-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        productId:
            "custom",

        name:
            designerState.text
                ? `تصميم مخصص: ${designerState.text}`
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
            designerState.text,

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


/* ================= SAVED DESIGNS ================= */

function getSavedDesigns() {

    const parsed =
        safeParse(
            localStorage.getItem(
                "sima_saved_designs"
            ) || "",
            []
        );


    return Array.isArray(parsed)
        ? parsed
        : [];
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
            "تم حفظ التصميم"
        );

    } catch (error) {

        console.error(
            "saveDesign:",
            error
        );

        showToast(
            "تعذر حفظ التصميم"
        );

    }
}


/* ================= SELL DESIGN ================= */

function submitDesignForSale() {

    const submissions =
        safeParse(
            localStorage.getItem(
                "sima_submissions"
            ) || "",
            []
        );


    if (!Array.isArray(submissions)) {

        showToast(
            "تعذر تجهيز الطلب"
        );

        return;
    }


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


    try {

        localStorage.setItem(
            "sima_submissions",
            JSON.stringify(submissions)
        );


        showToast(
            "تم إرسال التصميم للمراجعة"
        );

    } catch (error) {

        console.error(
            "submitDesignForSale:",
            error
        );

        showToast(
            "تعذر إرسال التصميم"
        );

    }
}


/* ================= AI ================= */

function openAIDesigner() {

    const message =
        window.prompt(
            "اكتب فكرة التصميم",
            "تيشيرت أسود بتصميم تخرج 2026"
        );


    if (
        !message ||
        !message.trim()
    ) {
        return;
    }


    const value =
        message.trim();


    const input =
        document.getElementById(
            "custom-text"
        );


    if (input) {
        input.value = value;
    }


    updateDesignText(
        value
    );


    showToast(
        "تم وضع فكرتك داخل المصمم"
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

    const container =
        document.getElementById(
            "checkout-summary-items"
        );


    const totalElement =
        document.getElementById(
            "checkout-total"
        );


    if (!container) {
        return;
    }


    if (!cart.length) {

        container.innerHTML =
            "<p>السلة فاضية.</p>";

    } else {

        container.innerHTML =
            cart
                .map(item => `

                    <div class="summary-row">

                        <span>
                            ${escapeHTML(item.name)}
                            ×
                            ${Number(item.quantity) || 0}
                        </span>

                        <strong>
                            ${formatPrice(
                                Number(item.price) *
                                Number(item.quantity)
                            )}
                        </strong>

                    </div>

                `)
                .join("");

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(
                calculateSubtotal()
            );

    }
}


/* ================= ORDERS ================= */

function getOrders() {

    const parsed =
        safeParse(
            localStorage.getItem(
                "sima_orders"
            ) || "",
            []
        );


    return Array.isArray(parsed)
        ? parsed
        : [];
}


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
            "أكمل بيانات الطلب"
        );

        return;
    }


    const orders =
        getOrders();


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
            cart.map(
                item => ({
                    ...item
                })
            ),

        total:
            calculateSubtotal(),

        status:
            "pending",

        createdAt:
            new Date().toISOString()

    };


    orders.push(
        order
    );


    try {

        localStorage.setItem(
            "sima_orders",
            JSON.stringify(orders)
        );


        cart = [];

        saveCart();
        updateCartCount();


        showToast(
            "تم تسجيل الطلب بنجاح"
        );


        setTimeout(
            () => {
                showPage("home");
            },
            700
        );


    } catch (error) {

        console.error(
            "submitOrder:",
            error
        );

        showToast(
            "تعذر تسجيل الطلب"
        );

    }
}


/* ================= ACCOUNT ================= */

function showLoginMessage() {

    showModal(
        "تسجيل الدخول",
        `

            <p>
                تسجيل الدخول الحقيقي سيتم ربطه
                مع Supabase في المرحلة القادمة.
            </p>

            <button
                type="button"
                class="primary-button full-button"
                onclick="closeModal()"
            >
                إغلاق
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
                    type="button"
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


/* ================= MODAL ================= */

function showModal(
    title,
    content
) {

    closeModal();


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "sima-modal";


    modal.style.cssText = `

        position:fixed;
        inset:0;
        z-index:99999;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;

    `;


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
                direction:rtl;
            "
        >

            <button
                type="button"
                onclick="closeModal()"
                aria-label="إغلاق"
                style="
                    position:absolute;
                    top:12px;
                    left:12px;
                    width:36px;
                    height:36px;
                    border:0;
                    border-radius:50%;
                    cursor:pointer;
                    font-size:20px;
                "
            >
                ×
            </button>


            <h2>
                ${escapeHTML(title)}
            </h2>


            <div
                style="margin-top:20px;"
            >
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


/* ================= MOBILE ================= */

function toggleMobileMenu() {

    const nav =
        document.getElementById(
            "main-nav"
        );


    if (!nav) {
        return;
    }


    nav.classList.toggle(
        "mobile-open"
    );
}


/* ================= TOAST ================= */

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".sima-toast"
        );


    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "sima-toast";


    toast.textContent =
        String(message || "");


    toast.style.cssText = `

        position:fixed;
        right:20px;
        bottom:20px;
        z-index:100000;
        background:#171717;
        color:#fff;
        padding:14px 20px;
        border-radius:12px;
        font-family:Cairo,sans-serif;
        font-size:14px;
        font-weight:700;
        box-shadow:0 10px 30px rgba(0,0,0,.2);
        direction:rtl;
        max-width:calc(100% - 40px);

    `;


    document.body.appendChild(
        toast
    );


    window.setTimeout(
        () => {

            if (toast.parentNode) {
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
            .toLocaleString("ar-SA")
        + " ر.س"
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


function escapeJSString(value) {

    return String(value ?? "")
        .replaceAll(
            "\\",
            "\\\\"
        )
        .replaceAll(
            "'",
            "\\'"
        )
        .replaceAll(
            "\n",
            "\\n"
        )
        .replaceAll(
            "\r",
            "\\r"
        );
}


function getInputValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return String(
        element.value || ""
    ).trim();
}


function getContrastColor(hex) {

    let color =
        String(hex || "")
            .replace("#", "");


    if (color.length === 3) {

        color =
            color
                .split("")
                .map(
                    char =>
                        char + char
                )
                .join("");

    }


    if (
        !/^[0-9a-fA-F]{6}$/.test(
            color
        )
    ) {

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


/* ================= RESET DESIGNER ================= */

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

    } catch (error) {

        console.error(
            "resetDesigner:",
            error
        );

    }


    const textInput =
        document.getElementById(
            "custom-text"
        );


    if (textInput) {
        textInput.value = "";
    }


    const sizeInput =
        document.getElementById(
            "text-size"
        );


    if (sizeInput) {
        sizeInput.value = "28";
    }


    removeUploadedDesign(true);

    updateDesignerPreview();


    showToast(
        "تمت إعادة التصميم"
    );
}


/* ================= YEAR ================= */

function updateCurrentYear() {

    const element =
        document.getElementById(
            "current-year"
        );


    if (element) {

        element.textContent =
            new Date().getFullYear();

    }
}


/* ================= LOADING ================= */

function hideLoadingScreen() {

    const loading =
        document.getElementById(
            "loading-screen"
        );


    if (!loading) {
        return;
    }


    loading.style.opacity =
        "0";


    loading.style.pointerEvents =
        "none";


    window.setTimeout(
        () => {

            if (loading.parentNode) {
                loading.remove();
            }

        },
        400
    );
}


/* ================= INITIALIZATION ================= */

function initializeSima() {

    loadCart();

    loadDesignerState();

    updateCartCount();

    updateCurrentYear();

    renderFeaturedProducts();

    renderShopProducts(products);

    renderCart();

    renderCheckout();

    updateDesignerPreview();

    hideLoadingScreen();

    showPage("home");


    console.log(
        "SIMA 3.0 initialized successfully"
    );
}


/* ================= GLOBAL FUNCTIONS ================= */

window.showPage =
    showPage;

window.openCategory =
    openCategory;

window.openProduct =
    openProduct;

window.addProductFromDetails =
    addProductFromDetails;

window.addToCart =
    addToCart;

window.removeFromCart =
    removeFromCart;

window.increaseCartItem =
    increaseCartItem;

window.decreaseCartItem =
    decreaseCartItem;

window.searchProducts =
    searchProducts;

window.clearSearch =
    clearSearch;

window.filterProducts =
    filterProducts;

window.filterCategory =
    filterCategory;

window.sortProducts =
    sortProducts;

window.selectProductType =
    selectProductType;

window.selectShirtColor =
    selectShirtColor;

window.changeShirtColor =
    changeShirtColor;

window.selectSize =
    selectSize;

window.updateDesignText =
    updateDesignText;

window.updateTextSize =
    updateTextSize;

window.handleDesignUpload =
    handleDesignUpload;

window.removeUploadedDesign =
    removeUploadedDesign;

window.addCustomDesignToCart =
    addCustomDesignToCart;

window.saveDesign =
    saveDesign;

window.submitDesignForSale =
    submitDesignForSale;

window.openAIDesigner =
    openAIDesigner;

window.goToCheckout =
    goToCheckout;

window.submitOrder =
    submitOrder;

window.showLoginMessage =
    showLoginMessage;

window.showOrdersMessage =
    showOrdersMessage;

window.showSavedDesigns =
    showSavedDesigns;

window.showModal =
    showModal;

window.closeModal =
    closeModal;

window.toggleMobileMenu =
    toggleMobileMenu;

window.resetDesigner =
    resetDesigner;


/* ================= START ================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSima
    );

} else {

    initializeSima();

}


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

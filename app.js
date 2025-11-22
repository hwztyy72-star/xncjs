// ================== التحكم في الصفحات ==================

function openPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
    document.getElementById(pageId).classList.add("active-page");

    // إظهار شريط التنقل
    document.getElementById("mainNav").style.display = "flex";
}

// ================== نظام تسجيل الدخول ==================

function showLogin() {
    document.getElementById("registerPage").classList.remove("active-page");
    document.getElementById("loginPage").classList.add("active-page");
}

function showRegister() {
    document.getElementById("loginPage").classList.remove("active-page");
    document.getElementById("registerPage").classList.add("active-page");
}

function register() {
    let user = {
        name: document.getElementById("regName").value,
        phone: document.getElementById("regPhone").value,
        pass: document.getElementById("regPassword").value,
        role: document.getElementById("regRole").value
    };

    if (!user.name || !user.phone || !user.pass) {
        alert("اكمل جميع البيانات");
        return;
    }

    localStorage.setItem("erp_user", JSON.stringify(user));

    alert("تم إنشاء الحساب بنجاح 🎉");

    showLogin();
}

function login() {
    let phone = document.getElementById("loginPhone").value;
    let pass = document.getElementById("loginPassword").value;

    let user = JSON.parse(localStorage.getItem("erp_user"));

    if (!user) {
        alert("لا يوجد حساب مسجل، قم بإنشاء حساب أولاً");
        return;
    }

    if (phone !== user.phone || pass !== user.pass) {
        alert("بيانات تسجيل الدخول غير صحيحة");
        return;
    }

    localStorage.setItem("erp_logged", "yes");

    // فتح جميع الصلاحيات
    unlockAllFeatures();

    openPage("dashboardPage");
}

// ================== الخروج ==================

function logout() {
    localStorage.removeItem("erp_logged");
    window.location.reload();
}

// ================== حماية الصفحات ==================

function protectPage() {
    if (!localStorage.getItem("erp_logged")) {
        showLogin();
    }
}
protectPage();

// ================== فتح جميع الصلاحيات ==================

function unlockAllFeatures() {
    console.log("✔ تم فتح جميع الصلاحيات لكل المستخدمين");
}

// ================== نظام المنتجات ==================

let products = JSON.parse(localStorage.getItem("erp_products")) || [];

function saveProducts() {
    localStorage.setItem("erp_products", JSON.stringify(products));
}

function addProduct() {
    let name = prompt("اسم المنتج:");
    let unit = prompt("الوحدة (قطعة/علبة/كرتونة):");
    let price = prompt("السعر:");
    let qty = prompt("الكمية:");

    if (!name || !price || !qty) return;

    products.push({
        name,
        unit,
        price: Number(price),
        qty: Number(qty)
    });

    saveProducts();
    loadProducts();
}

function loadProducts() {
    let table = document.getElementById("productTable");
    table.innerHTML = "";

    products.forEach((p, i) => {
        table.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.unit}</td>
                <td>${p.price}</td>
                <td>${p.qty}</td>
            </tr>
        `;
    });

    updateDashboard();
}
loadProducts();

// ================== الكاشير ==================

let cart = [];

function searchProducts() {
    let text = document.getElementById("searchProduct").value.toLowerCase();
    let results = document.getElementById("searchResults");

    results.innerHTML = "";

    products
        .filter(p => p.name.toLowerCase().includes(text))
        .forEach((p, i) => {
            results.innerHTML += `
                <div class="search-item" onclick="addToCart(${i})">
                    ${p.name} — ${p.price} ج.م
                </div>
            `;
        });
}

function addToCart(index) {
    let p = products[index];

    cart.push({
        name: p.name,
        price: p.price,
        qty: 1,
        total: p.price
    });

    updateCart();
}

function updateCart() {
    let tbody = document.getElementById("cashierCart");
    let totalBox = document.getElementById("totalInvoice");

    tbody.innerHTML = "";
    let total = 0;

    cart.forEach((c, i) => {
        total += c.total;

        tbody.innerHTML += `
            <tr>
                <td>${c.name}</td>
                <td>
                    <input type="number" value="${c.qty}" min="1" 
                        onchange="updateQty(${i}, this.value)" 
                        class="form-control">
                </td>
                <td>${c.price}</td>
                <td>${c.total}</td>
            </tr>
        `;
    });

    totalBox.innerHTML = total + " ج.م";
}

function updateQty(i, qty) {
    cart[i].qty = qty;
    cart[i].total = qty * cart[i].price;
    updateCart();
}

// ================== Dashboard ==================

function updateDashboard() {
    document.getElementById("productCount").innerHTML = products.length;

    let totalSales = cart.reduce((a, c) => a + c.total, 0);
    document.getElementById("salesTotal").innerHTML = totalSales + " ج.م";

    document.getElementById("employeeCount").innerHTML = "1";
    document.getElementById("cashboxAmount").innerHTML = totalSales + " ج.م";
}

updateDashboard();
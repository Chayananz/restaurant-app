const API_URL = 'http://localhost:3000/api';

let tables = [];
let employees = [];
let menuItems = [];
let cart = [];
let autoRefreshInterval;
let menuQuantities = {};
let selectedTableId = '';
let selectedEmployeeId = '';

document.addEventListener('DOMContentLoaded', () => {
    loadTables();
    loadEmployees();
    loadCategories();
    loadMenu();
    loadOrders();
    startAutoRefresh();
});

function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        loadTables();
        loadEmployees();
        loadMenu();
        loadOrders();
    }, 3000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    const navBtns = document.querySelectorAll('.nav-btn');

    sections.forEach(section => {
        section.classList.remove('active');
    });

    navBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');

    if (sectionName === 'tables') {
        loadTables();
    } else if (sectionName === 'orders') {
        loadOrders();
    }
}

async function loadTables() {
    try {
        const response = await fetch(`${API_URL}/tables`);
        tables = await response.json();
        displayTables();
    } catch (error) {
        console.error('Error loading tables:', error);
    }
}

function displayTables() {
    const grid = document.getElementById('tablesGrid');
    grid.innerHTML = '';

    tables.forEach(table => {
        const statusClass = getStatusClass(table.Status);
        const card = document.createElement('div');
        card.className = `table-card ${statusClass}`;
// ปุ่มแก้ไขในการ์ดโต๊ะ
        card.innerHTML = `
            <div onclick="updateTableStatus(${table.Table_ID})" style="cursor: pointer;">
                <div class="table-number">โต๊ะ ${table.Table_Number}</div>
                <div class="table-status">${table.Status}</div>
            </div>
            <div class="table-card-actions">
                <button onclick="event.stopPropagation(); editTable(${table.Table_ID})" class="btn-edit">แก้ไข</button>
                <button onclick="event.stopPropagation(); deleteTable(${table.Table_ID}, ${table.Table_Number})" class="btn-delete">ลบ</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function getStatusClass(status) {
    if (status === 'ว่าง') return 'vacant';
    if (status === 'กำลังใช้งาน') return 'occupied';
    if (status === 'กำลังจัดการ') return 'processing';
    return 'vacant';
}

async function updateTableStatus(tableId) {
    try {
        const response = await fetch(`${API_URL}/updateStatus/${tableId}`);
        const data = await response.json();
        console.log('Status updated:', data);
        loadTables();
    } catch (error) {
        console.error('Error updating status:', error);
        alert('เกิดข้อผิดพลาดในการอัพเดทสถานะโต๊ะ');
    }
}

async function loadEmployees() {
    try {
        const response = await fetch(`${API_URL}/employees`);
        employees = await response.json();
        displayEmployeeSelect();
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

function displayEmployeeSelect() {
    const select = document.getElementById('selectEmployee');
    const currentValue = select.value || selectedEmployeeId;
    select.innerHTML = '<option value="">-- เลือกพนักงาน --</option>';

    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.Employee_ID;
        option.textContent = `${employee.Employee_Name} (${employee.Position})`;
        select.appendChild(option);
    });

    if (currentValue) {
        select.value = currentValue;
        selectedEmployeeId = currentValue;
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        displayCategoryFilter(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function displayCategoryFilter(categories) {
    const select = document.getElementById('filterCategory');
    select.innerHTML = '<option value="ทั้งหมด">ทั้งหมด</option>';

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.Category;
        option.textContent = cat.Category;
        select.appendChild(option);
    });
}

async function loadMenu() {
    const category = document.getElementById('filterCategory')?.value || 'ทั้งหมด';
    const sort = document.getElementById('filterSort')?.value || '';

    let url = `${API_URL}/menu`;
    const params = new URLSearchParams();

    if (category !== 'ทั้งหมด') {
        params.append('category', category);
    }

    if (sort) {
        params.append('sort', sort);
    }

    if (params.toString()) {
        url += '?' + params.toString();
    }

    try {
        const response = await fetch(url);
        menuItems = await response.json();
        displayMenu();
        displayTableSelect();
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

function applyFilters() {
    loadMenu();
}

function displayMenu() {
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = '';

    if (menuItems.length === 0) {
        menuList.innerHTML = '<div class="empty-message">ไม่พบเมนูอาหาร</div>';
        return;
    }

    // ตรวจสอบว่ากำลังกรองหรือไม่
    const selectedCategory = document.getElementById('filterCategory')?.value;
    const selectedSort = document.getElementById('filterSort')?.value;

    // ถ้ากรองหมวดหมู่เฉพาะ ไม่ต้องแยกหมวด
    if (selectedCategory && selectedCategory !== 'ทั้งหมด') {
        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'menu-category-grid';

        menuItems.forEach(item => {
            const menuDiv = createMenuItemElement(item);
            categoryGrid.appendChild(menuDiv);
        });

        menuList.appendChild(categoryGrid);
    } else {
        // แสดงทั้งหมด แยกตามหมวดหมู่
        const categories = {};
        menuItems.forEach(item => {
            const category = item.Category || 'ทั่วไป';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(item);
        });

        Object.keys(categories).sort().forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'menu-category-section';

            const categoryTitle = document.createElement('h4');
            categoryTitle.className = 'menu-category-title';
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);

            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'menu-category-grid';

            categories[category].forEach(item => {
                const menuDiv = createMenuItemElement(item);
                categoryGrid.appendChild(menuDiv);
            });

            categorySection.appendChild(categoryGrid);
            menuList.appendChild(categorySection);
        });
    }
}

function createMenuItemElement(item) {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu-item';

    if (!menuQuantities[item.Menu_ID]) {
        menuQuantities[item.Menu_ID] = 0;
    }

    menuDiv.innerHTML = `
        <div class="menu-item-name">${item.Menu_Name}</div>
        <div class="menu-item-price">${item.Menu_Price} บาท</div>
        <div class="quantity-control">
            <button class="quantity-btn" onclick="decreaseQuantity(${item.Menu_ID})">-</button>
            <span class="quantity-display" id="qty-${item.Menu_ID}">${menuQuantities[item.Menu_ID]}</span>
            <button class="quantity-btn" onclick="increaseQuantity(${item.Menu_ID})">+</button>
        </div>
        <div class="menu-item-actions">
            <button onclick="editMenu(${item.Menu_ID})" class="btn-edit">แก้ไข</button>
            <button onclick="deleteMenu(${item.Menu_ID}, '${item.Menu_Name}')" class="btn-delete">ลบ</button>
        </div>
    `;

    return menuDiv;
}

function displayTableSelect() {
    const select = document.getElementById('selectTable');
    const currentValue = select.value || selectedTableId;
    select.innerHTML = '<option value="">-- เลือกโต๊ะ --</option>';

    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table.Table_ID;
        option.textContent = `โต๊ะ ${table.Table_Number} (${table.Status})`;

        if (table.Status === 'ว่าง') {
            option.className = 'option-vacant';
        } else if (table.Status === 'กำลังใช้งาน') {
            option.className = 'option-occupied';
        } else if (table.Status === 'กำลังจัดการ') {
            option.className = 'option-processing';
        }

        select.appendChild(option);
    });

    if (currentValue) {
        select.value = currentValue;
        selectedTableId = currentValue;
    }
}

function saveTableSelection() {
    selectedTableId = document.getElementById('selectTable').value;
}

function saveEmployeeSelection() {
    selectedEmployeeId = document.getElementById('selectEmployee').value;
}

function increaseQuantity(menuId) {
    if (!menuQuantities[menuId]) {
        menuQuantities[menuId] = 0;
    }
    menuQuantities[menuId]++;

    const qtyDisplay = document.getElementById(`qty-${menuId}`);
    if (qtyDisplay) {
        qtyDisplay.textContent = menuQuantities[menuId];
    }

    updateCart(menuId, menuQuantities[menuId]);
}

function decreaseQuantity(menuId) {
    if (!menuQuantities[menuId]) {
        menuQuantities[menuId] = 0;
    }

    if (menuQuantities[menuId] > 0) {
        menuQuantities[menuId]--;

        const qtyDisplay = document.getElementById(`qty-${menuId}`);
        if (qtyDisplay) {
            qtyDisplay.textContent = menuQuantities[menuId];
        }

        updateCart(menuId, menuQuantities[menuId]);
    }
}

function updateCart(menuId, quantity) {
    const existingIndex = cart.findIndex(item => item.menuId === menuId);

    if (quantity === 0) {
        if (existingIndex !== -1) {
            cart.splice(existingIndex, 1);
        }
    } else {
        const menuItem = menuItems.find(m => m.Menu_ID === menuId);

        if (existingIndex !== -1) {
            cart[existingIndex].quantity = quantity;
        } else {
            cart.push({
                menuId: menuId,
                name: menuItem.Menu_Name,
                price: menuItem.Menu_Price,
                quantity: quantity
            });
        }
    }

    displayCart();
}

function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-message">ยังไม่มีรายการสั่งอาหาร</div>';
        cartTotalSpan.textContent = '0';
        return;
    }

    cartItemsDiv.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                    ${item.quantity} x ${item.price} = ${itemTotal} บาท
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.menuId})">ลบ</button>
        `;

        cartItemsDiv.appendChild(cartItem);
    });

    cartTotalSpan.textContent = total;
}

function removeFromCart(menuId) {
    const qtyDisplay = document.getElementById(`qty-${menuId}`);
    qtyDisplay.textContent = '0';
    updateCart(menuId, 0);
}

async function submitOrder() {
    const tableId = document.getElementById('selectTable').value;
    const employeeId = document.getElementById('selectEmployee').value;

    if (!tableId) {
        alert('กรุณาเลือกโต๊ะ');
        return;
    }

    if (!employeeId) {
        alert('กรุณาเลือกพนักงาน');
        return;
    }

    if (cart.length === 0) {
        alert('กรุณาเลือกอาหารอย่างน้อย 1 รายการ');
        return;
    }

    const orderData = {
        tableId: parseInt(tableId),
        employeeId: parseInt(employeeId),
        items: cart.map(item => ({
            menuId: item.menuId,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`สั่งอาหารสำเร็จ!\nออเดอร์หมายเลข: ${result.orderId}\nยอดรวม: ${result.totalAmount} บาท`);

            await createReceipt(result.orderId);

            cart = [];
            menuQuantities = {};
            selectedTableId = '';
            selectedEmployeeId = '';
            displayCart();
            displayMenu();
            document.getElementById('selectTable').value = '';
            document.getElementById('selectEmployee').value = '';

            loadTables();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('เกิดข้อผิดพลาดในการสั่งอาหาร');
    }
}

async function createReceipt(orderId) {
    try {
        await fetch(`${API_URL}/receipt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId })
        });
    } catch (error) {
        console.error('Error creating receipt:', error);
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="empty-message">ยังไม่มีออเดอร์</div>';
        return;
    }

    ordersList.innerHTML = '';

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';

        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-id">ออเดอร์ #${order.Order_ID}</div>
                <button class="btn-receipt" onclick="viewReceipt(${order.Order_ID})">
                    ดูใบเสร็จ
                </button>
            </div>
            <div class="order-info">
                <div class="order-info-item">
                    <div class="order-info-label">โต๊ะ</div>
                    <div class="order-info-value">โต๊ะ ${order.Table_Number}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-info-label">พนักงาน</div>
                    <div class="order-info-value">${order.Employee_Name}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-info-label">วันที่</div>
                    <div class="order-info-value">${order.Order_Date}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-info-label">เวลา</div>
                    <div class="order-info-value">${order.Order_Time}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-info-label">ยอดรวม</div>
                    <div class="order-info-value">${order.Total_Amount} บาท</div>
                </div>
            </div>
        `;

        ordersList.appendChild(orderCard);
    });
}

async function viewReceipt(orderId) {
    try {
        const response = await fetch(`${API_URL}/receipt/${orderId}`);
        const data = await response.json();

        if (response.ok) {
            displayReceiptModal(data);
        } else {
            alert('ไม่พบใบเสร็จ');
        }
    } catch (error) {
        console.error('Error loading receipt:', error);
        alert('เกิดข้อผิดพลาดในการโหลดใบเสร็จ');
    }
}

function displayReceiptModal(data) {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptContent');

    let itemsHtml = '';
    data.items.forEach(item => {
        const itemTotal = item.Menu_Price * item.Quantity;
        itemsHtml += `
            <div class="receipt-item">
                <div class="receipt-item-name">${item.Menu_Name}</div>
                <div class="receipt-item-qty">x${item.Quantity}</div>
                <div class="receipt-item-price">${itemTotal} บาท</div>
            </div>
        `;
    });

    content.innerHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <div class="receipt-title">ใบเสร็จรับเงิน</div>
                <div>ร้านอาหาร</div>
            </div>
            <div class="receipt-info">
                <div class="receipt-info-row">
                    <span class="receipt-info-label">เลขที่ใบเสร็จ:</span>
                    <span>#${data.receipt.Receipt_ID}</span>
                </div>
                <div class="receipt-info-row">
                    <span class="receipt-info-label">ออเดอร์:</span>
                    <span>#${data.receipt.Order_ID}</span>
                </div>
                <div class="receipt-info-row">
                    <span class="receipt-info-label">โต๊ะ:</span>
                    <span>โต๊ะ ${data.receipt.Table_Number}</span>
                </div>
                <div class="receipt-info-row">
                    <span class="receipt-info-label">พนักงาน:</span>
                    <span>${data.receipt.Employee_Name}</span>
                </div>
                <div class="receipt-info-row">
                    <span class="receipt-info-label">วันที่:</span>
                    <span>${data.receipt.Receipt_Date}</span>
                </div>
                <div class="receipt-info-row">
                    <span class="receipt-info-label">เวลา:</span>
                    <span>${data.receipt.Receipt_Time}</span>
                </div>
            </div>
            <div class="receipt-items">
                <h3>รายการอาหาร</h3>
                ${itemsHtml}
            </div>
            <div class="receipt-total">
                <div>ยอดรวมทั้งสิ้น</div>
                <div class="receipt-total-amount">${data.receipt.Total_Amount} บาท</div>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('receiptModal');
    modal.classList.remove('show');
}

window.onclick = function(event) {
    const modal = document.getElementById('receiptModal');
    if (event.target === modal) {
        closeModal();
    }
}

function showAddTableForm() {
    hideEditTableForm();
    const form = document.getElementById('addTableForm');
    form.style.display = 'block';
    document.getElementById('newTableNumber').value = '';
    document.getElementById('newTableCapacity').value = '4';
}

function hideAddTableForm() {
    const form = document.getElementById('addTableForm');
    form.style.display = 'none';
}

function editTable(tableId) {
    const table = tables.find(t => t.Table_ID === tableId);
    if (!table) {
        alert('ไม่พบข้อมูลโต๊ะ');
        return;
    }

    document.getElementById('editTableId').value = table.Table_ID;
    document.getElementById('editTableNumber').value = table.Table_Number;
    document.getElementById('editTableCapacity').value = table.Capacity;
    document.getElementById('editTableStatus').value = table.Status;

    showEditTableForm();
}

function showEditTableForm() {
    hideAddTableForm();
    const form = document.getElementById('editTableForm');
    form.style.display = 'block';
}

function hideEditTableForm() {
    const form = document.getElementById('editTableForm');
    form.style.display = 'none';
}

async function updateTable() {
    const tableId = document.getElementById('editTableId').value;
    const tableNumber = document.getElementById('editTableNumber').value;
    const capacity = document.getElementById('editTableCapacity').value;
    const status = document.getElementById('editTableStatus').value;

    if (!tableNumber || !capacity || !status) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tables/${tableId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tableNumber: parseInt(tableNumber),
                capacity: parseInt(capacity),
                status: status
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`แก้ไขโต๊ะหมายเลข ${tableNumber} สำเร็จ!`);
            hideEditTableForm();
            loadTables();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating table:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขโต๊ะ');
    }
}

async function addNewTable() {
    const tableNumber = document.getElementById('newTableNumber').value;
    const capacity = document.getElementById('newTableCapacity').value;

    if (!tableNumber || !capacity) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    const existingTable = tables.find(t => t.Table_Number == tableNumber);
    if (existingTable) {
        alert(`โต๊ะหมายเลข ${tableNumber} มีอยู่แล้ว`);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tables`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tableNumber: parseInt(tableNumber),
                capacity: parseInt(capacity),
                status: 'ว่าง'
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`เพิ่มโต๊ะหมายเลข ${tableNumber} สำเร็จ!`);
            hideAddTableForm();
            loadTables();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding table:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มโต๊ะ');
    }
}

async function deleteTable(tableId, tableNumber) {
    if (!confirm(`คุณต้องการลบโต๊ะหมายเลข ${tableNumber} ใช่หรือไม่?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tables/${tableId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            alert(`ลบโต๊ะหมายเลข ${tableNumber} สำเร็จ!`);
            loadTables();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting table:', error);
        alert('เกิดข้อผิดพลาดในการลบโต๊ะ');
    }
}

function showAddMenuForm() {
    hideEditMenuForm();
    const form = document.getElementById('addMenuForm');
    form.style.display = 'block';
}

function hideAddMenuForm() {
    const form = document.getElementById('addMenuForm');
    form.style.display = 'none';
    document.getElementById('newMenuName').value = '';
    document.getElementById('newMenuPrice').value = '';
    document.getElementById('newMenuCategory').value = '';
}

function editMenu(menuId) {
    const menuItem = menuItems.find(m => m.Menu_ID === menuId);
    if (!menuItem) {
        alert('ไม่พบข้อมูลเมนู');
        return;
    }

    document.getElementById('editMenuId').value = menuItem.Menu_ID;
    document.getElementById('editMenuName').value = menuItem.Menu_Name;
    document.getElementById('editMenuPrice').value = menuItem.Menu_Price;
    document.getElementById('editMenuCategory').value = menuItem.Category;

    showEditMenuForm();
}

function showEditMenuForm() {
    hideAddMenuForm();
    const form = document.getElementById('editMenuForm');
    form.style.display = 'block';
}

function hideEditMenuForm() {
    const form = document.getElementById('editMenuForm');
    form.style.display = 'none';
}

async function updateMenu() {
    const menuId = document.getElementById('editMenuId').value;
    const menuName = document.getElementById('editMenuName').value;
    const menuPrice = document.getElementById('editMenuPrice').value;
    const category = document.getElementById('editMenuCategory').value;

    if (!menuName || !menuPrice || !category) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/menu/${menuId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                menuName: menuName,
                menuPrice: parseInt(menuPrice),
                category: category
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`แก้ไขเมนู "${menuName}" สำเร็จ!`);
            hideEditMenuForm();
            loadMenu();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating menu:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขเมนู');
    }
}

async function addNewMenu() {
    const menuName = document.getElementById('newMenuName').value;
    const menuPrice = document.getElementById('newMenuPrice').value;
    const category = document.getElementById('newMenuCategory').value;

    if (!menuName || !menuPrice || !category) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                menuName: menuName,
                menuPrice: parseInt(menuPrice),
                category: category
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`เพิ่มเมนู "${menuName}" สำเร็จ!`);
            hideAddMenuForm();
            loadMenu();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding menu:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มเมนู');
    }
}

async function deleteMenu(menuId, menuName) {
    if (!confirm(`คุณต้องการลบเมนู "${menuName}" ใช่หรือไม่?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/menu/${menuId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            alert(`ลบเมนู "${menuName}" สำเร็จ!`);
            loadMenu();
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting menu:', error);
        alert('เกิดข้อผิดพลาดในการลบเมนู');
    }
}

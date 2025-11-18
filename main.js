const readline = require('readline');

// นำเข้าฐานข้อมูล
const db = require('./database/connection');

// นำเข้า Operations ทั้งหมด
const tableOps = require('./operations/tableOps');
const employeeOps = require('./operations/employeeOps');
const menuOps = require('./operations/menuOps');
const orderOps = require('./operations/orderOps');
const receiptOps = require('./operations/receiptOps');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log('\n========================================');
    console.log(' ระบบจัดการร้านอาหาร');
    console.log('========================================');
    console.log('1. จัดการโต๊ะ (Tables)');
    console.log('2. จัดการพนักงาน (Employees)');
    console.log('3. จัดการเมนูอาหาร (Menu)');
    console.log('4. จัดการออเดอร์ (Orders)');
    console.log('5. จัดการใบเสร็จ (Receipts)');
    console.log('0. ออกจากโปรแกรม');
    console.log('========================================\n');
}

function showTableMenu() {
    console.log('\n--- จัดการโต๊ะ ---');
    console.log('1. ดูโต๊ะทั้งหมด (SELECT)');
    console.log('2. เพิ่มโต๊ะใหม่ (INSERT)');
    console.log('3. แก้ไขโต๊ะ (UPDATE)');
    console.log('4. ลบโต๊ะ (DELETE)');
    console.log('5. เปลี่ยนสถานะโต๊ะ (UPDATE)');
    console.log('0. กลับเมนูหลัก\n');
}

function showEmployeeMenu() {
    console.log('\n--- จัดการพนักงาน ---');
    console.log('1. ดูพนักงานทั้งหมด (SELECT)');
    console.log('2. เพิ่มพนักงานใหม่ (INSERT)');
    console.log('3. แก้ไขพนักงาน (UPDATE)');
    console.log('4. ลบพนักงาน (DELETE)');
    console.log('0. กลับเมนูหลัก\n');
}

function showMenuMenu() {
    console.log('\n--- จัดการเมนูอาหาร ---');
    console.log('1. ดูเมนูทั้งหมด (SELECT)');
    console.log('2. เพิ่มเมนูใหม่ (INSERT)');
    console.log('3. แก้ไขเมนู (UPDATE)');
    console.log('4. ลบเมนู (DELETE)');
    console.log('5. ดูเมนูแบบกรอง (FILTER & SORT)');
    console.log('0. กลับเมนูหลัก\n');
}

function showFilterSortMenu() {
    console.log('\n--- ตัวเลือกการดูเมนู ---');
    console.log('1. ดูเมนูทั้งหมด + เรียงราคา');
    console.log('2. เลือกหมวดหมู่ + เรียงราคา');
    console.log('0. กลับ\n');
}

function showOrderMenu() {
    console.log('\n--- จัดการออเดอร์ ---');
    console.log('1. ดูออเดอร์ทั้งหมด (SELECT)');
    console.log('2. สร้างออเดอร์ใหม่ (INSERT)');
    console.log('3. ดูรายละเอียดออเดอร์ (SELECT)');
    console.log('4. ลบออเดอร์ (DELETE)');
    console.log('0. กลับเมนูหลัก\n');
}

function showReceiptMenu() {
    console.log('\n--- จัดการใบเสร็จ ---');
    console.log('1. ดูใบเสร็จทั้งหมด (SELECT)');
    console.log('2. สร้างใบเสร็จ (INSERT)');
    console.log('3. ดูรายละเอียดใบเสร็จ (SELECT)');
    console.log('0. กลับเมนูหลัก\n');
}

// ========================================
// MENU HANDLERS
// ========================================

function handleTableMenu() {
    showTableMenu();
    rl.question('เลือกเมนู: ', (choice) => {
        switch(choice) {
            case '1':
                tableOps.getAllTables(() => handleTableMenu());
                break;
            case '2':
                rl.question('หมายเลขโต๊ะ: ', (tableNumber) => {
                    rl.question('จำนวนที่นั่ง: ', (capacity) => {
                        rl.question('สถานะ (ว่าง/กำลังใช้งาน/กำลังจัดการ): ', (status) => {
                            tableOps.insertTable(tableNumber, capacity, status || 'ว่าง', () => handleTableMenu());
                        });
                    });
                });
                break;
            case '3':
                rl.question('Table ID ที่ต้องการแก้ไข: ', (tableId) => {
                    rl.question('หมายเลขโต๊ะใหม่: ', (tableNumber) => {
                        rl.question('จำนวนที่นั่งใหม่: ', (capacity) => {
                            rl.question('สถานะใหม่: ', (status) => {
                                tableOps.updateTable(tableId, tableNumber, capacity, status, () => handleTableMenu());
                            });
                        });
                    });
                });
                break;
            case '4':
                rl.question('Table ID ที่ต้องการลบ: ', (tableId) => {
                    tableOps.deleteTable(tableId, () => handleTableMenu());
                });
                break;
            case '5':
                rl.question('Table ID: ', (tableId) => {
                    rl.question('สถานะใหม่ (ว่าง/กำลังใช้งาน/กำลังจัดการ): ', (status) => {
                        tableOps.updateTableStatus(tableId, status, () => handleTableMenu());
                    });
                });
                break;
            case '0':
                main();
                break;
            default:
                console.log('เลือกเมนูไม่ถูกต้อง');
                handleTableMenu();
        }
    });
}

function handleEmployeeMenu() {
    showEmployeeMenu();
    rl.question('เลือกเมนู: ', (choice) => {
        switch(choice) {
            case '1':
                employeeOps.getAllEmployees(() => handleEmployeeMenu());
                break;
            case '2':
                rl.question('ชื่อพนักงาน: ', (name) => {
                    rl.question('ตำแหน่ง: ', (position) => {
                        employeeOps.insertEmployee(name, position, () => handleEmployeeMenu());
                    });
                });
                break;
            case '3':
                rl.question('Employee ID ที่ต้องการแก้ไข: ', (employeeId) => {
                    rl.question('ชื่อใหม่: ', (name) => {
                        rl.question('ตำแหน่งใหม่: ', (position) => {
                            employeeOps.updateEmployee(employeeId, name, position, () => handleEmployeeMenu());
                        });
                    });
                });
                break;
            case '4':
                rl.question('Employee ID ที่ต้องการลบ: ', (employeeId) => {
                    employeeOps.deleteEmployee(employeeId, () => handleEmployeeMenu());
                });
                break;
            case '0':
                main();
                break;
            default:
                console.log('เลือกเมนูไม่ถูกต้อง');
                handleEmployeeMenu();
        }
    });
}

function handleFilterSortMenu() {
    showFilterSortMenu();
    rl.question('เลือกเมนู: ', (choice) => {
        switch(choice) {
            case '1':
                // ดูเมนูทั้งหมด + เรียงราคา
                console.log('\n--- เลือกการเรียงราคา ---');
                console.log('1. ราคาน้อย → มาก');
                console.log('2. ราคามาก → น้อย');
                rl.question('เลือก: ', (sortChoice) => {
                    if (sortChoice === '1') {
                        menuOps.getMenuByPriceAsc(() => handleMenuMenu());
                    } else if (sortChoice === '2') {
                        menuOps.getMenuByPriceDesc(() => handleMenuMenu());
                    } else {
                        console.log('เลือกไม่ถูกต้อง');
                        handleFilterSortMenu();
                    }
                });
                break;
            case '2':
                // เลือกหมวดหมู่ + เรียงราคา
                menuOps.getAllCategories((categories) => {
                    if (!categories || categories.length === 0) {
                        console.log('ไม่พบหมวดหมู่');
                        handleFilterSortMenu();
                        return;
                    }

                    rl.question('เลือกหมายเลขหมวดหมู่: ', (categoryChoice) => {
                        const index = parseInt(categoryChoice) - 1;

                        if (index < 0 || index >= categories.length) {
                            console.log('เลือกไม่ถูกต้อง');
                            handleFilterSortMenu();
                            return;
                        }

                        const selectedCategory = categories[index].Category;

                        console.log('\n--- เลือกการเรียงราคา ---');
                        console.log('1. ราคาน้อย → มาก');
                        console.log('2. ราคามาก → น้อย');
                        console.log('3. ไม่เรียง (ตามชื่อ)');

                        rl.question('เลือก: ', (sortChoice) => {
                            if (sortChoice === '1') {
                                menuOps.getMenuByCategorySort(selectedCategory, 'ASC', () => handleMenuMenu());
                            } else if (sortChoice === '2') {
                                menuOps.getMenuByCategorySort(selectedCategory, 'DESC', () => handleMenuMenu());
                            } else if (sortChoice === '3') {
                                menuOps.getMenuByCategory(selectedCategory, () => handleMenuMenu());
                            } else {
                                console.log('เลือกไม่ถูกต้อง');
                                handleFilterSortMenu();
                            }
                        });
                    });
                });
                break;
            case '0':
                handleMenuMenu();
                break;
            default:
                console.log('เลือกเมนูไม่ถูกต้อง');
                handleFilterSortMenu();
        }
    });
}

function handleMenuMenu() {
    showMenuMenu();
    rl.question('เลือกเมนู: ', (choice) => {
        switch(choice) {
            case '1':
                menuOps.getAllMenu(() => handleMenuMenu());
                break;
            case '2':
                rl.question('ชื่อเมนู: ', (menuName) => {
                    rl.question('ราคา: ', (menuPrice) => {
                        rl.question('หมวดหมู่: ', (category) => {
                            menuOps.insertMenu(menuName, menuPrice, category, () => handleMenuMenu());
                        });
                    });
                });
                break;
            case '3':
                rl.question('Menu ID ที่ต้องการแก้ไข: ', (menuId) => {
                    rl.question('ชื่อเมนูใหม่: ', (menuName) => {
                        rl.question('ราคาใหม่: ', (menuPrice) => {
                            rl.question('หมวดหมู่ใหม่: ', (category) => {
                                menuOps.updateMenu(menuId, menuName, menuPrice, category, () => handleMenuMenu());
                            });
                        });
                    });
                });
                break;
            case '4':
                rl.question('Menu ID ที่ต้องการลบ: ', (menuId) => {
                    menuOps.deleteMenu(menuId, () => handleMenuMenu());
                });
                break;
            case '5':
                handleFilterSortMenu();
                break;
            case '0':
                main();
                break;
            default:
                console.log('เลือกเมนูไม่ถูกต้อง');
                handleMenuMenu();
        }
    });
}

function handleOrderMenu() {
    showOrderMenu();
    rl.question('เลือกเมนู: ', (choice) => {
        switch(choice) {
            case '1':
                orderOps.getAllOrders(() => handleOrderMenu());
                break;
            case '2':
                rl.question('Table ID: ', (tableId) => {
                    rl.question('Employee ID: ', (employeeId) => {
                        rl.question('จำนวนเมนูที่สั่ง: ', (count) => {
                            const items = [];
                            let collected = 0;

                            function collectItem() {
                                if (collected >= parseInt(count)) {
                                    orderOps.insertOrder(tableId, employeeId, items, () => handleOrderMenu());
                                    return;
                                }

                                rl.question(`Menu ID รายการที่ ${collected + 1}: `, (menuId) => {
                                    rl.question(`จำนวน: `, (quantity) => {
                                        items.push({ menuId: parseInt(menuId), quantity: parseInt(quantity) });
                                        collected++;
                                        collectItem();
                                    });
                                });
                            }

                            collectItem();
                        });
                    });
                });
                break;
            case '3':
                rl.question('Order ID: ', (orderId) => {
                    orderOps.getOrderDetails(orderId, () => handleOrderMenu());
                });
                break;
            case '4':
                rl.question('Order ID ที่ต้องการลบ: ', (orderId) => {
                    orderOps.deleteOrder(orderId, () => handleOrderMenu());
                });
                break;
            case '0':
                main();
                break;
            default:
                console.log('เลือกเมนูไม่ถูกต้อง');
                handleOrderMenu();
        }
    });
}

function handleReceiptMenu() {
    showReceiptMenu();
    rl.question('เลือกเมนู: ', (choice) => {
        switch(choice) {
            case '1':
                receiptOps.getAllReceipts(() => handleReceiptMenu());
                break;
            case '2':
                rl.question('Order ID: ', (orderId) => {
                    receiptOps.insertReceipt(orderId, () => handleReceiptMenu());
                });
                break;
            case '3':
                rl.question('Order ID: ', (orderId) => {
                    receiptOps.getReceiptDetails(orderId, () => handleReceiptMenu());
                });
                break;
            case '0':
                main();
                break;
            default:
                console.log('เลือกเมนูไม่ถูกต้อง');
                handleReceiptMenu();
        }
    });
}

function main() {
    showMenu();
    rl.question('เลือกเมนู: ', (choice) => {
        switch(choice) {
            case '1':
                handleTableMenu();
                break;
            case '2':
                handleEmployeeMenu();
                break;
            case '3':
                handleMenuMenu();
                break;
            case '4':
                handleOrderMenu();
                break;
            case '5':
                handleReceiptMenu();
                break;
            case '0':
                console.log('ขอบคุณที่ใช้งาน ระบบจัดการร้านอาหาร!');
                rl.close();
                db.close();
                process.exit(0);
                break;
            default:
                console.log('เลือกเมนูไม่ถูกต้อง');
                main();
        }
    });
}

// เริ่มโปรแกรม
console.log('\nเริ่มต้นระบบจัดการร้านอาหาร...\n');
main();

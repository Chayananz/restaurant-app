const db = require('../database/connection');

// ดูออเดอร์ทั้งหมด
function getAllOrders(callback) {
    const sql = `SELECT o.*, t.Table_Number, e.Employee_Name
                 FROM \`Order\` o
                 LEFT JOIN \`Table\` t ON o.Table_ID = t.Table_ID
                 LEFT JOIN Employee e ON o.Employee_ID = e.Employee_ID
                 ORDER BY o.Order_ID DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log('\nรายการออเดอร์ทั้งหมด:');
        console.log('----------------------------------------');
        rows.forEach(row => {
            console.log(`Order ID: ${row.Order_ID} | โต๊ะ: ${row.Table_Number} | พนักงาน: ${row.Employee_Name} | ยอดรวม: ${row.Total_Amount} บาท | วันที่: ${row.Order_Date} ${row.Order_Time}`);
        });
        console.log('----------------------------------------');
        callback();
    });
}

// ดูรายละเอียดออเดอร์
function getOrderDetails(orderId, callback) {
    // ดึงข้อมูลออเดอร์
    const sql1 = `SELECT o.*, t.Table_Number, e.Employee_Name
                  FROM \`Order\` o
                  LEFT JOIN \`Table\` t ON o.Table_ID = t.Table_ID
                  LEFT JOIN Employee e ON o.Employee_ID = e.Employee_ID
                  WHERE o.Order_ID = ?`;

    // ดึงรายละเอียดเมนูในออเดอร์
    const sql2 = `SELECT od.*, m.Menu_Name, m.Menu_Price
                  FROM OrderDetail od
                  LEFT JOIN Menu m ON od.Menu_ID = m.Menu_ID
                  WHERE od.Order_ID = ?`;

    db.get(sql1, [orderId], (err, order) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        if (!order) {
            console.log('ไม่พบออเดอร์');
            callback();
            return;
        }

        db.all(sql2, [orderId], (err, details) => {
            if (err) {
                console.error('Error:', err.message);
                callback();
                return;
            }

            console.log('\nรายละเอียดออเดอร์:');
            console.log('----------------------------------------');
            console.log(`Order ID: ${order.Order_ID}`);
            console.log(`โต๊ะ: ${order.Table_Number}`);
            console.log(`พนักงาน: ${order.Employee_Name}`);
            console.log(`วันที่: ${order.Order_Date} ${order.Order_Time}`);
            console.log('\nรายการอาหาร:');
            details.forEach(item => {
                console.log(`  - ${item.Menu_Name} x${item.Quantity} = ${item.Menu_Price * item.Quantity} บาท`);
            });
            console.log(`\nยอดรวมทั้งสิ้น: ${order.Total_Amount} บาท`);
            console.log('----------------------------------------');
            callback();
        });
    });
}

// สร้างออเดอร์ใหม่
function insertOrder(tableId, employeeId, items, callback) {
    const now = new Date();
    const orderTime = now.toLocaleTimeString('th-TH');
    const orderDate = now.toLocaleDateString('th-TH');

    let totalAmount = 0;
    let processedItems = 0;

    // คำนวณยอดรวม
    items.forEach(item => {
        db.get('SELECT Menu_Price FROM Menu WHERE Menu_ID = ?', [item.menuId], (err, row) => {
            if (row) {
                totalAmount += row.Menu_Price * item.quantity;
            }
            processedItems++;

            if (processedItems === items.length) {
                // บันทึกออเดอร์
                db.run('INSERT INTO `Order` (Order_Time, Total_Amount, Order_Date, Employee_ID, Table_ID) VALUES (?, ?, ?, ?, ?)',
                       [orderTime, totalAmount, orderDate, employeeId, tableId],
                       function(err) {
                    if (err) {
                        console.error('Error:', err.message);
                        callback();
                        return;
                    }

                    const orderId = this.lastID;

                    // บันทึกรายละเอียดออเดอร์
                    const stmt = db.prepare('INSERT INTO OrderDetail (Quantity, Order_ID, Menu_ID) VALUES (?, ?, ?)');
                    items.forEach(item => {
                        stmt.run(item.quantity, orderId, item.menuId);
                    });
                    stmt.finalize();

                    console.log(`สร้างออเดอร์สำเร็จ! Order ID: ${orderId} | ยอดรวม: ${totalAmount} บาท`);
                    callback();
                });
            }
        });
    });
}

// ลบออเดอร์
function deleteOrder(orderId, callback) {
    // ลบ OrderDetail ก่อน
    db.run('DELETE FROM OrderDetail WHERE Order_ID = ?', [orderId], function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }

        // ลบ Receipt
        db.run('DELETE FROM Receipt WHERE Order_ID = ?', [orderId], function(err) {
            if (err) {
                console.error('Error:', err.message);
                callback();
                return;
            }

            // ลบ Order
            db.run('DELETE FROM `Order` WHERE Order_ID = ?', [orderId], function(err) {
                if (err) {
                    console.error('Error:', err.message);
                    callback();
                    return;
                }
                console.log(`ลบออเดอร์สำเร็จ!`);
                callback();
            });
        });
    });
}

module.exports = {
    getAllOrders,
    getOrderDetails,
    insertOrder,
    deleteOrder
};

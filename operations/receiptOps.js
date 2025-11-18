const db = require('../database/connection');

// ดูใบเสร็จทั้งหมด
function getAllReceipts(callback) {
    const sql = `SELECT r.*, o.Total_Amount, o.Order_Time, o.Order_Date
                 FROM Receipt r
                 LEFT JOIN \`Order\` o ON r.Order_ID = o.Order_ID
                 ORDER BY r.Receipt_ID DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log('\nรายการใบเสร็จทั้งหมด:');
        console.log('----------------------------------------');
        rows.forEach(row => {
            console.log(`Receipt ID: ${row.Receipt_ID} | Order ID: ${row.Order_ID} | ยอดรวม: ${row.Total_Amount} บาท | วันที่: ${row.Receipt_Date} ${row.Receipt_Time}`);
        });
        console.log('----------------------------------------');
        callback();
    });
}

// สร้างใบเสร็จ
function insertReceipt(orderId, callback) {
    const now = new Date();
    const receiptTime = now.toLocaleTimeString('th-TH');
    const receiptDate = now.toLocaleDateString('th-TH');

    db.run('INSERT INTO Receipt (Receipt_Time, Receipt_Date, Order_ID) VALUES (?, ?, ?)',
           [receiptTime, receiptDate, orderId],
           function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`สร้างใบเสร็จสำเร็จ! Receipt ID: ${this.lastID}`);
        callback();
    });
}

// ดูรายละเอียดใบเสร็จ
function getReceiptDetails(orderId, callback) {
    // ดึงข้อมูลใบเสร็จ
    const sql1 = `SELECT r.*, o.Total_Amount, o.Order_Time, o.Order_Date, t.Table_Number, e.Employee_Name
                  FROM Receipt r
                  LEFT JOIN \`Order\` o ON r.Order_ID = o.Order_ID
                  LEFT JOIN \`Table\` t ON o.Table_ID = t.Table_ID
                  LEFT JOIN Employee e ON o.Employee_ID = e.Employee_ID
                  WHERE r.Order_ID = ?`;

    // ดึงรายละเอียดเมนู
    const sql2 = `SELECT od.*, m.Menu_Name, m.Menu_Price
                  FROM OrderDetail od
                  LEFT JOIN Menu m ON od.Menu_ID = m.Menu_ID
                  WHERE od.Order_ID = ?`;

    db.get(sql1, [orderId], (err, receipt) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        if (!receipt) {
            console.log('ไม่พบใบเสร็จ');
            callback();
            return;
        }

        db.all(sql2, [orderId], (err, items) => {
            if (err) {
                console.error('Error:', err.message);
                callback();
                return;
            }

            console.log('\nใบเสร็จ:');
            console.log('========================================');
            console.log(`Receipt ID: ${receipt.Receipt_ID}`);
            console.log(`Order ID: ${receipt.Order_ID}`);
            console.log(`โต๊ะ: ${receipt.Table_Number}`);
            console.log(`พนักงาน: ${receipt.Employee_Name}`);
            console.log(`วันที่สั่ง: ${receipt.Order_Date} ${receipt.Order_Time}`);
            console.log(`วันที่ออกใบเสร็จ: ${receipt.Receipt_Date} ${receipt.Receipt_Time}`);
            console.log('\nรายการอาหาร:');
            items.forEach(item => {
                console.log(`  - ${item.Menu_Name} x${item.Quantity} = ${item.Menu_Price * item.Quantity} บาท`);
            });
            console.log(`\nยอดรวมทั้งสิ้น: ${receipt.Total_Amount} บาท`);
            console.log('========================================');
            callback();
        });
    });
}

module.exports = {
    getAllReceipts,
    insertReceipt,
    getReceiptDetails
};

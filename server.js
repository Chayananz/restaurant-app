const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// เชื่อมต่อฐานข้อมูล
const dbPath = path.join(__dirname, 'restaurant.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
    }
});

app.get('/api/tables', (req, res) => {
    db.all('SELECT * FROM `Table` ORDER BY Table_Number', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// อัพเดทสถานะโต๊ะ
app.get('/api/updateStatus/:tableId', (req, res) => {
    const tableId = req.params.tableId;

    db.get('SELECT Status FROM `Table` WHERE Table_ID = ?', [tableId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!row) {
            res.status(404).json({ error: 'ไม่พบโต๊ะ' });
            return;
        }

        // กำหนดสถานะใหม่
        let newStatus;
        if (row.Status === 'ว่าง') {
            newStatus = 'กำลังใช้งาน';
        } else if (row.Status === 'กำลังใช้งาน') {
            newStatus = 'กำลังจัดการ';
        } else {
            newStatus = 'ว่าง';
        }

        db.run('UPDATE `Table` SET Status = ? WHERE Table_ID = ?', [newStatus, tableId], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'อัพเดทสถานะสำเร็จ', newStatus: newStatus });
        });
    });
});

app.get('/api/employees', (req, res) => {
    db.all('SELECT * FROM Employee', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/menu', (req, res) => {
    const { category, sort } = req.query;

    let sql = 'SELECT * FROM Menu';
    let params = [];

    // กรองตามหมวดหมู่
    if (category && category !== 'ทั้งหมด') {
        sql += ' WHERE Category = ?';
        params.push(category);
    }

    // เรียงตามราคา
    if (sort === 'asc') {
        sql += ' ORDER BY Menu_Price ASC, Menu_Name';
    } else if (sort === 'desc') {
        sql += ' ORDER BY Menu_Price DESC, Menu_Name';
    } else {
        sql += ' ORDER BY Category, Menu_Name';
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// ดึงหมวดหมู่ทั้งหมด
app.get('/api/categories', (req, res) => {
    db.all('SELECT DISTINCT Category FROM Menu ORDER BY Category', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// สร้างออเดอร์ใหม่
app.post('/api/order', (req, res) => {
    const { tableId, employeeId, items } = req.body;

    if (!tableId || !employeeId || !items || items.length === 0) {
        res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
        return;
    }

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
                        res.status(500).json({ error: err.message });
                        return;
                    }

                    const orderId = this.lastID;

                    // บันทึกรายละเอียดออเดอร์
                    const stmt = db.prepare('INSERT INTO OrderDetail (Quantity, Order_ID, Menu_ID) VALUES (?, ?, ?)');
                    items.forEach(item => {
                        stmt.run(item.quantity, orderId, item.menuId);
                    });
                    stmt.finalize();

                    res.json({
                        message: 'สร้างออเดอร์สำเร็จ',
                        orderId: orderId,
                        totalAmount: totalAmount
                    });
                });
            }
        });
    });
});

// ดูรายละเอียดออเดอร์
app.get('/api/order/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    // ดึงข้อมูลออเดอร์
    db.get(`SELECT o.*, t.Table_Number, e.Employee_Name
            FROM \`Order\` o
            LEFT JOIN \`Table\` t ON o.Table_ID = t.Table_ID
            LEFT JOIN Employee e ON o.Employee_ID = e.Employee_ID
            WHERE o.Order_ID = ?`,
           [orderId],
           (err, order) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!order) {
            res.status(404).json({ error: 'ไม่พบออเดอร์' });
            return;
        }

        // ดึงรายละเอียดเมนู
        db.all(`SELECT od.*, m.Menu_Name, m.Menu_Price
                FROM OrderDetail od
                LEFT JOIN Menu m ON od.Menu_ID = m.Menu_ID
                WHERE od.Order_ID = ?`,
               [orderId],
               (err, details) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ order, details });
        });
    });
});

// สร้างใบเสร็จ
app.post('/api/receipt', (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        res.status(400).json({ error: 'ต้องระบุ Order ID' });
        return;
    }

    const now = new Date();
    const receiptTime = now.toLocaleTimeString('th-TH');
    const receiptDate = now.toLocaleDateString('th-TH');

    db.run('INSERT INTO Receipt (Receipt_Time, Receipt_Date, Order_ID) VALUES (?, ?, ?)',
           [receiptTime, receiptDate, orderId],
           function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'สร้างใบเสร็จสำเร็จ',
            receiptId: this.lastID
        });
    });
});

// ดูรายละเอียดใบเสร็จ
app.get('/api/receipt/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    // ดึงข้อมูลใบเสร็จ
    db.get(`SELECT r.*, o.Total_Amount, o.Order_Time, o.Order_Date, t.Table_Number, e.Employee_Name
            FROM Receipt r
            LEFT JOIN \`Order\` o ON r.Order_ID = o.Order_ID
            LEFT JOIN \`Table\` t ON o.Table_ID = t.Table_ID
            LEFT JOIN Employee e ON o.Employee_ID = e.Employee_ID
            WHERE r.Order_ID = ?`,
           [orderId],
           (err, receipt) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!receipt) {
            res.status(404).json({ error: 'ไม่พบใบเสร็จ' });
            return;
        }

        // ดึงรายละเอียดเมนู
        db.all(`SELECT od.*, m.Menu_Name, m.Menu_Price
                FROM OrderDetail od
                LEFT JOIN Menu m ON od.Menu_ID = m.Menu_ID
                WHERE od.Order_ID = ?`,
               [orderId],
               (err, items) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ receipt, items });
        });
    });
});

app.get('/api/orders', (req, res) => {
    db.all(
        `SELECT o.*, t.Table_Number, e.Employee_Name
         FROM \`Order\` o
         LEFT JOIN \`Table\` t ON o.Table_ID = t.Table_ID
         LEFT JOIN Employee e ON o.Employee_ID = e.Employee_ID
         ORDER BY o.Order_ID DESC`,
        [],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

// เพิ่มโต๊ะใหม่
app.post('/api/tables', (req, res) => {
    const { tableNumber, capacity, status } = req.body;

    if (!tableNumber || !capacity) {
        res.status(400).json({ error: 'ต้องระบุหมายเลขโต๊ะและจำนวนที่นั่ง' });
        return;
    }

    db.run('INSERT INTO `Table` (Table_Number, Capacity, Status) VALUES (?, ?, ?)',
           [tableNumber, capacity, status || 'ว่าง'],
           function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'เพิ่มโต๊ะสำเร็จ',
            tableId: this.lastID
        });
    });
});

// แก้ไขโต๊ะ
app.put('/api/tables/:tableId', (req, res) => {
    const tableId = req.params.tableId;
    const { tableNumber, capacity, status } = req.body;

    db.run('UPDATE `Table` SET Table_Number = ?, Capacity = ?, Status = ? WHERE Table_ID = ?',
           [tableNumber, capacity, status, tableId],
           function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'แก้ไขโต๊ะสำเร็จ' });
    });
});

// ลบโต๊ะ
app.delete('/api/tables/:tableId', (req, res) => {
    const tableId = req.params.tableId;

    db.run('DELETE FROM `Table` WHERE Table_ID = ?', [tableId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'ลบโต๊ะสำเร็จ' });
    });
});

// เพิ่มพนักงานใหม่
app.post('/api/employees', (req, res) => {
    const { employeeName, position } = req.body;

    if (!employeeName || !position) {
        res.status(400).json({ error: 'ต้องระบุชื่อและตำแหน่ง' });
        return;
    }

    db.run('INSERT INTO Employee (Employee_Name, Position) VALUES (?, ?)',
           [employeeName, position],
           function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'เพิ่มพนักงานสำเร็จ',
            employeeId: this.lastID
        });
    });
});

// แก้ไขพนักงาน
app.put('/api/employees/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
    const { employeeName, position } = req.body;

    db.run('UPDATE Employee SET Employee_Name = ?, Position = ? WHERE Employee_ID = ?',
           [employeeName, position, employeeId],
           function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'แก้ไขพนักงานสำเร็จ' });
    });
});

// ลบพนักงาน
app.delete('/api/employees/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;

    db.run('DELETE FROM Employee WHERE Employee_ID = ?', [employeeId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'ลบพนักงานสำเร็จ' });
    });
});

// เพิ่มเมนูใหม่
app.post('/api/menu', (req, res) => {
    const { menuName, menuPrice, category } = req.body;

    if (!menuName || !menuPrice) {
        res.status(400).json({ error: 'ต้องระบุชื่อเมนูและราคา' });
        return;
    }

    db.run('INSERT INTO Menu (Menu_Name, Menu_Price, Category) VALUES (?, ?, ?)',
           [menuName, menuPrice, category],
           function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'เพิ่มเมนูสำเร็จ',
            menuId: this.lastID
        });
    });
});

// แก้ไขเมนู
app.put('/api/menu/:menuId', (req, res) => {
    const menuId = req.params.menuId;
    const { menuName, menuPrice, category } = req.body;

    db.run('UPDATE Menu SET Menu_Name = ?, Menu_Price = ?, Category = ? WHERE Menu_ID = ?',
           [menuName, menuPrice, category, menuId],
           function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'แก้ไขเมนูสำเร็จ' });
    });
});

// ลบเมนู
app.delete('/api/menu/:menuId', (req, res) => {
    const menuId = req.params.menuId;

    db.run('DELETE FROM Menu WHERE Menu_ID = ?', [menuId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'ลบเมนูสำเร็จ' });
    });
});

// ลบออเดอร์
app.delete('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    // ลบ OrderDetail ก่อน
    db.run('DELETE FROM OrderDetail WHERE Order_ID = ?', [orderId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // ลบ Receipt
        db.run('DELETE FROM Receipt WHERE Order_ID = ?', [orderId], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            // ลบ Order
            db.run('DELETE FROM `Order` WHERE Order_ID = ?', [orderId], function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'ลบออเดอร์สำเร็จ' });
            });
        });
    });
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
